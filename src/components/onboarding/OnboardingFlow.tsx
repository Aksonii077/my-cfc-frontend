import { useState, useCallback, useEffect } from 'react'
import UserInfo from './UserInfo'
import { FounderOnboarding } from './flows/FounderOnBoarding/FounderOnboarding';
import { MentorOnboarding } from './flows/MentorOnboarding';
import { logger } from '@/utils/logger';
import type { UserInfoData, OnboardingStep } from './types';

interface OnboardingFlowProps {
  onComplete: (userData: UserInfoData, additionalData?: Record<string, unknown>) => void
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('userInfo')
  const [userInfo, setUserInfo] = useState<UserInfoData | null>(null)

  // Check localStorage for existing user data and role on component mount
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) return
      
      const user = JSON.parse(userStr)
      logger.debug('OnboardingFlow: Found user in localStorage', { email: user.email, role: user.role });
      
      // Check if user has a role
      if (user.role && user.role.trim() !== '') {
        logger.info('OnboardingFlow: Found existing user with role', { role: user.role })
        
        // Create UserInfoData from localStorage
        const nameParts = user.name?.split(' ') || []
        const userInfoData: UserInfoData = {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || '',
          phone: '', // Will need to be filled if required
          countryCode: '+1', // Default, will need to be updated if required
          selectedRole: user.role
        }
        
        // Set user info and skip to role-specific onboarding
        setUserInfo(userInfoData)
        setCurrentStep('roleSpecific')
        
        logger.info('OnboardingFlow: Skipping UserInfo, going directly to role-specific onboarding')
      }
    } catch (error) {
      logger.error('OnboardingFlow: Error parsing user data from localStorage', error)
    }
  }, [])

  const handleUserInfoComplete = useCallback((data: UserInfoData) => {
    setUserInfo(data)
    setCurrentStep('roleSpecific')
  }, [])

  const handleRoleSpecificComplete = useCallback((additionalData?: Record<string, unknown>) => {
    if (userInfo) {
      onComplete(userInfo, additionalData)
    }
  }, [userInfo, onComplete])

  const getRoleSpecificComponent = useCallback(() => {
    if (!userInfo) return null

    const commonProps = {
      userInfo,
      onComplete: handleRoleSpecificComplete,
      onBack: () => setCurrentStep('userInfo')
    }

    switch (userInfo.selectedRole) {
      case 'founder':
        return <FounderOnboarding {...commonProps} />
      case 'investor':
        return <MentorOnboarding {...commonProps} />;
      case 'mentor':
        return <MentorOnboarding {...commonProps} />
      case 'freelancer':
        return <MentorOnboarding {...commonProps} />;
      case 'service_provider':
        return <MentorOnboarding {...commonProps} />;
      case 'student':
        return <MentorOnboarding {...commonProps} />;
      case 'job_seeker':
      case 'supplier':
      case 'data_provider':
      case 'exploring':
      default:
        return <MentorOnboarding {...commonProps} />;
    }
  }, [userInfo, handleRoleSpecificComplete])

  if (currentStep === 'userInfo') {
    return <UserInfo onComplete={handleUserInfoComplete} />
  }

  if (currentStep === 'roleSpecific') {
    return getRoleSpecificComponent()
  }

  return null
}

export default OnboardingFlow