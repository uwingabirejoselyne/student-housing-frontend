import Flutterwave from 'flutterwave-node-v3';

/**
 * Flutterwave Service
 * Handles Mobile Money payments through Flutterwave
 */
class FlutterwaveService {
  private flw: any;

  constructor() {
    // Initialize Flutterwave with credentials from environment
    this.flw = new Flutterwave(
      process.env.FLUTTERWAVE_PUBLIC_KEY!,
      process.env.FLUTTERWAVE_SECRET_KEY!
    );
  }

  /**
   * Initiate Mobile Money payment (MTN, Airtel)
   */
  async initiateMoMoPayment(paymentData: {
    amount: number;
    currency: string;
    email: string;
    phone: string;
    name: string;
    txRef: string; // Unique transaction reference
    redirectUrl: string;
    meta?: any;
  }) {
    try {
      const payload = {
        tx_ref: paymentData.txRef,
        amount: paymentData.amount.toString(),
        currency: paymentData.currency || 'RWF',
        email: paymentData.email,
        phone_number: paymentData.phone,
        fullname: paymentData.name,
        redirect_url: paymentData.redirectUrl,
        payment_options: 'mobilemoneyrwanda', // Rwanda Mobile Money
        meta: paymentData.meta || {},
        customizations: {
          title: 'Student Housing Payment',
          description: 'Payment for accommodation booking',
          logo: 'https://your-logo-url.com/logo.png'
        }
      };

      const response = await this.flw.Charge.card(payload);
      return response;
    } catch (error: any) {
      console.error('Flutterwave MoMo initiation error:', error);
      throw new Error(error.message || 'Failed to initiate mobile money payment');
    }
  }

  /**
   * Verify payment transaction
   */
  async verifyTransaction(transactionId: string) {
    try {
      const response = await this.flw.Transaction.verify({ id: transactionId });

      if (response.data.status === 'successful' &&
          response.data.amount >= 0 &&
          response.data.currency === 'RWF') {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          message: 'Payment verification failed',
          data: response.data
        };
      }
    } catch (error: any) {
      console.error('Flutterwave verification error:', error);
      throw new Error(error.message || 'Failed to verify transaction');
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId: string) {
    try {
      const response = await this.flw.Transaction.fetch({ id: transactionId });
      return response.data;
    } catch (error: any) {
      console.error('Flutterwave get transaction error:', error);
      throw new Error(error.message || 'Failed to fetch transaction');
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(signature: string, payload: any): boolean {
    const hash = require('crypto')
      .createHmac('sha256', process.env.FLUTTERWAVE_SECRET_KEY!)
      .update(JSON.stringify(payload))
      .digest('hex');

    return hash === signature;
  }

  /**
   * Generate unique transaction reference
   */
  generateTxRef(): string {
    return `STDHSG-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }
}

export default new FlutterwaveService();
