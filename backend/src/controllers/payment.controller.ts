/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import paymentService from '../services/payment.service';
import { createNotification } from './notification.controller';

/**
 * Create a new payment
 * POST /api/payments
 */
export const createPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Validate required fields
    const { bookingId, amount, paymentMethod, transactionId, notes } = req.body;

    if (!bookingId || !amount || !paymentMethod) {
      return res.status(400).json({
        status: 'error',
        message: 'Booking ID, amount, and payment method are required'
      });
    }

    // Create payment
    const payment = await paymentService.createPayment({
      bookingId,
      studentId: userId!,
      amount: Number(amount),
      paymentMethod,
      transactionId,
      notes
    });

    // Get payment summary to send in notification
    const summary = await paymentService.getBookingPaymentSummary(bookingId);

    // Send notification to landlord about payment received
    if (payment) {
      try {
        await createNotification({
          userId: payment.landlordId.toString(),
          type: 'payment_received',
          title: 'Payment Received',
          message: `You received a payment of ${amount.toLocaleString()} RWF via ${paymentMethod}.`,
          relatedId: payment._id.toString(),
          relatedModel: 'Payment'
        });
      } catch (notifError) {
        console.error('Failed to create notification:', notifError);
      }
    }

    res.status(201).json({
      status: 'success',
      message: 'Payment recorded successfully',
      data: payment,
      summary
    });
  } catch (error: any) {
    console.error('Create payment error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to create payment'
    });
  }
};

/**
 * Get all payments for a booking
 * GET /api/payments/booking/:bookingId
 */
export const getBookingPayments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { bookingId } = req.params;

    const payments = await paymentService.getBookingPayments(bookingId, userId!);

    res.status(200).json({
      status: 'success',
      count: payments.length,
      data: payments
    });
  } catch (error: any) {
    console.error('Get booking payments error:', error);
    const statusCode = error.message.includes('not found') ? 404 :
                       error.message.includes('permission') ? 403 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to fetch payments'
    });
  }
};

/**
 * Get payment summary for a booking
 * GET /api/payments/booking/:bookingId/summary
 */
export const getBookingPaymentSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId } = req.params;
    const summary = await paymentService.getBookingPaymentSummary(bookingId);

    res.status(200).json({
      status: 'success',
      data: summary
    });
  } catch (error: any) {
    console.error('Get payment summary error:', error);
    res.status(error.message.includes('not found') ? 404 : 500).json({
      status: 'error',
      message: error.message || 'Failed to fetch payment summary'
    });
  }
};

/**
 * Get all payments for logged-in student
 * GET /api/payments/my-payments
 */
export const getMyPayments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const payments = await paymentService.getStudentPayments(userId!);

    res.status(200).json({
      status: 'success',
      count: payments.length,
      data: payments
    });
  } catch (error: any) {
    console.error('Get my payments error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch payments'
    });
  }
};

/**
 * Get all payments received by landlord
 * GET /api/payments/landlord-payments
 */
export const getLandlordPayments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const payments = await paymentService.getLandlordPayments(userId!);

    res.status(200).json({
      status: 'success',
      count: payments.length,
      data: payments
    });
  } catch (error: any) {
    console.error('Get landlord payments error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch payments'
    });
  }
};

/**
 * Get single payment by ID
 * GET /api/payments/:id
 */
export const getPaymentById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const payment = await paymentService.getPaymentById(id, userId!);

    res.status(200).json({
      status: 'success',
      data: payment
    });
  } catch (error: any) {
    console.error('Get payment error:', error);
    const statusCode = error.message.includes('not found') ? 404 :
                       error.message.includes('permission') ? 403 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to fetch payment'
    });
  }
};
