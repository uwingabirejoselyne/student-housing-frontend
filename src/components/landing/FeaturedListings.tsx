import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import type { Property } from '../../types/property.types';
import { MapPin, Home, DollarSign } from 'lucide-react';

// This component will now fetch real properties from the database
// We'll keep the old mock data commented out for reference
/*
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Modern Room near University of Rwanda',
    description: 'Spacious single room with modern amenities',
    price: 150000,
    currency: 'RWF',
    location: 'Remera',
    city: 'Kigali',
    district: 'Gasabo',
    university: 'University of Rwanda',
    images: [],
    amenities: ['WiFi', 'Kitchen', 'Security', '24/7 Water'],
    roomType: 'single',
    bedrooms: 1,
    bathrooms: 1,
    availableFrom: '2024-01-01',
    isAvailable: true,
    landlordId: '1',
    landlordName: 'Jean Pierre',
    landlordPhone: '+250788123456',
    landlordEmail: 'jean@example.com',
    verified: true,
    rating: 4.8,
    reviewCount: 24,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Shared Apartment near AUCA',
    description: 'Affordable shared apartment with great facilities',
    price: 100000,
    currency: 'RWF',
    location: 'Gikondo',
    city: 'Kigali',
    district: 'Kicukiro',
    
    university: 'AUCA',
    images: [],
    amenities: ['Parking', 'WiFi', 'Furnished', 'Laundry'],
    roomType: 'shared',
    bedrooms: 2,
    bathrooms: 1,
    availableFrom: '2024-02-01',
    isAvailable: true,
    landlordId: '2',
    landlordName: 'Marie Claire',
    landlordPhone: '+250788234567',
    landlordEmail: 'marie@example.com',
    verified: true,
    rating: 4.5,
    reviewCount: 18,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
  },
  {
    id: '3',
    title: 'Studio Apartment Kimihurura',
    description: 'Private studio with kitchen and modern amenities',
    price: 200000,
    currency: 'RWF',
    location: 'Kimihurura',
    city: 'Kigali',
    district: 'Gasabo',
    university: 'Kigali Independent University',
    images: [],
    amenities: ['AC', 'Kitchen', 'Balcony', 'WiFi', 'Security'],
    roomType: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    availableFrom: '2024-01-15',
    isAvailable: true,
    landlordId: '3',
    landlordName: 'Patrick Uwase',
    landlordPhone: '+250788345678',
    landlordEmail: 'patrick@example.com',
    verified: false,
    rating: 4.7,
    reviewCount: 31,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
];
*/

const FeaturedListings: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const allProperties = await propertyService.getAllProperties();
        // Show only the first 3 properties as "featured"
        setProperties(allProperties.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleViewAllListings = () => {
    navigate('/search');
  };

  const handleViewProperty = (propertyId: string) => {
    navigate(`/listings/${propertyId}`);
  };

  return (
    <section className="py-16 bg-white" id="browse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Accommodations
          </h2>
          <p className="text-gray-600">
            Discover the best student housing options near your campus
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Yet</h3>
            <p className="text-gray-600">Be the first landlord to add a property!</p>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                onClick={() => handleViewProperty(property._id)}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  {property.images && property.images[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Home className="w-16 h-16 text-emerald-600 opacity-50" />
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Property Type Badge */}
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full mb-3 capitalize">
                    {property.type}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {property.name}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{property.city}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>

                  {/* Units */}
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Home className="w-4 h-4 mr-1" />
                    <span>{property.totalUnits} units • {property.totalUnits - property.occupiedUnits} available</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center text-emerald-600">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-xl font-bold">
                        {property.monthlyRentMin.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">RWF/mo</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProperty(property._id);
                      }}
                      className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <button
            onClick={handleViewAllListings}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            View All Listings
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;