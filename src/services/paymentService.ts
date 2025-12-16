import { api } from './api';

/**
 * Payment interface matching backend
 */
export interface Payment {
  _id: string;
  bookingId: string;
  studentId: { _id: string; name: string; email: string };
  landlordId: { _id: string; name: string; email: string };
  amount: number;
  paymentMethod: 'momo' | 'cash' | 'bank';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payment summary interface
 */
export interface PaymentSummary {
  totalAmount: number;
  totalPaid: number;
  remainingBalance: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentCount: number;
}

/**
 * Create payment data interface
 */
export interface CreatePaymentData {
  bookingId: string;
  amount: number;
  paymentMethod: 'momo' | 'cash' | 'bank';
  transactionId?: string;
  notes?: string;
}

/**
 * Payment Service
 * Handles all payment API calls
 */
export const paymentService = {

  /**
   * Initiate Mobile Money payment
   */
  initiateMoMoPayment: async (data: {
    bookingId: string;
    amount: number;
    phoneNumber: string;
  }): Promise<{ paymentLink: string; txRef: string }> => {
    const response = await api.post('/api/payments/initiate-momo', data);
    return response.data.data;
  },

  /**
   * Verify payment transaction
   */
  verifyPayment: async (transactionId: string): Promise<any> => {
    const response = await api.get(`/api/payments/verify/${transactionId}`);
    return response.data.data;
  },

  /**
   * Create a new payment (for cash/bank)
   */
  createPayment: async (paymentData: CreatePaymentData): Promise<{ payment: Payment; summary: PaymentSummary }> => {
    const response = await api.post('/api/payments', paymentData);
    return {
      payment: response.data.data,
      summary: response.data.summary
    };
  },

  /**
   * Get all payments for current user (student)
   */
  getMyPayments: async (): Promise<Payment[]> => {
    const response = await api.get('/api/payments/my-payments');
    return response.data.data;
  },

  /**
   * Get all payments received by landlord
   */
  getLandlordPayments: async (): Promise<Payment[]> => {
    const response = await api.get('/api/payments/landlord-payments');
    return response.data.data;
  },

  /**
   * Get all payments for a specific booking
   */
  getBookingPayments: async (bookingId: string): Promise<Payment[]> => {
    const response = await api.get(`/api/payments/booking/${bookingId}`);
    return response.data.data;
  },

  /**
   * Get payment summary for a booking
   */
  getBookingPaymentSummary: async (bookingId: string): Promise<PaymentSummary> => {
    const response = await api.get(`/api/payments/booking/${bookingId}/summary`);
    return response.data.data;
  },

  /**
   * Get single payment by ID
   */
  getPaymentById: async (paymentId: string): Promise<Payment> => {
    const response = await api.get(`/api/payments/${paymentId}`);
    return response.data.data;
  }
};
