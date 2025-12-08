import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Filter, X, Bed, Bath, Building2, Home, Users } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import type { Property } from '../types/property.types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SearchListings: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 500000,
    propertyType: [] as string[],
  });

  // Fetch all properties on mount
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        console.log('Fetching properties from API...');
        const properties = await propertyService.getAllProperties();
        console.log('Fetched properties:', properties);
        console.log('Number of properties:', properties.length);
        setResults(properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        if (axios.isAxiosError(error)) {
          console.error('Error response:', error.response?.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Client-side filtering of properties
  const filteredResults = results.filter((property) => {
    // Search query filter (name, city, or address)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        property.name.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query);
      if (!matchesQuery) return false;
    }

    // Location filter
    if (selectedLocation && property.city !== selectedLocation) {
      return false;
    }

    // Price filter
    if (property.monthlyRentMin < filters.minPrice || property.monthlyRentMax > filters.maxPrice) {
      return false;
    }

    // Property type filter
    if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.type)) {
      return false;
    }

    return true;
  });

  const handlePropertyTypeToggle = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: prev.propertyType.includes(type)
        ? prev.propertyType.filter((t) => t !== type)
        : [...prev.propertyType, type],
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('');
    setFilters({
      minPrice: 0,
      maxPrice: 500000,
      propertyType: [],
    });
  };

  // Get unique cities from properties
  const availableCities = Array.from(new Set(results.map((p) => p.city)));

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Bar */}
        <div className="py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* General Search */}
              <div className="md:col-span-4 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="flex items-center px-4 bg-gray-50 rounded-lg">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, city, or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 ml-2 py-3 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Location/City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg outline-none border-none"
                >
                  <option value="">All Cities</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
              {(searchQuery || selectedLocation || filters.propertyType.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-red-600 hover:text-red-700 flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedLocation || filters.propertyType.length > 0) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedLocation && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                City: {selectedLocation}
                <X
                  className="w-4 h-4 ml-2 cursor-pointer"
                  onClick={() => setSelectedLocation('')}
                />
              </span>
            )}
            {filters.propertyType.map((type) => (
              <span
                key={type}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center capitalize"
              >
                {type}
                <X
                  className="w-4 h-4 ml-2 cursor-pointer"
                  onClick={() => handlePropertyTypeToggle(type)}
                />
              </span>
            ))}
          </div>
        )}

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-gray-900 mb-4">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">
                      Min: {filters.minPrice?.toLocaleString()} RWF
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">
                      Max: {filters.maxPrice?.toLocaleString()} RWF
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Property Type</h4>
                <div className="space-y-2">
                  {['hostel', 'apartment', 'house', 'studio'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.propertyType.includes(type)}
                        onChange={() => handlePropertyTypeToggle(type)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {loading ? (
              'Loading properties...'
            ) : filteredResults.length > 0 ? (
              `Found ${filteredResults.length} ${filteredResults.length === 1 ? 'property' : 'properties'}`
            ) : results.length > 0 ? (
              'No properties match your filters.'
            ) : (
              'No properties available yet.'
            )}
          </p>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {filteredResults.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/property/${property._id}`)}
            >
              <div className="flex gap-4">
                <div className="w-48 h-40 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  {property.images && property.images[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Building2 className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-xs">No image</p>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {property.name}
                      </h3>
                      <p className="text-gray-600 flex items-center mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.address}, {property.city}
                      </p>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs capitalize font-medium">
                        {property.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">From</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {property.monthlyRentMin.toLocaleString()} RWF
                      </div>
                      <span className="text-xs text-gray-500">per month</span>
                      {property.monthlyRentMax !== property.monthlyRentMin && (
                        <div className="text-xs text-gray-400 mt-1">
                          Up to {property.monthlyRentMax.toLocaleString()} RWF
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {property.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Home className="w-4 h-4 mr-1" />
                      {property.totalUnits} units
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {property.totalUnits - property.occupiedUnits} available
                    </span>
                  </div>

                  {/* Amenities */}
                  {property.amenities && property.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {property.amenities.slice(0, 4).map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                          +{property.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Contact: {property.contactPhone}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/property/${property._id}`);
                      }}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchListings;