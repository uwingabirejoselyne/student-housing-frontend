import React, { useState, useEffect } from 'react';
import { Search, MapPin, Bed, Heart, Filter, X, Home, SlidersHorizontal, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import type { Property } from '../types/property.types';

const roomTypes = ['hostel', 'apartment', 'house', 'studio'];

const amenityIcons: Record<string, string> = {
  wifi: '📶',
  parking: '🚗',
  gym: '🏋️',
  laundry: '🧺',
  security: '🔒',
  water: '💧',
  electricity: '⚡',
};

const typeColors: Record<string, string> = {
  hostel: 'bg-blue-100 text-blue-700',
  apartment: 'bg-emerald-100 text-emerald-700',
  house: 'bg-orange-100 text-orange-700',
  studio: 'bg-purple-100 text-purple-700',
};

const PropertyCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
    <div className="h-52 bg-slate-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="h-6 bg-slate-200 rounded w-1/3" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
      </div>
      <div className="h-10 bg-slate-200 rounded-xl" />
    </div>
  </div>
);

const BrowseListings: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredListings, setFilteredListings] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [selectedRoomType, setSelectedRoomType] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedRoomType, priceRange, properties]);

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

  const handleRoomTypeFilter = (type: string) => {
    setSelectedRoomType(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const applyFilters = () => {
    let filtered = properties;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    filtered = filtered.filter(
      p => (p.monthlyRentMin || 0) >= priceRange[0] && (p.monthlyRentMin || 0) <= priceRange[1]
    );

    if (selectedRoomType.length > 0) {
      filtered = filtered.filter(p => selectedRoomType.includes(p.type.toLowerCase()));
    }

    setFilteredListings(filtered);
  };

  const resetFilters = () => {
    setPriceRange([0, 500000]);
    setSelectedRoomType([]);
    setSearchQuery('');
    setFilteredListings(properties);
  };

  const availableUnits = (p: Property) => p.totalUnits - (p.occupiedUnits || 0);

  const FilterPanel = () => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          Filters
        </h2>
        <button
          onClick={resetFilters}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Reset all
        </button>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Monthly Rent (RWF)</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Min</span>
              <span className="font-medium text-slate-700">{priceRange[0].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500000"
              step="10000"
              value={priceRange[0]}
              onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full accent-emerald-600"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Max</span>
              <span className="font-medium text-slate-700">{priceRange[1].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500000"
              step="10000"
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Room Type */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Property Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {roomTypes.map(type => (
            <button
              key={type}
              onClick={() => handleRoomTypeFilter(type)}
              className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all capitalize ${
                selectedRoomType.includes(type)
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Active filters count */}
      {(selectedRoomType.length > 0 || priceRange[0] > 0 || priceRange[1] < 500000) && (
        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            {selectedRoomType.length + (priceRange[0] > 0 || priceRange[1] < 500000 ? 1 : 0)} filter(s) active
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-700 pt-28 pb-14 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Find Your Perfect Stay
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            {isLoading ? 'Loading...' : `${filteredListings.length} properties available across Rwanda`}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, city or address..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-900 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{filteredListings.length}</span> results
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(selectedRoomType.length > 0) && (
              <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {selectedRoomType.length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile filter panel */}
        {showFilters && (
          <div className="lg:hidden mb-6">
            <FilterPanel />
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-64 shrink-0 sticky top-24 self-start">
            <FilterPanel />
          </div>

          {/* Listings Grid */}
          <div className="flex-1 min-w-0">
            <div className="hidden lg:flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-800">{filteredListings.length}</span> properties
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredListings.map((property) => {
                  const available = availableUnits(property);
                  const hasImage = property.images && property.images.length > 0;

                  return (
                    <div
                      key={property._id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                      {/* Image / Placeholder */}
                      <div className="h-52 relative overflow-hidden">
                        {hasImage ? (
                          <img
                            src={property.images![0]}
                            alt={property.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col items-center justify-center gap-2">
                            <Building2 className="w-12 h-12 text-emerald-300" />
                            <span className="text-xs text-emerald-400 font-medium capitalize">{property.type}</span>
                          </div>
                        )}

                        {/* Type badge */}
                        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${typeColors[property.type] || 'bg-slate-100 text-slate-600'}`}>
                          {property.type}
                        </span>

                        {/* Wishlist */}
                        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white shadow-sm transition-colors">
                          <Heart className="w-4 h-4 text-slate-500 hover:text-red-500" />
                        </button>

                        {/* Availability tag */}
                        {available > 0 ? (
                          <span className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                            {available} unit{available !== 1 ? 's' : ''} available
                          </span>
                        ) : (
                          <span className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                            Fully booked
                          </span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 text-base mb-1 truncate">{property.name}</h3>

                        <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          {property.address}, {property.city}
                        </p>

                        {/* Amenities */}
                        {property.amenities && property.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {property.amenities.slice(0, 3).map(a => (
                              <span key={a} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize flex items-center gap-1">
                                {amenityIcons[a.toLowerCase()] && <span>{amenityIcons[a.toLowerCase()]}</span>}
                                {a}
                              </span>
                            ))}
                            {property.amenities.length > 3 && (
                              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                                +{property.amenities.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-end justify-between mb-4">
                          <div>
                            <span className="text-xl font-extrabold text-slate-900">
                              {property.monthlyRentMin?.toLocaleString()}
                            </span>
                            {property.monthlyRentMax && property.monthlyRentMax !== property.monthlyRentMin && (
                              <span className="text-sm text-slate-500"> – {property.monthlyRentMax.toLocaleString()}</span>
                            )}
                            <span className="text-xs text-slate-400 block">RWF / month</span>
                          </div>
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Bed className="w-3.5 h-3.5" />
                            {property.totalUnits} total
                          </span>
                        </div>

                        <button
                          onClick={() => navigate(`/listings/${property._id}`)}
                          className="w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors duration-200"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                <Home className="w-14 h-14 text-slate-200 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-1">No properties found</h3>
                <p className="text-sm text-slate-400 mb-4">Try adjusting your filters or search term</p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseListings;
