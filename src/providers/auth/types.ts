import { ReactNode } from 'react';

// Import User type from store
import type { User } from '@/stores/userStore';

// Define the simplified authentication context type
export interface SimpleAuthContextType {
  // State
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  
  // Methods
  logout: () => Promise<void>;
  checkAuthState: () => Promise<void>;
}

// Auth Provider Props
export interface SimpleAuthProviderProps {
  children: ReactNode;
}

// JWT Payload type
export interface JWTPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

// Redirect configuration
export interface RedirectConfig {
  currentPath: string;
  userData: {
    role: string;
    isOnboarded: boolean;
  };
  token: string | null;
}