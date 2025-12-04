/**
 * Centralized exports for all providers
 * This file provides clean imports for the entire provider system
 */

// Auth Provider
export { SimpleAuthProvider, useSimpleAuth, SimpleAuthContext } from './SimpleAuthProvider';

// Auth utilities
export * from './auth';

// Re-export types for external use
export type { 
  SimpleAuthContextType, 
  SimpleAuthProviderProps,
  JWTPayload,
  RedirectConfig 
} from './auth/types';