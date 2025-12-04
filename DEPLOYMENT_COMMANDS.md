# Deployment Commands for CoFounder Circle Frontend

## Updated Docker Build Command

Use this command to build and push the Docker image with all necessary environment variables:

```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  --build-arg VITE_API_BASE_URL=https://test.api.cofoundercircle.ai \
  --build-arg VITE_AGENT_URL=https://test.agent.cofoundercircle.ai \
  --build-arg VITE_SAAS_APP_URL=https://test.saas.cofoundercircle.ai \
  --build-arg VITE_FRONTEND_URL=https://test.cofoundercircle.ai \
  --build-arg VITE_DASHBOARD_DOMAIN_URL=https://app.cofoundercircle.ai \
  --build-arg VITE_ENABLE_LOGGING=true \
  -t vikaskamwal/cofounder-nectar:test \
  --push .
```

## Changes Made to Fix Auth Callback Issue

### 1. **Auth.tsx** - Added Timeout Protection
- Added 10-second timeout for the `checkUserExists` API call
- Added logic to use the `is_new_user` URL parameter
- If API times out and `is_new_user=True`, redirects directly to `/onboarding`
- Improved error messages for timeout scenarios
- Added explicit check: if user is not onboarded, always redirect to `/onboarding`

### 2. **Dockerfile** - Added Missing Environment Variables
- Added `VITE_FRONTEND_URL` as ARG and ENV
- Added `VITE_DASHBOARD_DOMAIN_URL` as ARG and ENV
- Added `VITE_ENABLE_LOGGING` to enable console logs for debugging

## Deployment Steps

1. **Build and push the new image:**
   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 \
     --build-arg VITE_API_BASE_URL=https://test.api.cofoundercircle.ai \
     --build-arg VITE_AGENT_URL=https://test.agent.cofoundercircle.ai \
     --build-arg VITE_SAAS_APP_URL=https://test.saas.cofoundercircle.ai \
     --build-arg VITE_FRONTEND_URL=https://test.cofoundercircle.ai \
     --build-arg VITE_DASHBOARD_DOMAIN_URL=https://app.cofoundercircle.ai \
     --build-arg VITE_ENABLE_LOGGING=true \
     -t vikaskamwal/cofounder-nectar:test \
     --push .
   ```

2. **Deploy to EC2:**
   - SSH into your EC2 instance
   - Pull the new image: `docker pull vikaskamwal/cofounder-nectar:test`
   - Stop the old container: `docker stop <container_name>`
   - Start the new container with your existing docker run command
   - Or use docker-compose if you have it configured

3. **Test the authentication flow:**
   - Clear browser cache and cookies
   - Go to https://test.cofoundercircle.ai
   - Try signing up/logging in
   - Check browser console (F12) for detailed logs
   - The auth callback should now timeout after 10 seconds instead of hanging

## Debugging

If the issue persists, check the browser console logs. With `VITE_ENABLE_LOGGING=true`, you'll see detailed logs like:
- `[AUTH] Token received, length: XXX`
- `[AUTH] Email extracted from token: XXX`
- `[AUTH] Is new user: true/false`
- `[AUTH] API call failed or timed out: XXX`
- `[AUTH] Navigating to: /onboarding`

## Common Issues

### Issue: Still stuck on callback page
**Possible causes:**
1. API endpoint `https://test.api.cofoundercircle.ai/api/check-user` is not responding
2. CORS is blocking the request from browser
3. Network connectivity issue between frontend and backend

**Solution:**
- Check if backend API is running: `curl https://test.api.cofoundercircle.ai/api/check-user?email=test@example.com`
- Check CORS configuration on backend to allow `https://test.cofoundercircle.ai`
- Check browser console for CORS or network errors

### Issue: "Server is taking too long to respond" error
**Cause:** API is timing out after 10 seconds

**Solution:**
- Backend API needs optimization
- Check backend logs for errors
- Verify database connectivity on backend

### Issue: Redirected to home instead of onboarding
**Cause:** User data shows `is_onboarded: true`

**Solution:**
- Check backend database to verify user's onboarding status
- User should have `is_onboarded: false` for new signups

