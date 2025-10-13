/**
 * Authentication Context
 * Provides global authentication state management
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData } from '../types/user.types';
import { authService } from '../services/authService';

// Context type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for provider
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 * Wraps the app and provides authentication state
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUserJson = localStorage.getItem('user');
      const storedUser = storedUserJson ? JSON.parse(storedUserJson) : null;
      const token = localStorage.getItem('token');
      const isAuth = !!token;
      
      if (storedUser && isAuth) {
        setUser(storedUser);
        setIsAuthenticated(true);
        
        // Optionally verify token with backend
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          // Token invalid, clear everything
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login function
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register function
   */
  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh user data from backend
   */
  const refreshUser = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

