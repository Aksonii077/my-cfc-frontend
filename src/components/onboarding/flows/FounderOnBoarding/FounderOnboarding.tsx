import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useSimpleAuth } from '@/providers/SimpleAuthProvider'
import { useUserStore } from '@/stores/userStore'
import { EntryAnimation } from '../../EntryAnimation'
import type { RoleOnboardingProps } from '../../types'
import { 
  trackOnboardingStart, 
  trackOnboardingStepView, 
  trackOnboardingStepComplete,
  trackOnboardingFieldEdit,
  trackDashboardSectionSelect,
  trackOnboardingComplete
} from '../../../../utils/analytics'

// Import components
import { WelcomeStep, PathSelectionStep, IdeaFormStep, StartupFormStep, CompletionStep } from './steps'

// Import types and constants
import type { OnboardingData, OnboardingStep, ValidationErrors } from './types'
import { STARTUP_STAGES, STEP_CONFIG } from './constants'

// Import hooks
import { useFormValidation, useApiSubmission } from './hooks'

export const FounderOnboarding = ({ onComplete, onBack }: RoleOnboardingProps) => {
  const { user } = useUserStore()
  // Skip welcome screen and start directly at path-selection
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('path-selection')
  const [formData, setFormData] = useState<OnboardingData>({ path: null })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stepStartTime, setStepStartTime] = useState(Date.now())
  const [onboardingStartTime] = useState(Date.now())

  // Custom hooks
  const { validateIdeaForm, validateStartupForm } = useFormValidation()
  const { submitIdea, submitStartup } = useApiSubmission()

  // Restore data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('onboarding_founderData')
      const savedStep = localStorage.getItem('onboarding_founderStep')
      if (savedData) {
        setFormData(JSON.parse(savedData))
      }
      if (savedStep) {
        // Skip welcome step if it was previously saved
        const step = savedStep as OnboardingStep
        setCurrentStep(step === 'welcome' ? 'path-selection' : step)
      }
    } catch (error) {
      console.error('Error restoring founder onboarding data:', error)
    }
  }, [])

  // Auto-save form data to localStorage whenever it changes
  useEffect(() => {
    if (formData.path) {
      try {
        localStorage.setItem('onboarding_founderData', JSON.stringify(formData))
        localStorage.setItem('onboarding_founderStep', currentStep)
      } catch (error) {
        console.error('Error saving founder onboarding data:', error)
      }
    }
  }, [formData, currentStep])

  // Analytics tracking
  useEffect(() => {
    if (user) {
      trackOnboardingStart(user.id, 'founder')
    }
  }, [user])

  useEffect(() => {
    const config = STEP_CONFIG[currentStep as keyof typeof STEP_CONFIG]
    if (config) {
      trackOnboardingStepView(config.number, config.name)
      setStepStartTime(Date.now())
    }
  }, [currentStep])

  // Utility functions
  const getStageDescription = useCallback((stage: string) => {
    return STARTUP_STAGES.find(s => s.value === stage)?.description || ''
  }, [])

  const updateFormData = useCallback(<K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (typeof value === 'string' && field !== 'path') {
      trackOnboardingFieldEdit(String(field), !!value)
    }
    // Clear field error on change
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: undefined }))
    }
  }, [errors])

  // Event handlers
  const handlePathSelection = useCallback((path: 'idea' | 'startup') => {
    const timeSpent = Math.floor((Date.now() - stepStartTime) / 1000)
    trackOnboardingStepComplete(2, 'Path Selection', timeSpent)
    
    updateFormData('path', path)
    setCurrentStep(path === 'idea' ? 'idea-form' : 'startup-form')
  }, [stepStartTime, updateFormData])

  const handleIdeaSubmit = useCallback(async () => {
    const validationErrors = validateIdeaForm(formData)
    setErrors(validationErrors)
    
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await submitIdea(formData)
      setCurrentStep('completion')
    } catch (error) {
      console.error('Failed to submit idea:', error)
      setErrors({ submit: 'Failed to submit idea. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }, [validateIdeaForm, formData, submitIdea])

  const handleStartupSubmit = useCallback(async () => {
    const validationErrors = validateStartupForm(formData)
    setErrors(validationErrors)
    
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await submitStartup(formData)
      setCurrentStep('completion')
    } catch (error) {
      console.error('Failed to submit startup:', error)
      setErrors({ submit: 'Failed to submit startup. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }, [validateStartupForm, formData, submitStartup])

  const handleFinalSubmit = useCallback(async (selectedSection?: 'idea-launch-pad' | 'growth-hub') => {
    if (selectedSection) {
      trackDashboardSectionSelect(selectedSection)
      updateFormData('selectedSection', selectedSection)
      
      const totalTime = Math.floor((Date.now() - onboardingStartTime) / 1000)
      trackOnboardingComplete(totalTime, 5, selectedSection)
      // Redirect to mentors dashboard (cookie authentication)
      const businessBaseUrl = import.meta.env.VITE_DASHBOARD_DOMAIN_URL;
      const redirectUrl = `${businessBaseUrl}/dashboard/mentors`
      
      window.location.href = redirectUrl
    } else {
      setIsSubmitting(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentStep('entry-animation')
      
      const totalTime = Math.floor((Date.now() - onboardingStartTime) / 1000)
      trackOnboardingComplete(totalTime, 5, 'idea-launch-pad')
    }
  }, [onboardingStartTime, updateFormData])

  const handleEntryAnimationComplete = useCallback(() => {
    onComplete(formData)
  }, [onComplete, formData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-[#EDF2FF] to-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {currentStep === 'welcome' && (
            <WelcomeStep 
              user={user}
              onNext={() => setCurrentStep('path-selection')}
              onBack={onBack}
            />
          )}

          {currentStep === 'path-selection' && (
            <PathSelectionStep 
              onPathSelect={handlePathSelection}
              onBack={onBack}
            />
          )}

          {currentStep === 'idea-form' && (
            <IdeaFormStep
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              onUpdate={updateFormData}
              onSubmit={handleIdeaSubmit}
              onBack={() => setCurrentStep('path-selection')}
            />
          )}

          {currentStep === 'startup-form' && (
            <StartupFormStep
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              onUpdate={updateFormData}
              onSubmit={handleStartupSubmit}
              onBack={() => setCurrentStep('path-selection')}
              getStageDescription={getStageDescription}
            />
          )}

          {currentStep === 'completion' && (
            <CompletionStep
              isSubmitting={isSubmitting}
              onFinalSubmit={handleFinalSubmit}
              userPath={formData.path}
            />
          )}

          {currentStep === 'entry-animation' && (
            <EntryAnimation 
              onComplete={handleEntryAnimationComplete} 
              selectedSection={formData.selectedSection}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}