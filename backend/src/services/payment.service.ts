import Payment, { IPayment } from '../models/Payment';
import Booking from '../models/Booking';
import mongoose from 'mongoose';

/**
 * Payment Service
 * Handles all payment-related business logic
 */
class PaymentService {

  /**
   * Create a new payment
   * This is called when a student makes a payment
   */
  async createPayment(paymentData: {
    bookingId: string;
    studentId: string;
    amount: number;
    paymentMethod: 'momo' | 'cash' | 'bank';
    transactionId?: string;
    notes?: string;
  }): Promise<IPayment> {

    // Step 1: Find the booking to get landlord info
    const booking = await Booking.findById(paymentData.bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Step 2: Verify the student owns this booking
    if (booking.studentId.toString() !== paymentData.studentId) {
      throw new Error('You can only make payments for your own bookings');
    }

    // Step 3: Check if payment amount is valid
    if (paymentData.amount <= 0) {
      throw new Error('Payment amount must be greater than 0');
    }

    // Step 4: Create the payment record
    const payment = await Payment.create({
      bookingId: paymentData.bookingId,
      studentId: paymentData.studentId,
      landlordId: booking.landlordId,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      transactionId: paymentData.transactionId,
      notes: paymentData.notes,
      paymentStatus: 'completed' // In real app, this would be 'pending' until confirmed
    });

    // Step 5: Update booking payment status
    await this.updateBookingPaymentStatus(paymentData.bookingId);

    return payment;
  }

  /**
   * Update booking payment status based on total payments
   */
  async updateBookingPaymentStatus(bookingId: string): Promise<void> {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Calculate total paid amount
    const payments = await Payment.find({
      bookingId: bookingId,
      paymentStatus: 'completed'
    });

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Update payment status based on amount paid
    if (totalPaid === 0) {
      booking.paymentStatus = 'unpaid';
    } else if (totalPaid < booking.totalAmount) {
      booking.paymentStatus = 'partial';
    } else {
      booking.paymentStatus = 'paid';
    }

    await booking.save();
  }

  /**
   * Get all payments for a booking
   */
  async getBookingPayments(bookingId: string, userId: string): Promise<IPayment[]> {
    // Verify user has access to this booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const isStudent = booking.studentId.toString() === userId;
    const isLandlord = booking.landlordId.toString() === userId;

    if (!isStudent && !isLandlord) {
      throw new Error('You do not have permission to view these payments');
    }

    // Get all payments for this booking
    const payments = await Payment.find({ bookingId })
      .populate('studentId', 'name email')
      .populate('landlordId', 'name email')
      .sort({ createdAt: -1 });

    return payments;
  }

  /**
   * Get all payments made by a student
   */
  async getStudentPayments(studentId: string): Promise<IPayment[]> {
    const payments = await Payment.find({ studentId })
      .populate('bookingId')
      .populate('landlordId', 'name email phone')
      .sort({ createdAt: -1 });

    return payments;
  }

  /**
   * Get all payments received by a landlord
   */
  async getLandlordPayments(landlordId: string): Promise<IPayment[]> {
    const payments = await Payment.find({ landlordId })
      .populate('bookingId')
      .populate('studentId', 'name email phone')
      .sort({ createdAt: -1 });

    return payments;
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string, userId: string): Promise<IPayment> {
    const payment = await Payment.findById(paymentId)
      .populate('bookingId')
      .populate('studentId', 'name email')
      .populate('landlordId', 'name email');

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Verify user has access to this payment
    // When populated, studentId and landlordId are User objects
    const studentIdObj = payment.studentId as any;
    const landlordIdObj = payment.landlordId as any;

    const isStudent = studentIdObj._id.toString() === userId;
    const isLandlord = landlordIdObj._id.toString() === userId;

    if (!isStudent && !isLandlord) {
      throw new Error('You do not have permission to view this payment');
    }

    return payment;
  }

  /**
   * Calculate payment summary for a booking
   */
  async getBookingPaymentSummary(bookingId: string) {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const payments = await Payment.find({
      bookingId: bookingId,
      paymentStatus: 'completed'
    });

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalAmount = booking.totalAmount;
    const remainingBalance = totalAmount - totalPaid;

    return {
      totalAmount,
      totalPaid,
      remainingBalance,
      paymentStatus: booking.paymentStatus,
      paymentCount: payments.length
    };
  }
}

export default new PaymentService();
