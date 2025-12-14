import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Menu,
  Filter,
  Eye,
  X,
  Phone,
  Mail,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types/booking.types';

const Bookings = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      alert('Booking cancelled successfully');
      await fetchBookings(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to cancel booking:', error);
      const errorMessage = error.response?.data?.message || 'Failed to cancel booking';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  // Filter bookings by status - exclude cancelled bookings unless specifically filtered
  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === 'all') {
      // Exclude cancelled bookings from 'all' view
      return booking.status !== 'cancelled';
    }
    return booking.status === filterStatus;
  });

  // Calculate stats - exclude cancelled from total count
  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const stats = {
    total: activeBookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'cancelled':
        return XCircle;
      case 'completed':
        return CheckCircle;
      default:
        return AlertCircle;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateDuration = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

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
                <h1 className="text-xl font-bold text-slate-900">My Bookings</h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">{user?.name || 'Student'}</p>
                  <p className="text-xs text-slate-500">Student Portal</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                  {(user?.name || 'S').charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card padding="md" className="border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </Card>

            <Card padding="md" className="border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-slate-900">{stats.confirmed}</p>
            </Card>

            <Card padding="md" className="border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
            </Card>
          </div>

          {/* Filter Bar */}
          <Card padding="md" className="mb-6">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-slate-600" />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('confirmed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'confirmed'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Confirmed
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'pending'
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>
          </Card>

          {/* Bookings List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <Card padding="lg" className="text-center">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No bookings found</h3>
              <p className="text-slate-600 mb-4">
                {filterStatus === 'all'
                  ? "You haven't made any bookings yet. Browse properties to get started!"
                  : `No ${filterStatus} bookings found.`}
              </p>
              <Button
                onClick={() => (window.location.href = '/browse')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Properties
              </Button>
            </Card>
          ) : (
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Guests
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredBookings.map((booking) => {
                      const StatusIcon = getStatusIcon(booking.status);
                      const duration = calculateDuration(booking.checkInDate, booking.checkOutDate);

                      return (
                        <tr key={booking._id || booking.id} className="hover:bg-slate-50 transition-colors">
                          {/* Property */}
                          <td className="px-4 py-4">
                            <div className="flex items-start gap-2">
                              <Building2 className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate">
                                  {booking.propertyName}
                                </p>
                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {booking.propertyCity}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Dates */}
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-slate-900">
                                  {formatDate(booking.checkInDate)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-red-600" />
                                <span className="font-medium text-slate-900">
                                  {formatDate(booking.checkOutDate)}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Duration */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-semibold text-slate-900">
                                {duration} days
                              </span>
                            </div>
                          </td>

                          {/* Guests */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-slate-400" />
                              <span className="text-sm font-medium text-slate-900">
                                {booking.numberOfGuests}
                              </span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-4 py-4">
                            <div>
                              <div className="flex items-center gap-1 text-green-600 font-bold">
                                <DollarSign className="w-4 h-4" />
                                <span>{booking.totalAmount?.toLocaleString() || 'N/A'}</span>
                              </div>
                              <Badge
                                variant={booking.paymentStatus === 'paid' ? 'success' : 'warning'}
                                className="text-xs mt-1"
                              >
                                {booking.paymentStatus || 'Unpaid'}
                              </Badge>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <Badge variant={getStatusColor(booking.status)} className="capitalize">
                              <StatusIcon className="w-4 h-4 mr-1" />
                              {booking.status}
                            </Badge>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewDetails(booking)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {booking.status === 'pending' && (
                                <button
                                  onClick={() => handleCancelBooking(booking._id || booking.id!)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Cancel Booking"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </main>
      </div>

      {/* Booking Details Modal */}
      {isDetailModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card padding="none" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Property Info */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Property Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">{selectedBooking.propertyName}</p>
                      <p className="text-sm text-slate-600">
                        {selectedBooking.propertyAddress}, {selectedBooking.propertyCity}
                      </p>
                    </div>
                  </div>
                  {selectedBooking.roomType && (
                    <p className="text-sm text-slate-600">Room Type: {selectedBooking.roomType}</p>
                  )}
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Check-in Date</p>
                    <p className="font-medium text-slate-900">
                      {formatDate(selectedBooking.checkInDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Check-out Date</p>
                    <p className="font-medium text-slate-900">
                      {formatDate(selectedBooking.checkOutDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Duration</p>
                    <p className="font-medium text-slate-900">
                      {calculateDuration(selectedBooking.checkInDate, selectedBooking.checkOutDate)}{' '}
                      days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Number of Guests</p>
                    <p className="font-medium text-slate-900">{selectedBooking.numberOfGuests}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Booking Date</p>
                    <p className="font-medium text-slate-900">
                      {formatDate(selectedBooking.bookingDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Status</p>
                    <Badge variant={getStatusColor(selectedBooking.status)} className="capitalize">
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-green-600">
                      RWF {selectedBooking.totalAmount?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Payment Status</p>
                    <Badge
                      variant={selectedBooking.paymentStatus === 'paid' ? 'success' : 'warning'}
                      className="capitalize"
                    >
                      {selectedBooking.paymentStatus || 'Unpaid'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Landlord Contact */}
              {selectedBooking.landlordName && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Landlord Contact</h3>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-900">{selectedBooking.landlordName}</p>
                    {selectedBooking.landlordContact && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4" />
                        <span>{selectedBooking.landlordContact}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Special Requests</h3>
                  <p className="text-slate-600">{selectedBooking.specialRequests}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Close
                </Button>
                {selectedBooking.status === 'pending' && (
                  <Button
                    variant="primary"
                    fullWidth
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleCancelBooking(selectedBooking._id || selectedBooking.id!);
                    }}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Bookings;
