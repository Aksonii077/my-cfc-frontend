/**
 * Custom error classes for auth-related errors
 */

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class TokenError extends AuthError {
  constructor(message: string) {
    super(message, 'TOKEN_ERROR');
    this.name = 'TokenError';
  }
}

export class UserNotFoundError extends AuthError {
  constructor(message: string) {
    super(message, 'USER_NOT_FOUND');
    this.name = 'UserNotFoundError';
  }
}

export class NetworkError extends AuthError {
  constructor(message: string, public originalError?: Error) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}