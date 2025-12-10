import React, { useState } from 'react';
import { X, Calendar, Users, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: BookingFormData) => void;
  property: {
    id: string;
    name: string;
    monthlyRent: number;
    address: string;
    city: string;
  };
}

export interface BookingFormData {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSubmit, property }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    propertyId: property.id,
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const calculateDuration = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const calculateTotal = () => {
    const duration = calculateDuration();
    const months = Math.ceil(duration / 30);
    return months * property.monthlyRent;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    }

    if (!formData.checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
    }

    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        newErrors.checkInDate = 'Check-in date cannot be in the past';
      }

      if (checkOut <= checkIn) {
        newErrors.checkOutDate = 'Check-out date must be after check-in date';
      }

      const duration = calculateDuration();
      if (duration < 30) {
        newErrors.checkOutDate = 'Minimum booking period is 30 days (1 month)';
      }
    }

    if (formData.numberOfGuests < 1) {
      newErrors.numberOfGuests = 'At least 1 guest is required';
    }

    if (formData.numberOfGuests > 10) {
      newErrors.numberOfGuests = 'Maximum 10 guests allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const duration = calculateDuration();
  const months = Math.ceil(duration / 30);
  const totalAmount = calculateTotal();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Book Property</h2>
            <p className="text-sm text-slate-600 mt-1">{property.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Property Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-slate-600">Location</p>
            <p className="font-medium text-slate-900">
              {property.address}, {property.city}
            </p>
            <p className="text-sm text-slate-600 mt-2">Monthly Rent</p>
            <p className="text-2xl font-bold text-blue-600">
              RWF {property.monthlyRent.toLocaleString()}
            </p>
          </div>

          {/* Check-in Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Check-in Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={formData.checkInDate}
                onChange={(e) => handleChange('checkInDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.checkInDate ? 'border-red-500' : 'border-slate-300'
                }`}
              />
            </div>
            {errors.checkInDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.checkInDate}
              </p>
            )}
          </div>

          {/* Check-out Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Check-out Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => handleChange('checkOutDate', e.target.value)}
                min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.checkOutDate ? 'border-red-500' : 'border-slate-300'
                }`}
              />
            </div>
            {errors.checkOutDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.checkOutDate}
              </p>
            )}
          </div>

          {/* Number of Guests */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Number of Guests *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                min="1"
                max="10"
                value={formData.numberOfGuests}
                onChange={(e) => handleChange('numberOfGuests', parseInt(e.target.value))}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.numberOfGuests ? 'border-red-500' : 'border-slate-300'
                }`}
              />
            </div>
            {errors.numberOfGuests && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.numberOfGuests}
              </p>
            )}
          </div>

          {/* Special Requests */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleChange('specialRequests', e.target.value)}
              rows={3}
              placeholder="Any special requirements or requests..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Booking Summary */}
          {duration > 0 && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg space-y-2">
              <h3 className="font-semibold text-slate-900 mb-3">Booking Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Duration:</span>
                <span className="font-medium text-slate-900">
                  {duration} days ({months} month{months > 1 ? 's' : ''})
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Monthly Rent:</span>
                <span className="font-medium text-slate-900">
                  RWF {property.monthlyRent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Number of Months:</span>
                <span className="font-medium text-slate-900">{months}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                    <DollarSign className="w-5 h-5" />
                    RWF {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Note */}
          <div className="mb-6 p-3 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Minimum booking period is 30 days (1 month). Your booking will be
              pending until confirmed by the landlord.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button type="button" variant="ghost" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirm Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
