import React from 'react';
import { MapPin, Star, Bed, Heart, Shield } from 'lucide-react';
import type { Listing } from '../../types/listing.types';

interface ListingCardProps {
  listing: Listing;
  onFavorite?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onFavorite,
  onViewDetails,
}) => {
  const handleFavoriteClick = () => {
    if (onFavorite) {
      onFavorite(listing.id);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(listing.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
        >
          <Heart className="w-5 h-5 text-gray-600" />
        </button>

        {/* Verified Badge */}
        {listing.verified && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {listing.title}
            </h3>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              {listing.location}, {listing.city}
            </p>
          </div>

          {/* Price */}
          <div className="text-right ml-4">
            <div className="text-xl font-bold text-gray-900">
              {listing.price.toLocaleString()} {listing.currency}
            </div>
            <div className="text-xs text-gray-500">per month</div>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
          <span className="flex items-center capitalize">
            <Bed className="w-4 h-4 mr-1" />
            {listing.roomType}
          </span>
          <span className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
            {listing.rating} ({listing.reviewCount})
          </span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-3">
          {listing.amenities.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {amenity}
            </span>
          ))}
          {listing.amenities.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{listing.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ListingCard;