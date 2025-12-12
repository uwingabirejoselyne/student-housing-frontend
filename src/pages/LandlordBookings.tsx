import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Menu, CheckCircle, XCircle, Clock, Eye, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LandlordSidebar from '../components/layout/LandlordSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';

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

const LandlordBookings = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/bookings/landlord/bookings');
      setBookings(data.data || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      alert('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to confirm this booking?')) {
      return;
    }

    setConfirmingId(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/confirm`);
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
      await api.patch(`/bookings/${bookingId}/reject`);
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

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'neutral';
      default: return 'neutral';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                  className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Menu className="w-6 h-6 text-slate-700" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">Bookings</h1>
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
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </Card>

            <Card padding="md" className="border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
            </Card>

            <Card padding="md" className="border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Confirmed</p>
              <p className="text-3xl font-bold text-slate-900">{stats.confirmed}</p>
            </Card>

            <Card padding="md" className="border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Cancelled</p>
              <p className="text-3xl font-bold text-slate-900">{stats.cancelled}</p>
            </Card>
          </div>

          {/* Filter Bar */}
          <Card padding="md" className="mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <select
                className="input flex-1"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Bookings</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </Card>

          {/* Bookings Table */}
          <Card padding="none" className="overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-slate-600">Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No bookings found</h3>
                <p className="text-slate-600">
                  {filterStatus === 'all'
                    ? 'You have no bookings yet'
                    : `No ${filterStatus} bookings at this time`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Check-in/Out
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Guests
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                        {/* Student */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-semibold text-slate-900">{booking.studentId.name}</div>
                            <div className="text-sm text-slate-500">{booking.studentId.email}</div>
                            <div className="text-sm text-slate-500">{booking.studentId.phone}</div>
                          </div>
                        </td>

                        {/* Property */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-semibold text-slate-900">{booking.propertyId.name}</div>
                            <div className="text-sm text-slate-500">{booking.propertyId.address}</div>
                            <div className="text-sm text-slate-500">{booking.propertyId.city}</div>
                          </div>
                        </td>

                        {/* Dates */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-medium text-slate-900">{formatDate(booking.checkInDate)}</div>
                            <div className="text-slate-500">to</div>
                            <div className="font-medium text-slate-900">{formatDate(booking.checkOutDate)}</div>
                          </div>
                        </td>

                        {/* Guests */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium">{booking.numberOfGuests}</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-slate-900">
                            {booking.totalAmount.toLocaleString()} RWF
                          </div>
                          <div className="text-xs text-slate-500 capitalize">{booking.paymentStatus}</div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusColor(booking.status)} className="capitalize">
                            {booking.status}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleConfirmBooking(booking._id)}
                                  disabled={confirmingId === booking._id}
                                  className={`p-2 rounded-lg transition-colors ${
                                    confirmingId === booking._id
                                      ? 'text-green-400 bg-green-50 cursor-not-allowed'
                                      : 'text-green-600 hover:bg-green-50'
                                  }`}
                                  title="Confirm Booking"
                                >
                                  <CheckCircle className={`w-4 h-4 ${confirmingId === booking._id ? 'animate-pulse' : ''}`} />
                                </button>
                                <button
                                  onClick={() => handleRejectBooking(booking._id)}
                                  disabled={rejectingId === booking._id}
                                  className={`p-2 rounded-lg transition-colors ${
                                    rejectingId === booking._id
                                      ? 'text-red-400 bg-red-50 cursor-not-allowed'
                                      : 'text-red-600 hover:bg-red-50'
                                  }`}
                                  title="Reject Booking"
                                >
                                  <XCircle className={`w-4 h-4 ${rejectingId === booking._id ? 'animate-pulse' : ''}`} />
                                </button>
                              </>
                            )}
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

export default LandlordBookings;
