import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Calendar, Menu, Receipt } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import NotificationDropdown from '../components/layout/NotificationDropdown';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { paymentService, Payment } from '../services/paymentService';

const StudentPayments = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch payments on mount
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const data = await paymentService.getMyPayments();
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPaymentMethodBadge = (method: string) => {
    const badges = {
      momo: { text: '📱 MoMo', variant: 'primary' as const },
      cash: { text: '💵 Cash', variant: 'success' as const },
      bank: { text: '🏦 Bank', variant: 'info' as const }
    };
    return badges[method as keyof typeof badges] || { text: method, variant: 'default' as const };
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { text: 'Completed', variant: 'success' as const },
      pending: { text: 'Pending', variant: 'warning' as const },
      failed: { text: 'Failed', variant: 'danger' as const },
      refunded: { text: 'Refunded', variant: 'info' as const }
    };
    return badges[status as keyof typeof badges] || { text: status, variant: 'default' as const };
  };

  // Calculate total paid
  const totalPaid = payments
    .filter(p => p.paymentStatus === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Menu className="w-6 h-6 text-slate-700" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">My Payments</h1>
              </div>

              <div className="flex items-center gap-3">
                <NotificationDropdown />
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">Student</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {/* Summary Card */}
          <Card padding="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">Total Payments Made</p>
                <p className="text-4xl font-bold">{totalPaid.toLocaleString()} RWF</p>
                <p className="text-sm text-blue-100 mt-2">{payments.length} transactions</p>
              </div>
              <DollarSign className="w-16 h-16 text-blue-200 opacity-50" />
            </div>
          </Card>

          {/* Payments List */}
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <Receipt className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">Payment History</h2>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-slate-600">Loading payments...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">No payments yet</p>
                <p className="text-slate-500 text-sm">Your payment history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => {
                  const methodBadge = getPaymentMethodBadge(payment.paymentMethod);
                  const statusBadge = getStatusBadge(payment.paymentStatus);

                  return (
                    <Card key={payment._id} padding="md" className="border-l-4 border-blue-500">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Payment Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900">
                              Payment #{payment._id.slice(-6).toUpperCase()}
                            </h3>
                            <Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                            <div>
                              <span className="font-medium">Amount:</span>{' '}
                              <span className="font-bold text-slate-900">
                                {payment.amount.toLocaleString()} RWF
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Method:</span>{' '}
                              <Badge variant={methodBadge.variant} className="text-xs">
                                {methodBadge.text}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span className="font-medium">Date:</span> {formatDate(payment.paymentDate)}
                            </div>
                            {payment.transactionId && (
                              <div>
                                <span className="font-medium">Transaction:</span> {payment.transactionId}
                              </div>
                            )}
                          </div>
                          {payment.notes && (
                            <div className="mt-2 text-sm text-slate-600">
                              <span className="font-medium">Notes:</span> {payment.notes}
                            </div>
                          )}
                        </div>

                        {/* Landlord Info */}
                        <div className="text-sm text-slate-600 md:text-right">
                          <p className="font-medium text-slate-900">Paid to:</p>
                          <p>{payment.landlordId.name}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default StudentPayments;
