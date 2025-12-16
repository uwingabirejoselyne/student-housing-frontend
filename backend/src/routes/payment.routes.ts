import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as paymentController from '../controllers/payment.controller';

const router = express.Router();

/**
 * Payment Routes
 * All routes require authentication except webhook
 */

// Mobile Money payment routes
router.post('/initiate-momo', authenticate, paymentController.initiateMoMoPayment);
router.get('/verify/:transactionId', authenticate, paymentController.verifyPayment);
router.post('/webhook', paymentController.handleWebhook); // No auth - Flutterwave webhook

// Create a new payment (students only)
router.post('/', authenticate, paymentController.createPayment);

// Get all payments for the logged-in user (student or landlord)
router.get('/my-payments', authenticate, paymentController.getMyPayments);

// Get all payments received by landlord
router.get('/landlord-payments', authenticate, paymentController.getLandlordPayments);

// Get all payments for a specific booking
router.get('/booking/:bookingId', authenticate, paymentController.getBookingPayments);

// Get payment summary for a booking
router.get('/booking/:bookingId/summary', authenticate, paymentController.getBookingPaymentSummary);

// Get a single payment by ID
router.get('/:id', authenticate, paymentController.getPaymentById);

export default router;
