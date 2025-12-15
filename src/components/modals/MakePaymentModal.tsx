import { useState } from 'react';
import { X, CreditCard, Banknote } from 'lucide-react';
import { Button } from '../ui/Button';
import { paymentService, CreatePaymentData } from '../../services/paymentService';

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
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Reset form when modal closes
  const handleClose = () => {
    setAmount('');
    setPaymentMethod('momo');
    setTransactionId('');
    setNotes('');
    setError('');
    onClose();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);

    try {
      // Create payment data
      const paymentData: CreatePaymentData = {
        bookingId,
        amount: paymentAmount,
        paymentMethod,
        transactionId: transactionId || undefined,
        notes: notes || undefined
      };

      // Submit payment
      await paymentService.createPayment(paymentData);

      // Success!
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
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Transaction ID (optional) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Transaction ID (Optional)
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g., MoMo reference number"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

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
                {isSubmitting ? 'Processing...' : 'Submit Payment'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakePaymentModal;
