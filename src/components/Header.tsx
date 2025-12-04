import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '@/lib/theme';
import SignupModal from './Modals/SignupModal';
import { useGetStartedHandler } from '@/hooks/useGetStartedHandler';

// Navigation items
const navItems = [
  { label: 'Pitch Tank', path: '/pitch-tank' },
  { label: 'Mentor', path: '/mentor' },
  { label: 'FEF', path: '/fef' },
];

interface HeaderProps {
  className?: string;
  onGetStartedClick?: () => void;
}

// Header configuration for different pages
const getHeaderConfig = (pathname: string) => {
  switch (pathname) {
    case "/pitch-tank-form":
      return {
        showNavigation: false,
        showAuthButtons: false,
        showSignOut: true,
        useWhiteText: false,
        background: "transparent",
      };
    case "/pitch-tank":
      return {
        showNavigation: true,
        showAuthButtons: true,
        showSignOut: false,
        useWhiteText: true,
        background: "#02093d",
        buttonType: "signup",
      };
    case "/mentor":
      return {
        showNavigation: true,
        showAuthButtons: true,
        showSignOut: false,
        useWhiteText: true,
        background: "#040403",
        buttonType: "invite",
      };
    case "/partner":
      return {
        showNavigation: true,
        showAuthButtons: true,
        showSignOut: false,
        useWhiteText: true,
        background: "#040403",
        buttonType: "getStarted",
      };
    case "/partner-lookup":
      return {
        showNavigation: true,
        showAuthButtons: true,
        showSignOut: false,
        useWhiteText: false,
        background: "white",
        buttonType: "getStarted",
        sticky: true,
      };
    case "/mentor-profile":
      return {
        showNavigation: true,
        showAuthButtons: false,
        showSignOut: true,
        useWhiteText: false,
        background: "white",
      };
    default:
      return {
        showNavigation: true,
        showAuthButtons: true,
        showSignOut: false,
        useWhiteText: false,
        background: "transparent",
        buttonType: "getStarted",
      };
  }
};

const Header: React.FC<HeaderProps> = ({ className = '', onGetStartedClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const { handleGetStarted } = useGetStartedHandler();
  
  // Check if this is a FEF application
  const urlParams = new URLSearchParams(location.search);
  const isFefApplication = urlParams.get('fef-application') === 'true';
  
  // Get configuration for current page
  const config = useMemo(() => getHeaderConfig(location.pathname), [location.pathname]);

  // Event handlers
  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleActionClick = async () => {
    setMobileMenuOpen(false);
    
    switch (config.buttonType) {
      case 'signup': {
        // For signup button, use the new Get Started logic if on pitch-tank page
        if (location.pathname === '/pitch-tank') {
          const wasHandled = await handleGetStarted();
          if (!wasHandled) {
            setSignupModalOpen(true);
          }
        } else {
          setSignupModalOpen(true);
        }
        break;
      }
      case 'invite':
        // No action for invite only button
        break;
      case 'getStarted':
      default: {
        if (location.pathname === '/') {
          // Use the new Get Started handler for home page
          const wasHandled = await handleGetStarted();
          if (!wasHandled) {
            setSignupModalOpen(true);
          }
        } else {
          onGetStartedClick?.();
        }
        break;
      }
    }
  };

  // Determine redirect path based on current page
  const getRedirectPath = () => {
    switch (location.pathname) {
      case '/mentor':
        return '/mentor-profile';
      case '/pitch-tank':
        return '/pitch-tank-form';
      case '/':
        return '/onboarding';
      default:
        return '/pitch-tank-form'; // Default fallback
    }
  };

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.clear();
    
    // Determine redirect based on current page
    if (isFefApplication) {
      navigate('/fef');
    } else if (location.pathname === '/pitch-tank-form') {
      navigate('/pitch-tank');
    } else {
      navigate('/');
    }
    setMobileMenuOpen(false);
  };

  // Button components
  const SignOutButton = ({ mobile = false }: { mobile?: boolean }) => (
    <button
      onClick={handleSignOut}
      className={mobile 
        ? "w-full py-3 text-base sm:text-lg text-gray-700 font-medium rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 border-0"
        : "px-4 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium rounded-lg hover:shadow-lg transition-all duration-200 bg-white shadow-md border-0"
      }
    >
      Sign Out
    </button>
  );

  const ActionButton = ({ mobile = false }: { mobile?: boolean }) => {
    const getButtonText = () => {
      switch (config.buttonType) {
        case 'invite': return 'Invite only';
        case 'signup':
        case 'getStarted':
        default: return 'Get Started';
      }
    };

    const baseClasses = mobile 
      ? "w-full py-3 text-base sm:text-lg font-medium transition-all duration-200"
      : "px-4 sm:px-6 md:px-12 lg:px-16 py-2 text-xs sm:text-sm font-medium transition-all duration-200";

    if (config.buttonType === 'getStarted' && !mobile) {
      return (
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3CD9A7] to-[#114CFF] rounded-full blur opacity-75"></div>
          <button
            onClick={handleActionClick}
            className={`relative ${baseClasses} bg-white text-gray-700 rounded-full hover:shadow-md border-2 border-transparent`}
            style={{
              background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #3CD9A7, #114CFF) border-box",
            }}
          >
            {getButtonText()}
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleActionClick}
        className={`${baseClasses} text-white rounded-full hover:shadow-md`}
        style={{ background: theme.colors.primary }}
      >
        {getButtonText()}
      </button>
    );
  };

  return (
    <>
      <header 
        className={`w-full px-4 sm:px-6 md:px-8 lg:px-16 py-3 sm:py-4 ${className} ${config.sticky ? 'sticky top-0 z-50 shadow-md' : ''}`}
        style={{ backgroundColor: config.background }}
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
          >
            <img
              src={isFefApplication 
                ? "/fef/fef-logo-main.svg" 
                : (config.useWhiteText ? "/brand-logo-white.svg" : "/brandlogo.svg")
              }
              alt={isFefApplication ? "Fashion Entrepreneur Fund" : "CoFounder Circle"}
              loading="eager"
            />
          </button>

          {/* Navigation and Action Buttons */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation */}
            {config.showNavigation && (
              <nav className="flex items-center space-x-8">
                {navItems.map(item => {
                  const isActive = location.pathname === item.path;
                  const textColor = config.useWhiteText
                    ? (isActive ? 'text-white font-bold' : 'text-white/80 hover:text-white') 
                    : (isActive ? 'text-gray-900 font-bold' : 'text-gray-600 hover:text-gray-900');
                  
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleNavigation(item.path)}
                      className={`font-bold transition-colors ${textColor}`}
                      style={{ fontSize: '21px' }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
              {config.showSignOut && <SignOutButton />}
              {config.showAuthButtons && <ActionButton />}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden transition-colors ${
              config.useWhiteText
                ? 'text-white hover:text-white/80' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[99998] md:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-white shadow-lg z-[99999] md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6">
            <div className="space-y-0">
              <div className="flex items-center justify-between py-3 sm:py-4">
                <span className="text-base sm:text-lg text-gray-700 font-medium">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="w-full h-px bg-gray-200"></div>

              {/* Navigation Items */}
              {config.showNavigation && (
                <>
                  {navItems.map((item, index) => (
                    <div key={item.label}>
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className="block w-full text-left text-base sm:text-lg text-gray-700 hover:text-gray-900 font-medium py-3 sm:py-4"
                      >
                        {item.label}
                      </button>
                      {index < navItems.length - 1 && <div className="w-full h-px bg-gray-200"></div>}
                    </div>
                  ))}
                  <div className="w-full h-px bg-gray-200"></div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="p-4 sm:p-6 space-y-3">
            {config.showSignOut && <SignOutButton mobile />}
            {config.showAuthButtons && <ActionButton mobile />}
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      <SignupModal 
        isOpen={signupModalOpen} 
        onClose={() => setSignupModalOpen(false)}
        redirectPath={getRedirectPath()}
      />
    </>
  );
};

export default Header;