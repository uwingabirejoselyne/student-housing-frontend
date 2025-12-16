/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import paymentService from '../services/payment.service';
import flutterwaveService from '../services/flutterwave.service';
import bookingService from '../services/booking.service';
import { createNotification } from './notification.controller';
import User from '../models/User';

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

/**
 * Initiate Mobile Money payment via Flutterwave
 * POST /api/payments/initiate-momo
 */
export const initiateMoMoPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { bookingId, amount, phoneNumber } = req.body;

    // Validate required fields
    if (!bookingId || !amount || !phoneNumber) {
      return res.status(400).json({
        status: 'error',
        message: 'Booking ID, amount, and phone number are required'
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get booking details
    const booking = await bookingService.getBookingById(bookingId, userId!);

    // Generate unique transaction reference
    const txRef = flutterwaveService.generateTxRef();

    // Initiate payment with Flutterwave
    const paymentResponse = await flutterwaveService.initiateMoMoPayment({
      amount: Number(amount),
      currency: 'RWF',
      email: user.email,
      phone: phoneNumber,
      name: user.name,
      txRef,
      redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}?tx_ref=${txRef}&booking_id=${bookingId}`,
      meta: {
        bookingId,
        userId: userId!,
        propertyName: (booking as any).propertyId?.name || 'Property'
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Payment initiated successfully',
      data: {
        paymentLink: paymentResponse.data.link,
        txRef,
        ...paymentResponse.data
      }
    });
  } catch (error: any) {
    console.error('Initiate MoMo payment error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to initiate payment'
    });
  }
};

/**
 * Verify Mobile Money payment
 * GET /api/payments/verify/:transactionId
 */
export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user?.userId;

    // Verify transaction with Flutterwave
    const verificationResult = await flutterwaveService.verifyTransaction(transactionId);

    if (!verificationResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment verification failed',
        data: verificationResult.data
      });
    }

    const transactionData = verificationResult.data;

    // Get booking ID from meta data
    const bookingId = transactionData.meta?.bookingId;
    if (!bookingId) {
      return res.status(400).json({
        status: 'error',
        message: 'Booking ID not found in transaction data'
      });
    }

    // Create payment record
    const payment = await paymentService.createPayment({
      bookingId,
      studentId: userId!,
      amount: transactionData.amount,
      paymentMethod: 'momo',
      transactionId: transactionData.tx_ref,
      notes: `MoMo payment via ${transactionData.payment_type || 'Mobile Money'}`
    });

    // Send notification to landlord
    if (payment) {
      try {
        await createNotification({
          userId: payment.landlordId.toString(),
          type: 'payment_received',
          title: 'Payment Received',
          message: `You received a payment of ${transactionData.amount.toLocaleString()} RWF via Mobile Money.`,
          relatedId: payment._id.toString(),
          relatedModel: 'Payment'
        });
      } catch (notifError) {
        console.error('Failed to create notification:', notifError);
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment verified and recorded successfully',
      data: {
        payment,
        transaction: transactionData
      }
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to verify payment'
    });
  }
};

/**
 * Handle Flutterwave webhook
 * POST /api/payments/webhook
 */
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['verif-hash'] as string;

    // Verify webhook signature
    if (!signature || signature !== process.env.FLUTTERWAVE_SECRET_KEY) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid webhook signature'
      });
    }

    const payload = req.body;

    // Check if payment was successful
    if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
      const transactionData = payload.data;

      // Get booking ID from meta data
      const bookingId = transactionData.meta?.bookingId;
      const userId = transactionData.meta?.userId;

      if (bookingId && userId) {
        // Create payment record
        await paymentService.createPayment({
          bookingId,
          studentId: userId,
          amount: transactionData.amount,
          paymentMethod: 'momo',
          transactionId: transactionData.tx_ref,
          notes: `MoMo payment via ${transactionData.payment_type || 'Mobile Money'} (Webhook)`
        });

        console.log('✓ Payment recorded via webhook:', transactionData.tx_ref);
      }
    }

    res.status(200).json({
      status: 'success'
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Webhook processing failed'
    });
  }
};
