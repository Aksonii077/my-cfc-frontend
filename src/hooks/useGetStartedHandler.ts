import { useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSimpleAuth } from '@/providers/SimpleAuthProvider';
import { getToken } from '@/providers/auth/tokenUtils';
import { getDefaultRedirectPath } from '@/providers/auth/redirectUtils';
import { ga4Analytics } from '@/services/ga4AnalyticsService';
import { logger } from '@/utils/logger';

export interface GetStartedHandlerReturn {
  handleGetStarted: () => Promise<boolean>;
  isProcessing: boolean;
  isReady: boolean;
  error: string | null;
}

/**
 * Enhanced hook to handle "Get Started" button clicks with better UX
 * Returns true if navigation was handled, false if signup modal should be shown
 */
export function useGetStartedHandler(): GetStartedHandlerReturn {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useSimpleAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetStarted = useCallback(async (): Promise<boolean> => {
    logger.debug('[GET_STARTED] Button clicked, checking auth state');
    
    // Track the get started button click
    ga4Analytics.trackButtonClick('get_started', location.pathname, {
      user_authenticated: isAuthenticated,
      current_path: location.pathname
    });
    
    setIsProcessing(true);
    setError(null);

    try {
      // If still loading, don't handle (fallback to signup modal)
      if (isLoading) {
        logger.debug('[GET_STARTED] Auth loading, showing signup modal');
        return false;
      }

      // Check authentication status
      const token = getToken();
      if (!isAuthenticated || !user || !token) {
        logger.debug('[GET_STARTED] Not authenticated, showing signup modal');
        
        // Track unauthenticated get started attempt
        ga4Analytics.trackEvent({
          event_name: 'get_started_unauthenticated',
          event_category: 'conversion',
          event_label: 'signup_modal_shown',
          custom_parameters: {
            source_page: location.pathname,
            action_taken: 'show_signup_modal'
          }
        });
        
        return false;
      }

      logger.debug('[GET_STARTED] User authenticated, determining redirect', {
        role: user.role,
        isOnboarded: user.isOnboarded,
        currentPath: location.pathname
      });
      
      console.log('🔍 [DEBUG] Get Started - User Details:', {
        role: user.role,
        isOnboarded: user.isOnboarded,
        email: user.email,
        currentPath: location.pathname,
        hasToken: !!token
      });

      // Add small delay for better UX (prevents flash)
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use our existing redirect logic
      const redirectPath = getDefaultRedirectPath({
        currentPath: location.pathname,
        userData: {
          role: user.role,
          isOnboarded: user.isOnboarded
        },
        token
      });

      // If external redirect occurred (returns null)
      if (redirectPath === null) {
        logger.debug('[GET_STARTED] External redirect triggered');
        
        // Track external dashboard redirect
        ga4Analytics.trackNavigation(location.pathname, 'external_dashboard', 'external');
        ga4Analytics.trackConversion('dashboard_redirect', 1, 'USD', {
          user_role: user.role,
          redirect_type: 'external',
          dashboard_type: user.role === 'founder' ? 'race-ai' : 'mentor-demo'
        });
        
        return true;
      }

      // If we have a local redirect path
      if (redirectPath) {
        logger.debug('[GET_STARTED] Navigating to:', redirectPath);
        
        // Track local navigation
        ga4Analytics.trackNavigation(location.pathname, redirectPath, 'internal');
        ga4Analytics.trackEvent({
          event_name: 'get_started_redirect',
          event_category: 'navigation',
          event_label: redirectPath,
          custom_parameters: {
            user_role: user.role,
            is_onboarded: user.isOnboarded,
            redirect_type: 'internal',
            destination_path: redirectPath
          }
        });
        
        navigate(redirectPath);
        return true;
      }

      // Fallback - shouldn't happen with our redirect logic
      logger.warn('[GET_STARTED] No redirect path determined, showing signup modal');
      setError('Unable to determine destination');
      return false;

    } catch (error) {
      logger.error('[GET_STARTED] Error determining redirect:', error);
      setError('An error occurred while processing your request');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [isAuthenticated, isLoading, user, navigate, location.pathname]);

  return { 
    handleGetStarted,
    isProcessing,
    isReady: !isLoading && !isProcessing,
    error
  };
}