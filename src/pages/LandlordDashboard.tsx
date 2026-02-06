/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Building2, Users, DollarSign, Wrench, Menu, Plus, TrendingUp, Home, Calendar, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/LandlordSidebar';
import NotificationDropdown from '../components/layout/NotificationDropdown';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import AddPropertyModal from '../components/modals/AddPropertyModal';
import type { PropertyFormData } from '../components/modals/AddPropertyModal';
import AddAnnouncementModal from '../components/modals/AddAnnouncementModal';
import { propertyService } from '../services/propertyService';
import type { Property } from '../types/property.types';
import { bookingService } from '../services/bookingService';
import { useNavigate } from 'react-router-dom';

interface Booking {
  _id: string;
  studentId: { _id: string; name: string; email: string; phone: string };
  propertyId: { _id: string; name: string; address: string; city: string };
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  specialRequests?: string;
  createdAt: string;
}

const LandlordDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isAddAnnouncementModalOpen, setIsAddAnnouncementModalOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // Fetch properties and bookings on mount
  useEffect(() => {
    fetchProperties();
    fetchBookings();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const data = await propertyService.getLandlordProperties();
      setProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getLandlordBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to confirm this booking?')) {
      return;
    }

    setConfirmingId(bookingId);
    try {
      await bookingService.confirmBooking(bookingId);
      alert('✓ Booking confirmed successfully!');
      await fetchBookings();
    } catch (error: any) {
      console.error('Failed to confirm booking:', error);
      const errorMessage = error.response?.data?.message || 'Failed to confirm booking';
      alert(`✗ Error: ${errorMessage}`);
    } finally {
      setConfirmingId(null);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to reject this booking? This action cannot be undone.')) {
      return;
    }

    setRejectingId(bookingId);
    try {
      await bookingService.rejectBooking(bookingId);
      alert('✓ Booking rejected successfully');
      await fetchBookings();
    } catch (error: any) {
      console.error('Failed to reject booking:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reject booking';
      alert(`✗ Error: ${errorMessage}`);
    } finally {
      setRejectingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const displayName = user?.name || 'Landlord';
  const firstName = displayName.split(' ')[0];

  // Calculate stats from real property data
  const totalProperties = properties.length;
  const totalUnits = properties.reduce((sum, p) => sum + (p.totalUnits || 0), 0);
  // For now, we'll use mock data for occupancy and revenue since the API might not have this info
  const occupiedUnits = Math.round(totalUnits * 0.85); // 85% occupancy estimate
  const totalTenants = occupiedUnits;
  const monthlyRevenue = totalUnits * 150000; // Estimate based on average rent
  const pendingPayments = monthlyRevenue * 0.07; // 7% pending estimate
  const openMaintenanceRequests = 7; // Mock data - API endpoint needed
  const newApplications = 3; // Mock data - API endpoint needed

  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const collectionRate = monthlyRevenue > 0 ? Math.round(((monthlyRevenue - pendingPayments) / monthlyRevenue) * 100) : 0;

  const handleAddProperty = async (propertyData: PropertyFormData) => {
    try {
      // Clean up data before sending
      const cleanData: any = { ...propertyData };

      // Remove availableFrom if it's empty
      if (!cleanData.availableFrom) {
        delete cleanData.availableFrom;
      }

      console.log('Sending property data:', JSON.stringify(cleanData, null, 2));

      await propertyService.createProperty(cleanData);
      alert('Property added successfully! Students can now see it on the landing page.');
      setIsAddPropertyModalOpen(false);

      // Refresh properties list to show the new property
      await fetchProperties();
    } catch (error: any) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Validation errors:', error.response?.data?.errors);

      const errorMessage = error.response?.data?.message ||
                          (error.response?.data?.errors ? error.response.data.errors.join(', ') : '') ||
                          'Failed to create property. Please try again.';
      alert(`Error: ${errorMessage}`);

      // Also log to console for debugging
      if (error.response?.data?.errors) {
        console.log('Detailed errors:', error.response.data.errors);
      }
    }
  };

  const handleAddAnnouncement = (announcementData: any) => {
    console.log('New Announcement Data:', announcementData);
    // TODO: Integrate with backend API to save announcement
    alert('Announcement created successfully! (Integration with backend pending)');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
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
                {/* Notification Dropdown */}
                <NotificationDropdown />

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">{displayName}</p>
                    <p className="text-xs text-slate-500">Landlord</p>
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
                    <span>{totalProperties} Properties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" aria-hidden="true" />
                    <span>{totalUnits} Total Units</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" aria-hidden="true" />
                    <span>{totalTenants} Active Tenants</span>
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
                  onClick={() => setIsAddPropertyModalOpen(true)}
                >
                  Add Property
                </Button>
                <Button
                  size="sm"
                  icon={Plus}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                  onClick={() => setIsAddAnnouncementModalOpen(true)}
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
              <p className="text-2xl font-bold text-slate-900">RWF {monthlyRevenue.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-slate-900">RWF {pendingPayments.toLocaleString()}</p>
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
              <p className="text-xs text-slate-500 mt-1">{occupiedUnits} / {totalUnits} units occupied</p>
            </Card>

            {/* Maintenance Requests */}
            <Card padding="md" className="border-l-4 border-red-500 slide-up">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Wrench className="w-6 h-6 text-red-600" aria-hidden="true" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1">Maintenance Requests</p>
              <p className="text-2xl font-bold text-slate-900">{openMaintenanceRequests}</p>
              <p className="text-xs text-red-600 mt-1">Requires attention</p>
            </Card>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card padding="md" className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Properties</p>
                  <p className="text-3xl font-bold text-slate-900">{totalProperties}</p>
                </div>
                <Building2 className="w-12 h-12 text-blue-600 opacity-50" aria-hidden="true" />
              </div>
            </Card>

            <Card padding="md" className="bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Active Tenants</p>
                  <p className="text-3xl font-bold text-slate-900">{totalTenants}</p>
                </div>
                <Users className="w-12 h-12 text-emerald-600 opacity-50" aria-hidden="true" />
              </div>
            </Card>

            <Card padding="md" className="bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">New Applications</p>
                  <p className="text-3xl font-bold text-slate-900">{newApplications}</p>
                </div>
                <Badge variant="warning" className="text-lg px-4 py-2">
                  Review
                </Badge>
              </div>
            </Card>
          </div>

          {/* Pending Bookings Section */}
          <Card padding="lg" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">Pending Bookings</h2>
                <Badge variant="warning">
                  {bookings.filter(b => b.status === 'pending').length}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/landlord/bookings')}
              >
                View All
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-slate-600">Loading bookings...</p>
              </div>
            ) : bookings.filter(b => b.status === 'pending').length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No pending bookings at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings
                  .filter(b => b.status === 'pending')
                  .slice(0, 5)
                  .map((booking) => (
                    <Card key={booking._id} padding="md" className="border-l-4 border-yellow-500">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Booking Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-slate-900">
                                  {booking.propertyId.name}
                                </h3>
                                <Badge variant="warning" className="text-xs">Pending</Badge>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                                <div>
                                  <span className="font-medium">Student:</span> {booking.studentId.name}
                                </div>
                                <div>
                                  <span className="font-medium">Contact:</span> {booking.studentId.phone}
                                </div>
                                <div>
                                  <span className="font-medium">Check-in:</span> {formatDate(booking.checkInDate)}
                                </div>
                                <div>
                                  <span className="font-medium">Check-out:</span> {formatDate(booking.checkOutDate)}
                                </div>
                                <div>
                                  <span className="font-medium">Guests:</span> {booking.numberOfGuests}
                                </div>
                                <div>
                                  <span className="font-medium">Amount:</span>{' '}
                                  <span className="font-semibold text-slate-900">
                                    {booking.totalAmount.toLocaleString()} RWF
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 md:flex-col lg:flex-row">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={CheckCircle}
                            onClick={() => handleConfirmBooking(booking._id)}
                            disabled={confirmingId === booking._id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {confirmingId === booking._id ? 'Confirming...' : 'Accept'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={XCircle}
                            onClick={() => handleRejectBooking(booking._id)}
                            disabled={rejectingId === booking._id}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            {rejectingId === booking._id ? 'Rejecting...' : 'Reject'}
                          </Button>
                          <button
                            onClick={() => navigate('/landlord/bookings')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </Card>
        </main>
      </div>

      {/* Modals */}
      <AddPropertyModal
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
        onSubmit={handleAddProperty}
      />

      <AddAnnouncementModal
        isOpen={isAddAnnouncementModalOpen}
        onClose={() => setIsAddAnnouncementModalOpen(false)}
        onSubmit={handleAddAnnouncement}
      />
    </div>
  );
};

export default LandlordDashboard;
