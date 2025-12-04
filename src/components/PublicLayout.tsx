import React, { useState, createContext, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import SignupModal from '@/components/Modals/SignupModal';
import RegisterWaitlist from '@/components/Modals/RegisterWaitlist';
import { useUserStore } from '@/stores/userStore';

// Create context for modal controls
interface ModalContextType {
  openModal: () => void;
  openSignupModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within PublicLayout');
  }
  return context;
};

const PublicLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useUserStore();
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  if (import.meta.env.DEV) {
    console.log("PublicLayout user:", user);
  }
  const handleWaitlistModalOpen = () => {
    setIsWaitlistModalOpen(true);
  };

  const handleWaitlistModalClose = () => {
    setIsWaitlistModalOpen(false);
  };

  const handleSignupModalOpen = () => {
    setIsSignupModalOpen(true);
  };

  const handleSignupModalClose = () => {
    setIsSignupModalOpen(false);
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

  return (
    <ModalContext.Provider value={{ 
      openModal: handleSignupModalOpen,
      openSignupModal: handleSignupModalOpen 
    }}>
      <Header onGetStartedClick={handleWaitlistModalOpen} />
      <Outlet />
      <RegisterWaitlist isOpen={isWaitlistModalOpen} onClose={handleWaitlistModalClose} />
      <SignupModal isOpen={isSignupModalOpen} onClose={handleSignupModalClose} redirectPath={getRedirectPath()} />
    </ModalContext.Provider>
  );
};

export default PublicLayout;