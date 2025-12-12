import express from 'express';
import {
  createBooking,
  getMyBookings,
  getLandlordBookings,
  getBookingById,
  confirmBooking,
  rejectBooking,
  cancelBooking,
  updateBooking,
  deleteBooking
} from '../controllers/booking.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

// Student routes
router.post('/', createBooking); // Create new booking
router.get('/my-bookings', getMyBookings); // Get all bookings for logged-in student
router.get('/:id', getBookingById); // Get single booking by ID
router.put('/:id', updateBooking); // Update booking (only pending bookings)
router.patch('/:id/cancel', cancelBooking); // Cancel booking (student)
router.delete('/:id', deleteBooking); // Delete booking

// Landlord routes
router.get('/landlord/bookings', getLandlordBookings); // Get all bookings for landlord's properties
router.patch('/:id/confirm', confirmBooking); // Confirm booking (landlord only)
router.patch('/:id/reject', rejectBooking); // Reject booking (landlord only)

export default router;
