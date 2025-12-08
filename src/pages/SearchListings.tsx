import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Filter, X, Bed, Bath } from 'lucide-react';
import { listingService } from '../services/listingService';
import type { Listing, SearchFilters } from '../types/listing.types';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SearchListings: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [results, setResults] = useState<Listing[]>([]);
  const [universities, setUniversities] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: 0,
    maxPrice: 500000,
    roomType: [],
  });

  // Fetch universities and locations on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [univData, locData] = await Promise.all([
          listingService.getUniversities(),
          listingService.getLocations(),
        ]);
        setUniversities(univData);
        setLocations(locData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    fetchData();
  }, []);

  // Initialize from URL parameters on mount
  useEffect(() => {
    const queryParam = searchParams.get('q');
    const locationParam = searchParams.get('location');
    const universityParam = searchParams.get('university');

    if (queryParam) setSearchQuery(queryParam);
    if (locationParam) setSelectedLocation(locationParam);
    if (universityParam) setSelectedUniversity(universityParam);

    // Auto-search if any parameters are present
    if (queryParam || locationParam || universityParam) {
      setTimeout(() => {
        handleSearch();
      }, 100);
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchFilters: SearchFilters = {
        query: searchQuery || undefined,
        university: selectedUniversity || undefined,
        location: selectedLocation || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        roomType: filters.roomType && filters.roomType.length > 0 ? filters.roomType : undefined,
      };

      const data = await listingService.searchListings(searchFilters);
      setResults(data);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomTypeToggle = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      roomType: prev.roomType?.includes(type)
        ? prev.roomType.filter((t) => t !== type)
        : [...(prev.roomType || []), type],
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedUniversity('');
    setSelectedLocation('');
    setFilters({
      minPrice: 0,
      maxPrice: 500000,
      roomType: [],
    });
    setResults([]);
  };

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
                    placeholder="Search by keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 ml-2 py-3 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* University Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University
                </label>
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg outline-none border-none"
                >
                  <option value="">All Universities</option>
                  {universities.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg outline-none border-none"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
              {(searchQuery || selectedUniversity || selectedLocation || filters.roomType && filters.roomType.length > 0) && (
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
        {(selectedUniversity || selectedLocation || (filters.roomType && filters.roomType.length > 0)) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedUniversity && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                University: {selectedUniversity}
                <X
                  className="w-4 h-4 ml-2 cursor-pointer"
                  onClick={() => setSelectedUniversity('')}
                />
              </span>
            )}
            {selectedLocation && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                Location: {selectedLocation}
                <X
                  className="w-4 h-4 ml-2 cursor-pointer"
                  onClick={() => setSelectedLocation('')}
                />
              </span>
            )}
            {filters.roomType?.map((type) => (
              <span
                key={type}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center"
              >
                {type}
                <X
                  className="w-4 h-4 ml-2 cursor-pointer"
                  onClick={() => handleRoomTypeToggle(type)}
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

              {/* Room Type */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Room Type</h4>
                <div className="space-y-2">
                  {['Single', 'Shared', 'Studio', 'Apartment'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.roomType?.includes(type) || false}
                        onChange={() => handleRoomTypeToggle(type)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
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
            {results.length > 0
              ? `Found ${results.length} ${results.length === 1 ? 'property' : 'properties'}`
              : loading
              ? 'Searching...'
              : 'No results yet. Try searching for properties.'}
          </p>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                <div className="w-48 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex-shrink-0">
                  {result.images && result.images[0] && (
                    <img
                      src={result.images[0]}
                      alt={result.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {result.title}
                      </h3>
                      <p className="text-gray-600 flex items-center mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {result.location}
                      </p>
                      {result.university && (
                        <p className="text-sm text-blue-600 mb-2">
                          Near {result.university}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {result.price.toLocaleString()} RWF
                      </div>
                      <span className="text-xs text-gray-500">per month</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {result.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {result.bedrooms} bed{result.bedrooms !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {result.bathrooms} bath{result.bathrooms !== 1 ? 's' : ''}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {result.roomType}
                    </span>
                    {result.verified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        Verified
                      </span>
                    )}
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                      {result.rating} ({result.reviewCount})
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/listings/${result.id}`)}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    View Details
                  </button>
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