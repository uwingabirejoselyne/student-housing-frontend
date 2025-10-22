import React, { useState } from 'react';
import { MapPin, Star, Bed, Bath, Wifi, Shield, Phone, Mail, Heart, Share2, MapPin as MapIcon, Calendar } from 'lucide-react';

const ListingDetails: React.FC = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  const listing = {
    id: '1',
    title: 'Modern Room near University of Rwanda',
    price: 150000,
    location: 'Remera',
    city: 'Kigali',
    description: 'Spacious and modern single room with excellent amenities for students.',
    bedrooms: 1,
    bathrooms: 1,
    squareMeters: 25,
    amenities: ['WiFi', 'Kitchen', 'Security', '24/7 Water', 'Parking', 'Laundry'],
    roomType: 'single',
    verified: true,
    rating: 4.8,
    reviewCount: 24,
    images: [],
    landlord: {
      name: 'Jean Pierre',
      phone: '+250788123456',
      email: 'jean@example.com',
      verified: true,
    },
    availableFrom: '2024-02-01',
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <p className="text-gray-600 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              {listing.location}, {listing.city}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Heart className={`w-6 h-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            <button className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50">
              <Share2 className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-96 rounded-lg mb-6"></div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-600 mb-6">{listing.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Bedrooms</p>
                  <p className="text-2xl font-bold text-gray-900">{listing.bedrooms}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Bathrooms</p>
                  <p className="text-2xl font-bold text-gray-900">{listing.bathrooms}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Size</p>
                  <p className="text-2xl font-bold text-gray-900">{listing.squareMeters}m²</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Type</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{listing.roomType}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {listing.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Wifi className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews</h3>
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(listing.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="ml-2 text-gray-700">{listing.rating} out of 5 ({listing.reviewCount} reviews)</span>
              </div>
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">Great location and affordable!</p>
                  <p className="text-sm text-gray-600">Amazing property, very close to campus.</p>
                  <p className="text-xs text-gray-500 mt-2">By Sarah K. - 2 months ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div className="bg-white rounded-lg p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <p className="text-gray-600 mb-1">Monthly price</p>
                <div className="text-4xl font-bold text-gray-900">
                  {listing.price.toLocaleString()}
                  <span className="text-sm text-gray-600 ml-1">RWF</span>
                </div>
              </div>

              {/* Verified Badge */}
              {listing.verified && (
                <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">Verified Property</span>
                </div>
              )}

              {/* Available From */}
              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Available from</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {listing.availableFrom}
                </p>
              </div>

              {/* CTA Button */}
              <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold mb-3">
                Contact Landlord
              </button>

              {/* Landlord Info */}
              <div className="border-t pt-6">
                <h4 className="font-bold text-gray-900 mb-4">Landlord Information</h4>
                <div className="space-y-3">
                  <p className="text-gray-700 font-semibold">{listing.landlord.name}</p>
                  
                  <a
                    href={`tel:${listing.landlord.phone}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Phone className="w-4 h-4" />
                    {listing.landlord.phone}
                  </a>

                  <a
                    href={`mailto:${listing.landlord.email}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Mail className="w-4 h-4" />
                    {listing.landlord.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
