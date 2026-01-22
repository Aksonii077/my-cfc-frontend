export interface ValidationRule<T = any> {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: T) => string | null
  message?: string  // ✅ Custom error messages
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface ValidationErrors {
  [key: string]: string
}

export const validateField = <T = string>(
  value: T,
  rules: ValidationRule<T>
): string | null => {
  // Check if field is required
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return rules.message || 'This field is required'
  }

  // For optional fields, skip validation if value is empty
  if (!rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return null
  }

  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return rules.message || `Must be at least ${rules.minLength} characters`
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.message || `Must be no more than ${rules.maxLength} characters`
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message || 'Invalid format'
    }
  }

  //  Run custom validation LAST (after all other checks pass)
  if (rules.custom) {
    return rules.custom(value)
  }

  return null
}

export const validateForm = <T extends Record<string, any>>(
  data: T,
  rules: ValidationRules
): ValidationErrors => {
  const errors: ValidationErrors = {}

  Object.keys(rules).forEach(field => {
    const value = data[field]
    const fieldRules = rules[field]
    const error = validateField(value, fieldRules)
    
    if (error) {
      errors[field] = error
    }
  })

  return errors
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
  phone: /^\+?[\d\s-()]+$/
} as const

// Common validation rules
export const COMMON_RULES = {
  email: {
    required: true,
    pattern: VALIDATION_PATTERNS.email
  },
  linkedinUrl: {
    required: false,
    custom: (value: string) => {
      // No hard validation rules - accept any input
      return null
    }
  },
  // ✅ MENTOR BIO (Short - max 150 chars)
  bio: {
    required: true,
    maxLength: 150,
    custom: (value: string) => {
      if (!value?.trim()) return 'Please provide a brief bio'
      if (value.length > 150) return 'Bio must be 150 characters or less'
      return null
    }
  },
  // ✅ SERVICE PROVIDER BIO (Long - 50-500 chars)
  serviceProviderBio: {
    required: true,
    minLength: 50,
    maxLength: 500,
    custom: (value: string) => {
      if (!value?.trim()) return 'Please provide a bio about your business'
      if (value.length < 50) return 'Bio must be at least 50 characters'
      if (value.length > 500) return 'Bio must be no more than 500 characters'
      return null
    }
  },
  expertise: {
    required: true,
    custom: (value: string[]) => {
      if (!value || value.length === 0) {
        return 'Please select at least one area of expertise'
      }
      return null
    }
  },
  yearsOfExperience: {
    required: true,
    custom: (value: string) => {
      if (!value) return 'Please select your years of experience'
      return null
    }
  }
} as const
