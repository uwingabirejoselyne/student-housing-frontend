import React, { useState } from 'react';
import { Users, Menu, Search, Filter, Mail, Phone, MapPin, Calendar, DollarSign, Eye, MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LandlordSidebar from '../components/layout/LandlordSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import TenantDetailsModal from '../components/modals/TenantDetailsModal';

// Mock Data
const tenants = [
  {
    id: 1,
    name: 'Jean Claude Mugabo',
    email: 'jean.mugabo@student.edu',
    phone: '+250 788 123 456',
    studentId: 'STU-2024-001',
    property: 'University Heights',
    unit: 'Block A - Room 205',
    checkIn: '2024-01-15',
    checkOut: '2024-12-31',
    monthlyRent: 150000,
    paymentStatus: 'paid',
    balance: 0,
    lastPayment: '2024-11-01',
    status: 'active',
  },
  {
    id: 2,
    name: 'Marie Uwase',
    email: 'marie.uwase@student.edu',
    phone: '+250 788 234 567',
    studentId: 'STU-2024-002',
    property: 'Campus View Apartments',
    unit: 'Apt 301',
    checkIn: '2024-02-01',
    checkOut: '2024-12-31',
    monthlyRent: 180000,
    paymentStatus: 'pending',
    balance: 180000,
    lastPayment: '2024-10-01',
    status: 'active',
  },
  {
    id: 3,
    name: 'Patrick Nkusi',
    email: 'patrick.nkusi@student.edu',
    phone: '+250 788 345 678',
    studentId: 'STU-2024-003',
    property: 'Student Residence Hall',
    unit: 'Block B - Room 105',
    checkIn: '2024-01-20',
    checkOut: '2024-12-31',
    monthlyRent: 140000,
    paymentStatus: 'paid',
    balance: 0,
    lastPayment: '2024-11-05',
    status: 'active',
  },
  {
    id: 4,
    name: 'Grace Ishimwe',
    email: 'grace.ishimwe@student.edu',
    phone: '+250 788 456 789',
    studentId: 'STU-2024-004',
    property: 'Downtown Student Suites',
    unit: 'Apt 202',
    checkIn: '2024-03-01',
    checkOut: '2024-12-31',
    monthlyRent: 160000,
    paymentStatus: 'overdue',
    balance: 320000,
    lastPayment: '2024-09-15',
    status: 'active',
  },
  {
    id: 5,
    name: 'David Habimana',
    email: 'david.habimana@student.edu',
    phone: '+250 788 567 890',
    studentId: 'STU-2024-005',
    property: 'Riverside Hostel',
    unit: 'Block C - Room 310',
    checkIn: '2024-02-15',
    checkOut: '2024-12-31',
    monthlyRent: 135000,
    paymentStatus: 'paid',
    balance: 0,
    lastPayment: '2024-11-03',
    status: 'active',
  },
  {
    id: 6,
    name: 'Sarah Mukamana',
    email: 'sarah.mukamana@student.edu',
    phone: '+250 788 678 901',
    studentId: 'STU-2024-006',
    property: 'University Heights',
    unit: 'Block A - Room 103',
    checkIn: '2024-01-10',
    checkOut: '2024-11-30',
    monthlyRent: 150000,
    paymentStatus: 'paid',
    balance: 0,
    lastPayment: '2024-11-01',
    status: 'leaving',
  },
];

const LandlordTenants = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedTenant, setSelectedTenant] = useState<typeof tenants[0] | null>(null);

  const displayName = user?.name || 'Landlord';

  const handleSendMessage = (tenantId: number) => {
    console.log('Sending message to tenant:', tenantId);
    // In real implementation: Open messaging interface or send email
  };

  const handleViewPayments = (tenantId: number) => {
    console.log('Viewing payments for tenant:', tenantId);
    // In real implementation: Navigate to payments page filtered by tenant
  };

  // Filter tenants
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.studentId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'paid' && tenant.paymentStatus === 'paid') ||
      (filterStatus === 'pending' && tenant.paymentStatus === 'pending') ||
      (filterStatus === 'overdue' && tenant.paymentStatus === 'overdue');

    return matchesSearch && matchesFilter;
  });

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === 'active').length;
  const paidTenants = tenants.filter((t) => t.paymentStatus === 'paid').length;
  const overdueTenants = tenants.filter((t) => t.paymentStatus === 'overdue').length;
  const totalOutstanding = tenants.reduce((sum, t) => sum + t.balance, 0);

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
      <div className="flex-1 flex flex-col">
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
                <h1 className="text-xl font-bold text-slate-900">Tenants</h1>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={viewMode === 'table' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className={viewMode === 'table' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  Table
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  Grid
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card padding="md" className="border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Tenants</p>
              <p className="text-3xl font-bold text-slate-900">{totalTenants}</p>
              <p className="text-xs text-slate-500 mt-1">{activeTenants} active</p>
            </Card>

            <Card padding="md" className="border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Paid This Month</p>
              <p className="text-3xl font-bold text-slate-900">{paidTenants}</p>
              <p className="text-xs text-green-600 mt-1">{Math.round((paidTenants / totalTenants) * 100)}% collection rate</p>
            </Card>

            <Card padding="md" className="border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-8 h-8 text-red-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Overdue Payments</p>
              <p className="text-3xl font-bold text-slate-900">{overdueTenants}</p>
              <p className="text-xs text-red-600 mt-1">Requires follow-up</p>
            </Card>

            <Card padding="md" className="border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-orange-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Outstanding Balance</p>
              <p className="text-2xl font-bold text-slate-900">RWF {totalOutstanding.toLocaleString()}</p>
            </Card>
          </div>

          {/* Search and Filter Bar */}
          <Card padding="md" className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, email, property, or student ID..."
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

          {/* Table View */}
          {viewMode === 'table' && (
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
                        Monthly Rent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Payment Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredTenants.map((tenant) => (
                      <tr key={tenant.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {tenant.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{tenant.name}</p>
                              <p className="text-xs text-slate-500">{tenant.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900">{tenant.property}</p>
                          <p className="text-xs text-slate-500">{tenant.unit}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900">
                            RWF {tenant.monthlyRent.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">{getPaymentStatusBadge(tenant.paymentStatus)}</td>
                        <td className="px-6 py-4">
                          <p
                            className={`text-sm font-semibold ${
                              tenant.balance > 0 ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {tenant.balance > 0
                              ? `RWF ${tenant.balance.toLocaleString()}`
                              : 'No Balance'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Eye}
                              onClick={() => setSelectedTenant(tenant)}
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={MessageSquare}
                              onClick={() => handleSendMessage(tenant.id)}
                            >
                              Message
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTenants.map((tenant) => (
                <Card key={tenant.id} padding="md" hover>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                        {tenant.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{tenant.name}</h3>
                        <p className="text-xs text-slate-500">{tenant.studentId}</p>
                      </div>
                    </div>
                    {getPaymentStatusBadge(tenant.paymentStatus)}
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="w-4 h-4 text-slate-400" aria-hidden="true" />
                      <span className="truncate">{tenant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-4 h-4 text-slate-400" aria-hidden="true" />
                      <span>{tenant.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400" aria-hidden="true" />
                      <span className="truncate">{tenant.property}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-4 h-4 text-slate-400" aria-hidden="true" />
                      <span>{tenant.unit}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Monthly Rent</span>
                      <span className="text-sm font-semibold text-slate-900">
                        RWF {tenant.monthlyRent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Balance</span>
                      <span
                        className={`text-sm font-semibold ${
                          tenant.balance > 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {tenant.balance > 0
                          ? `RWF ${tenant.balance.toLocaleString()}`
                          : 'No Balance'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      fullWidth
                      onClick={() => setSelectedTenant(tenant)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={MessageSquare}
                      fullWidth
                      onClick={() => handleSendMessage(tenant.id)}
                    >
                      Message
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredTenants.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No tenants found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </main>
      </div>

      {/* Tenant Details Modal */}
      {selectedTenant && (
        <TenantDetailsModal
          isOpen={!!selectedTenant}
          onClose={() => setSelectedTenant(null)}
          tenant={{
            ...selectedTenant,
            tenantId: selectedTenant.studentId,
            roomType: selectedTenant.unit.includes('Room') ? 'Single Room' : 'Apartment',
            moveInDate: selectedTenant.checkIn,
            leaseEndDate: selectedTenant.checkOut,
            university: 'University of Rwanda',
            studentId: selectedTenant.studentId,
            emergencyContact: {
              name: 'Parent/Guardian',
              relationship: 'Parent',
              phone: '+250 788 XXX XXX',
            },
          }}
          onSendMessage={handleSendMessage}
          onViewPayments={handleViewPayments}
        />
      )}
    </div>
  );
};

export default LandlordTenants;
