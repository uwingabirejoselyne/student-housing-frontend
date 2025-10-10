import { api } from './api';
import type { Listing, SearchFilters } from '../types/listing.types';

export const listingService = {
  getListings: async (filters?: SearchFilters): Promise<Listing[]> => {
    const { data } = await api.get('/listings', { params: filters });
    return data;
  },

  getListingById: async (id: string): Promise<Listing> => {
    const { data } = await api.get(`/listings/${id}`);
    return data;
  },

  createListing: async (listingData: Partial<Listing>): Promise<Listing> => {
    const { data } = await api.post('/listings', listingData);
    return data;
  },

  updateListing: async (id: string, listingData: Partial<Listing>): Promise<Listing> => {
    const { data } = await api.put(`/listings/${id}`, listingData);
    return data;
  },

  deleteListing: async (id: string): Promise<void> => {
    await api.delete(`/listings/${id}`);
  },

  searchListings: async (query: string): Promise<Listing[]> => {
    const { data } = await api.get('/listings/search', { params: { q: query } });
    return data;
  },
};