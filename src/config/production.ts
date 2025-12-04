/**
 * Production configuration
 * All production-specific settings and optimizations
 */

export const PRODUCTION_CONFIG = {
  // Logging
  ENABLE_LOGGING: import.meta.env.MODE === 'development',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'error',
  
  // Performance
  ENABLE_PERFORMANCE_MONITORING: import.meta.env.VITE_ENABLE_PERF === 'true',
  BUNDLE_ANALYZER: import.meta.env.VITE_ANALYZE === 'true',
  
  // Security
  ENABLE_CSP: import.meta.env.VITE_ENABLE_CSP !== 'false',
  SECURE_COOKIES: import.meta.env.NODE_ENV === 'production',
  
  // API
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  MAX_RETRIES: parseInt(import.meta.env.VITE_MAX_RETRIES || '3'),
  
  // Auth
  TOKEN_REFRESH_THRESHOLD: parseInt(import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD || '300'), // 5 minutes
  SESSION_TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600'), // 1 hour
  
  // UI
  ANIMATION_DURATION: parseInt(import.meta.env.VITE_ANIMATION_DURATION || '300'),
  DEBOUNCE_DELAY: parseInt(import.meta.env.VITE_DEBOUNCE_DELAY || '300'),
  
  // Features
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
} as const;

// Environment validation
const requiredEnvVars = [
  'VITE_DASHBOARD_DOMAIN_URL',
] as const;

export const validateEnvironment = (): void => {
  const missing = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Initialize environment validation in production
if (import.meta.env.NODE_ENV === 'production') {
  validateEnvironment();
}