import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Property from '../models/Property';
import { AuthRequest } from '../middlewares/auth.middleware';

// Create a new booking
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { propertyId, checkInDate, checkOutDate, numberOfGuests, specialRequests } = req.body;

    // Validate required fields
    if (!propertyId || !checkInDate || !checkOutDate || !numberOfGuests) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Find property and verify it exists
    const property = await Property.findById(propertyId).populate('landlordId', '_id name email');

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    // Calculate total amount
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const months = Math.ceil(days / 30);
    const totalAmount = months * (property.monthlyRentMin || 0);

    // Create booking
    const booking = await Booking.create({
      studentId: userId,
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
    const populatedBooking = await Booking.findById(booking._id)
      .populate('studentId', 'name email phone')
      .populate('propertyId', 'name address city monthlyRentMin')
      .populate('landlordId', 'name email phone');

    res.status(201).json({
      status: 'success',
      message: 'Booking created successfully',
      data: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create booking'
    });
  }
};

// Get all bookings for the logged-in student
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { status } = req.query;

    const filter: any = { studentId: userId };
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('propertyId', 'name address city type images monthlyRentMin')
      .populate('landlordId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch bookings'
    });
  }
};

// Get all bookings for landlord's properties
export const getLandlordBookings = async (req: AuthRequest, res: Response) => {
  try {
    const landlordId = req.user?.userId;
    const { status } = req.query;

    const filter: any = { landlordId };
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('studentId', 'name email phone')
      .populate('propertyId', 'name address city type images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get landlord bookings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch bookings'
    });
  }
};

// Get single booking by ID
export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const booking = await Booking.findById(id)
      .populate('studentId', 'name email phone')
      .populate('propertyId', 'name address city type images monthlyRentMin')
      .populate('landlordId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Check if user has permission to view this booking
    if (
      booking.studentId._id.toString() !== userId &&
      booking.landlordId._id.toString() !== userId
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to view this booking'
      });
    }

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch booking'
    });
  }
};

// Confirm booking (landlord only)
export const confirmBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const landlordId = req.user?.userId;

    const booking = await Booking.findOne({ _id: id, landlordId });

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found or you do not have permission'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: `Cannot confirm booking with status: ${booking.status}`
      });
    }

    booking.status = 'confirmed';
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('studentId', 'name email phone')
      .populate('propertyId', 'name address city');

    res.status(200).json({
      status: 'success',
      message: 'Booking confirmed successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to confirm booking'
    });
  }
};

// Reject booking (landlord only)
export const rejectBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const landlordId = req.user?.userId;

    const booking = await Booking.findOne({ _id: id, landlordId });

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found or you do not have permission'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: `Cannot reject booking with status: ${booking.status}`
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      status: 'success',
      message: 'Booking rejected successfully',
      data: booking
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reject booking'
    });
  }
};

// Cancel booking (student only - can only cancel pending bookings)
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const booking = await Booking.findOne({ _id: id, studentId: userId });

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found or you do not have permission'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        status: 'error',
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot cancel a completed booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      status: 'success',
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to cancel booking'
    });
  }
};

// Update booking
export const updateBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const booking = await Booking.findOne({ _id: id, studentId: userId });

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found or you do not have permission'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'Can only update pending bookings'
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('propertyId', 'name address city')
      .populate('landlordId', 'name email');

    res.status(200).json({
      status: 'success',
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update booking'
    });
  }
};

// Delete booking
export const deleteBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const booking = await Booking.findOne({ _id: id, studentId: userId });

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found or you do not have permission'
      });
    }

    await Booking.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete booking'
    });
  }
};
