import React from 'react';
import { logger } from '@/utils/logger';

// Auth utility functions
export interface UserData {
  id: string;
  email: string;
  name: string;
  picture?: string;
  [key: string]: any;
}

export class AuthManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_DATA_KEY = 'user_data';

  // Store authentication data
  static setAuthData(token: string, userData?: UserData): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    
    if (userData) {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    }

    // Set default axios header if axios is available
    if (window.axios) {
      window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  // Get stored token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get stored user data
  static getUserData(): UserData | null {
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch (error) {
      logger.error('AuthManager: Failed to parse stored user data', error);
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Clear authentication data
  static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);

    // Remove axios header
    if (window.axios?.defaults?.headers?.common) {
      delete window.axios.defaults.headers.common['Authorization'];
    }
  }

  // Initialize auth on app startup
  static initializeAuth(): void {
    const token = this.getToken();
    if (token && window.axios) {
      window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  // Get authorization header for manual requests
  static getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Hook for React components
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(AuthManager.isAuthenticated());
  const [userData, setUserData] = React.useState(AuthManager.getUserData());

  const login = (token: string, userData?: UserData) => {
    AuthManager.setAuthData(token, userData);
    setIsAuthenticated(true);
    setUserData(userData || null);
  };

  const logout = () => {
    AuthManager.clearAuth();
    setIsAuthenticated(false);
    setUserData(null);
  };

  React.useEffect(() => {
    // Listen for auth changes (if you implement auth state management)
    const handleAuthChange = () => {
      setIsAuthenticated(AuthManager.isAuthenticated());
      setUserData(AuthManager.getUserData());
    };

    // You can add event listeners here if needed
    return () => {
      // Cleanup
    };
  }, []);

  return {
    isAuthenticated,
    userData,
    login,
    logout,
    token: AuthManager.getToken(),
  };
};