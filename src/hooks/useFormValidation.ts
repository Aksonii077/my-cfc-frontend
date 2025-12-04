import { useState, useCallback } from 'react'
import { validateForm, ValidationRules, ValidationErrors } from '../utils/validation'

export interface UseFormValidationOptions<T extends Record<string, any>> {
  initialData: T
  validationRules: ValidationRules
  onSubmit: (data: T) => Promise<void> | void
}

export interface UseFormValidationReturn<T> {
  data: T
  errors: ValidationErrors
  isSubmitting: boolean
  updateField: (field: keyof T, value: any) => void
  handleSubmit: () => Promise<void>
  clearError: (field: keyof T) => void
  setErrors: (errors: ValidationErrors) => void
}

export const useFormValidation = <T extends Record<string, any>>({
  initialData,
  validationRules,
  onSubmit
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> => {
  const [data, setData] = useState<T>(initialData)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }))
    }
  }, [errors])

  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => ({ ...prev, [field as string]: '' }))
  }, [])

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm(data, validationRules)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      await onSubmit(data)
    } catch (error) {
      setErrors({ submit: 'Failed to submit. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }, [data, validationRules, onSubmit])

  return {
    data,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    clearError,
    setErrors
  }
}