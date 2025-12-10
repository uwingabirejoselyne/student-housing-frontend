import React, { useState, useEffect } from 'react';
import { AlertCircle, Bell, Calendar, CheckCircle, Clock, CreditCard, DollarSign, Download, Edit, FileText, Wrench, Home, Mail, MapPin, Menu, Phone, Plus, Settings, User, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types/booking.types';

// Mock Data
const studentData = {
  name: 'Jean Claude Mugabo',
  studentId: 'STU-2024-001',
  photo: 'JM',
  email: 'jean.mugabo@student.edu',
  phone: '+250 788 123 456',
  status: 'Active',
  room: {
    hostel: 'University Heights',
    block: 'Block A',
    roomNumber: '205',
    roomType: 'Shared (2-bed)',
    capacity: 2,
    roommates: ['Patrick Uwase'],
    checkIn: '2024-01-15',
    checkOut: '2024-12-31',
    rentAmount: 150000,
  },
};

const paymentHistory = [
  { id: 1, date: '2024-10-01', amount: 150000, method: 'Mobile Money', status: 'Paid' },
  { id: 2, date: '2024-09-01', amount: 150000, method: 'Mobile Money', status: 'Paid' },
  { id: 3, date: '2024-08-01', amount: 150000, method: 'Bank Transfer', status: 'Paid' },
  { id: 4, date: '2024-07-01', amount: 150000, method: 'Mobile Money', status: 'Paid' },
];

const maintenanceRequests = [
  { id: 1, issue: 'Light bulb not working', date: '2024-10-20', status: 'In Progress', comment: 'Assigned to technician' },
  { id: 2, issue: 'Broken bed frame', date: '2024-10-12', status: 'Resolved', comment: 'Fixed on Oct 15' },
  { id: 3, issue: 'Door lock issue', date: '2024-10-05', status: 'Resolved', comment: 'Replaced lock' },
];

const announcements = [
  { id: 1, title: 'Power Outage Notification', message: 'Power outage in Block A on Oct 24 from 9AM–3PM', date: '2024-10-22', type: 'warning' },
  { id: 2, title: 'Monthly Cleaning', message: 'Monthly room inspection and cleaning on Oct 26', date: '2024-10-20', type: 'info' },
  { id: 3, title: 'Rent Reminder', message: 'Reminder: Rent due by Oct 30', date: '2024-10-25', type: 'alert' },
];

const upcomingEvents = [
  { id: 1, title: 'Rent Payment Due', date: '2024-10-30', type: 'payment' },
  { id: 2, title: 'Room Inspection', date: '2024-10-26', type: 'inspection' },
  { id: 3, title: 'Maintenance Visit', date: '2024-10-24', type: 'maintenance' },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Calculate booking statistics
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalSpent = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const totalPaid = paymentHistory.reduce((sum, payment) =>
    payment.status === 'Paid' ? sum + payment.amount : sum, 0
  );

  const outstandingBalance = 0;
  const openRequests = maintenanceRequests.filter(r => r.status !== 'Resolved').length;
  const newNotifications = 5;

  const displayName = user?.name || studentData.name;
  const firstName = displayName.split(' ')[0];

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
                    <p className="text-xs text-slate-500">{studentData.studentId}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                    {studentData.photo}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {/* Welcome Banner */}
          <Card padding="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white mb-8 fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back, {firstName}!</h2>
                <p className="text-blue-100 mb-4">Here's your housing overview for today</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" aria-hidden="true" />
                    <span>Room {studentData.room.roomNumber}, {studentData.room.block}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    <span>{studentData.room.hostel}</span>
                  </div>
                  <Badge variant="success" className="bg-green-500 text-white">
                    {studentData.status}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" icon={Edit}>
                  Update Info
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={CreditCard}
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  Make Payment
                </Button>
                <Button
                  size="sm"
                  icon={Wrench}
                  onClick={() => setShowMaintenanceModal(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Maintenance
                </Button>
              </div>
            </div>
          </Card>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card padding="md" className="border-l-4 border-blue-500 slide-up">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Home className="w-6 h-6 text-blue-600" aria-hidden="true" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-slate-900">{isLoading ? '...' : totalBookings}</p>
            </Card>

            <Card padding="md" className="border-l-4 border-green-500 slide-up">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" aria-hidden="true" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1">Active Bookings</p>
              <p className="text-2xl font-bold text-slate-900">{isLoading ? '...' : activeBookings}</p>
            </Card>

            <Card padding="md" className="border-l-4 border-yellow-500 slide-up">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" aria-hidden="true" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1">Pending Bookings</p>
              <p className="text-2xl font-bold text-slate-900">{isLoading ? '...' : pendingBookings}</p>
            </Card>

            <Card padding="md" className="border-l-4 border-purple-500 slide-up">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" aria-hidden="true" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-slate-900">RWF {isLoading ? '...' : totalSpent.toLocaleString()}</p>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Room Details */}
              <Card padding="md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Home className="w-6 h-6 text-blue-600" aria-hidden="true" />
                    Room & Housing Details
                  </h3>
                  <Button variant="ghost" size="sm">
                    View Full Details
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Hostel Name</p>
                      <p className="font-semibold text-slate-900">{studentData.room.hostel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Block / Room</p>
                      <p className="font-semibold text-slate-900">{studentData.room.block} - Room {studentData.room.roomNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Room Type</p>
                      <p className="font-semibold text-slate-900">{studentData.room.roomType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Roommate(s)</p>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" aria-hidden="true" />
                        <p className="font-semibold text-slate-900">{studentData.room.roommates.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Check-in Date</p>
                      <p className="font-semibold text-slate-900">{studentData.room.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Check-out Date</p>
                      <p className="font-semibold text-slate-900">{studentData.room.checkOut}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Monthly Rent</p>
                      <p className="text-2xl font-bold text-blue-600">RWF {studentData.room.rentAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Overview */}
              <Card padding="md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-600" aria-hidden="true" />
                    Payment Overview
                  </h3>
                  <Button variant="ghost" size="sm" icon={Download}>
                    Download Receipt
                  </Button>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6 border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Total Rent Due</p>
                      <p className="text-3xl font-bold text-slate-900">RWF {studentData.room.rentAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Next Due Date</p>
                      <p className="text-2xl font-bold text-orange-600">Oct 30, 2024</p>
                    </div>
                  </div>
                  <Button
                    variant="accent"
                    fullWidth
                    icon={CreditCard}
                    onClick={() => setShowPaymentModal(true)}
                    className="mt-4 bg-green-600 hover:bg-green-700"
                  >
                    Pay Now
                  </Button>
                </div>

                <h4 className="font-semibold text-slate-900 mb-4">Payment History</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Method</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-slate-900">{payment.date}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                            RWF {payment.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{payment.method}</td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={payment.status === 'Paid' ? 'success' : 'error'}
                              icon={payment.status === 'Paid' ? CheckCircle : AlertCircle}
                            >
                              {payment.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Maintenance Requests */}
              <Card padding="md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Wrench className="w-6 h-6 text-orange-600" aria-hidden="true" />
                    Maintenance Requests
                  </h3>
                  <Button
                    size="sm"
                    icon={Plus}
                    onClick={() => setShowMaintenanceModal(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    New Request
                  </Button>
                </div>

                <div className="space-y-3">
                  {maintenanceRequests.map((request) => (
                    <div key={request.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 mb-1">{request.issue}</p>
                          <p className="text-sm text-slate-600 mb-2">{request.comment}</p>
                          <p className="text-xs text-slate-500">Submitted: {request.date}</p>
                        </div>
                        <Badge
                          variant={request.status === 'Resolved' ? 'success' : 'warning'}
                          icon={request.status === 'Resolved' ? CheckCircle : Clock}
                        >
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Profile Summary */}
              <Card padding="md">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  Profile Summary
                </h3>

                <div className="flex flex-col items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md">
                    {studentData.photo}
                  </div>
                  <h4 className="font-bold text-slate-900 text-center">{displayName}</h4>
                  <p className="text-sm text-slate-600">{studentData.studentId}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    <span>{studentData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    <span>{studentData.phone}</span>
                  </div>
                </div>

                <Button variant="secondary" fullWidth icon={Settings} className="mt-4">
                  Edit Profile
                </Button>
              </Card>

              {/* Announcements */}
              <Card padding="md">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  Announcements
                </h3>

                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        announcement.type === 'warning'
                          ? 'bg-yellow-50 border-yellow-500'
                          : announcement.type === 'alert'
                          ? 'bg-red-50 border-red-500'
                          : 'bg-blue-50 border-blue-500'
                      }`}
                    >
                      <p className="font-semibold text-slate-900 text-sm mb-1">{announcement.title}</p>
                      <p className="text-xs text-slate-700 mb-2">{announcement.message}</p>
                      <p className="text-xs text-slate-500">{announcement.date}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Upcoming Events */}
              <Card padding="md">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" aria-hidden="true" />
                  Upcoming Events
                </h3>

                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          event.type === 'payment'
                            ? 'bg-green-100'
                            : event.type === 'inspection'
                            ? 'bg-blue-100'
                            : 'bg-orange-100'
                        }`}
                      >
                        {event.type === 'payment' ? (
                          <DollarSign className="w-5 h-5 text-green-600" aria-hidden="true" />
                        ) : event.type === 'inspection' ? (
                          <FileText className="w-5 h-5 text-blue-600" aria-hidden="true" />
                        ) : (
                          <Wrench className="w-5 h-5 text-orange-600" aria-hidden="true" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-slate-900">{event.title}</p>
                        <p className="text-xs text-slate-600">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 fade-in"
          onClick={() => setShowPaymentModal(false)}
        >
          <Card
            padding="lg"
            className="max-w-md w-full slide-up"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Make Payment</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="payment-amount" className="label">Amount</label>
                <input
                  id="payment-amount"
                  type="text"
                  value={`RWF ${studentData.room.rentAmount.toLocaleString()}`}
                  disabled
                  className="input bg-slate-50"
                />
              </div>
              <div>
                <label htmlFor="payment-method" className="label">Payment Method</label>
                <select id="payment-method" className="input">
                  <option>Mobile Money</option>
                  <option>Bank Transfer</option>
                  <option>Credit/Debit Card</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" fullWidth onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </Button>
                <Button variant="accent" fullWidth className="bg-green-600 hover:bg-green-700">
                  Proceed to Pay
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Maintenance Modal */}
      {showMaintenanceModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 fade-in"
          onClick={() => setShowMaintenanceModal(false)}
        >
          <Card
            padding="lg"
            className="max-w-md w-full slide-up"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">New Maintenance Request</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="issue-type" className="label">Issue Type</label>
                <select id="issue-type" className="input">
                  <option>Electrical</option>
                  <option>Plumbing</option>
                  <option>Furniture</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="issue-description" className="label">Description</label>
                <textarea
                  id="issue-description"
                  rows={4}
                  className="input"
                  placeholder="Describe the issue in detail..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" fullWidth onClick={() => setShowMaintenanceModal(false)}>
                  Cancel
                </Button>
                <Button fullWidth className="bg-orange-600 hover:bg-orange-700 text-white">
                  Submit Request
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
