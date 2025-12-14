import { api } from './api';
import type { Booking, CreateBookingData, UpdateBookingData } from '../types/booking.types';

export const bookingService = {
  // Create a new booking (student only)
  createBooking: async (bookingData: CreateBookingData): Promise<Booking> => {
    const { data } = await api.post('/bookings', bookingData);
    return data.data || data;
  },

  // Get all bookings for the logged-in student
  getMyBookings: async (): Promise<Booking[]> => {
    const { data } = await api.get('/bookings/my-bookings');
    return data.data || data;
  },

  // Get a single booking by ID
  getBookingById: async (id: string): Promise<Booking> => {
    const { data } = await api.get(`/bookings/${id}`);
    return data.data || data;
  },

  // Update a booking
  updateBooking: async (id: string, bookingData: UpdateBookingData): Promise<Booking> => {
    const { data } = await api.put(`/bookings/${id}`, bookingData);
    return data.data || data;
  },

  // Cancel a booking
  cancelBooking: async (id: string): Promise<Booking> => {
    const { data } = await api.patch(`/bookings/${id}/cancel`);
    return data.data || data;
  },

  // Delete a booking
  deleteBooking: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },

  // Get all bookings for landlord's properties
  getLandlordBookings: async (): Promise<Booking[]> => {
    const { data } = await api.get('/bookings/landlord/bookings');
    return data.data || data;
  },

  // Confirm a booking (landlord only)
  confirmBooking: async (id: string): Promise<Booking> => {
    const { data } = await api.patch(`/bookings/${id}/confirm`);
    return data.data || data;
  },

  // Reject a booking (landlord only)
  rejectBooking: async (id: string): Promise<Booking> => {
    const { data } = await api.patch(`/bookings/${id}/reject`);
    return data.data || data;
  },
};
