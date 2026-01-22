
import { useCallback, useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { trackEvent, trackOnboardingStepView, trackOnboardingStepComplete } from '../../../../utils/analytics'
import { useFormValidation } from '../../../../hooks/useFormValidation'
import { COMMON_RULES } from '../../../../utils/validation'
import { OnboardingLayout } from '../../ui/OnboardingLayout'
import { UserInfoDisplay } from '../MentorOnboarding/components/UserInfoDisplay'
import { ServiceProviderFormFields } from './components/ServiceProviderFormFields'
import { ServiceProviderConfirmation } from './components/ServiceProviderConfirmation'
import { SERVICE_PROVIDER_FORM_CONFIG } from './constants/serviceProviderConstants'
import { useServiceProviderApiSubmission } from './services/serviceProviderApi'
import type { RoleOnboardingProps, ServiceProviderFormData } from '../../types'

const getInitialFormData = (): ServiceProviderFormData => {
  try {
    const savedData = localStorage.getItem('onboarding_serviceProviderData')
    if (savedData) {
      return JSON.parse(savedData)
    }
  } catch (error) {
    console.error('Error restoring service provider onboarding data:', error)
  }
  return {
    bio: '',
    services: [],
    businessType: '',
    yearsOfExperience: ''
  }
}

const VALIDATION_RULES = {
  bio: COMMON_RULES.serviceProviderBio,
  services: {
    required: true,
    minLength: 1,
    message: 'Please select at least one service'
  },
  businessType: {
    required: true,
    message: 'Please select your business type'
  },
  yearsOfExperience: {
    required: true,
    message: 'Please select your years of experience'
  }
}

export function ServiceProviderOnboarding({ userInfo, onComplete, onBack }: RoleOnboardingProps) {
  const { submitServiceProvider } = useServiceProviderApiSubmission()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formStartTime] = useState(Date.now())

  // Track form view
  useEffect(() => {
    trackOnboardingStepView(2, 'Service Provider Form')
    trackEvent('service_provider_form_view', {
      category: 'onboarding',
      email: userInfo.email,
      role: 'service_provider'
    })
  }, [userInfo.email])

  const handleFormSubmit = useCallback(async (formData: ServiceProviderFormData) => {
    try {
      const result = await submitServiceProvider(userInfo, formData)
      
      const timeSpent = Math.floor((Date.now() - formStartTime) / 1000)
      trackOnboardingStepComplete(2, 'Service Provider Form', timeSpent)
      
      trackEvent('service_provider_submit_success', {
        partner_id: result.data?.id,
        status: result.data?.status,
        time_spent: timeSpent
      })

      setShowConfirmation(true)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      trackEvent('service_provider_submit_failed', {
        error_message: errorMessage
      })
      throw error
    }
  }, [userInfo, submitServiceProvider, formStartTime])

  const {
    data: formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit
  } = useFormValidation<ServiceProviderFormData>({
    initialData: getInitialFormData(),
    validationRules: VALIDATION_RULES,
    onSubmit: handleFormSubmit
  })

  // Auto-save
  useEffect(() => {
    if (formData.bio || formData.services.length > 0) {
      try {
        localStorage.setItem('onboarding_serviceProviderData', JSON.stringify(formData))
      } catch (error) {
        console.error('Error saving data:', error)
      }
    }
  }, [formData])

  const addService = useCallback((service: string) => {
    if (service && !formData.services.includes(service) && 
        formData.services.length < SERVICE_PROVIDER_FORM_CONFIG.maxServicesSelections) {
      updateField('services', [...formData.services, service])
    }
  }, [formData.services, updateField])

  const removeService = useCallback((service: string) => {
    updateField('services', formData.services.filter(s => s !== service))
  }, [formData.services, updateField])

  if (showConfirmation) {
    return <ServiceProviderConfirmation userEmail={userInfo.email} />
  }

  return (
    <OnboardingLayout
      title="Service Provider Registration"
      subtitle="Join our network of trusted service providers for startups"
      submitError={errors.submit}
      onBack={onBack}
      onSubmit={handleSubmit}
      submitText="Complete Registration"
      isSubmitting={isSubmitting}
      submitIcon={<Send className="w-3.5 h-3.5" />}
    >
      <div className="space-y-3">
        <UserInfoDisplay userInfo={userInfo} />
        <ServiceProviderFormFields
          formData={formData}
          errors={errors}
          onUpdateField={updateField}
          onAddService={addService}
          onRemoveService={removeService}
        />
      </div>
    </OnboardingLayout>
  )
}
