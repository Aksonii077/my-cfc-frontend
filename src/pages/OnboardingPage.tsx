import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingFlow, type UserInfoData } from '@/components/onboarding';
import { logger } from '@/utils/logger';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleOnboardingComplete = (userData: UserInfoData, additionalData?: Record<string, unknown>) => {
    logger.info('Onboarding completed', {
      userInfo: {
        email: userData.email,
        role: userData.selectedRole,
        firstName: userData.firstName,
        lastName: userData.lastName
      },
      hasAdditionalData: !!additionalData
    });
    
    // Clear onboarding data from localStorage after successful completion
    try {
      localStorage.removeItem('onboarding_userInfo');
      localStorage.removeItem('onboarding_founderData');
      localStorage.removeItem('onboarding_founderStep');
      localStorage.removeItem('onboarding_mentorData');
      logger.debug('Cleared onboarding data from localStorage');
    } catch (error) {
      logger.error('Error clearing onboarding data from localStorage:', error);
    }
    
    // Navigate to home page after successful onboarding
    navigate('/');
  };

  return (
    <div>
      <OnboardingFlow onComplete={handleOnboardingComplete} />
    </div>
  );
};

export default OnboardingPage; 