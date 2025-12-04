# Dashboard Frontend Cookie Authentication Setup

## Problem
When redirecting from `localhost:3000` → `localhost:8080`, the dashboard doesn't have the token in localStorage and redirects back.

## Solution
The dashboard frontend needs to fetch the token from the httpOnly cookie on load.

---

## Implementation Steps

### **Step 1: Update Dashboard API Client**

Find your dashboard's API client configuration (usually `api.ts` or similar):

```typescript
// dashboard/src/utils/api.ts (or wherever your axios instance is)
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8002",
  timeout: 30000,
  withCredentials: true, // ✅ ADD THIS - Send cookies with all requests
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Keep your existing interceptors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

### **Step 2: Create Cookie Auth Hook**

Create a new file in your dashboard:

```typescript
// dashboard/src/hooks/useCookieAuth.ts
import { useEffect, useState } from 'react';

export const useCookieAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeFromCookie = async () => {
      // Skip if already have token
      if (localStorage.getItem('token')) {
        setIsInitialized(true);
        return;
      }

      try {
        // Fetch token from httpOnly cookie
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002'}/auth/google/token`,
          { 
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
          }
        );

        if (response.ok) {
          const data = await response.json();
          
          if (data.token) {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            
            // Fetch and store user data
            const userResponse = await fetch(
              `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002'}/api/auth/me`,
              {
                credentials: 'include',
                headers: {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${data.token}`
                }
              }
            );
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              localStorage.setItem('user', JSON.stringify(userData));
              localStorage.setItem('user_id', userData.id);
              
              console.log('[COOKIE_AUTH] Initialized from cookie successfully');
            }
          }
        } else {
          // No cookie found - redirect to main site
          console.log('[COOKIE_AUTH] No auth cookie found, redirecting to login');
          window.location.href = 'http://localhost:3000/';
          return;
        }
      } catch (error) {
        console.error('[COOKIE_AUTH] Failed to initialize from cookie:', error);
        // Redirect to main site on error
        window.location.href = 'http://localhost:3000/';
        return;
      }
      
      setIsInitialized(true);
    };

    initializeFromCookie();
  }, []);

  return { isInitialized };
};
```

---

### **Step 3: Use Hook in Dashboard App**

Update your dashboard's main App component:

```typescript
// dashboard/src/App.tsx
import { useCookieAuth } from './hooks/useCookieAuth';

function App() {
  const { isInitialized } = useCookieAuth();

  // Show loading while initializing from cookie
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Your existing dashboard code
  return (
    <YourDashboardRoutes />
  );
}
```

---

### **Step 4: Update Dashboard Logout**

```typescript
// dashboard/src/utils/auth.ts or wherever logout is defined
export const logout = async () => {
  try {
    // Call backend to clear cookie
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/google/logout`,
      { 
        method: 'POST', 
        credentials: 'include' 
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  // Clear localStorage
  localStorage.clear();
  
  // Redirect to main site
  window.location.href = 'http://localhost:3000/';
};
```

---

## Summary

### What this fixes:

**Before:**
```
localhost:3000 → localhost:8080
                 ↓ (no token in localStorage)
                 ↓ (redirects back)
                localhost:3000 ❌
```

**After:**
```
localhost:3000 → localhost:8080
                 ↓ (reads cookie)
                 ↓ (gets token)
                 ↓ (stores in localStorage)
                 ✅ Stays on dashboard
```

---

## Testing Steps

1. **Clear everything:**
   - Clear localStorage on both `localhost:3000` and `localhost:8080`
   - Clear all cookies

2. **Login on main site** (`localhost:3000`)
   - Cookie is set by backend

3. **Click "Get Started"**
   - Redirects to `localhost:8080/dashboard/mentors`
   - Dashboard reads cookie
   - Dashboard stores token in localStorage
   - ✅ Dashboard loads successfully!

4. **Navigate between sites**
   - Both sites have access to the cookie
   - Both sites have token in localStorage
   - Seamless navigation!

---

## Key Files to Update in Dashboard

1. ✅ `api.ts` or axios config → Add `withCredentials: true`
2. ✅ Create `hooks/useCookieAuth.ts` → Hook to initialize from cookie
3. ✅ `App.tsx` → Use the hook before rendering
4. ✅ `auth.ts` or logout function → Call logout endpoint

---

## Production Deployment

The same code works in production because:
- Cookie domain is `.cofoundercircle.ai`
- Both `cofoundercircle.ai` and `app.cofoundercircle.ai` share the cookie
- HTTPS + secure flag ensures it's encrypted
- No code changes needed between dev and prod!

---

Would you like me to create the complete hook file that you can copy directly into your dashboard codebase?

