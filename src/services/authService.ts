import { api } from './api';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../types/user.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const { data } = await api.post<AuthResponse>('/users/login', credentials);
    // Store token in localStorage
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  },

  register: async (userData: RegisterData): Promise<{ user: User; token: string }> => {
    const { data } = await api.post<AuthResponse>('/users/register', userData);
    // Store token in localStorage
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/users/me');
    return data.data.user;
  },

  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};