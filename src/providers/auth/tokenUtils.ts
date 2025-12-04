import { decodeJWT } from '@/utils/jwtUtils';
import { logger } from '@/utils/logger';
import { STORAGE_KEYS } from './constants';
import type { JWTPayload } from './types';

/**
 * Get token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Decode email from JWT token
 */
export const getEmailFromToken = (token: string): string | null => {
  try {
    const payload: JWTPayload = decodeJWT(token);
    return payload?.sub || null;
  } catch (error) {
    logger.error('[TOKEN] Failed to decode JWT token:', error);
    return null;
  }
};

/**
 * Clear all auth-related data from localStorage
 */
export const clearAuthStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  logger.debug('[TOKEN] Cleared all auth storage');
};