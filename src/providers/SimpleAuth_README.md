# Simplified Authentication Flow

A streamlined authentication system that checks for JWT tokens on app load and fetches user details via API.

## Flow Overview

1. **Token Check** - Check if JWT token exists in localStorage
2. **Email Extraction** - Decode JWT token to get user email
3. **User Verification** - Call check-user API with email
4. **Store User Data** - Save user details in Zustand store
5. **Authentication Complete** - User is now authenticated

## Architecture

```
App Load → SimpleAuthProvider → Token Check → JWT Decode → API Call → Zustand Store
```

### Components

- **SimpleAuthProvider** - Main authentication wrapper
- **useUserStore** - Zustand store for user data
- **checkUserExists** - API service to verify user
- **JWT Utils** - Token decoding utilities

## Setup

1. **Wrap your app:**

```tsx
import { SimpleAuthProvider } from '@/providers/SimpleAuthProvider';

function App() {
  return (
    <SimpleAuthProvider>
      {/* Your app */}
    </SimpleAuthProvider>
  );
}
```

2. **Use authentication state:**

```tsx
import { useSimpleAuth } from '@/providers/SimpleAuthProvider';
import { useUserStore } from '@/stores/userStore';

function MyComponent() {
  const { isLoading, isAuthenticated, logout } = useSimpleAuth();
  const { user, isAdmin } = useUserStore();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;
  
  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      {isAdmin() && <p>Admin privileges</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## API Requirements

### JWT Token
Must contain `email` field in payload:
```json
{
  "email": "user@example.com",
  "user_id": "123",
  "exp": 1234567890
}
```

### Check User API
Endpoint: `GET /api/check-user?email={email}`

Response format:
```json
{
  "exists": true,
  "message": "User found",
  "user": {
    "user_id": "123",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "founder",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "onboarding_step": "completed",
    "is_onboarded": true,
    "onboarding_data": {}
  }
}
```

## User Store API

### State
- `user: User | null` - Current user data
- `isAuthenticated: boolean` - Auth status

### Actions
- `setUser(user)` - Set user data
- `updateUser(updates)` - Update user partially
- `clearUser()` - Clear user data

### Getters
- `isAdmin()` - Check if admin
- `hasRole(role)` - Check specific role
- `getUserId()` - Get user ID
- `getUserEmail()` - Get user email
- `getUserName()` - Get user name

## Authentication Events

- `app:logout` - Fired when user logs out
- Cross-tab logout synchronization via storage events

## Benefits

✅ **Simple & Clean** - Single responsibility principle  
✅ **Fast Loading** - Immediate token validation  
✅ **Type Safe** - Full TypeScript support  
✅ **Reliable** - Error handling and fallbacks  
✅ **Scalable** - Easy to extend and modify  

## Migration from Complex Auth

This simplified flow replaces:
- ❌ Firebase authentication complexity
- ❌ Multiple login/register methods
- ❌ Profile management
- ❌ Role update API calls
- ❌ Complex state management

Now you have:
- ✅ Single token-based authentication
- ✅ Automatic user data fetching
- ✅ Simple Zustand store
- ✅ Clean separation of concerns