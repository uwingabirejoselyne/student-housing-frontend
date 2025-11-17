import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, GraduationCap, DollarSign, Home, FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface TenantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: {
    id: number;
    name: string;
    tenantId: string;
    email: string;
    phone: string;
    property: string;
    unit: string;
    roomType: string;
    moveInDate: string;
    leaseEndDate: string;
    monthlyRent: number;
    paymentStatus: string;
    university?: string;
    studentId?: string;
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  onSendMessage?: (tenantId: number) => void;
  onViewPayments?: (tenantId: number) => void;
}

const paymentRecords = [
  { month: 'November 2024', amount: 150000, status: 'paid', paidDate: '2024-11-01' },
  { month: 'October 2024', amount: 150000, status: 'paid', paidDate: '2024-10-02' },
  { month: 'September 2024', amount: 150000, status: 'paid', paidDate: '2024-09-01' },
  { month: 'August 2024', amount: 150000, status: 'paid', paidDate: '2024-08-03' },
];

const maintenanceRequests = [
  { id: 1, issue: 'Leaking faucet', date: '2024-11-05', status: 'completed', priority: 'medium' },
  { id: 2, issue: 'AC not cooling properly', date: '2024-10-22', status: 'completed', priority: 'high' },
  { id: 3, issue: 'Door lock squeaking', date: '2024-09-15', status: 'completed', priority: 'low' },
];

const TenantDetailsModal: React.FC<TenantDetailsModalProps> = ({
  isOpen,
  onClose,
  tenant,
  onSendMessage,
  onViewPayments,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'maintenance'>('overview');

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" icon={CheckCircle}>Paid</Badge>;
      case 'pending':
        return <Badge variant="warning" icon={Clock}>Pending</Badge>;
      case 'overdue':
        return <Badge variant="error" icon={AlertTriangle}>Overdue</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-slate-600';
      default:
        return 'text-slate-600';
    }
  };

  const calculateDaysUntilLeaseEnd = () => {
    const today = new Date();
    const leaseEnd = new Date(tenant.leaseEndDate);
    const diffTime = leaseEnd.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysUntilLeaseEnd();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 fade-in overflow-y-auto"
      onClick={onClose}
    >
      <Card
        padding="none"
        className="max-w-4xl w-full my-8 slide-up max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {tenant.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{tenant.name}</h2>
              <p className="text-sm text-slate-600 font-mono">{tenant.tenantId}</p>
              <div className="mt-1">{getPaymentStatusBadge(tenant.paymentStatus)}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-slate-600" aria-hidden="true" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-slate-50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                activeTab === 'payments'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                activeTab === 'maintenance'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Maintenance
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card padding="md" className="bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-slate-600 mb-0.5">Email</p>
                        <p className="font-medium text-slate-900">{tenant.email}</p>
                      </div>
                    </div>
                  </Card>
                  <Card padding="md" className="bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-slate-600 mb-0.5">Phone</p>
                        <p className="font-medium text-slate-900">{tenant.phone}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Property Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  Property Information
                </h3>
                <Card padding="md" className="bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Property</p>
                      <p className="font-semibold text-slate-900">{tenant.property}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Unit</p>
                      <p className="font-semibold text-slate-900">{tenant.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Room Type</p>
                      <p className="font-semibold text-slate-900">{tenant.roomType}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Lease Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  Lease Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card padding="md" className="bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-slate-600 mb-0.5">Move-In Date</p>
                        <p className="font-semibold text-slate-900">{tenant.moveInDate}</p>
                      </div>
                    </div>
                  </Card>
                  <Card padding="md" className={daysRemaining < 30 ? 'bg-orange-50 border-orange-200' : 'bg-slate-50'}>
                    <div className="flex items-center gap-3">
                      <Calendar className={`w-5 h-5 ${daysRemaining < 30 ? 'text-orange-600' : 'text-emerald-600'}`} aria-hidden="true" />
                      <div>
                        <p className="text-xs text-slate-600 mb-0.5">Lease End Date</p>
                        <p className="font-semibold text-slate-900">{tenant.leaseEndDate}</p>
                        {daysRemaining < 60 && (
                          <p className={`text-xs mt-1 ${daysRemaining < 30 ? 'text-orange-600 font-medium' : 'text-slate-500'}`}>
                            {daysRemaining} days remaining
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                  <Card padding="md" className="bg-emerald-50 border-emerald-200 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                        <div>
                          <p className="text-xs text-emerald-700 mb-0.5">Monthly Rent</p>
                          <p className="text-2xl font-bold text-emerald-900">RWF {tenant.monthlyRent.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-emerald-700 mb-0.5">Payment Status</p>
                        {getPaymentStatusBadge(tenant.paymentStatus)}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Student Information */}
              {tenant.university && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                    Student Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card padding="md" className="bg-slate-50">
                      <p className="text-xs text-slate-600 mb-1">University</p>
                      <p className="font-semibold text-slate-900">{tenant.university}</p>
                    </Card>
                    {tenant.studentId && (
                      <Card padding="md" className="bg-slate-50">
                        <p className="text-xs text-slate-600 mb-1">Student ID</p>
                        <p className="font-semibold text-slate-900 font-mono">{tenant.studentId}</p>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              {tenant.emergencyContact && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" aria-hidden="true" />
                    Emergency Contact
                  </h3>
                  <Card padding="md" className="bg-orange-50 border-orange-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-orange-700 mb-1">Name</p>
                        <p className="font-semibold text-slate-900">{tenant.emergencyContact.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-orange-700 mb-1">Relationship</p>
                        <p className="font-semibold text-slate-900">{tenant.emergencyContact.relationship}</p>
                      </div>
                      <div>
                        <p className="text-xs text-orange-700 mb-1">Phone</p>
                        <p className="font-semibold text-slate-900">{tenant.emergencyContact.phone}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Payment History</h3>
                {onViewPayments && (
                  <Button variant="ghost" size="sm" onClick={() => onViewPayments(tenant.id)}>
                    View All Payments
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {paymentRecords.map((record, index) => (
                  <Card key={index} padding="md" hover className="transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${record.status === 'paid' ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                          {record.status === 'paid' ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                          ) : (
                            <Clock className="w-5 h-5 text-orange-600" aria-hidden="true" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{record.month}</p>
                          {record.paidDate && (
                            <p className="text-xs text-slate-500 mt-0.5">Paid on {record.paidDate}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">RWF {record.amount.toLocaleString()}</p>
                        {getPaymentStatusBadge(record.status)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Payment Summary */}
              <Card padding="md" className="bg-emerald-50 border-emerald-200 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-700 mb-1">Total Paid (Last 4 Months)</p>
                    <p className="text-2xl font-bold text-emerald-900">
                      RWF {paymentRecords.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-emerald-700 mb-1">Payment Rate</p>
                    <p className="text-2xl font-bold text-emerald-900">100%</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Maintenance Request History</h3>
                <p className="text-sm text-slate-600">{maintenanceRequests.length} total requests</p>
              </div>

              {maintenanceRequests.length > 0 ? (
                <div className="space-y-3">
                  {maintenanceRequests.map((request) => (
                    <Card key={request.id} padding="md" hover className="transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${getMaintenanceStatusColor(request.status)}`}>
                              <FileText className="w-4 h-4" aria-hidden="true" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">{request.issue}</p>
                              <p className="text-xs text-slate-500 mt-1">Submitted on {request.date}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getMaintenanceStatusColor(request.status)}`}>
                            {request.status}
                          </div>
                          <div className={`text-xs font-medium capitalize ${getPriorityColor(request.priority)}`}>
                            {request.priority} priority
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Maintenance Requests</h3>
                  <p className="text-slate-600">This tenant hasn't submitted any maintenance requests</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Close
          </Button>
          {onSendMessage && (
            <Button
              icon={Mail}
              fullWidth
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => onSendMessage(tenant.id)}
            >
              Send Message
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TenantDetailsModal;
