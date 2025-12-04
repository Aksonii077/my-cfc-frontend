import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '@/components/PublicLayout';
import ProfileLayout from '@/components/ProfileLayout';
import ErrorBoundary from '@/ErrorBoundary';

// Eager load critical components
import Homepage from '@/pages/Homepage';
import NotFound from '@/pages/NotFound';
import AuthCallback from '@/pages/Auth';
import FefLanding from '@/pages/fef-landing';

// Lazy load components for specified routes
const PitchTankLandingPage = lazy(() => import('@/pages/PitchTankLandingPage'));
const PitchTankForm = lazy(() => import('@/pages/PitchTankForm'));
const MentorPage = lazy(() => import('@/pages/MentorPage'));
const PartnerPage = lazy(() => import('@/pages/PartnerPage'));
const PartnerProfileLookupPage = lazy(() => import('@/pages/PartnerProfileLookupPage'));
const ProfileSetupPage = lazy(() => import('@/pages/ProfileSetupPage'));
const DarpanSanghviPage = lazy(() => import('@/pages/DarpanSanghviPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));

// Loading Component
const AppLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
  </div>
);

// Simplified Route Guard for protected routes
interface RouteGuardConfig {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const RouteGuard: React.FC<RouteGuardConfig> = ({ 
  children, 
  requireAuth = true, 
  redirectTo = "/" 
}) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

// Route type definition
interface RouteConfig {
  path: string;
  element: React.ReactElement;
  layout?: 'public' | 'profile';
  protected?: boolean;
}

// Clean route configuration for specified routes only
const allowedRoutes: RouteConfig[] = [
  // Public routes (no layout)
  { path: "/", element: <Homepage /> },
  { path: "/auth/callback", element: <AuthCallback /> },
  { path: "/auth", element: <AuthCallback /> },
  { path: "darpansanghvi", element: <DarpanSanghviPage /> },
  { path: "fef", element: <FefLanding /> },

  // PublicLayout routes
  { path: "pitch-tank", element: <PitchTankLandingPage />, layout: "public" },
  { path: "mentor", element: <MentorPage />, layout: "public" },
  { path: "partner", element: <PartnerPage />, layout: "public" },
  { path: "partner-lookup", element: <PartnerProfileLookupPage />, layout: "public" },

  // ProfileLayout routes (protected)
  {
    path: "mentor-profile",
    element: <ProfileSetupPage />,
    layout: "profile",
    protected: true,
  },

  // Standalone routes (protected)
  { path: "pitch-tank-form", element: <PitchTankForm />, protected: true },
  { path: "onboarding", element: <OnboardingPage />, protected: true },
];

const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<AppLoadingSpinner />}>
        <Routes>
          {/* Public Routes (no layout) */}
          {allowedRoutes
            .filter(route => !route.layout)
            .map(({ path, element, protected: isProtected }) => (
              <Route 
                key={path} 
                path={path} 
                element={isProtected ? <RouteGuard>{element}</RouteGuard> : element} 
              />
            ))}

          {/* Public Layout Routes (shared Header) */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Homepage />} />
            {allowedRoutes
              .filter(route => route.layout === "public")
              .map(({ path, element, protected: isProtected }) => (
                <Route 
                  key={path} 
                  path={path} 
                  element={isProtected ? <RouteGuard>{element}</RouteGuard> : element} 
                />
              ))}
          </Route>

          {/* Profile Layout Routes (Header + profile setup) */}
          <Route path="/" element={<ProfileLayout />}>
            {allowedRoutes
              .filter(route => route.layout === "profile")
              .map(({ path, element, protected: isProtected }) => (
                <Route 
                  key={path} 
                  path={path} 
                  element={isProtected ? <RouteGuard>{element}</RouteGuard> : element} 
                />
              ))}
          </Route>

          {/* Standalone Protected Routes */}
          {allowedRoutes
            .filter(route => route.protected && !route.layout)
            .map(({ path, element }) => (
              <Route 
                key={path} 
                path={path} 
                element={<RouteGuard>{element}</RouteGuard>} 
              />
            ))}

          {/* Global catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;