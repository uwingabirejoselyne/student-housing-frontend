export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  district: string;
  university: string;
  images: string[];
  amenities: string[];
  roomType: 'single' | 'shared' | 'studio' | 'apartment';
  availableFrom: string;
  landlordId: string;
  landlordName: string;
  landlordPhone: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface SearchFilters {
  location?: string;
  university?: string;
  minPrice?: number;
  maxPrice?: number;
  roomType?: string[];
  amenities?: string[];
}