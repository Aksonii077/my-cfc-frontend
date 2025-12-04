import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'sonner';
import { SimpleAuthProvider } from '@/providers/SimpleAuthProvider';
import { useGA4Analytics } from '@/hooks/useGA4Analytics';
import { useSimpleAuth } from '@/providers/SimpleAuthProvider';
import AppRoutes from '@/routes/AppRoutes';
import { Helmet } from 'react-helmet';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnalyticsProvider() {
  const { user, isAuthenticated } = useSimpleAuth();
  
  // Initialize GA4 with user context
  useGA4Analytics({
    trackPageViews: true,
    trackUserEngagement: true,
    userId: user?.id,
    userType: isAuthenticated ? 'authenticated' : 'new'
  });

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <SimpleAuthProvider>
        <Router>
          <Helmet>
            <link rel="icon" type="image/svg+xml" href="/logos/favicon (2).svg" />
            <link rel="manifest" href="/manifest.webmanifest" />
            <meta name="theme-color" content="#ffffff" />
          </Helmet>
          <ScrollToTop />
          <AnalyticsProvider />
          <Toaster position="bottom-center" />
          <AppRoutes />
        </Router>
      </SimpleAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
