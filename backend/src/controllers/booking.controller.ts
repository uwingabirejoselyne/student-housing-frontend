/* eslint-disable @typescript-eslint/no-explicit-any */
import {  Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import bookingService from '../services/booking.service';
import { createNotification } from './notification.controller';

/**
 * Create a new booking
 */
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Validate booking data
    bookingService.validateBookingData(req.body);

    // Create booking
    const booking = await bookingService.createBooking({
      studentId: userId!,
      ...req.body
    });

    // Send notification to the landlord about the new booking request
    if (booking) {
      try {
        const propertyName = typeof booking.propertyId === 'object' && (booking.propertyId as any).name
          ? (booking.propertyId as any).name
          : 'your property';
        await createNotification({
          userId: booking.landlordId.toString(),
          type: 'booking_created',
          title: 'New Booking Request',
          message: `You have a new booking request for ${propertyName}.`,
          relatedId: booking._id.toString(),
          relatedModel: 'Booking'
        });
      } catch (notifError) {
        console.error('Failed to create notification:', notifError);
        // Don't fail the whole request if notification fails
      }
    }

    res.status(201).json({
      status: 'success',
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(error.message.includes('not found') ? 404 : 400).json({
      status: 'error',
      message: error.message || 'Failed to create booking'
    });
  }
};

/**
 * Get all bookings for the logged-in student
 */
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { status } = req.query;

    const bookings = await bookingService.getStudentBookings(
      userId!,
      status as string
    );

    res.status(200).json({
      status: 'success',
      count: bookings.length,
      data: bookings
    });
  } catch (error: any) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch bookings'
    });
  }
};

/**
 * Get all bookings for landlord's properties
 */
export const getLandlordBookings = async (req: AuthRequest, res: Response) => {
  try {
    const landlordId = req.user?.userId;
    const { status } = req.query;

    const bookings = await bookingService.getLandlordBookings(
      landlordId!,
      status as string
    );

    res.status(200).json({
      status: 'success',
      count: bookings.length,
      data: bookings
    });
  } catch (error: any) {
    console.error('Get landlord bookings error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch bookings'
    });
  }
};

/**
 * Get single booking by ID
 */
export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const booking = await bookingService.getBookingById(id, userId!);

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error: any) {
    console.error('Get booking error:', error);
    const statusCode = error.message.includes('not found') ? 404 :
                       error.message.includes('permission') ? 403 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to fetch booking'
    });
  }
};

/**
 * Confirm booking (landlord only)
 */
export const confirmBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const landlordId = req.user?.userId;

    const booking = await bookingService.confirmBooking(id, landlordId!);

    // Send notification to the student that their booking was confirmed
    if (booking) {
      try {
        const propertyName = typeof booking.propertyId === 'object' && (booking.propertyId as any).name
          ? (booking.propertyId as any).name
          : 'property';
        await createNotification({
          userId: booking.studentId.toString(),
          type: 'booking_confirmed',
          title: 'Booking Confirmed!',
          message: `Your booking for ${propertyName} has been confirmed by the landlord.`,
          relatedId: booking._id.toString(),
          relatedModel: 'Booking'
        });
      } catch (notifError) {
        console.error('Failed to create notification:', notifError);
        // Don't fail the whole request if notification fails
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Booking confirmed successfully',
      data: booking
    });
  } catch (error: any) {
    console.error('Confirm booking error:', error);
    const statusCode = error.message.includes('not found') || error.message.includes('permission') ? 404 :
                       error.message.includes('Cannot confirm') ? 400 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to confirm booking'
    });
  }
};

/**
 * Reject booking (landlord only)
 */
export const rejectBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const landlordId = req.user?.userId;

    const booking = await bookingService.rejectBooking(id, landlordId!);

    // Send notification to the student that their booking was rejected
    if (booking && booking.studentId) {
      try {
        const propertyName = typeof booking.propertyId === 'object' && (booking.propertyId as any).name
          ? (booking.propertyId as any).name
          : 'property';
        await createNotification({
          userId: booking.studentId.toString(),
          type: 'booking_rejected',
          title: 'Booking Rejected',
          message: `Your booking request for ${propertyName} has been declined.`,
          relatedId: booking._id.toString(),
          relatedModel: 'Booking'
        });
      } catch (notifError) {
        console.error('Failed to create notification:', notifError);
        // Don't fail the whole request if notification fails
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Booking rejected successfully',
      data: booking
    });
  } catch (error: any) {
    console.error('Reject booking error:', error);
    const statusCode = error.message.includes('not found') || error.message.includes('permission') ? 404 :
                       error.message.includes('Cannot reject') ? 400 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to reject booking'
    });
  }
};

/**
 * Cancel booking (student only)
 */
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const booking = await bookingService.cancelBooking(id, userId!);

    res.status(200).json({
      status: 'success',
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    const statusCode = error.message.includes('not found') || error.message.includes('permission') ? 404 :
                       error.message.includes('already cancelled') || error.message.includes('Cannot cancel') ? 400 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to cancel booking'
    });
  }
};

/**
 * Update booking
 */
export const updateBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const booking = await bookingService.updateBooking(id, userId!, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error: any) {
    console.error('Update booking error:', error);
    const statusCode = error.message.includes('not found') || error.message.includes('permission') ? 404 :
                       error.message.includes('only update') ? 400 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to update booking'
    });
  }
};

/**
 * Delete booking
 */
export const deleteBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    await bookingService.deleteBooking(id, userId!);

    res.status(200).json({
      status: 'success',
      message: 'Booking deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete booking error:', error);
    const statusCode = error.message.includes('not found') || error.message.includes('permission') ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to delete booking'
    });
  }
};
