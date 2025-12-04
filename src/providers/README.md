# AuthProvider

A comprehensive authentication provider that wraps your React app with authentication logic.

## Features

- **Centralized Auth State** - Single source of truth for authentication
- **Firebase Integration** - Support for Firebase authentication
- **JWT Token Management** - Automatic token validation and refresh
- **Role-based Access** - Built-in role checking and admin detection
- **Auto-logout** - Handles token expiration and cross-tab logout
- **Local Storage Sync** - Syncs auth state across browser tabs
- **Type Safety** - Full TypeScript support

## Setup

1. Wrap your app with the AuthProvider:

```tsx
import { AuthProvider } from '@/providers/AuthProvider';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

## Usage

Use the `useAuthContext` hook in any component:

```tsx
import { useAuthContext } from '@/providers/AuthProvider';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout,
    isAdmin,
    hasRole 
  } = useAuthContext();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return (
      <button onClick={() => login('email', 'password')}>
        Login
      </button>
    );
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      {isAdmin() && <p>You are an admin</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## API Reference

### State

- `user: User | null` - Current authenticated user
- `isAuthenticated: boolean` - Whether user is logged in
- `isLoading: boolean` - Whether auth operation is in progress

### Methods

- `login(email, password)` - Login with email/password
- `loginWithFirebase(firebaseUser)` - Login with Firebase
- `register(email, password, fullName)` - Register new user
- `registerWithFirebase(firebaseUser, name?)` - Register with Firebase
- `logout()` - Logout current user
- `updateUserRole(role)` - Update user's role
- `refreshAuthState()` - Manually refresh auth state

### Utilities

- `getToken()` - Get current JWT token
- `isAdmin()` - Check if user is admin
- `hasRole(role)` - Check if user has specific role
- `getUserId()` - Get current user ID

## Events

The AuthProvider dispatches the following events:

- `roleUpdated` - When user role is updated
- `app:logout` - When user logs out

## Token Management

- Automatically validates JWT tokens on app load
- Clears expired tokens and logs out user
- Stores tokens securely in localStorage
- Syncs token state across browser tabs

## Role-based Access

```tsx
const { hasRole, isAdmin } = useAuthContext();

// Check specific role
if (hasRole('founder')) {
  // Show founder-specific content
}

// Check admin status
if (isAdmin()) {
  // Show admin controls
}
```

## Error Handling

All auth methods return a standardized response:

```tsx
const result = await login(email, password);
if (result.error) {
  console.error('Login failed:', result.error.message);
} else {
  console.log('Login successful:', result.data);
}
```