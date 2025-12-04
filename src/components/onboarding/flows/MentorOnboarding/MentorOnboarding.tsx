import { useCallback, useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { trackEvent, trackOnboardingStepView, trackOnboardingStepComplete } from '../../../../utils/analytics'
import { useFormValidation } from '../../../../hooks/useFormValidation'
import { COMMON_RULES } from '../../../../utils/validation'
import { OnboardingLayout } from '../../ui/OnboardingLayout'
import { MentorBenefitsCard, MentorProcessCard } from './components/MentorInfoCards'
import { UserInfoDisplay } from './components/UserInfoDisplay'
import { MentorFormFields } from './components/MentorFormFields'
import { MentorConfirmationStep } from './components/MentorConfirmationStep'
import { MENTOR_FORM_CONFIG } from './constants/mentorConstants'
import { useMentorApiSubmission } from './services/mentorApi'
import type { RoleOnboardingProps, MentorFormData } from '../../types'

const getInitialFormData = (): MentorFormData => {
  try {
    const savedData = localStorage.getItem('onboarding_mentorData')
    if (savedData) {
      return JSON.parse(savedData)
    }
  } catch (error) {
    console.error('Error restoring mentor onboarding data:', error)
  }
  return {
    bio: '',
    expertise: [],
    yearsOfExperience: ''
  }
}

const INITIAL_FORM_DATA: MentorFormData = getInitialFormData()

const VALIDATION_RULES = {
  bio: COMMON_RULES.bio,
  expertise: COMMON_RULES.expertise,
  yearsOfExperience: COMMON_RULES.yearsOfExperience
}

export function MentorOnboarding({ userInfo, onComplete, onBack }: RoleOnboardingProps) {
  const { submitMentor } = useMentorApiSubmission()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formStartTime] = useState(Date.now())

  // Track mentor form view on mount
  useEffect(() => {
    trackOnboardingStepView(2, 'Mentor Form')
    trackEvent('mentor_form_view', {
      category: 'onboarding',
      email: userInfo.email,
      role: 'mentor'
    })
  }, [userInfo.email])

  const handleFormSubmit = useCallback(async (formData: MentorFormData) => {
    // Track analytics event
    trackEvent('mentor_interest_submit', {
      phone: `${userInfo.countryCode}${userInfo.phone}`,
      expertise_count: formData.expertise.length,
      years_of_experience: formData.yearsOfExperience,
      bio_length: formData.bio.length
    })

    try {
      // Submit to API
      const result = await submitMentor(userInfo, formData)
      
      // Track successful submission
      const timeSpent = Math.floor((Date.now() - formStartTime) / 1000)
      trackOnboardingStepComplete(2, 'Mentor Form', timeSpent)
      
      trackEvent('mentor_interest_submit_success', {
        mentor_id: result.data?.id,
        status: result.data?.status,
        time_spent: timeSpent
      })

      // Track confirmation screen view
      trackOnboardingStepView(3, 'Mentor Confirmation')
      trackEvent('mentor_confirmation_view', {
        category: 'onboarding',
        email: userInfo.email
      })

      // Show confirmation screen instead of immediately completing
      setShowConfirmation(true)
    } catch (error: unknown) {
      // Track failed submission
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } }
      const errorStatus = axiosError.response?.status
      const errorData = axiosError.response?.data?.message
      
      trackEvent('mentor_interest_submit_failed', {
        error_message: errorData || errorMessage,
        error_status: errorStatus
      })
      
      // Re-throw error to be handled by form validation hook
      throw error
    }
  }, [userInfo, onComplete, submitMentor])

  const {
    data: formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit
  } = useFormValidation<MentorFormData>({
    initialData: INITIAL_FORM_DATA,
    validationRules: VALIDATION_RULES,
    onSubmit: handleFormSubmit
  })

  // Auto-save form data to localStorage whenever it changes
  useEffect(() => {
    if (formData.bio || formData.expertise.length > 0 || formData.yearsOfExperience) {
      try {
        localStorage.setItem('onboarding_mentorData', JSON.stringify(formData))
      } catch (error) {
        console.error('Error saving mentor onboarding data:', error)
      }
    }
  }, [formData])

  const handleValidationError = useCallback(() => {
    trackEvent('mentor_interest_validation_error', { 
      error_fields: Object.keys(errors) 
    })
  }, [errors])

  const addExpertise = useCallback((area: string) => {
    if (area && !formData.expertise.includes(area) && 
        formData.expertise.length < MENTOR_FORM_CONFIG.maxExpertiseSelections) {
      updateField('expertise', [...formData.expertise, area])
    }
  }, [formData.expertise, updateField])

  const removeExpertise = useCallback((area: string) => {
    updateField('expertise', formData.expertise.filter(e => e !== area))
  }, [formData.expertise, updateField])

  const handleFormSubmitWrapper = useCallback(async () => {
    try {
      await handleSubmit()
    } catch {
      handleValidationError()
    }
  }, [handleSubmit, handleValidationError])

  const handleBackClick = useCallback(() => {
    // Track back navigation
    trackEvent('mentor_form_back', {
      category: 'onboarding',
      email: userInfo.email,
      action: 'back_navigation'
    })
    onBack()
  }, [onBack, userInfo.email])

  // Show confirmation screen after successful submission
  // User will need to manually close browser or navigate away
  if (showConfirmation) {
    return (
      <MentorConfirmationStep 
        userEmail={userInfo.email}
      />
    )
  }

  return (
    <OnboardingLayout
      title="Mentor Program Interest"
      subtitle="Carefully curated to ensure quality guidance for founders"
      showInviteOnlyBadge
      submitError={errors.submit}
      onBack={handleBackClick}
      onSubmit={handleFormSubmitWrapper}
      submitText="Submit Your Interest"
      isSubmitting={isSubmitting}
      submitIcon={<Send className="w-3.5 h-3.5" />}
    >
      <div className="space-y-3">
        <MentorBenefitsCard />
        <MentorProcessCard />
        
        <div className="space-y-3">
          <UserInfoDisplay userInfo={userInfo} />
          <MentorFormFields
            formData={formData}
            errors={errors}
            onUpdateField={updateField}
            onAddExpertise={addExpertise}
            onRemoveExpertise={removeExpertise}
          />
        </div>
      </div>
    </OnboardingLayout>
  )
}