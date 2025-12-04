/**
 * Google Analytics 4 (GA4) Analytics Service
 * Comprehensive tracking for user behavior, page views, and custom events
 */

import { logger } from '@/utils/logger';

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export interface GA4Event {
  event_name: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface PageViewEvent {
  page_title: string;
  page_location: string;
  page_path?: string;
  content_group1?: string; // Section (e.g., 'pitch-tank', 'home', 'auth')
  content_group2?: string; // Subsection (e.g., 'form', 'landing')
}

export interface UserEngagementEvent {
  engagement_time_msec?: number;
  session_id?: string;
  user_id?: string;
  user_type?: 'new' | 'returning' | 'authenticated';
}

class GA4AnalyticsService {
  private measurementId: string = 'G-HE0NKZDYD0';
  private isInitialized: boolean = false;

  constructor() {
    this.initializeGA4();
  }

  /**
   * Initialize GA4 if not already done
   */
  private initializeGA4(): void {
    if (typeof window === 'undefined') return;

    // Check if gtag is available
    if (typeof window.gtag === 'function') {
      this.isInitialized = true;
      return;
    }

    // Wait for gtag to load
    const checkGtag = () => {
      if (typeof window.gtag === 'function') {
        this.isInitialized = true;
      } else {
        setTimeout(checkGtag, 100);
      }
    };
    checkGtag();
  }

  /**
   * Track page view with enhanced parameters
   */
  trackPageView(pageData: PageViewEvent): void {
    if (!this.isInitialized || typeof window.gtag !== 'function') {
      logger.warn('[GA4] Not initialized, skipping page view tracking');
      return;
    }

    try {
      window.gtag('event', 'page_view', {
        page_title: pageData.page_title,
        page_location: pageData.page_location,
        page_path: pageData.page_path || window.location.pathname,
        content_group1: pageData.content_group1,
        content_group2: pageData.content_group2,
        send_page_view: true
      });

      logger.debug('[GA4] Page view tracked:', pageData);
    } catch (error) {
      logger.error('[GA4] Error tracking page view:', error);
    }
  }

  /**
   * Track custom events
   */
  trackEvent(eventData: GA4Event): void {
    if (!this.isInitialized || typeof window.gtag !== 'function') {
      logger.warn('[GA4] Not initialized, skipping event tracking');
      return;
    }

    try {
      const eventParams: Record<string, any> = {
        event_category: eventData.event_category,
        event_label: eventData.event_label,
        value: eventData.value,
        ...eventData.custom_parameters
      };

      // Remove undefined values
      Object.keys(eventParams).forEach(key => {
        if (eventParams[key] === undefined) {
          delete eventParams[key];
        }
      });

      window.gtag('event', eventData.event_name, eventParams);
      logger.debug('[GA4] Event tracked:', eventData);
    } catch (error) {
      logger.error('[GA4] Error tracking event:', error);
    }
  }

  /**
   * Track user engagement events
   */
  trackUserEngagement(engagementData: UserEngagementEvent & GA4Event): void {
    this.trackEvent({
      ...engagementData,
      custom_parameters: {
        ...engagementData.custom_parameters,
        engagement_time_msec: engagementData.engagement_time_msec,
        session_id: engagementData.session_id,
        user_id: engagementData.user_id,
        user_type: engagementData.user_type
      }
    });
  }

  /**
   * Track form interactions
   */
  trackFormEvent(
    formName: string,
    action: 'start' | 'complete' | 'abandon' | 'error',
    step?: string,
    additionalData?: Record<string, any>
  ): void {
    this.trackEvent({
      event_name: 'form_interaction',
      event_category: 'form',
      event_label: `${formName}_${action}`,
      custom_parameters: {
        form_name: formName,
        form_action: action,
        form_step: step,
        ...additionalData
      }
    });
  }

  /**
   * Track button clicks and CTA interactions
   */
  trackButtonClick(
    buttonName: string,
    location: string,
    additionalData?: Record<string, any>
  ): void {
    this.trackEvent({
      event_name: 'button_click',
      event_category: 'engagement',
      event_label: buttonName,
      custom_parameters: {
        button_name: buttonName,
        button_location: location,
        ...additionalData
      }
    });
  }

  /**
   * Track navigation events
   */
  trackNavigation(
    fromPage: string,
    toPage: string,
    navigationType: 'internal' | 'external' | 'back' | 'forward'
  ): void {
    this.trackEvent({
      event_name: 'navigation',
      event_category: 'user_journey',
      event_label: `${fromPage}_to_${toPage}`,
      custom_parameters: {
        from_page: fromPage,
        to_page: toPage,
        navigation_type: navigationType
      }
    });
  }

  /**
   * Track pitch tank specific events
   */
  trackPitchTankEvent(
    eventType: 'landing_view' | 'form_start' | 'form_progress' | 'form_submit' | 'form_complete' | 'form_abandon',
    step?: string,
    additionalData?: Record<string, any>
  ): void {
    this.trackEvent({
      event_name: 'pitch_tank_interaction',
      event_category: 'pitch_tank',
      event_label: eventType,
      custom_parameters: {
        pitch_tank_event: eventType,
        pitch_tank_step: step,
        ...additionalData
      }
    });
  }

  /**
   * Track user session data
   */
  setUserProperties(userId?: string, userType?: string, additionalProperties?: Record<string, any>): void {
    if (!this.isInitialized || typeof window.gtag !== 'function') {
      logger.warn('[GA4] Not initialized, skipping user properties');
      return;
    }

    try {
      // Set user properties using the correct gtag format
      if (userId) {
        window.gtag('config', this.measurementId, {
          user_id: userId,
          user_type: userType,
          ...additionalProperties
        });
      }
      logger.debug('[GA4] User properties set:', { userId, userType, ...additionalProperties });
    } catch (error) {
      logger.error('[GA4] Error setting user properties:', error);
    }
  }

  /**
   * Track conversion events
   */
  trackConversion(
    conversionType: string,
    value?: number,
    currency?: string,
    additionalData?: Record<string, any>
  ): void {
    this.trackEvent({
      event_name: 'conversion',
      event_category: 'conversion',
      event_label: conversionType,
      value: value,
      custom_parameters: {
        conversion_type: conversionType,
        currency: currency || 'USD',
        ...additionalData
      }
    });
  }

  /**
   * Track errors and exceptions
   */
  trackError(
    errorType: string,
    errorMessage: string,
    errorLocation?: string,
    additionalData?: Record<string, any>
  ): void {
    this.trackEvent({
      event_name: 'exception',
      event_category: 'error',
      event_label: errorType,
      custom_parameters: {
        error_type: errorType,
        error_message: errorMessage,
        error_location: errorLocation,
        fatal: false,
        ...additionalData
      }
    });
  }

  /**
   * Get current page data for tracking
   */
  getCurrentPageData(): PageViewEvent {
    return {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      content_group1: this.getContentGroup1(),
      content_group2: this.getContentGroup2()
    };
  }

  /**
   * Determine content group 1 based on current path
   */
  private getContentGroup1(): string {
    const path = window.location.pathname;
    
    if (path === '/' || path === '/home') return 'home';
    if (path.includes('/pitch-tank')) return 'pitch-tank';
    if (path.includes('/auth') || path.includes('/login') || path.includes('/signup')) return 'auth';
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/startup')) return 'startup';
    if (path.includes('/network')) return 'network';
    
    return 'other';
  }

  /**
   * Determine content group 2 based on current path
   */
  private getContentGroup2(): string {
    const path = window.location.pathname;
    
    if (path === '/pitch-tank') return 'landing';
    if (path === '/pitch-tank-form') return 'form';
    if (path.includes('/pitch-tank-form/')) return 'form-step';
    if (path.includes('/auth/login')) return 'login';
    if (path.includes('/auth/signup')) return 'signup';
    if (path.includes('/auth/forgot-password')) return 'forgot-password';
    
    return 'main';
  }

  /**
   * Check if GA4 is ready
   */
  isReady(): boolean {
    return this.isInitialized && typeof window.gtag === 'function';
  }
}

// Create singleton instance
export const ga4Analytics = new GA4AnalyticsService();

// Export types and service
export default ga4Analytics;
