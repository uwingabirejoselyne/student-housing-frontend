import Booking from '../models/Booking';
import Property from '../models/Property';
import mongoose from 'mongoose';

export class BookingService {
  /**
   * Create a new booking
   */
  async createBooking(bookingData: {
    studentId: string;
    propertyId: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    specialRequests?: string;
  }) {
    const { studentId, propertyId, checkInDate, checkOutDate, numberOfGuests, specialRequests } = bookingData;

    // Find property and verify it exists
    const property = await Property.findById(propertyId).populate('landlordId', '_id name email');

    if (!property) {
      throw new Error('Property not found');
    }

    // Calculate total amount
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const months = Math.ceil(days / 30);
    const totalAmount = months * (property.monthlyRentMin || 0);

    // Create booking
    const booking = await Booking.create({
      studentId,
      propertyId,
      landlordId: property.landlordId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalAmount,
      specialRequests,
      status: 'pending',
      paymentStatus: 'unpaid'
    });

    // Populate references
    return await Booking.findById(booking._id)
      .populate('studentId', 'name email phone')
      .populate('propertyId', 'name address city monthlyRentMin')
      .populate('landlordId', 'name email phone');
  }

  /**
   * Get all bookings for a student
   */
  async getStudentBookings(studentId: string, status?: string) {
    const filter: any = { studentId };
    if (status) {
      filter.status = status;
    }

    return await Booking.find(filter)
      .populate('propertyId', 'name address city type images monthlyRentMin')
      .populate('landlordId', 'name email phone')
      .sort({ createdAt: -1 });
  }

  /**
   * Get all bookings for a landlord's properties
   */
  async getLandlordBookings(landlordId: string, status?: string) {
    const filter: any = { landlordId };
    if (status) {
      filter.status = status;
    }

    return await Booking.find(filter)
      .populate('studentId', 'name email phone')
      .populate('propertyId', 'name address city type images')
      .sort({ createdAt: -1 });
  }

  /**
   * Get single booking by ID with permission check
   */
  async getBookingById(bookingId: string, userId: string) {
    const booking = await Booking.findById(bookingId)
      .populate('studentId', 'name email phone')
      .populate('propertyId', 'name address city type images monthlyRentMin')
      .populate('landlordId', 'name email phone');

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check if user has permission to view this booking
    const studentIdStr = (booking.studentId as any)._id.toString();
    const landlordIdStr = (booking.landlordId as any)._id.toString();

    if (studentIdStr !== userId && landlordIdStr !== userId) {
      throw new Error('You do not have permission to view this booking');
    }

    return booking;
  }

  /**
   * Confirm a booking (landlord only)
   */
  async confirmBooking(bookingId: string, landlordId: string) {
    const booking = await Booking.findOne({ _id: bookingId, landlordId });

    if (!booking) {
      throw new Error('Booking not found or you do not have permission');
    }

    if (booking.status !== 'pending') {
      throw new Error(`Cannot confirm booking with status: ${booking.status}`);
    }

    booking.status = 'confirmed';
    await booking.save();

    return await Booking.findById(booking._id)
      .populate('studentId', 'name email phone')
      .populate('propertyId', 'name address city');
  }

  /**
   * Reject a booking (landlord only)
   */
  async rejectBooking(bookingId: string, landlordId: string) {
    const booking = await Booking.findOne({ _id: bookingId, landlordId });

    if (!booking) {
      throw new Error('Booking not found or you do not have permission');
    }

    if (booking.status !== 'pending') {
      throw new Error(`Cannot reject booking with status: ${booking.status}`);
    }

    booking.status = 'cancelled';
    await booking.save();

    return booking;
  }

  /**
   * Cancel a booking (student only)
   */
  async cancelBooking(bookingId: string, studentId: string) {
    const booking = await Booking.findOne({ _id: bookingId, studentId });

    if (!booking) {
      throw new Error('Booking not found or you do not have permission');
    }

    if (booking.status === 'cancelled') {
      throw new Error('Booking is already cancelled');
    }

    if (booking.status === 'completed') {
      throw new Error('Cannot cancel a completed booking');
    }

    booking.status = 'cancelled';
    await booking.save();

    return booking;
  }

  /**
   * Update a booking (student only - pending bookings only)
   */
  async updateBooking(bookingId: string, studentId: string, updateData: any) {
    const booking = await Booking.findOne({ _id: bookingId, studentId });

    if (!booking) {
      throw new Error('Booking not found or you do not have permission');
    }

    if (booking.status !== 'pending') {
      throw new Error('Can only update pending bookings');
    }

    return await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('propertyId', 'name address city')
      .populate('landlordId', 'name email');
  }

  /**
   * Delete a booking (student only)
   */
  async deleteBooking(bookingId: string, studentId: string) {
    const booking = await Booking.findOne({ _id: bookingId, studentId });

    if (!booking) {
      throw new Error('Booking not found or you do not have permission');
    }

    await Booking.findByIdAndDelete(bookingId);
    return { message: 'Booking deleted successfully' };
  }

  /**
   * Validate booking data
   */
  validateBookingData(data: {
    propertyId?: string;
    checkInDate?: string;
    checkOutDate?: string;
    numberOfGuests?: number;
  }) {
    const { propertyId, checkInDate, checkOutDate, numberOfGuests } = data;

    if (!propertyId || !checkInDate || !checkOutDate || !numberOfGuests) {
      throw new Error('Missing required fields');
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      throw new Error('Check-in date cannot be in the past');
    }

    if (checkOut <= checkIn) {
      throw new Error('Check-out date must be after check-in date');
    }

    // Validate number of guests
    if (numberOfGuests < 1 || numberOfGuests > 10) {
      throw new Error('Number of guests must be between 1 and 10');
    }

    return true;
  }
}

export default new BookingService();
