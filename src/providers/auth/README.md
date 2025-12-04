# Auth Module

This module provides a simplified authentication system for the application.

## Structure

```
auth/
├── index.ts           # Main exports
├── types.ts           # TypeScript type definitions
├── constants.ts       # Application constants
├── tokenUtils.ts      # JWT token handling utilities
├── redirectUtils.ts   # Redirect logic utilities
├── logger.ts          # Authentication logging utility
├── errors.ts          # Custom error classes
├── hooks.ts           # React hooks
└── README.md          # This file
```

## Usage

### Basic Setup

```tsx
import { SimpleAuthProvider } from '@/providers/SimpleAuthProvider';

function App() {
  return (
    <SimpleAuthProvider>
      {/* Your app content */}
    </SimpleAuthProvider>
  );
}
```

### Using the Auth Hook

```tsx
import { useSimpleAuth } from '@/providers/auth';

function MyComponent() {
  const { isAuthenticated, isLoading, logout, checkAuthState } = useSimpleAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <div>Please log in</div>
      )}
    </div>
  );
}
```

## Features

- **Token Management**: Secure JWT token handling with automatic validation
- **Smart Redirects**: Context-aware redirects based on user role and current location
- **Session Storage**: Support for saved redirect paths
- **External Dashboard Integration**: Seamless redirection to external dashboards for different user roles
- **Cross-tab Logout**: Automatic logout when token is removed in another tab
- **Comprehensive Logging**: Detailed logging for debugging and monitoring
- **Error Handling**: Custom error classes for better error management
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## Configuration

### Environment Variables

- `VITE_DASHBOARD_DOMAIN_URL`: URL for external dashboard redirects

### Storage Keys

The module uses the following localStorage keys:
- `token`: JWT authentication token
- `user`: User data
- `user_id`: User ID
- `userRole`: User role
- `userRoles`: User roles array
- `ai_session_id`: AI session identifier
- `ai_active_idea`: Active AI idea

### Session Storage

- `afterLoginRedirect`: Saved redirect path for post-authentication navigation

## Redirect Logic

The module implements smart redirect logic based on:

1. **Saved Redirect Path**: If a redirect path is saved in session storage, it takes priority
2. **Current Route**: Different behavior based on the current route:
   - `/mentor` → `/mentor-profile`
   - `/pitch-tank` → `/pitch-tank-form`
   - `/` → External dashboard (if onboarded) or `/onboarding`
   - Default → `/pitch-tank-form`

3. **User Role & Onboarding Status**: 
   - Onboarded founders → External founder dashboard
   - Onboarded mentors → External mentor dashboard
   - Non-onboarded users → Onboarding flow

## Error Handling

The module includes custom error classes:

- `AuthError`: Base authentication error
- `TokenError`: JWT token-related errors
- `UserNotFoundError`: User not found in API
- `NetworkError`: Network-related errors

## Logging

The `authLogger` provides context-aware logging with different levels:

- `info()`: General information
- `success()`: Successful operations
- `error()`: Error conditions
- `warn()`: Warning conditions
- `network()`: Network operations