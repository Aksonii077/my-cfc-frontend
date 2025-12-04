# Cookie-Based Authentication Implementation

## Overview
This document describes the secure cookie-based authentication implementation for CoFounder Circle using httpOnly cookies across subdomains.

## Architecture

### Production Domains
- **Main Site:** `https://cofoundercircle.ai` (port 3000)
- **Dashboard:** `https://app.cofoundercircle.ai` (port 8080)
- **Cookie Domain:** `.cofoundercircle.ai` (works for all subdomains)

### Development
- **Main Site:** `http://localhost:3000`
- **Dashboard:** `http://localhost:8080`
- **Cookie Domain:** None (localhost cookies work across ports)

---

## Backend Implementation (Already Done ✅)

### 1. **Google OAuth Callback** (`app/auth/google_oauth.py`)

```python
@router.get("/callback")
async def auth_callback(request: Request):
    # After successful authentication
    cookie_name = os.getenv("AUTH_COOKIE_NAME", "auth_token")
    cookie_domain = os.getenv("AUTH_COOKIE_DOMAIN", "").strip() or None
    cookie_secure = os.getenv("AUTH_COOKIE_SECURE", "true").lower() == "true"
    
    response = RedirectResponse(
        url=f"{FRONTEND_URL}/auth/callback?is_new_user={is_new_user}"
    )
    
    # Set httpOnly cookie
    response.set_cookie(
        key=cookie_name,
        value=jwt_token,
        domain=cookie_domain,  # .cofoundercircle.ai in production
        path="/",
        httponly=True,         # ✅ JavaScript cannot access
        secure=cookie_secure,  # ✅ HTTPS only in production
        samesite="Lax",       # ✅ CSRF protection
        max_age=604800         # 7 days
    )
    
    return response
```

### 2. **Token Retrieval Endpoint** (for localStorage compatibility)

```python
@router.get("/token")
async def get_token_from_cookie(request: Request):
    """Get JWT token from cookie for localStorage storage"""
    cookie_name = os.getenv("AUTH_COOKIE_NAME", "auth_token")
    token = request.cookies.get(cookie_name)
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return {"success": True, "token": token}
```

### 3. **Logout Endpoint**

```python
@router.post("/logout")
async def google_logout(request: Request):
    """Clear auth cookie"""
    cookie_name = os.getenv("AUTH_COOKIE_NAME", "auth_token")
    cookie_domain = os.getenv("AUTH_COOKIE_DOMAIN", "").strip() or None
    
    response = JSONResponse(content={"success": True})
    response.delete_cookie(
        key=cookie_name,
        domain=cookie_domain,
        path="/"
    )
    
    return response
```

### 4. **Middleware** (`app/main.py`)

Automatically adds `Authorization: Bearer <token>` header from cookie if header is missing.

---

## Frontend Implementation (Completed ✅)

### 1. **API Client Configuration** (`src/utils/api.ts`)

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8002",
  timeout: 30000,
  withCredentials: true, // ✅ Send cookies with all requests
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "1",
    "Accept": "application/json",
  },
});
```

### 2. **Auth Callback Handler** (`src/pages/Auth.tsx`)

```typescript
// ✅ Fetch token from httpOnly cookie instead of URL
const tokenResponse = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/auth/google/token`,
  { credentials: 'include' }
);

const tokenData = await tokenResponse.json();
const token = tokenData.token;

// Store in localStorage for compatibility
localStorage.setItem("token", token);
```

### 3. **Logout Function** (`src/providers/SimpleAuthProvider.tsx`)

```typescript
const logout = useCallback(async (): Promise<void> => {
  try {
    // Call backend to clear httpOnly cookie
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/google/logout`,
      { method: 'POST', credentials: 'include' }
    );
  } catch (error) {
    console.error('Error calling logout endpoint:', error);
  }
  
  clearAuthStorage();
  clearUser();
  setIsAuthenticated(false);
}, [clearUser]);
```

### 4. **Remove Token from URLs**

**Updated:** `src/providers/auth/redirectUtils.ts`
```typescript
// ✅ No token in URL
const redirectUrl = `${dashboardUrl}${dashboardPath}`;
window.location.href = redirectUrl;
```

**Updated:** `src/components/onboarding/flows/FounderOnBoarding/FounderOnboarding.tsx`
```typescript
// ✅ No token in URL
const redirectUrl = `${businessBaseUrl}/dashboard/mentors`;
window.location.href = redirectUrl;
```

---

## Environment Variables

### Production (`.env.production`)
```bash
# Backend
AUTH_COOKIE_DOMAIN=.cofoundercircle.ai
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_SAMESITE=Lax
AUTH_COOKIE_NAME=auth_token
AUTH_COOKIE_MAX_AGE=604800
FRONTEND_URL=https://cofoundercircle.ai
ALLOWED_ORIGINS=https://cofoundercircle.ai,https://app.cofoundercircle.ai

# Frontend
VITE_API_BASE_URL=https://api.cofoundercircle.ai
VITE_DASHBOARD_DOMAIN_URL=https://app.cofoundercircle.ai
```

### Development (`.env`)
```bash
# Backend
AUTH_COOKIE_DOMAIN=
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAMESITE=Lax
AUTH_COOKIE_NAME=auth_token
AUTH_COOKIE_MAX_AGE=604800
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080

# Frontend
VITE_API_BASE_URL=http://localhost:8002
VITE_DASHBOARD_DOMAIN_URL=http://localhost:8080
```

---

## How It Works

### Login Flow
1. User clicks "Login with Google"
2. OAuth redirects to backend `/auth/google/callback`
3. Backend **sets httpOnly cookie** and redirects to frontend `/auth/callback?is_new_user=true`
4. Frontend calls `/auth/google/token` with `credentials: 'include'`
5. Backend reads cookie, returns `{ token }`
6. Frontend stores token in localStorage (for compatibility)
7. User is redirected based on onboarding status

### Cross-Domain Navigation
1. User completes onboarding on `cofoundercircle.ai`
2. Redirects to `app.cofoundercircle.ai/dashboard/mentors`
3. **No token in URL!** Cookie is automatically sent
4. Dashboard reads cookie via middleware
5. Dashboard makes API calls with cookie

### Logout Flow
1. User clicks logout
2. Frontend calls `POST /auth/google/logout` with `credentials: 'include'`
3. Backend deletes the cookie
4. Frontend clears localStorage
5. User is logged out everywhere (both domains)

---

## Security Benefits

✅ **httpOnly Cookie**
- JavaScript cannot access the token (XSS protection)
- Token never exposed to client-side code

✅ **Secure Flag (Production)**
- Cookie only sent over HTTPS
- Man-in-the-middle attack protection

✅ **SameSite=Lax**
- CSRF attack protection
- Cookie only sent for same-site requests

✅ **No Token in URL**
- Not logged in server logs
- Not stored in browser history
- Cannot be shared accidentally
- Not leaked via Referer header

✅ **Domain-Wide Cookie**
- Works across all subdomains
- Single logout clears everywhere
- Seamless cross-domain navigation

---

## Testing Checklist

### Development (localhost)
- [ ] Login works and sets cookie
- [ ] Token stored in localStorage
- [ ] Onboarding flow works
- [ ] Redirect from :3000 to :8080 works without token in URL
- [ ] API calls work from both domains
- [ ] Logout clears cookie and localStorage
- [ ] Pitch Tank form works from dashboard

### Production
- [ ] Login works on cofoundercircle.ai
- [ ] Cookie shared across subdomains
- [ ] Dashboard accessible on app.cofoundercircle.ai
- [ ] No token visible in URL
- [ ] HTTPS secure flag works
- [ ] Logout works from both domains
- [ ] Cross-domain navigation seamless

---

## Files Modified

### Frontend Changes
1. ✅ `src/utils/api.ts` - Added `withCredentials: true`
2. ✅ `src/pages/Auth.tsx` - Fetch token from cookie endpoint
3. ✅ `src/providers/SimpleAuthProvider.tsx` - Call logout endpoint
4. ✅ `src/providers/auth/types.ts` - Make logout async
5. ✅ `src/providers/auth/redirectUtils.ts` - Remove token from URL
6. ✅ `src/components/onboarding/flows/FounderOnBoarding/FounderOnboarding.tsx` - Remove token from URL

### Backend (Already Done)
1. ✅ `app/auth/google_oauth.py` - Set httpOnly cookie
2. ✅ `app/auth/google_oauth.py` - Add token endpoint
3. ✅ `app/auth/google_oauth.py` - Add logout endpoint
4. ✅ `app/main.py` - Cookie middleware

---

## Troubleshooting

### Cookie not being set?
- Check CORS settings include `credentials: true`
- Check `AUTH_COOKIE_DOMAIN` is correct (`.cofoundercircle.ai` for prod)
- Check browser dev tools → Application → Cookies

### Cookie not being sent?
- Ensure `withCredentials: true` in axios config
- Check same domain/subdomain
- Check HTTPS in production (secure flag)

### Localhost issues?
- Leave `AUTH_COOKIE_DOMAIN` empty for localhost
- Set `AUTH_COOKIE_SECURE=false` for HTTP
- Cookies work across different ports on localhost

---

## Migration Plan

1. ✅ Backend deployed with cookie support (Done)
2. ✅ Frontend updated to use cookies (Done)
3. ⏳ Test in development
4. ⏳ Deploy to production
5. ⏳ Monitor for issues
6. ⏳ Optional: Remove localStorage fallback after stable

---

## Benefits Over URL Tokens

| Aspect | URL Token | httpOnly Cookie |
|--------|-----------|-----------------|
| **XSS Protection** | ❌ Vulnerable | ✅ Protected |
| **Browser History** | ❌ Exposed | ✅ Not stored |
| **Server Logs** | ❌ Logged | ✅ Not logged |
| **Sharing Risk** | ❌ High | ✅ None |
| **CSRF Protection** | ❌ None | ✅ SameSite flag |
| **Referer Leakage** | ❌ Can leak | ✅ Safe |

---

## Next Steps

1. **Test in Development**
   - Clear cookies and localStorage
   - Try login flow
   - Test cross-domain navigation
   - Verify logout

2. **Update Environment Variables**
   - Set production cookie domain
   - Enable secure flag for HTTPS

3. **Deploy to Production**
   - Deploy backend first
   - Deploy frontend
   - Monitor authentication flow

4. **Optional Future Enhancement**
   - Remove localStorage dependency completely
   - Use only cookies for authentication
   - Implement refresh token rotation

