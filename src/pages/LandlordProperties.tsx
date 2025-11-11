import React, { useState } from 'react';
import { Building2, Users, DollarSign, Menu, Plus, Search, Filter, MapPin, Bed, Edit, Trash2, Eye, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LandlordSidebar from '../components/layout/LandlordSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

// Mock Data
const properties = [
  {
    id: 1,
    name: 'University Heights',
    address: 'KN 5 Ave, Kigali',
    type: 'Hostel',
    totalUnits: 20,
    occupiedUnits: 18,
    monthlyRevenue: 3000000,
    status: 'active',
    imageGradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 2,
    name: 'Campus View Apartments',
    address: 'KG 7 St, Kigali',
    type: 'Apartment',
    totalUnits: 12,
    occupiedUnits: 10,
    monthlyRevenue: 1800000,
    status: 'active',
    imageGradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 3,
    name: 'Student Residence Hall',
    address: 'KN 15 Rd, Kigali',
    type: 'Hostel',
    totalUnits: 15,
    occupiedUnits: 12,
    monthlyRevenue: 1800000,
    status: 'active',
    imageGradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 4,
    name: 'Downtown Student Suites',
    address: 'KN 3 Ave, Kigali',
    type: 'Apartment',
    totalUnits: 8,
    occupiedUnits: 7,
    monthlyRevenue: 1050000,
    status: 'active',
    imageGradient: 'from-orange-500 to-red-600',
  },
  {
    id: 5,
    name: 'Riverside Hostel',
    address: 'KG 12 St, Kigali',
    type: 'Hostel',
    totalUnits: 10,
    occupiedUnits: 8,
    monthlyRevenue: 1200000,
    status: 'maintenance',
    imageGradient: 'from-cyan-500 to-blue-600',
  },
];

const LandlordProperties = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const displayName = user?.name || 'Landlord';

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || property.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const totalProperties = properties.length;
  const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0);
  const totalOccupied = properties.reduce((sum, p) => sum + p.occupiedUnits, 0);
  const totalRevenue = properties.reduce((sum, p) => sum + p.monthlyRevenue, 0);
  const occupancyRate = Math.round((totalOccupied / totalUnits) * 100);

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
                <h1 className="text-xl font-bold text-slate-900">Properties</h1>
              </div>

              <Button icon={Plus} variant="primary" className="bg-emerald-600 hover:bg-emerald-700">
                Add Property
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card padding="md" className="border-l-4 border-emerald-500">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="w-8 h-8 text-emerald-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Properties</p>
              <p className="text-3xl font-bold text-slate-900">{totalProperties}</p>
            </Card>

            <Card padding="md" className="border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <Home className="w-8 h-8 text-blue-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Units</p>
              <p className="text-3xl font-bold text-slate-900">{totalUnits}</p>
            </Card>

            <Card padding="md" className="border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-purple-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Occupancy Rate</p>
              <p className="text-3xl font-bold text-slate-900">{occupancyRate}%</p>
              <p className="text-xs text-slate-500 mt-1">{totalOccupied} / {totalUnits} occupied</p>
            </Card>

            <Card padding="md" className="border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-green-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">RWF {totalRevenue.toLocaleString()}</p>
            </Card>
          </div>

          {/* Search and Filter Bar */}
          <Card padding="md" className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search properties by name or address..."
                  icon={Search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="sm:w-48">
                <select
                  className="input"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="hostel">Hostel</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const occupancy = Math.round((property.occupiedUnits / property.totalUnits) * 100);

              return (
                <Card key={property.id} padding="none" hover className="overflow-hidden group">
                  {/* Property Image Placeholder */}
                  <div className={`h-48 bg-gradient-to-br ${property.imageGradient} flex items-center justify-center relative`}>
                    <Building2 className="w-16 h-16 text-white opacity-50" aria-hidden="true" />

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant={property.status === 'active' ? 'success' : 'warning'}
                        className="capitalize"
                      >
                        {property.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{property.name}</h3>

                    <div className="flex items-start gap-2 text-sm text-slate-600 mb-4">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{property.address}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="neutral" className="text-xs">
                        {property.type}
                      </Badge>
                      <span className="text-sm text-slate-600">•</span>
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        <Bed className="w-4 h-4" aria-hidden="true" />
                        {property.totalUnits} units
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-slate-600">Occupancy</span>
                          <span className="text-sm font-semibold text-slate-900">
                            {property.occupiedUnits} / {property.totalUnits}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              occupancy >= 80 ? 'bg-green-500' : occupancy >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${occupancy}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Monthly Revenue</span>
                        <span className="text-sm font-bold text-emerald-600">
                          RWF {property.monthlyRevenue.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-slate-200">
                      <Button variant="ghost" size="sm" icon={Eye} fullWidth>
                        View
                      </Button>
                      <Button variant="ghost" size="sm" icon={Edit} fullWidth>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" icon={Trash2} fullWidth className="text-red-600 hover:text-red-700">
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No properties found</h3>
              <p className="text-slate-600 mb-4">
                {searchQuery ? 'Try adjusting your search criteria' : 'Get started by adding your first property'}
              </p>
              <Button icon={Plus} className="bg-emerald-600 hover:bg-emerald-700">
                Add Property
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LandlordProperties;
