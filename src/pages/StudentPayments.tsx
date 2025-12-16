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

          {/* Payments Table */}
          <Card padding="none">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">Payment History</h2>
              </div>
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Paid To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {payments.map((payment) => {
                      const methodBadge = getPaymentMethodBadge(payment.paymentMethod);
                      const statusBadge = getStatusBadge(payment.paymentStatus);

                      return (
                        <tr key={payment._id} className="hover:bg-slate-50 transition-colors">
                          {/* Date */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span className="text-sm font-medium text-slate-900">
                                {formatDate(payment.paymentDate)}
                              </span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-bold text-green-600">
                                {payment.amount.toLocaleString()} RWF
                              </span>
                            </div>
                          </td>

                          {/* Method */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={methodBadge.variant} className="text-xs">
                              {methodBadge.text}
                            </Badge>
                          </td>

                          {/* Paid To */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900 font-medium">
                              {payment.landlordId.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {payment.landlordId.email}
                            </div>
                          </td>

                          {/* Transaction ID */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {payment.transactionId ? (
                              <div className="text-xs font-mono text-slate-600" title={payment.transactionId}>
                                {payment.transactionId.length > 20
                                  ? `${payment.transactionId.substring(0, 20)}...`
                                  : payment.transactionId}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={statusBadge.variant} className="text-xs">
                              {statusBadge.text}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default StudentPayments;
