/**
 * Production-ready analytics utilities using GA4
 * Replaces basic console logging with proper GA4 tracking
 */

import { ga4Analytics } from '@/services/ga4AnalyticsService';
import { logger } from './logger';

/**
 * Track onboarding field edits
 */
export function trackOnboardingFieldEdit(field: string, hasValue: boolean): void {
  ga4Analytics.trackEvent({
    event_name: 'onboarding_field_edit',
    event_category: 'onboarding',
    event_label: field,
    custom_parameters: {
      field_name: field,
      has_value: hasValue,
      form_type: 'onboarding'
    }
  });
}

/**
 * Track general events with GA4
 */
export function trackEvent(eventName: string, properties: Record<string, any> = {}): void {
  try {
    ga4Analytics.trackEvent({
      event_name: eventName,
      event_category: properties.category || 'general',
      event_label: properties.label,
      value: properties.value,
      custom_parameters: properties
    });
  } catch (error) {
    logger.error('[ANALYTICS] Error tracking event:', error);
  }
}

/**
 * Track onboarding start
 */
export function trackOnboardingStart(userId: string, role: string): void {
  ga4Analytics.trackEvent({
    event_name: 'onboarding_start',
    event_category: 'onboarding',
    event_label: role,
    custom_parameters: {
      user_id: userId,
      selected_role: role,
      onboarding_version: '2.0'
    }
  });

  // Set user properties for better segmentation
  ga4Analytics.setUserProperties(userId, 'onboarding', {
    selected_role: role,
    onboarding_started_at: new Date().toISOString()
  });
}

/**
 * Track onboarding step views
 */
export function trackOnboardingStepView(stepNumber: number, stepName: string): void {
  ga4Analytics.trackEvent({
    event_name: 'onboarding_step_view',
    event_category: 'onboarding',
    event_label: stepName,
    custom_parameters: {
      step_number: stepNumber,
      step_name: stepName,
      funnel_step: `step_${stepNumber}`
    }
  });
}

/**
 * Track onboarding step completion
 */
export function trackOnboardingStepComplete(stepNumber: number, stepName: string, timeSpent: number): void {
  ga4Analytics.trackEvent({
    event_name: 'onboarding_step_complete',
    event_category: 'onboarding',
    event_label: stepName,
    value: timeSpent,
    custom_parameters: {
      step_number: stepNumber,
      step_name: stepName,
      time_spent_seconds: timeSpent,
      funnel_step: `step_${stepNumber}_complete`
    }
  });
}

/**
 * Track dashboard section selection
 */
export function trackDashboardSectionSelect(section: string): void {
  ga4Analytics.trackEvent({
    event_name: 'dashboard_section_select',
    event_category: 'navigation',
    event_label: section,
    custom_parameters: {
      section_name: section,
      interaction_type: 'selection'
    }
  });
}

/**
 * Track onboarding completion
 */
export function trackOnboardingComplete(totalTime: number, completedSteps: number, selectedSection: string): void {
  ga4Analytics.trackConversion('onboarding_complete', totalTime, 'USD', {
    total_time_seconds: totalTime,
    completed_steps: completedSteps,
    selected_section: selectedSection,
    conversion_funnel: 'onboarding'
  });

  ga4Analytics.trackEvent({
    event_name: 'onboarding_complete',
    event_category: 'onboarding',
    event_label: 'success',
    value: totalTime,
    custom_parameters: {
      total_time_seconds: totalTime,
      completed_steps_count: completedSteps,
      final_selected_section: selectedSection,
      completion_rate: (completedSteps / 5) * 100 // Assuming 5 total steps
    }
  });
}