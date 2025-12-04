# Cookie Authentication Debugging Guide

## Quick Diagnosis - Run These Commands

### **On localhost:3000 (Main Site) - Browser Console:**

```javascript
// === STEP 1: Check Cookie ===
console.log('🍪 Cookies:', document.cookie);

// === STEP 2: Check localStorage ===
console.log('💾 Token:', localStorage.getItem('token'));
console.log('👤 User:', JSON.parse(localStorage.getItem('user') || '{}'));

// === STEP 3: Test Cookie Endpoint ===
fetch('http://localhost:8002/auth/google/token', {
  credentials: 'include'
})
.then(r => {
  console.log('📡 Response Status:', r.status);
  return r.json();
})
.then(d => console.log('✅ Cookie Endpoint Response:', d))
.catch(e => console.error('❌ Cookie Endpoint Error:', e));
```

---

### **On localhost:8080 (Dashboard) - Browser Console:**

```javascript
// === STEP 1: Check Cookie ===
console.log('🍪 Cookies on Dashboard:', document.cookie);

// === STEP 2: Check localStorage ===
console.log('💾 Dashboard Token:', localStorage.getItem('token'));
console.log('👤 Dashboard User:', localStorage.getItem('user'));

// === STEP 3: Test Cookie Endpoint ===
fetch('http://localhost:8002/auth/google/token', {
  credentials: 'include'
})
.then(r => {
  console.log('📡 Dashboard Response Status:', r.status);
  return r.json();
})
.then(d => console.log('✅ Dashboard Cookie Response:', d))
.catch(e => console.error('❌ Dashboard Cookie Error:', e));
```

---

## Common Issues & Solutions

### **Issue 1: Cookie Not Visible on Dashboard (Different Ports)**

**Symptom:**
- Cookie exists on `localhost:3000`
- Cookie MISSING on `localhost:8080`

**Cause:**
Cookies on localhost with different ports might not share properly depending on browser and backend cookie domain setting.

**Solution:**
Check backend `AUTH_COOKIE_DOMAIN` environment variable:

```bash
# In your backend .env file, it should be:
AUTH_COOKIE_DOMAIN=   # EMPTY for localhost (or comment it out)

# NOT this:
# AUTH_COOKIE_DOMAIN=localhost  # This won't work for different ports
```

**Fix:** Restart backend after changing env variable.

---

### **Issue 2: CORS Not Allowing Credentials**

**Symptom:**
```
Access to fetch at 'http://localhost:8002/auth/google/token' from origin 
'http://localhost:8080' has been blocked by CORS policy
```

**Cause:**
Backend CORS not configured to allow credentials from both origins.

**Solution:**
Backend needs:

```python
# Python/FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8080",  # ✅ Add dashboard
    ],
    allow_credentials=True,  # ✅ CRITICAL
    allow_methods=["*"],
    allow_headers=["*"],
)
```

```javascript
// Node.js/Express
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8080'  // ✅ Add dashboard
  ],
  credentials: true  // ✅ CRITICAL
}));
```

---

### **Issue 3: Dashboard Redirects Before Cookie Auth Initializes**

**Symptom:**
- Briefly see dashboard
- Immediately redirected to main site

**Cause:**
Dashboard's auth check runs before cookie token is fetched.

**Solution:**
Dashboard needs to initialize auth from cookie BEFORE running auth checks.

**In Dashboard codebase:**

```typescript
// dashboard/src/App.tsx
function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Only fetch if no token exists
        if (!localStorage.getItem('token')) {
          console.log('🔄 Dashboard: Fetching token from cookie...');
          
          const res = await fetch('http://localhost:8002/auth/google/token', {
            credentials: 'include'
          });
          
          if (!res.ok) {
            console.error('❌ No auth cookie, redirecting to main site');
            window.location.href = 'http://localhost:3000/';
            return;
          }
          
          const data = await res.json();
          localStorage.setItem('token', data.token);
          
          // Fetch user data
          const userRes = await fetch('http://localhost:8002/api/auth/me', {
            credentials: 'include',
            headers: { 'Authorization': `Bearer ${data.token}` }
          });
          
          const user = await userRes.json();
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('user_id', user.id);
          
          console.log('✅ Dashboard: Auth initialized from cookie');
        } else {
          console.log('✅ Dashboard: Token already in localStorage');
        }
      } catch (error) {
        console.error('❌ Dashboard auth init failed:', error);
        window.location.href = 'http://localhost:3000/';
        return;
      }
      
      setAuthReady(true);
    };

    initAuth();
  }, []);

  if (!authReady) {
    return <div>Loading authentication...</div>;
  }

  return <YourDashboardContent />;
}
```

---

### **Issue 4: Backend Cookie Domain Issues**

**For localhost testing:**

Your backend `.env` should have:

```bash
# Leave EMPTY for localhost
AUTH_COOKIE_DOMAIN=

# OR explicitly set to localhost (no dot prefix)
AUTH_COOKIE_DOMAIN=localhost

# NOT this (won't work for different ports):
# AUTH_COOKIE_DOMAIN=.localhost
```

---

## Debugging Commands

### **Check Backend Cookie Settings:**

```bash
# In your backend directory
grep -E "AUTH_COOKIE|ALLOWED_ORIGINS|CORS" .env
```

### **Test Backend Endpoints Directly:**

```bash
# 1. Login and get cookie (in browser, check Network tab)
# Visit: http://localhost:8002/auth/google/login

# 2. After login, test token endpoint from terminal
curl -v http://localhost:8002/auth/google/token \
  -H "Cookie: auth_token=YOUR_TOKEN_HERE" \
  --cookie-jar cookies.txt

# 3. Test with credentials from browser
# (Run in console of localhost:3000)
fetch('http://localhost:8002/auth/google/token', {
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

---

## Step-by-Step Diagnosis

Run these in order to find the exact issue:

### **Test 1: Is Cookie Set?**
```javascript
// On localhost:3000
console.log('Cookie check:', document.cookie.includes('auth_token'));
// Should be TRUE
```

### **Test 2: Can Dashboard See Cookie?**
```javascript
// On localhost:8080
console.log('Dashboard cookie check:', document.cookie.includes('auth_token'));
// Should be TRUE (if FALSE, cookie domain issue)
```

### **Test 3: Can Dashboard Fetch from Cookie Endpoint?**
```javascript
// On localhost:8080
fetch('http://localhost:8002/auth/google/token', {
  credentials: 'include'
})
.then(r => r.ok ? r.json() : Promise.reject(r))
.then(d => console.log('SUCCESS:', d))
.catch(e => console.error('FAILED:', e));
// Should return { success: true, token: "..." }
```

### **Test 4: Check Network Tab**
1. Open DevTools → Network tab
2. Go to `localhost:8080/dashboard/mentors`
3. Look for redirects
4. Check if any request shows `401 Unauthorized`
5. Check request headers for `Cookie: auth_token=...`

---

## Most Likely Issues:

### **🔥 Issue #1: Cookie Domain (90% chance this is it)**

**Problem:** Backend setting cookie with domain that doesn't work for localhost ports

**Check your backend `.env`:**
```bash
# THIS IS WRONG for localhost:
AUTH_COOKIE_DOMAIN=.localhost

# THIS IS RIGHT for localhost:
AUTH_COOKIE_DOMAIN=
# (leave empty or completely remove the line)
```

**Fix:** Update backend `.env` and restart backend server.

---

### **🔥 Issue #2: Dashboard Not Fetching Token**

**Problem:** Dashboard checks auth before fetching from cookie

**Symptoms:**
- Cookie exists on both domains
- Dashboard immediately redirects
- No fetch to `/auth/google/token` in Network tab

**Fix:** Dashboard needs initialization code (see Issue 3 solution above)

---

### **🔥 Issue #3: CORS Missing Dashboard Origin**

**Problem:** Backend doesn't allow dashboard origin

**Symptom:**
```
CORS error: Access to fetch at 'http://localhost:8002/auth/google/token' 
from origin 'http://localhost:8080' has been blocked
```

**Check backend ALLOWED_ORIGINS:**
```bash
# Should include BOTH:
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

**Fix:** Add `,http://localhost:8080` to ALLOWED_ORIGINS in backend `.env`

---

## Quick Test Flow

1. **Clear everything:**
   ```javascript
   // On BOTH localhost:3000 AND localhost:8080
   localStorage.clear();
   document.cookie.split(";").forEach(c => {
     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
   });
   ```

2. **Login on localhost:3000**

3. **Check cookie on 3000:**
   ```javascript
   console.log('Has auth_token?', document.cookie.includes('auth_token'));
   ```

4. **Manually navigate to 8080:**
   - Type `http://localhost:8080` in address bar
   
5. **Immediately check cookie on 8080:**
   ```javascript
   console.log('Dashboard has auth_token?', document.cookie.includes('auth_token'));
   ```

**If Step 5 returns FALSE:**
→ **Cookie domain issue in backend** (AUTH_COOKIE_DOMAIN should be empty for localhost)

**If Step 5 returns TRUE:**
→ **Dashboard frontend issue** (needs initialization code from cookie)

---

## My Prediction

Based on typical localhost behavior, the issue is likely:

**🎯 Backend `AUTH_COOKIE_DOMAIN` is set incorrectly for localhost.**

**Expected:** `AUTH_COOKIE_DOMAIN=` (empty)  
**Actual:** Probably set to something like `.localhost` or `localhost`

**Why this breaks:**
- Localhost with different ports are treated as different origins
- Cookie domain `.localhost` might not work in all browsers
- Empty domain lets the browser handle it correctly per port

**Fix:**
```bash
# In backend .env
AUTH_COOKIE_DOMAIN=

# Restart backend
```

Then test again!

