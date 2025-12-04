import { useCallback } from 'react'
import { apiClient } from '../../../../../utils/api'
import type { OnboardingData } from '../types'
import { ADVANCED_STARTUP_STAGES } from '../constants'

export const useApiSubmission = () => {
  const submitIdea = useCallback(async (formData: OnboardingData) => {
    const payload = {
      title: formData.ideaTitle,
      description: formData.ideaDescription,
      idea_type: 'idea'
    }
    
    await apiClient.post('/submit-simple-idea', payload)
  }, [])

  const submitStartup = useCallback(async (formData: OnboardingData) => {
    const needsIncorporationData = formData.startupStage && ADVANCED_STARTUP_STAGES.includes(formData.startupStage)
    
    const payload: {
      title: string | undefined
      industry: string | undefined
      description: string | undefined
      idea_type: string
      date_of_incorporation?: string
      registration_number?: string
    } = {
      title: formData.startupName,
      industry: formData.startupIndustry,
      description: formData.startupDescription,
      idea_type: 'startup'
    }
    
    if (needsIncorporationData) {
      payload.date_of_incorporation = formData.incorporationDate
      payload.registration_number = formData.registrationNumber
    }
    
    await apiClient.post('/submit-simple-idea', payload)
  }, [])

  return {
    submitIdea,
    submitStartup
  }
}