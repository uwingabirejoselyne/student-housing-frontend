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

  // Filter bookings by status
  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  // Calculate stats
  const stats = {
    total: bookings.length,
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

            <Card padding="md" className="border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Cancelled</p>
              <p className="text-2xl font-bold text-slate-900">{stats.cancelled}</p>
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
                <button
                  onClick={() => setFilterStatus('cancelled')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'cancelled'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Cancelled
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
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status);
                const duration = calculateDuration(booking.checkInDate, booking.checkOutDate);

                return (
                  <Card key={booking._id || booking.id} padding="md" hover>
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Property Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                              {booking.propertyName}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {booking.propertyAddress}, {booking.propertyCity}
                              </span>
                            </div>
                          </div>
                          <Badge variant={getStatusColor(booking.status)} className="capitalize">
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Check-in</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {formatDate(booking.checkInDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Check-out</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {formatDate(booking.checkOutDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Duration</p>
                            <p className="text-sm font-semibold text-slate-900">{duration} days</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Guests</p>
                            <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {booking.numberOfGuests}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-lg font-bold text-green-600">
                              RWF {booking.totalAmount?.toLocaleString() || 'N/A'}
                            </span>
                          </div>
                          <Badge variant={booking.paymentStatus === 'paid' ? 'success' : 'warning'}>
                            Payment: {booking.paymentStatus || 'Unpaid'}
                          </Badge>
                        </div>

                        {booking.specialRequests && (
                          <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                            <span className="font-medium">Special Requests: </span>
                            {booking.specialRequests}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2 lg:w-32">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Eye}
                          fullWidth
                          onClick={() => handleViewDetails(booking)}
                        >
                          Details
                        </Button>
                        {booking.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={XCircle}
                            fullWidth
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleCancelBooking(booking._id || booking.id!)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
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
