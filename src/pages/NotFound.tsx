
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auto-redirect to homepage after a short delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate('/', { replace: true });
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl text-gray-600 mb-6">
        The page <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code> doesn't exist or has been moved.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={() => navigate('/')} variant="default" size="lg" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
          <Home className="h-4 w-4" /> Return Home
        </Button>
      </div>
      <p className="mt-4 text-sm text-gray-500">You will be redirected to the homepage shortly.</p>
    </div>
  );
};

export default NotFound;
