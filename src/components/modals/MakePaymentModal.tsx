import { useState } from 'react';
import { X, CreditCard, Banknote, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { paymentService, type CreatePaymentData } from '../../services/paymentService';

interface MakePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  totalAmount: number;
  remainingBalance: number;
  onPaymentSuccess?: () => void;
}

const MakePaymentModal = ({
  isOpen,
  onClose,
  bookingId,
  totalAmount,
  remainingBalance,
  onPaymentSuccess
}: MakePaymentModalProps) => {
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'cash' | 'bank'>('momo');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'airtel'>('mtn');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  if (!isOpen) return null;

  // Reset form when modal closes
  const handleClose = () => {
    setAmount('');
    setPaymentMethod('momo');
    setMomoProvider('mtn');
    setTransactionId('');
    setNotes('');
    setError('');
    setShowInstructions(false);
    onClose();
  };

  // Show USSD payment instructions
  const handleShowInstructions = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const paymentAmount = Number(amount);
    if (!amount || paymentAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (paymentAmount > remainingBalance) {
      setError(`Amount cannot exceed remaining balance of ${remainingBalance.toLocaleString()} RWF`);
      return;
    }

    // Show instructions for MoMo
    if (paymentMethod === 'momo') {
      setShowInstructions(true);
      return;
    }

    // For cash/bank, submit directly
    handleDirectPayment();
  };

  // Handle direct payment submission (cash/bank)
  const handleDirectPayment = async () => {
    const paymentAmount = Number(amount);
    setIsSubmitting(true);

    try {
      const paymentData: CreatePaymentData = {
        bookingId,
        amount: paymentAmount,
        paymentMethod,
        transactionId: transactionId || undefined,
        notes: notes || undefined
      };

      await paymentService.createPayment(paymentData);

      alert(`✓ Payment of ${paymentAmount.toLocaleString()} RWF recorded successfully!`);

      if (onPaymentSuccess) {
        onPaymentSuccess();
      }

      handleClose();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm payment after USSD
  const handleConfirmPayment = async () => {
    if (!transactionId || transactionId.trim() === '') {
      setError('Please enter the transaction reference from your phone');
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentAmount = Number(amount);
      const paymentData: CreatePaymentData = {
        bookingId,
        amount: paymentAmount,
        paymentMethod: 'momo',
        transactionId: transactionId.trim(),
        notes: `${momoProvider.toUpperCase()} Mobile Money payment`
      };

      await paymentService.createPayment(paymentData);

      alert(`✓ Payment of ${paymentAmount.toLocaleString()} RWF recorded successfully!`);

      if (onPaymentSuccess) {
        onPaymentSuccess();
      }

      handleClose();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">Make Payment</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Total Amount:</span>
              <span className="font-semibold text-slate-900">
                {totalAmount.toLocaleString()} RWF
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Remaining Balance:</span>
              <span className="font-bold text-blue-600">
                {remainingBalance.toLocaleString()} RWF
              </span>
            </div>
          </div>

          {/* Form */}
          {!showInstructions ? (
          <form onSubmit={handleShowInstructions} className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Payment Amount (RWF) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                max={remainingBalance}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Maximum: {remainingBalance.toLocaleString()} RWF
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Payment Method *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    paymentMethod === 'momo'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  📱 MoMo
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-4 h-4 mx-auto mb-1" />
                  Cash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  🏦 Bank
                </button>
              </div>
            </div>

            {/* Mobile Money Provider (for MoMo only) */}
            {paymentMethod === 'momo' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Provider *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMomoProvider('mtn')}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      momoProvider === 'mtn'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    📱 MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setMomoProvider('airtel')}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      momoProvider === 'airtel'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    📱 Airtel Money
                  </button>
                </div>
              </div>
            )}

            {/* Transaction ID (optional - for cash/bank only) */}
            {paymentMethod !== 'momo' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Transaction ID (Optional)
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g., Bank reference number"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this payment"
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Processing...'
                  : paymentMethod === 'momo'
                    ? 'Continue to Payment'
                    : 'Submit Payment'}
              </Button>
            </div>
          </form>
          ) : (
            /* USSD Payment Instructions */
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Copy className="w-5 h-5 text-yellow-600" />
                  Payment Instructions - {momoProvider === 'mtn' ? 'MTN MoMo' : 'Airtel Money'}
                </h3>

                <div className="space-y-3 text-sm">
                  <p className="font-semibold text-slate-900">
                    Amount to pay: <span className="text-2xl text-green-600">{Number(amount).toLocaleString()} RWF</span>
                  </p>

                  <div className="bg-white rounded-lg p-4 border-2 border-yellow-300">
                    <p className="font-bold text-slate-900 mb-2">📱 Follow these steps:</p>
                    <ol className="list-decimal list-inside space-y-2 text-slate-700">
                      {momoProvider === 'mtn' ? (
                        <>
                          <li>Dial <span className="font-mono font-bold text-yellow-600">*182*8*1#</span> on your MTN phone</li>
                          <li>Select option <strong>1</strong> (My Wallet)</li>
                          <li>Select option <strong>3</strong> (Payments)</li>
                          <li>Enter amount: <strong>{Number(amount).toLocaleString()} RWF</strong></li>
                          <li>Enter your PIN to confirm</li>
                          <li>You'll receive an SMS with transaction reference</li>
                        </>
                      ) : (
                        <>
                          <li>Dial <span className="font-mono font-bold text-red-600">*500#</span> on your Airtel phone</li>
                          <li>Select <strong>Payments</strong></li>
                          <li>Select <strong>Other Payments</strong></li>
                          <li>Enter amount: <strong>{Number(amount).toLocaleString()} RWF</strong></li>
                          <li>Enter your PIN to confirm</li>
                          <li>You'll receive an SMS with transaction reference</li>
                        </>
                      )}
                    </ol>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      After completing payment, enter the transaction reference below
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Reference Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Transaction Reference * (from SMS)
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g., MP210524.1234.A12345"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Check your phone SMS for the transaction ID
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowInstructions(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleConfirmPayment}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Payment'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MakePaymentModal;
