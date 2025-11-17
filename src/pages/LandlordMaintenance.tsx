import React, { useState } from 'react';
import { Wrench, Menu, Search, Clock, CheckCircle, AlertCircle, XCircle, User, MapPin, Calendar, Filter, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LandlordSidebar from '../components/layout/LandlordSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

// Mock Data
const maintenanceRequests = [
  {
    id: 1,
    tenantName: 'Jean Claude Mugabo',
    tenantId: 'STU-2024-001',
    property: 'University Heights',
    unit: 'Block A - Room 205',
    issue: 'Broken window latch',
    category: 'Structural',
    priority: 'medium',
    status: 'in-progress',
    description: 'The window latch in my room is broken and the window won\'t stay closed properly. This is a security concern.',
    submittedDate: '2024-11-15',
    assignedTo: 'John Technician',
    estimatedCost: 25000,
    images: [],
  },
  {
    id: 2,
    tenantName: 'Marie Uwase',
    tenantId: 'STU-2024-002',
    property: 'Campus View Apartments',
    unit: 'Apt 301',
    issue: 'Leaking faucet in bathroom',
    category: 'Plumbing',
    priority: 'high',
    status: 'pending',
    description: 'The bathroom sink faucet has been leaking continuously for the past two days. Water is being wasted.',
    submittedDate: '2024-11-18',
    assignedTo: null,
    estimatedCost: null,
    images: [],
  },
  {
    id: 3,
    tenantName: 'Patrick Nkusi',
    tenantId: 'STU-2024-003',
    property: 'Student Residence Hall',
    unit: 'Block B - Room 105',
    issue: 'Air conditioning not working',
    category: 'HVAC',
    priority: 'high',
    status: 'pending',
    description: 'The AC unit stopped working yesterday. Room is getting very hot.',
    submittedDate: '2024-11-17',
    assignedTo: null,
    estimatedCost: null,
    images: [],
  },
  {
    id: 4,
    tenantName: 'Grace Ishimwe',
    tenantId: 'STU-2024-004',
    property: 'Downtown Student Suites',
    unit: 'Apt 202',
    issue: 'Light bulb replacement needed',
    category: 'Electrical',
    priority: 'low',
    status: 'completed',
    description: 'Main ceiling light bulb is burnt out and needs replacement.',
    submittedDate: '2024-11-10',
    assignedTo: 'Mike Electrician',
    estimatedCost: 5000,
    completedDate: '2024-11-12',
    images: [],
  },
  {
    id: 5,
    tenantName: 'David Habimana',
    tenantId: 'STU-2024-005',
    property: 'Riverside Hostel',
    unit: 'Block C - Room 310',
    issue: 'Door lock malfunction',
    category: 'Security',
    priority: 'high',
    status: 'in-progress',
    description: 'Room door lock is jammed and difficult to open/close. Need urgent repair for security.',
    submittedDate: '2024-11-16',
    assignedTo: 'Paul Locksmith',
    estimatedCost: 35000,
    images: [],
  },
  {
    id: 6,
    tenantName: 'Sarah Mukamana',
    tenantId: 'STU-2024-006',
    property: 'University Heights',
    unit: 'Block A - Room 103',
    issue: 'Shower drain clogged',
    category: 'Plumbing',
    priority: 'medium',
    status: 'completed',
    description: 'Shower drain is completely blocked and water is not draining.',
    submittedDate: '2024-11-08',
    assignedTo: 'John Technician',
    estimatedCost: 15000,
    completedDate: '2024-11-09',
    images: [],
  },
  {
    id: 7,
    tenantName: 'Emmanuel Gasana',
    tenantId: 'STU-2024-007',
    property: 'Campus View Apartments',
    unit: 'Apt 105',
    issue: 'Refrigerator making loud noise',
    category: 'Appliances',
    priority: 'medium',
    status: 'pending',
    description: 'The refrigerator has been making an unusual loud buzzing noise. Still working but concerning.',
    submittedDate: '2024-11-18',
    assignedTo: null,
    estimatedCost: null,
    images: [],
  },
];

const LandlordMaintenance = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<typeof maintenanceRequests[0] | null>(null);

  const displayName = user?.name || 'Landlord';

  // Filter requests
  const filteredRequests = maintenanceRequests.filter((request) => {
    const matchesSearch =
      request.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate stats
  const totalRequests = maintenanceRequests.length;
  const pendingRequests = maintenanceRequests.filter(r => r.status === 'pending').length;
  const inProgressRequests = maintenanceRequests.filter(r => r.status === 'in-progress').length;
  const completedRequests = maintenanceRequests.filter(r => r.status === 'completed').length;
  const highPriorityRequests = maintenanceRequests.filter(r => r.priority === 'high' && r.status !== 'completed').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning" icon={Clock}>Pending</Badge>;
      case 'in-progress':
        return <Badge variant="info" icon={Wrench}>In Progress</Badge>;
      case 'completed':
        return <Badge variant="success" icon={CheckCircle}>Completed</Badge>;
      case 'cancelled':
        return <Badge variant="error" icon={XCircle}>Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="error">High Priority</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="neutral">Low</Badge>;
      default:
        return <Badge variant="neutral">{priority}</Badge>;
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
                <h1 className="text-xl font-bold text-slate-900">Maintenance Requests</h1>
              </div>

              <Badge variant="error" className="text-sm">
                {highPriorityRequests} High Priority
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card padding="md" className="border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <Wrench className="w-8 h-8 text-blue-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Requests</p>
              <p className="text-3xl font-bold text-slate-900">{totalRequests}</p>
            </Card>

            <Card padding="md" className="border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-orange-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-slate-900">{pendingRequests}</p>
              <p className="text-xs text-orange-600 mt-1">Awaiting assignment</p>
            </Card>

            <Card padding="md" className="border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <Wrench className="w-8 h-8 text-purple-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-slate-900">{inProgressRequests}</p>
              <p className="text-xs text-slate-500 mt-1">Being worked on</p>
            </Card>

            <Card padding="md" className="border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-slate-900">{completedRequests}</p>
              <p className="text-xs text-green-600 mt-1">This month</p>
            </Card>
          </div>

          {/* Search and Filter Bar */}
          <Card padding="md" className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by tenant, property, issue, or category..."
                  icon={Search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="sm:w-40">
                <select
                  className="input"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="sm:w-40">
                <select
                  className="input"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} padding="md" hover onClick={() => setSelectedRequest(request)}>
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Left Section - Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">{request.issue}</h3>
                          {getPriorityBadge(request.priority)}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" aria-hidden="true" />
                            <span>{request.tenantName}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" aria-hidden="true" />
                            <span>{request.property} - {request.unit}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" aria-hidden="true" />
                            <span>{request.submittedDate}</span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    <p className="text-sm text-slate-700 mb-3 line-clamp-2">{request.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <Badge variant="neutral" className="text-xs">
                        {request.category}
                      </Badge>
                      {request.assignedTo && (
                        <span className="text-slate-600">
                          Assigned to: <span className="font-medium text-slate-900">{request.assignedTo}</span>
                        </span>
                      )}
                      {request.estimatedCost && (
                        <span className="text-slate-600">
                          Est. Cost: <span className="font-medium text-emerald-600">RWF {request.estimatedCost.toLocaleString()}</span>
                        </span>
                      )}
                      {request.completedDate && (
                        <span className="text-green-600 text-xs">
                          Completed: {request.completedDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Button variant="ghost" size="sm" className="flex-1 lg:flex-none">
                      View Details
                    </Button>
                    {request.status === 'pending' && (
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 lg:flex-none">
                        Assign
                      </Button>
                    )}
                    {request.status === 'in-progress' && (
                      <Button size="sm" variant="accent" className="flex-1 lg:flex-none">
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <Wrench className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No maintenance requests found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </main>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 fade-in"
          onClick={() => setSelectedRequest(null)}
        >
          <Card
            padding="lg"
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto slide-up"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedRequest.issue}</h2>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedRequest.status)}
                  {getPriorityBadge(selectedRequest.priority)}
                  <Badge variant="neutral">{selectedRequest.category}</Badge>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Tenant Information</h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                  <p><span className="text-slate-600">Name:</span> <span className="font-medium">{selectedRequest.tenantName}</span></p>
                  <p><span className="text-slate-600">Student ID:</span> <span className="font-medium">{selectedRequest.tenantId}</span></p>
                  <p><span className="text-slate-600">Location:</span> <span className="font-medium">{selectedRequest.property} - {selectedRequest.unit}</span></p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Issue Description</h3>
                <p className="text-slate-700 bg-slate-50 rounded-lg p-4">{selectedRequest.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Submitted Date</h3>
                  <p className="text-slate-900">{selectedRequest.submittedDate}</p>
                </div>
                {selectedRequest.completedDate && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Completed Date</h3>
                    <p className="text-green-600">{selectedRequest.completedDate}</p>
                  </div>
                )}
              </div>

              {selectedRequest.assignedTo && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Assigned To</h3>
                  <p className="text-slate-900">{selectedRequest.assignedTo}</p>
                </div>
              )}

              {selectedRequest.estimatedCost && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Estimated Cost</h3>
                  <p className="text-2xl font-bold text-emerald-600">RWF {selectedRequest.estimatedCost.toLocaleString()}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button variant="ghost" icon={MessageSquare} fullWidth>
                  Contact Tenant
                </Button>
                {selectedRequest.status === 'pending' && (
                  <Button fullWidth className="bg-emerald-600 hover:bg-emerald-700">
                    Assign Technician
                  </Button>
                )}
                {selectedRequest.status === 'in-progress' && (
                  <Button variant="accent" fullWidth>
                    Mark as Complete
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

export default LandlordMaintenance;
