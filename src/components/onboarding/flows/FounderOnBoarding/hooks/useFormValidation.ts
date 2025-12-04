import { useCallback } from 'react'
import type { OnboardingData, ValidationErrors } from '../types'

export const useFormValidation = () => {
  const validateIdeaForm = useCallback((formData: OnboardingData): ValidationErrors => {
    const errors: ValidationErrors = {}
    
    if (!formData.ideaTitle?.trim()) {
      errors.ideaTitle = 'Please enter your idea title'
    }
    
    if (!formData.ideaDescription?.trim()) {
      errors.ideaDescription = 'Please explain your idea and problem statement'
    } else if (formData.ideaDescription.trim().length < 50) {
      errors.ideaDescription = 'Please provide more details (at least 50 characters)'
    }
    
    return errors
  }, [])

  const validateStartupForm = useCallback((formData: OnboardingData): ValidationErrors => {
    const errors: ValidationErrors = {}
    
    if (!formData.startupName?.trim()) {
      errors.startupName = 'Please enter your startup name'
    }
    
    if (!formData.startupIndustry?.trim()) {
      errors.startupIndustry = 'Please select an industry'
    }
    
    if (!formData.startupDescription?.trim()) {
      errors.startupDescription = 'Please tell us about your startup'
    } else if (formData.startupDescription.trim().length < 50) {
      errors.startupDescription = 'Please provide more details (at least 50 characters)'
    }
    
    if (!formData.startupStage) {
      errors.startupStage = 'Please select your startup stage'
    }
    
    return errors
  }, [])

  const validateIncorporationForm = useCallback((formData: OnboardingData): ValidationErrors => {
    const errors: ValidationErrors = {}
    
    if (formData.isIncorporated) {
      if (!formData.incorporationDate) {
        errors.incorporationDate = 'Please enter incorporation date'
      }
      if (!formData.registrationNumber?.trim()) {
        errors.registrationNumber = 'Please enter registration number'
      }
    }
    
    return errors
  }, [])

  return {
    validateIdeaForm,
    validateStartupForm,
    validateIncorporationForm
  }
}