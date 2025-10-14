import React from 'react';
import ListingCard from './ListingCard';
import type { Listing } from '../../types/listing.types';

// Mock data - Replace with API call later
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

const FeaturedListings: React.FC = () => {
  const handleFavorite = (id: string) => {
    console.log('Favorited listing:', id);
    // TODO: Implement favorite functionality
  };

  const handleViewDetails = (id: string) => {
    console.log('View listing details:', id);
    // TODO: Navigate to listing details page
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

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onFavorite={handleFavorite}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            View All Listings
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;