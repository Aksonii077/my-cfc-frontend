/**
 * React Hook for GA4 Analytics
 * Provides easy integration with GA4 tracking throughout the application
 */

import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ga4Analytics, PageViewEvent, GA4Event, UserEngagementEvent } from '../services/ga4AnalyticsService';

export interface UseGA4AnalyticsOptions {
  trackPageViews?: boolean;
  trackUserEngagement?: boolean;
  userId?: string;
  userType?: 'new' | 'returning' | 'authenticated';
  customPageData?: Partial<PageViewEvent>;
}

export const useGA4Analytics = (options: UseGA4AnalyticsOptions = {}) => {
  const {
    trackPageViews = true,
    trackUserEngagement = true,
    userId,
    userType,
    customPageData = {}
  } = options;

  const location = useLocation();
  const previousPathRef = useRef<string>('');
  const pageStartTimeRef = useRef<number>(Date.now());

  // Track page views on route changes
  useEffect(() => {
    if (!trackPageViews) return;

    const currentPath = location.pathname;
    const previousPath = previousPathRef.current;

    // Track navigation if this is not the first page load
    if (previousPath && previousPath !== currentPath) {
      ga4Analytics.trackNavigation(previousPath, currentPath, 'internal');
    }

    // Track page view
    const pageData: PageViewEvent = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: currentPath,
      content_group1: getContentGroup1(currentPath),
      content_group2: getContentGroup2(currentPath),
      ...customPageData
    };

    ga4Analytics.trackPageView(pageData);

    // Update refs
    previousPathRef.current = currentPath;
    pageStartTimeRef.current = Date.now();

    // Track user engagement if enabled
    if (trackUserEngagement) {
      trackPageEngagement();
    }
  }, [location.pathname, trackPageViews, trackUserEngagement, customPageData]);

  // Track user engagement on page
  const trackPageEngagement = useCallback(() => {
    if (!trackUserEngagement) return;

    const engagementTime = Date.now() - pageStartTimeRef.current;
    
    ga4Analytics.trackUserEngagement({
      event_name: 'page_engagement',
      event_category: 'engagement',
      engagement_time_msec: engagementTime,
      user_id: userId,
      user_type: userType,
      custom_parameters: {
        page_path: location.pathname,
        page_title: document.title
      }
    });
  }, [trackUserEngagement, userId, userType, location.pathname]);

  // Track custom events
  const trackEvent = useCallback((eventData: GA4Event) => {
    ga4Analytics.trackEvent(eventData);
  }, []);

  // Track button clicks
  const trackButtonClick = useCallback((
    buttonName: string,
    location: string,
    additionalData?: Record<string, any>
  ) => {
    ga4Analytics.trackButtonClick(buttonName, location, additionalData);
  }, []);

  // Track form interactions
  const trackFormEvent = useCallback((
    formName: string,
    action: 'start' | 'complete' | 'abandon' | 'error',
    step?: string,
    additionalData?: Record<string, any>
  ) => {
    ga4Analytics.trackFormEvent(formName, action, step, additionalData);
  }, []);

  // Track pitch tank specific events
  const trackPitchTankEvent = useCallback((
    eventType: 'landing_view' | 'form_start' | 'form_progress' | 'form_submit' | 'form_complete' | 'form_abandon',
    step?: string,
    additionalData?: Record<string, any>
  ) => {
    ga4Analytics.trackPitchTankEvent(eventType, step, additionalData);
  }, []);

  // Track conversions
  const trackConversion = useCallback((
    conversionType: string,
    value?: number,
    currency?: string,
    additionalData?: Record<string, any>
  ) => {
    ga4Analytics.trackConversion(conversionType, value, currency, additionalData);
  }, []);

  // Track errors
  const trackError = useCallback((
    errorType: string,
    errorMessage: string,
    errorLocation?: string,
    additionalData?: Record<string, any>
  ) => {
    ga4Analytics.trackError(errorType, errorMessage, errorLocation, additionalData);
  }, []);

  // Set user properties
  const setUserProperties = useCallback((properties: Record<string, any>) => {
    ga4Analytics.setUserProperties(userId, userType, properties);
  }, [userId, userType]);

  // Track page engagement on unmount
  useEffect(() => {
    return () => {
      if (trackUserEngagement) {
        trackPageEngagement();
      }
    };
  }, [trackPageEngagement, trackUserEngagement]);

  return {
    trackEvent,
    trackButtonClick,
    trackFormEvent,
    trackPitchTankEvent,
    trackConversion,
    trackError,
    setUserProperties,
    trackPageEngagement,
    isReady: ga4Analytics.isReady()
  };
};

// Helper functions
const getContentGroup1 = (path: string): string => {
  if (path === '/' || path === '/home') return 'home';
  if (path.includes('/pitch-tank')) return 'pitch-tank';
  if (path.includes('/auth') || path.includes('/login') || path.includes('/signup')) return 'auth';
  if (path.includes('/dashboard')) return 'dashboard';
  if (path.includes('/profile')) return 'profile';
  if (path.includes('/startup')) return 'startup';
  if (path.includes('/network')) return 'network';
  return 'other';
};

const getContentGroup2 = (path: string): string => {
  if (path === '/pitch-tank') return 'landing';
  if (path === '/pitch-tank-form') return 'form';
  if (path.includes('/pitch-tank-form/')) return 'form-step';
  if (path.includes('/auth/login')) return 'login';
  if (path.includes('/auth/signup')) return 'signup';
  if (path.includes('/auth/forgot-password')) return 'forgot-password';
  return 'main';
};

export default useGA4Analytics;
