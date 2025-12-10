import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Bed, Bath, Wifi, Heart, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import type { Property } from '../types/property.types';

const BrowseListings: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredListings, setFilteredListings] = useState<Property[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [selectedRoomType, setSelectedRoomType] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const data = await propertyService.getAllProperties();
      setProperties(data);
      setFilteredListings(data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = Number(e.target.value);
    if (type === 'min') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  const handleRoomTypeFilter = (type: string) => {
    setSelectedRoomType(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const applyFilters = () => {
    let filtered = properties;

    // Price filter
    filtered = filtered.filter(
      p => (p.monthlyRentMin || 0) >= priceRange[0] && (p.monthlyRentMax || p.monthlyRentMin || 0) <= priceRange[1]
    );

    // Room type filter
    if (selectedRoomType.length > 0) {
      filtered = filtered.filter(p => selectedRoomType.includes(p.type.toLowerCase()));
    }

    setFilteredListings(filtered);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setPriceRange([0, 500000]);
    setSelectedRoomType([]);
    setFilteredListings(properties);
  };

  const handleViewDetails = (propertyId: string) => {
    navigate(`/listings/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse All Listings</h1>
          <p className="text-gray-600">
            Found {filteredListings.length} properties available
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Reset
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">Min: {priceRange[0].toLocaleString()} RWF</label>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 'min')}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Max: {priceRange[1].toLocaleString()} RWF</label>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 'max')}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Room Type */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Room Type</h3>
                <div className="space-y-2">
                  {['single', 'shared', 'studio', 'apartment'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRoomType.includes(type)}
                        onChange={() => handleRoomTypeFilter(type)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verified Only */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">Verified Only</span>
                </label>
              </div>

              <button
                onClick={applyFilters}
                className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-500">Loading properties...</p>
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((property) => (
                  <div key={property._id || property.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md">
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative">
                      <button className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100">
                        <Heart className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{property.name}</h3>

                      <p className="text-sm text-gray-600 flex items-center mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.address}, {property.city}
                      </p>

                      <div className="flex justify-between items-end mb-3">
                        <div className="text-2xl font-bold text-gray-900">
                          {property.monthlyRentMin?.toLocaleString()}
                          {property.monthlyRentMax && property.monthlyRentMax !== property.monthlyRentMin && (
                            <span className="text-sm"> - {property.monthlyRentMax.toLocaleString()}</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">RWF/month</span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          {property.totalUnits} units
                        </span>
                        <span className="flex items-center capitalize">
                          {property.type}
                        </span>
                      </div>

                      <button
                        onClick={() => handleViewDetails(property._id || property.id || '')}
                        className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-500">No listings found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseListings;
