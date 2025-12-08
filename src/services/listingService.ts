import { api } from './api';
import type { Listing, SearchFilters } from '../types/listing.types';

export const listingService = {
  getListings: async (filters?: SearchFilters): Promise<Listing[]> => {
    const { data } = await api.get('/properties', { params: filters });
    return data.data || data;
  },

  getListingById: async (id: string): Promise<Listing> => {
    const { data } = await api.get(`/properties/${id}`);
    return data.data || data;
  },

  createListing: async (listingData: Partial<Listing>): Promise<Listing> => {
    const { data } = await api.post('/properties', listingData);
    return data.data || data;
  },

  updateListing: async (id: string, listingData: Partial<Listing>): Promise<Listing> => {
    const { data } = await api.put(`/properties/${id}`, listingData);
    return data.data || data;
  },

  deleteListing: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },

  searchListings: async (filters: SearchFilters): Promise<Listing[]> => {
    const { data } = await api.get('/properties/search', { params: filters });
    return data.data || data;
  },

  getUniversities: async (): Promise<string[]> => {
    const { data } = await api.get('/properties/universities');
    return data.data || data;
  },

  getLocations: async (): Promise<string[]> => {
    const { data } = await api.get('/properties/locations');
    return data.data || data;
  },
};