import React, { useState, useEffect } from 'react';
import { MapPin, Star, Bed, Bath, Wifi, Shield, Phone, Mail, Heart, Share2, MapPin as MapIcon, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BookingModal, { BookingFormData } from '../components/modals/BookingModal';
import { bookingService } from '../services/bookingService';
import { propertyService } from '../services/propertyService';
import type { Property } from '../types/property.types';

const ListingDetails: React.FC = () => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchProperty(id);
    }
  }, [id]);

  const fetchProperty = async (propertyId: string) => {
    try {
      setIsLoading(true);
      const data = await propertyService.getPropertyById(propertyId);
      setProperty(data);
    } catch (error) {
      console.error('Failed to fetch property:', error);
      alert('Failed to load property details');
      navigate('/browse');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      alert('Please login to book a property');
      // You can redirect to login or open login modal here
      return;
    }

    if (user?.role !== 'student') {
      alert('Only students can book properties');
      return;
    }

    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    try {
      // Note: This will work once the backend booking API is implemented
      await bookingService.createBooking(bookingData);
      alert('Booking request submitted successfully! The landlord will review and confirm your booking.');
      setIsBookingModalOpen(false);
      // Redirect to bookings page
      navigate('/student/bookings');
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to create booking. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Property not found</p>
          <button
            onClick={() => navigate('/browse')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{property.name}</h1>
            <p className="text-gray-600 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              {property.address}, {property.city}
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
              <p className="text-gray-600 mb-6">{property.description || 'No description available.'}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Total Units</p>
                  <p className="text-2xl font-bold text-gray-900">{property.totalUnits}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Type</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{property.type}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">City</p>
                  <p className="text-2xl font-bold text-gray-900">{property.city}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{property.status}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Wifi className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div className="bg-white rounded-lg p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <p className="text-gray-600 mb-1">Monthly rent</p>
                <div className="text-4xl font-bold text-gray-900">
                  {property.monthlyRentMin?.toLocaleString()}
                  {property.monthlyRentMax && property.monthlyRentMax !== property.monthlyRentMin && (
                    <span className="text-2xl"> - {property.monthlyRentMax.toLocaleString()}</span>
                  )}
                  <span className="text-sm text-gray-600 ml-1">RWF</span>
                </div>
              </div>

              {/* Status Badge */}
              {property.status === 'active' && (
                <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">Active Property</span>
                </div>
              )}

              {/* Available From */}
              {property.availableFrom && (
                <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Available from</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(property.availableFrom).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={handleBookNow}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold mb-3"
              >
                Book Now
              </button>

              {/* Landlord Info */}
              <div className="border-t pt-6">
                <h4 className="font-bold text-gray-900 mb-4">Contact Information</h4>
                <div className="space-y-3">
                  {property.contactPhone && (
                    <a
                      href={`tel:${property.contactPhone}`}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <Phone className="w-4 h-4" />
                      {property.contactPhone}
                    </a>
                  )}

                  {property.contactEmail && (
                    <a
                      href={`mailto:${property.contactEmail}`}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <Mail className="w-4 h-4" />
                      {property.contactEmail}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={handleBookingSubmit}
        property={{
          id: property._id || property.id || '',
          name: property.name,
          monthlyRent: property.monthlyRentMin || 0,
          address: property.address,
          city: property.city,
        }}
      />
    </div>
  );
};

export default ListingDetails;
