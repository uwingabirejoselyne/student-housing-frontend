import { X, User, Mail, Phone, MapPin, Calendar, Building2, DollarSign, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';

interface ProfileSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSummaryModal = ({ isOpen, onClose }: ProfileSummaryModalProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeBookingsCount, setActiveBookingsCount] = useState(0);
  const [paymentsCount, setPaymentsCount] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchStats();
    }
  }, [isOpen, user]);

  const fetchStats = async () => {
    try {
      setIsLoadingStats(true);
      // Fetch bookings and count confirmed ones
      const bookings = await bookingService.getMyBookings();
      const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
      setActiveBookingsCount(activeBookings);

      // Fetch payments and count completed ones
      const payments = await paymentService.getMyPayments();
      const completedPayments = payments.filter(p => p.paymentStatus === 'completed').length;
      setPaymentsCount(completedPayments);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  if (!isOpen) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/');
  };

  const handleViewProfile = () => {
    onClose();
    navigate('/student/profile');
  };

  const handleViewSettings = () => {
    onClose();
    navigate('/student/settings');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal - Positioned at top right like a dropdown */}
      <div className="fixed top-20 right-4 sm:right-8">
        <div className="bg-white rounded-lg shadow-2xl max-w-sm w-screen sm:w-96 overflow-hidden animate-in slide-in-from-top">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{user?.name || 'Student'}</h3>
                  <Badge variant="success" className="bg-white/20 text-white border-white/30 text-xs mt-1">
                    Student
                  </Badge>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-6 space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-slate-900 font-medium truncate">{user?.email || 'Not provided'}</p>
              </div>
            </div>

            {/* Phone */}
            {user?.phone && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-slate-900 font-medium">{user.phone}</p>
                </div>
              </div>
            )}

            {/* University/Location (if available) */}
            {user?.university && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Building2 className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">University</p>
                  <p className="text-slate-900 font-medium">{user.university}</p>
                </div>
              </div>
            )}

            {/* Member Since */}
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500">Member Since</p>
                <p className="text-slate-900 font-medium">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })
                    : 'Recently joined'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-6 pb-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {isLoadingStats ? '...' : activeBookingsCount}
                  </p>
                  <p className="text-xs text-slate-500">Active Bookings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {isLoadingStats ? '...' : paymentsCount}
                  </p>
                  <p className="text-xs text-slate-500">Payments Made</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6 space-y-2">
            <Button
              variant="outline"
              fullWidth
              icon={User}
              onClick={handleViewProfile}
              className="justify-center"
            >
              View Full Profile
            </Button>

            <Button
              variant="outline"
              fullWidth
              icon={LogOut}
              onClick={handleLogout}
              className="justify-center text-red-600 border-red-200 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
            <p className="text-xs text-center text-slate-500">
              StudentStay • Student Account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummaryModal;
