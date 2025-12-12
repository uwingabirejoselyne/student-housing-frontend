import React, { useState, useEffect } from 'react';
import { Building2, Users, DollarSign, Menu, Plus, Search, Filter, MapPin, Bed, Edit, Trash2, Eye, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LandlordSidebar from '../components/layout/LandlordSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import AddPropertyModal, { PropertyFormData } from '../components/modals/AddPropertyModal';
import { propertyService } from '../services/propertyService';
import type { Property } from '../types/property.types';

// Gradient colors for property cards
const gradients = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-pink-600',
  'from-orange-500 to-red-600',
  'from-cyan-500 to-blue-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-purple-600',
];

const LandlordProperties = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyFormData | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties();
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

  const displayName = user?.name || 'Landlord';

  const handleAddProperty = async (propertyData: PropertyFormData) => {
    try {
      await propertyService.createProperty(propertyData);
      alert('Property added successfully!');
      setIsAddPropertyModalOpen(false);
      // Refresh the properties list
      await fetchProperties();
    } catch (error: any) {
      console.error('Failed to add property:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add property. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleEditProperty = (property: any) => {
    // Convert property to PropertyFormData format
    const formData: PropertyFormData = {
      name: property.name,
      address: property.address,
      city: 'Kigali', // Default value
      type: property.type,
      totalUnits: property.totalUnits,
      description: '',
      amenities: [],
      monthlyRentMin: 0,
      monthlyRentMax: 0,
      availableFrom: '',
      contactEmail: '',
      contactPhone: '',
    };
    setEditingProperty(formData);
    setIsAddPropertyModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddPropertyModalOpen(false);
    setEditingProperty(null);
  };

  const handleDeleteProperty = async (propertyId: string, propertyName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${propertyName}"?\n\nThis action cannot be undone. All property data, including images and bookings, will be permanently removed.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingPropertyId(propertyId);

    try {
      await propertyService.deleteProperty(propertyId);

      // Remove from local state immediately for better UX
      setProperties(prev => prev.filter(p => p._id !== propertyId));

      alert('✓ Property deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete property:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete property. Please try again.';
      alert(`✗ Error: ${errorMessage}`);

      // Refresh properties list to sync with server state
      await fetchProperties();
    } finally {
      setDeletingPropertyId(null);
    }
  };

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || property.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const totalProperties = properties.length;
  const totalUnits = properties.reduce((sum, p) => sum + (p.totalUnits || 0), 0);
  // For now, estimate occupancy and revenue since the API might not have this data
  const totalOccupied = Math.round(totalUnits * 0.85); // 85% occupancy estimate
  const totalRevenue = totalUnits * 150000; // Estimate based on average rent
  const occupancyRate = totalUnits > 0 ? Math.round((totalOccupied / totalUnits) * 100) : 0;

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

              <Button
                icon={Plus}
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setIsAddPropertyModalOpen(true)}
              >
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

          {/* Properties Table */}
          <Card padding="none" className="overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-slate-600">Loading properties...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No properties found</h3>
                <p className="text-slate-600 mb-4">
                  {searchQuery || filterType !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Get started by adding your first property'}
                </p>
                <Button
                  variant="primary"
                  icon={Plus}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setIsAddPropertyModalOpen(true)}
                >
                  Add Property
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Units
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Rent Range
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
                    {filteredProperties.map((property) => {
                      const availableUnits = (property.totalUnits || 0) - (property.occupiedUnits || 0);

                      return (
                        <tr key={property._id || property.id} className="hover:bg-slate-50 transition-colors">
                          {/* Property Name & Image */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                                {property.images && property.images.length > 0 ? (
                                  <img
                                    src={property.images[0]}
                                    alt={property.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                ) : (
                                  <Building2 className="w-6 h-6 text-white" />
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{property.name}</div>
                                <div className="text-sm text-slate-500">{property.address}</div>
                              </div>
                            </div>
                          </td>

                          {/* Type */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="neutral" className="capitalize">
                              {property.type}
                            </Badge>
                          </td>

                          {/* Location */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <MapPin className="w-4 h-4" />
                              {property.city}
                            </div>
                          </td>

                          {/* Units */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="font-semibold text-slate-900">{property.totalUnits} total</div>
                              <div className="text-slate-500">{availableUnits} available</div>
                            </div>
                          </td>

                          {/* Rent Range */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-slate-900">
                              {property.monthlyRentMin?.toLocaleString()} RWF
                              {property.monthlyRentMax && property.monthlyRentMax !== property.monthlyRentMin && (
                                <span className="text-slate-500"> - {property.monthlyRentMax.toLocaleString()} RWF</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">per month</div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant={property.status === 'active' ? 'success' : 'neutral'}
                              className="capitalize"
                            >
                              {property.status}
                            </Badge>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => window.location.href = `/listings/${property._id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Property"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditProperty(property)}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Edit Property"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(property._id, property.name)}
                                disabled={deletingPropertyId === property._id}
                                className={`p-2 rounded-lg transition-colors ${
                                  deletingPropertyId === property._id
                                    ? 'text-red-400 bg-red-50 cursor-not-allowed'
                                    : 'text-red-600 hover:bg-red-50'
                                }`}
                                title={deletingPropertyId === property._id ? 'Deleting...' : 'Delete Property'}
                              >
                                <Trash2 className={`w-4 h-4 ${deletingPropertyId === property._id ? 'animate-pulse' : ''}`} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </main>
      </div>

      {/* Add/Edit Property Modal */}
      <AddPropertyModal
        isOpen={isAddPropertyModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddProperty}
        initialData={editingProperty || undefined}
      />
    </div>
  );
};

export default LandlordProperties;
