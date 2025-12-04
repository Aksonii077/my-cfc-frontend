export interface ValidationRule<T = any> {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: T) => string | null
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
    return 'This field is required'
  }

  // For optional fields, skip validation if value is empty
  if (!rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return null
  }

  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters`
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format'
    }
  }

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
  bio: {
    required: true,
    maxLength: 150,
    custom: (value: string) => {
      if (!value?.trim()) return 'Please provide a brief bio'
      if (value.length > 150) return 'Bio must be 150 characters or less'
      return null
    }
  },
  expertise: {
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