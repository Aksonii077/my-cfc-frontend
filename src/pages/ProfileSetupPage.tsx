import React, { useState, useEffect } from 'react';
import { Steps } from 'antd';
import { theme } from '@/lib/theme';
import WelcomeStep from '@/components/profile/steps/WelcomeStep';
import ProfileStep from '@/components/profile/steps/ProfileStep';
import ProgramStep from '@/components/profile/steps/ProgramStep';
import CompleteStep from '@/components/profile/steps/CompleteStep';

const { Step } = Steps;

const ProfileSetupPage: React.FC = () => {
  // Start from step 1 (Profile) as Welcome step is already completed
  const [currentStep, setCurrentStep] = useState(1);
  const [hideStepper, setHideStepper] = useState(false);

  const steps = [
    {
      title: 'Welcome',
      status: 'finish' as const, // Always completed
    },
    {
      title: 'Profile',
      status: currentStep === 1 ? 'process' as const : currentStep > 1 ? 'finish' as const : 'wait' as const,
    },
    {
      title: 'Program',
      status: currentStep === 2 ? 'process' as const : currentStep > 2 ? 'finish' as const : 'wait' as const,
    },
    {
      title: 'Complete',
      status: currentStep === 3 ? 'process' as const : currentStep > 3 ? 'finish' as const : 'wait' as const,
    },
  ];

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return;
      case 1:
        return <ProfileStep onNext={handleNext} onPrev={handlePrev} />;
      case 2:
        return <ProgramStep onNext={handleNext} onPrev={handlePrev} />;
      case 3:
        return <CompleteStep onPrev={handlePrev} onHideStepper={setHideStepper} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-6xl">
      {/* Custom styled stepper */}
      {!hideStepper && (
        <div className="mb-6 sm:mb-8 lg:mb-12 flex justify-center px-2 sm:px-0">
        <div className="w-full max-w-full sm:max-w-md lg:max-w-2xl overflow-x-auto">
          <Steps
            current={currentStep}
            className="profile-setup-steps"
            size="default"
            direction="horizontal"
            labelPlacement="vertical"
            responsive={false}
          >
            {steps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                status={step.status}
              />
            ))}
          </Steps>
        </div>
        </div>
      )}

      {/* Step content */}
      <div className="min-h-[400px] sm:min-h-[500px]">
        {renderStepContent()}
      </div>

      {/* Custom CSS for stepper styling - Only background colors */}
      <style>{`
        /* Icon background colors only */
        .profile-setup-steps .ant-steps-item-finish .ant-steps-item-icon {
          background: ${theme.gradients.primary} !important;
          border-color: transparent !important;
        }
        
        .profile-setup-steps .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon {
          color: white !important;
        }
        
        .profile-setup-steps .ant-steps-item-process .ant-steps-item-icon {
          background: #3CE5A7 !important;
          border-color: #3CE5A7 !important;
        }
        
        .profile-setup-steps .ant-steps-item-process .ant-steps-item-icon .ant-steps-icon {
          color: white !important;
        }
        
        /* Mobile responsive adjustments */
        @media (max-width: 640px) {
          .profile-setup-steps .ant-steps-item-title {
            line-height: 1.2 !important;
            margin-top: 4px !important;
          }
          
          .profile-setup-steps .ant-steps-item {
            padding-left: 8px !important;
            padding-right: 8px !important;
          }
          
          .profile-setup-steps .ant-steps-item-icon {
            width: 24px !important;
            height: 24px !important;
            line-height: 24px !important;
            font-size: 12px !important;
          }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          .profile-setup-steps .ant-steps-item-icon {
            width: 28px !important;
            height: 28px !important;
            line-height: 28px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileSetupPage;