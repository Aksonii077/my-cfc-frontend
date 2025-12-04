// Auth-related constants
export const AFTER_LOGIN_REDIRECT_KEY = 'afterLoginRedirectPath';

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  USER_ID: 'user_id',
  USER_ROLE: 'userRole',
  USER_ROLES: 'userRoles',
  AI_SESSION_ID: 'ai_session_id',
  AI_ACTIVE_IDEA: 'ai_active_idea',
} as const;

// Route paths
export const ROUTES = {
  MENTOR: '/mentor',
  MENTOR_PROFILE: '/mentor-profile',
  PITCH_TANK: '/pitch-tank',
  PITCH_TANK_FORM: '/pitch-tank-form',
  HOME: '/',
  ONBOARDING: '/onboarding',
} as const;

// Dashboard routes
export const DASHBOARD_ROUTES = {
  FOUNDER: '/dashboard/mentors',
  MENTOR: '/dashboard/mentors',
} as const;