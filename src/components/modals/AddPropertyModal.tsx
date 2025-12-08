import React, { useState } from 'react';
import { X, Building2, MapPin, DollarSign, Home, Image as ImageIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (propertyData: PropertyFormData) => void;
  initialData?: PropertyFormData | null;
}

export interface PropertyFormData {
  name: string;
  address: string;
  city: string;
  type: 'hostel' | 'apartment' | 'house' | 'studio';
  totalUnits: number;
  description: string;
  amenities: string[];
  monthlyRentMin: number;
  monthlyRentMax: number;
  availableFrom?: string;
  contactEmail: string;
  contactPhone: string;
}

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<PropertyFormData>(
    initialData || {
      name: '',
      address: '',
      city: '',
      type: 'hostel',
      totalUnits: 1,
      description: '',
      amenities: [],
      monthlyRentMin: 0,
      monthlyRentMax: 0,
      availableFrom: '',
      contactEmail: '',
      contactPhone: '',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof PropertyFormData, string>>>({});
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.amenities || []);

  const availableAmenities = [
    'WiFi',
    'Parking',
    'Security',
    'Laundry',
    'Kitchen',
    'Study Room',
    'Gym',
    'Swimming Pool',
    'Garden',
    'Backup Generator',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalUnits' || name === 'monthlyRentMin' || name === 'monthlyRentMax'
        ? parseInt(value) || 0
        : value,
    }));

    // Clear error when user types
    if (errors[name as keyof PropertyFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PropertyFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Property name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (formData.totalUnits < 1) newErrors.totalUnits = 'Must have at least 1 unit';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.monthlyRentMin <= 0) newErrors.monthlyRentMin = 'Minimum rent must be greater than 0';
    if (formData.monthlyRentMax < formData.monthlyRentMin) {
      newErrors.monthlyRentMax = 'Maximum rent must be greater than or equal to minimum rent';
    }
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = {
      ...formData,
      amenities: selectedAmenities,
    };

    onSubmit(submitData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 fade-in overflow-y-auto"
      onClick={onClose}
    >
      <Card
        padding="none"
        className="max-w-4xl w-full my-8 slide-up max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-emerald-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <Building2 className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {initialData ? 'Edit Property' : 'Add New Property'}
              </h2>
              <p className="text-sm text-slate-600">Fill in the property details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-slate-600" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Property Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., University Heights"
                  error={errors.name}
                  required
                />

                <div>
                  <label htmlFor="type" className="label">
                    Property Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="hostel">Hostel</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>

                <Input
                  label="Total Units"
                  name="totalUnits"
                  type="number"
                  value={formData.totalUnits}
                  onChange={handleInputChange}
                  min="1"
                  error={errors.totalUnits}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Street Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g., KN 5 Ave"
                  error={errors.address}
                  required
                />

                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Kigali"
                  error={errors.city}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label">
                Property Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`input ${errors.description ? 'input-error' : ''}`}
                placeholder="Describe your property, nearby amenities, and what makes it special..."
                required
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                Pricing (RWF)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Minimum Monthly Rent"
                  name="monthlyRentMin"
                  type="number"
                  value={formData.monthlyRentMin}
                  onChange={handleInputChange}
                  min="0"
                  error={errors.monthlyRentMin}
                  helperText="Starting price for the cheapest unit"
                  required
                />

                <Input
                  label="Maximum Monthly Rent"
                  name="monthlyRentMax"
                  type="number"
                  value={formData.monthlyRentMax}
                  onChange={handleInputChange}
                  min="0"
                  error={errors.monthlyRentMax}
                  helperText="Price for the most expensive unit"
                  required
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {availableAmenities.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      selectedAmenities.includes(amenity)
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <Input
                label="Available From"
                name="availableFrom"
                type="date"
                value={formData.availableFrom}
                onChange={handleInputChange}
                helperText="When will this property be available for rent?"
              />
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="contact@example.com"
                  error={errors.contactEmail}
                  required
                />

                <Input
                  label="Contact Phone"
                  name="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+250 788 123 456"
                  error={errors.contactPhone}
                  required
                />
              </div>
            </div>

            {/* Images Placeholder */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                Property Images
              </h3>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer">
                <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" aria-hidden="true" />
                <p className="text-sm text-slate-600 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500">PNG, JPG up to 10MB (Coming soon)</p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button type="button" variant="secondary" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {initialData ? 'Update Property' : 'Add Property'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddPropertyModal;
