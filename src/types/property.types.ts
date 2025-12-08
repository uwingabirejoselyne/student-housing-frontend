export interface Property {
  _id: string;
  landlordId: string;
  name: string;
  address: string;
  city: string;
  type: 'hostel' | 'apartment' | 'house' | 'studio';
  totalUnits: number;
  occupiedUnits: number;
  description: string;
  amenities: string[];
  monthlyRentMin: number;
  monthlyRentMax: number;
  availableFrom?: string;
  contactEmail: string;
  contactPhone: string;
  images?: string[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyData {
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
