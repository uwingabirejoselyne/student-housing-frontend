import React, { useState } from 'react';
import { Building2, Users, DollarSign, Wrench, Bell, Menu, Plus, TrendingUp, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/LandlordSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

// Mock Data
const landlordData = {
  name: 'John Doe',
  landlordId: 'LL-2024-001',
  email: 'john.doe@landlord.com',
  phone: '+250 788 999 888',
  totalProperties: 5,
  totalUnits: 45,
  occupiedUnits: 38,
  totalTenants: 38,
  monthlyRevenue: 6750000,
  pendingPayments: 450000,
  openMaintenanceRequests: 7,
  newApplications: 3,
};

const LandlordDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const newNotifications = 8;

  const displayName = user?.name || landlordData.name;
  const firstName = displayName.split(' ')[0];

  const occupancyRate = Math.round((landlordData.occupiedUnits / landlordData.totalUnits) * 100);
  const collectionRate = Math.round(((landlordData.monthlyRevenue - landlordData.pendingPayments) / landlordData.monthlyRevenue) * 100);

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
                  className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="w-6 h-6 text-slate-700" />
                </button>
                <h1 className="text-xl font-bold text-slate-900 hidden sm:block">Dashboard</h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`${newNotifications} new notifications`}
                >
                  <Bell className="w-6 h-6 text-slate-700" aria-hidden="true" />
                  {newNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {newNotifications}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">{displayName}</p>
                    <p className="text-xs text-slate-500">{landlordData.landlordId}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {/* Welcome Banner */}
          <Card padding="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white mb-8 fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back, {firstName}!</h2>
                <p className="text-emerald-100 mb-4">Here's your property management overview</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" aria-hidden="true" />
                    <span>{landlordData.totalProperties} Properties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" aria-hidden="true" />
                    <span>{landlordData.totalUnits} Total Units</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" aria-hidden="true" />
                    <span>{landlordData.totalTenants} Active Tenants</span>
                  </div>
                  <Badge variant="success" className="bg-green-500 text-white">
                    {occupancyRate}% Occupied
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  Add Property
                </Button>
                <Button
                  size="sm"
                  icon={Plus}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  New Announcement
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <Card padding="md" className="border-l-4 border-emerald-500 slide-up">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Monthly Revenue</p>
              <p className="text-2xl font-bold text-slate-900">RWF {landlordData.monthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-emerald-600 mt-1">+12% from last month</p>
            </Card>

            {/* Pending Payments */}
            <Card padding="md" className="border-l-4 border-orange-500 slide-up">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-orange-600" aria-hidden="true" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1">Pending Payments</p>
              <p className="text-2xl font-bold text-slate-900">RWF {landlordData.pendingPayments.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">{collectionRate}% collection rate</p>
            </Card>

            {/* Occupancy Rate */}
            <Card padding="md" className="border-l-4 border-blue-500 slide-up">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" aria-hidden="true" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1">Occupancy Rate</p>
              <p className="text-2xl font-bold text-slate-900">{occupancyRate}%</p>
              <p className="text-xs text-slate-500 mt-1">{landlordData.occupiedUnits} / {landlordData.totalUnits} units occupied</p>
            </Card>

            {/* Maintenance Requests */}
            <Card padding="md" className="border-l-4 border-red-500 slide-up">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Wrench className="w-6 h-6 text-red-600" aria-hidden="true" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1">Maintenance Requests</p>
              <p className="text-2xl font-bold text-slate-900">{landlordData.openMaintenanceRequests}</p>
              <p className="text-xs text-red-600 mt-1">Requires attention</p>
            </Card>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card padding="md" className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Properties</p>
                  <p className="text-3xl font-bold text-slate-900">{landlordData.totalProperties}</p>
                </div>
                <Building2 className="w-12 h-12 text-blue-600 opacity-50" aria-hidden="true" />
              </div>
            </Card>

            <Card padding="md" className="bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Active Tenants</p>
                  <p className="text-3xl font-bold text-slate-900">{landlordData.totalTenants}</p>
                </div>
                <Users className="w-12 h-12 text-emerald-600 opacity-50" aria-hidden="true" />
              </div>
            </Card>

            <Card padding="md" className="bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">New Applications</p>
                  <p className="text-3xl font-bold text-slate-900">{landlordData.newApplications}</p>
                </div>
                <Badge variant="warning" className="text-lg px-4 py-2">
                  Review
                </Badge>
              </div>
            </Card>
          </div>

          {/* Placeholder for future sections */}
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg mb-4">More features coming in next steps...</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="info">Properties List</Badge>
              <Badge variant="info">Tenants Management</Badge>
              <Badge variant="info">Payment Tracking</Badge>
              <Badge variant="info">Maintenance Queue</Badge>
              <Badge variant="info">Analytics</Badge>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandlordDashboard;
