import { createContext, useEffect, useState, useCallback } from 'react';
import { checkUserExists, type UserCheckResponse } from '@/services/userService';
import { useUserStore } from '@/stores/userStore';
import { getToken, getEmailFromToken, clearAuthStorage } from './auth/tokenUtils';
import { authLogger } from './auth/logger';
import type { SimpleAuthContextType, SimpleAuthProviderProps } from './auth/types';

// Create the context
const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

// Main SimpleAuthProvider component
export function SimpleAuthProvider({ children }: SimpleAuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Get user store actions and user data
  const { setUser, clearUser, user } = useUserStore();

  // Function to logout user
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Call backend to clear httpOnly cookie
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002'}/auth/google/logout`, {
        method: 'POST',
        credentials: 'include', // Send cookie to be cleared
      });
    } catch (error) {
      authLogger.error('Error calling logout endpoint:', error);
    }
    
    clearAuthStorage();
    clearUser();
    setIsAuthenticated(false);
    authLogger.info('User logged out');
    window.dispatchEvent(new CustomEvent('app:logout'));
  }, [clearUser]);

  // Function to check authentication state
  const checkAuthState = useCallback(async (): Promise<void> => {
    authLogger.info('Starting authentication check');
    setIsLoading(true);
    
    try {
      const token = getToken();
      if (!token) {
        authLogger.info('No token found');
        setIsAuthenticated(false);
        clearUser();
        return;
      }

      const email = getEmailFromToken(token);
      if (!email) {
        authLogger.error('Invalid token format');
        logout();
        return;
      }

      authLogger.info('Validating user credentials');
      const userResponse: UserCheckResponse = await checkUserExists(email);
      
      if (userResponse.exists && userResponse.user) {
        const userData = {
          id: userResponse.user.user_id,
          email: userResponse.user.email,
          name: userResponse.user.full_name,
          role: userResponse.user.role as 'user' | 'admin' | 'founder' | 'investor' | 'mentor',
          createdAt: userResponse.user.created_at,
          updatedAt: userResponse.user.updated_at,
          onboardingStep: userResponse.user.onboarding_step,
          isOnboarded: userResponse.user.is_onboarded || false,
          onboardingData: userResponse.user.onboarding_data,
        };

        setUser(userData);
        setIsAuthenticated(true);
        authLogger.success('User authenticated successfully');
      } else {
        authLogger.error('User validation failed');
        logout();
      }
    } catch (error) {
      authLogger.error('Authentication check failed:', error);
      logout();
    } finally {
      setIsLoading(false);
      authLogger.info('Authentication check completed');
    }
  }, [setUser, clearUser, logout]);

  // Check auth state on mount
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  // Listen for storage changes (logout in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        authLogger.info('Token removed in another session');
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [logout]);

  // Check for signout query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('signout') === 'true') {
      authLogger.info('Signout query parameter detected');
      logout();
      // Remove the signout parameter from the URL
      urlParams.delete('signout');
      const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [logout]);

  const contextValue: SimpleAuthContextType = {
    isLoading,
    isAuthenticated,
    user,
    logout,
    checkAuthState,
  };

  return (
    <SimpleAuthContext.Provider value={contextValue}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

// Export the context for direct access if needed
export { SimpleAuthContext };

// Re-export the hook from the auth module
export { useSimpleAuth } from './auth/hooks';