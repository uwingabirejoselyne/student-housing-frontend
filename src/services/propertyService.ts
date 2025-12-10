import { api, publicApi } from './api';
import type { Property, CreatePropertyData } from '../types/property.types';

export const propertyService = {
  // Create a new property (landlord only)
  createProperty: async (propertyData: CreatePropertyData): Promise<Property> => {
    const { data } = await api.post('/properties', propertyData);
    return data.data || data;
  },

  // Get all properties for the logged-in landlord
  getLandlordProperties: async (): Promise<Property[]> => {
    const { data } = await api.get('/properties');
    return data.data || data;
  },

  // Get a single property by ID (public endpoint)
  getPropertyById: async (id: string): Promise<Property> => {
    const { data } = await publicApi.get(`/properties/public/${id}`);
    return data.data || data;
  },

  // Update a property
  updateProperty: async (id: string, propertyData: Partial<CreatePropertyData>): Promise<Property> => {
    const { data } = await api.put(`/properties/${id}`, propertyData);
    return data.data || data;
  },

  // Delete a property
  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },

  // Get all active properties (public - for students to browse)
  getAllProperties: async (): Promise<Property[]> => {
    const { data } = await publicApi.get('/properties/all');
    return data.data || data;
  },
};
