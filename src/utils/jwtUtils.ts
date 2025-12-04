/**
 * Utility functions for JWT token handling
 */

export interface JWTPayload {
  user_id?: string;
  sub?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export interface FirebaseIDTokenPayload {
  iss?: string;
  aud?: string;
  auth_time?: number;
  user_id?: string;
  sub?: string;
  iat?: number;
  exp?: number;
  email?: string;
  email_verified?: boolean;
  firebase?: {
    identities?: {
      [key: string]: any;
    };
    sign_in_provider?: string;
  };
  [key: string]: any;
}

/**
 * Decode a JWT token and return the payload
 * @param token - The JWT token to decode
 * @returns The decoded payload or null if invalid
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

/**
 * Decode a Firebase ID token and extract user information
 * @param token - The Firebase ID token
 * @returns The decoded Firebase token payload or null if invalid
 */
export function decodeFirebaseIDToken(token: string): FirebaseIDTokenPayload | null {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid Firebase ID token format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding Firebase ID token:', error);
    return null;
  }
}

/**
 * Extract user_id from a JWT token
 * @param token - The JWT token
 * @returns The user_id or null if not found
 */
export function extractUserIdFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  // Check for user_id first, then sub (standard JWT subject field)
  return payload.user_id || payload.sub || null;
}

/**
 * Extract user information from a Firebase ID token
 * @param token - The Firebase ID token
 * @returns Object with user information or null if invalid
 */
export function extractFirebaseUserInfo(token: string): { email?: string; uid?: string; emailVerified?: boolean } | null {
  const payload = decodeFirebaseIDToken(token);
  if (!payload) {
    return null;
  }

  return {
    email: payload.email,
    uid: payload.user_id || payload.sub,
    emailVerified: payload.email_verified
  };
}

/**
 * Check if a JWT token is expired
 * @param token - The JWT token
 * @returns True if expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true; // Consider invalid tokens as expired
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Extract roles from a JWT token
 * @param token - The JWT token
 * @returns Array of roles or empty array if not found
 */
export function extractRolesFromToken(token: string): string[] {
  const payload = decodeJWT(token);
  if (!payload) {
    return [];
  }

  // Check for roles field in the token
  return payload.roles || [];
} 