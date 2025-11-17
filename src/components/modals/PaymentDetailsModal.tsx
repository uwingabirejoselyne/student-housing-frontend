import React, { useState } from 'react';
import { X, DollarSign, Download, Send, User, Home, Calendar, CreditCard, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: {
    id: number;
    tenantName: string;
    tenantId: string;
    tenantEmail?: string;
    tenantPhone?: string;
    property: string;
    unit: string;
    amount: number;
    dueDate: string;
    paidDate: string | null;
    status: string;
    method: string | null;
    reference: string | null;
  };
  onSendReminder?: (paymentId: number) => void;
}

const paymentHistory = [
  { month: 'October 2024', amount: 150000, paidDate: '2024-10-02', method: 'Mobile Money', reference: 'PAY-2024-045' },
  { month: 'September 2024', amount: 150000, paidDate: '2024-09-01', method: 'Bank Transfer', reference: 'PAY-2024-032' },
  { month: 'August 2024', amount: 150000, paidDate: '2024-08-03', method: 'Mobile Money', reference: 'PAY-2024-021' },
  { month: 'July 2024', amount: 150000, paidDate: '2024-07-01', method: 'Bank Transfer', reference: 'PAY-2024-012' },
];

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  onClose,
  payment,
  onSendReminder,
}) => {
  const [reminderSent, setReminderSent] = useState(false);

  const handleSendReminder = () => {
    if (onSendReminder) {
      onSendReminder(payment.id);
      setReminderSent(true);
      setTimeout(() => setReminderSent(false), 3000);
    }
  };

  const handleDownloadReceipt = () => {
    // Mock receipt download
    console.log('Downloading receipt for payment:', payment.reference);
    // In real implementation: Generate and download PDF receipt
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'overdue':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'pending':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'overdue':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  if (!isOpen) return null;

  const StatusIcon = getStatusIcon(payment.status);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 fade-in overflow-y-auto"
      onClick={onClose}
    >
      <Card
        padding="none"
        className="max-w-3xl w-full my-8 slide-up max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-emerald-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Payment Details</h2>
              <p className="text-sm text-slate-600">Transaction information and history</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-slate-600" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Payment Status Card */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(payment.status)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <StatusIcon className="w-8 h-8" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium opacity-80">Payment Status</p>
                  <p className="text-2xl font-bold capitalize">{payment.status}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium opacity-80">Amount</p>
                <p className="text-3xl font-bold">RWF {payment.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-current/20">
              <div>
                <p className="text-xs font-medium opacity-70 mb-1">Due Date</p>
                <p className="font-semibold">{payment.dueDate}</p>
              </div>
              {payment.paidDate && (
                <div>
                  <p className="text-xs font-medium opacity-70 mb-1">Paid Date</p>
                  <p className="font-semibold">{payment.paidDate}</p>
                </div>
              )}
              {payment.method && (
                <div>
                  <p className="text-xs font-medium opacity-70 mb-1">Payment Method</p>
                  <p className="font-semibold">{payment.method}</p>
                </div>
              )}
              {payment.reference && (
                <div>
                  <p className="text-xs font-medium opacity-70 mb-1">Reference Number</p>
                  <p className="font-semibold font-mono text-sm">{payment.reference}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tenant Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              Tenant Information
            </h3>
            <Card padding="md" className="bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Full Name</p>
                  <p className="font-semibold text-slate-900">{payment.tenantName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Tenant ID</p>
                  <p className="font-semibold text-slate-900 font-mono">{payment.tenantId}</p>
                </div>
                {payment.tenantEmail && (
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Email</p>
                    <p className="font-medium text-slate-900">{payment.tenantEmail}</p>
                  </div>
                )}
                {payment.tenantPhone && (
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Phone</p>
                    <p className="font-medium text-slate-900">{payment.tenantPhone}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Property Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              Property Information
            </h3>
            <Card padding="md" className="bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Property Name</p>
                  <p className="font-semibold text-slate-900">{payment.property}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Unit</p>
                  <p className="font-semibold text-slate-900">{payment.unit}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment History */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              Payment History
            </h3>
            <div className="space-y-3">
              {paymentHistory.map((record, index) => (
                <Card key={index} padding="md" hover className="transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{record.month}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Paid on {record.paidDate} via {record.method}
                        </p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{record.reference}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">RWF {record.amount.toLocaleString()}</p>
                      <Badge variant="success" className="mt-1">Paid</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Actions */}
          {payment.status === 'paid' && payment.reference && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                Actions
              </h3>
              <Button
                icon={Download}
                variant="secondary"
                fullWidth
                onClick={handleDownloadReceipt}
              >
                Download Receipt
              </Button>
            </div>
          )}

          {(payment.status === 'pending' || payment.status === 'overdue') && onSendReminder && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                Payment Reminder
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-600 mb-2">
                  Send a payment reminder to <span className="font-semibold">{payment.tenantName}</span>
                </p>
                <p className="text-xs text-slate-500">
                  {payment.tenantEmail ? `Email will be sent to ${payment.tenantEmail}` : 'Contact information not available'}
                </p>
              </div>
              <Button
                icon={Send}
                variant="accent"
                fullWidth
                onClick={handleSendReminder}
                disabled={reminderSent || !payment.tenantEmail}
                className={reminderSent ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                {reminderSent ? 'Reminder Sent!' : 'Send Payment Reminder'}
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Close
          </Button>
          {payment.status === 'paid' && payment.reference && (
            <Button
              icon={Download}
              fullWidth
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleDownloadReceipt}
            >
              Download Receipt
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PaymentDetailsModal;
