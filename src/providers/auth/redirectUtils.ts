import {
  AFTER_LOGIN_REDIRECT_KEY,
  ROUTES,
  DASHBOARD_ROUTES,
} from "./constants";
import type { RedirectConfig } from "./types";

export const getAndClearSavedRedirectPath = (): string | null => {
  const redirectPath = sessionStorage.getItem(AFTER_LOGIN_REDIRECT_KEY);
  if (redirectPath) {
    sessionStorage.removeItem(AFTER_LOGIN_REDIRECT_KEY);
  }
  return redirectPath;
};

export const redirectToExternalDashboard = (
  role: string,
  token: string | null
): void => {
  const dashboardUrl = import.meta.env.VITE_DASHBOARD_DOMAIN_URL;

  if (!dashboardUrl) {
    console.error('[REDIRECT] VITE_DASHBOARD_DOMAIN_URL not set in environment variables');
    console.log('[REDIRECT] Using default: http://localhost:8080');
    // Fallback to localhost for development
    const fallbackUrl = 'http://localhost:8080';
    const dashboardPath = DASHBOARD_ROUTES.FOUNDER; // Both founder and mentor use same path now
    window.location.href = `${fallbackUrl}${dashboardPath}`;
    return;
  }

  // ✅ No token in URL - cookie authentication handles it
  let dashboardPath: string;

  switch (role) {
    case "founder":
      dashboardPath = DASHBOARD_ROUTES.FOUNDER;
      break;
    case "mentor":
      dashboardPath = DASHBOARD_ROUTES.MENTOR;
      break;
    default:
      console.warn('[REDIRECT] Unknown role:', role);
      return;
  }

  const redirectUrl = `${dashboardUrl}${dashboardPath}`;
  console.log('[REDIRECT] Redirecting to:', redirectUrl);
  window.location.href = redirectUrl;
};

export const getDefaultRedirectPath = (
  config: RedirectConfig
): string | null => {
  const { currentPath, userData, token } = config;

  console.log('[REDIRECT] getDefaultRedirectPath called:', {
    currentPath,
    role: userData?.role,
    isOnboarded: userData?.isOnboarded,
    hasToken: !!token
  });

  switch (currentPath) {
    case ROUTES.MENTOR:
      if (userData?.isOnboarded && userData.role === "mentor") {
        console.log('[REDIRECT] Redirecting mentor to dashboard');
        redirectToExternalDashboard(userData.role, token);
        return null;
      }
      return currentPath;

    case ROUTES.PITCH_TANK:
      return currentPath;

    case ROUTES.ONBOARDING:
    case ROUTES.HOME:
      console.log('[REDIRECT] Home/Onboarding path, checking conditions:', {
        isOnboarded: userData?.isOnboarded,
        role: userData?.role,
        shouldRedirect: userData?.isOnboarded && (userData.role === "founder" || userData.role === "mentor")
      });
      
      if (userData?.isOnboarded && (userData.role === "founder" || userData.role === "mentor")) {
        console.log('[REDIRECT] Redirecting to external dashboard');
        redirectToExternalDashboard(userData.role, token);
        return null;
      }
      console.log('[REDIRECT] Not redirecting, staying on:', currentPath);
      return currentPath;

    default:
      return currentPath;
  }
};
