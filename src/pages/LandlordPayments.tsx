import React, { useState } from 'react';
import { DollarSign, Menu, Search, Download, CheckCircle, Clock, AlertCircle, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LandlordSidebar from '../components/layout/LandlordSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import PaymentDetailsModal from '../components/modals/PaymentDetailsModal';

// Mock Data
const payments = [
  {
    id: 1,
    tenantName: 'Jean Claude Mugabo',
    tenantId: 'STU-2024-001',
    property: 'University Heights',
    unit: 'Block A - Room 205',
    amount: 150000,
    dueDate: '2024-11-30',
    paidDate: '2024-11-01',
    status: 'paid',
    method: 'Mobile Money',
    reference: 'PAY-2024-001',
  },
  {
    id: 2,
    tenantName: 'Marie Uwase',
    tenantId: 'STU-2024-002',
    property: 'Campus View Apartments',
    unit: 'Apt 301',
    amount: 180000,
    dueDate: '2024-11-30',
    paidDate: null,
    status: 'pending',
    method: null,
    reference: null,
  },
  {
    id: 3,
    tenantName: 'Patrick Nkusi',
    tenantId: 'STU-2024-003',
    property: 'Student Residence Hall',
    unit: 'Block B - Room 105',
    amount: 140000,
    dueDate: '2024-11-30',
    paidDate: '2024-11-05',
    status: 'paid',
    method: 'Bank Transfer',
    reference: 'PAY-2024-002',
  },
  {
    id: 4,
    tenantName: 'Grace Ishimwe',
    tenantId: 'STU-2024-004',
    property: 'Downtown Student Suites',
    unit: 'Apt 202',
    amount: 160000,
    dueDate: '2024-10-30',
    paidDate: null,
    status: 'overdue',
    method: null,
    reference: null,
  },
  {
    id: 5,
    tenantName: 'David Habimana',
    tenantId: 'STU-2024-005',
    property: 'Riverside Hostel',
    unit: 'Block C - Room 310',
    amount: 135000,
    dueDate: '2024-11-30',
    paidDate: '2024-11-03',
    status: 'paid',
    method: 'Mobile Money',
    reference: 'PAY-2024-003',
  },
  {
    id: 6,
    tenantName: 'Sarah Mukamana',
    tenantId: 'STU-2024-006',
    property: 'University Heights',
    unit: 'Block A - Room 103',
    amount: 150000,
    dueDate: '2024-11-30',
    paidDate: '2024-11-01',
    status: 'paid',
    method: 'Bank Transfer',
    reference: 'PAY-2024-004',
  },
  {
    id: 7,
    tenantName: 'Emmanuel Gasana',
    tenantId: 'STU-2024-007',
    property: 'Campus View Apartments',
    unit: 'Apt 105',
    amount: 180000,
    dueDate: '2024-11-30',
    paidDate: null,
    status: 'pending',
    method: null,
    reference: null,
  },
  {
    id: 8,
    tenantName: 'Alice Uwera',
    tenantId: 'STU-2024-008',
    property: 'Student Residence Hall',
    unit: 'Block A - Room 201',
    amount: 140000,
    dueDate: '2024-10-30',
    paidDate: null,
    status: 'overdue',
    method: null,
    reference: null,
  },
];

const revenueHistory = [
  { month: 'November 2024', collected: 1205000, expected: 1565000, percentage: 77 },
  { month: 'October 2024', collected: 1565000, expected: 1565000, percentage: 100 },
  { month: 'September 2024', collected: 1480000, expected: 1565000, percentage: 95 },
  { month: 'August 2024', collected: 1565000, expected: 1565000, percentage: 100 },
];

const LandlordPayments = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null);

  const displayName = user?.name || 'Landlord';

  const handleSendReminder = (paymentId: number) => {
    console.log('Sending payment reminder for payment:', paymentId);
    // In real implementation: API call to send reminder email/SMS
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.tenantId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || payment.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const totalExpected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalCollected = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
  const collectionRate = Math.round((totalCollected / totalExpected) * 100);

  const paidCount = payments.filter(p => p.status === 'paid').length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const overdueCount = payments.filter(p => p.status === 'overdue').length;

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" icon={CheckCircle}>Paid</Badge>;
      case 'pending':
        return <Badge variant="warning" icon={Clock}>Pending</Badge>;
      case 'overdue':
        return <Badge variant="error" icon={AlertCircle}>Overdue</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <LandlordSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="w-6 h-6 text-slate-700" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">Payments & Revenue</h1>
              </div>

              <Button icon={Download} variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Export Report
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card padding="md" className="border-l-4 border-emerald-500">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-emerald-600" aria-hidden="true" />
                <TrendingUp className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Collected</p>
              <p className="text-3xl font-bold text-slate-900">RWF {totalCollected.toLocaleString()}</p>
              <p className="text-xs text-emerald-600 mt-1">{paidCount} payments received</p>
            </Card>

            <Card padding="md" className="border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-orange-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Pending Payments</p>
              <p className="text-3xl font-bold text-slate-900">RWF {totalPending.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">{pendingCount} payments pending</p>
            </Card>

            <Card padding="md" className="border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-8 h-8 text-red-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Overdue Amount</p>
              <p className="text-3xl font-bold text-slate-900">RWF {totalOverdue.toLocaleString()}</p>
              <p className="text-xs text-red-600 mt-1">{overdueCount} overdue payments</p>
            </Card>

            <Card padding="md" className="border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-blue-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Collection Rate</p>
              <p className="text-3xl font-bold text-slate-900">{collectionRate}%</p>
              <p className="text-xs text-slate-500 mt-1">This month</p>
            </Card>
          </div>

          {/* Revenue History Chart */}
          <Card padding="md" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Revenue Trend</h3>
              <Button variant="ghost" size="sm" icon={Calendar}>
                Last 4 Months
              </Button>
            </div>

            <div className="space-y-4">
              {revenueHistory.map((record, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">{record.month}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900">
                        RWF {record.collected.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500"> / {record.expected.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        record.percentage === 100
                          ? 'bg-emerald-500'
                          : record.percentage >= 80
                          ? 'bg-green-500'
                          : record.percentage >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${record.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-slate-500">{record.percentage}% collected</span>
                    <span className="text-xs text-slate-500">
                      {record.percentage < 100 && `RWF ${(record.expected - record.collected).toLocaleString()} remaining`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Search and Filter Bar */}
          <Card padding="md" className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by tenant name, property, or ID..."
                  icon={Search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="sm:w-48">
                <select
                  className="input"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Payments Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Property & Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Payment Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">{payment.tenantName}</p>
                          <p className="text-xs text-slate-500">{payment.tenantId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">{payment.property}</p>
                        <p className="text-xs text-slate-500">{payment.unit}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">
                          RWF {payment.amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">{payment.dueDate}</p>
                      </td>
                      <td className="px-6 py-4">{getPaymentStatusBadge(payment.status)}</td>
                      <td className="px-6 py-4">
                        {payment.status === 'paid' ? (
                          <div>
                            <p className="text-xs text-slate-600">
                              Paid: <span className="font-medium">{payment.paidDate}</span>
                            </p>
                            <p className="text-xs text-slate-500">{payment.method}</p>
                            <p className="text-xs text-slate-400 font-mono">{payment.reference}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500">Not paid yet</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Empty State */}
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No payments found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </main>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <PaymentDetailsModal
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          payment={{
            ...selectedPayment,
            tenantEmail: `${selectedPayment.tenantName.toLowerCase().replace(' ', '.')}@student.edu`,
            tenantPhone: '+250 78X XXX XXX',
          }}
          onSendReminder={handleSendReminder}
        />
      )}
    </div>
  );
};

export default LandlordPayments;
