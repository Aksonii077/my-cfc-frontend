import { useState, useEffect, useCallback, memo } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase,
  AlertCircle,
  ArrowRight,
  Globe,
  ExternalLink
} from 'lucide-react'
import { USER_ROLES, COUNTRY_CODES } from './constants'
import type { UserInfoData, ValidationErrors, UserRole } from './types'
import { apiClient } from '../../utils/api'
import { useUserStore } from '../../stores/userStore'
import { logger } from '../../utils/logger'
import { trackEvent, trackOnboardingStepView, trackOnboardingStepComplete } from '../../utils/analytics'

interface UserInfoProps {
  onComplete: (data: UserInfoData) => void
}

const UserInfo = memo(({ onComplete }: UserInfoProps) => {
  const { user } = useUserStore()
  const [formData, setFormData] = useState<UserInfoData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    website: '',
    linkedin: '',
    selectedRole: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stepStartTime] = useState(Date.now())

  // Track user info step view on mount
  useEffect(() => {
    trackOnboardingStepView(1, 'User Info')
    trackEvent('user_info_step_view', {
      category: 'onboarding',
      label: 'user_info_form'
    })
  }, [])

  // Populate form with existing user data from user store or localStorage
  useEffect(() => {
    // First, try to restore from localStorage (for back navigation)
    try {
      const savedData = localStorage.getItem('onboarding_userInfo')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
        logger.debug('[USER_INFO] Restored data from localStorage')
        return
      }
    } catch (error) {
      logger.error('[USER_INFO] Error restoring data from localStorage:', error)
    }

    // If no saved data, populate from user store
    if (!user) return
    
    const nameParts = user.name?.split(' ') || []
    
    setFormData(prev => ({
      ...prev,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user.email || ''
    }))
  }, [user])

  // Auto-save form data to localStorage whenever it changes
  useEffect(() => {
    if (formData.firstName || formData.lastName || formData.phone || formData.selectedRole) {
      try {
        localStorage.setItem('onboarding_userInfo', JSON.stringify(formData))
      } catch (error) {
        logger.error('[USER_INFO] Error saving data to localStorage:', error)
      }
    }
  }, [formData])

  const validateField = useCallback((field: keyof UserInfoData, value: string): string => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return value.trim() ? '' : `${field === 'firstName' ? 'First' : 'Last'} name is required`
      
      case 'email':
        if (!value.trim()) return 'Email is required'
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email'
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        return /^\d{10}$/.test(value) ? '' : 'Please enter a valid 10-digit phone number'
      
      case 'website':
        if (!value.trim()) return '' // Optional field
        return /^https?:\/\/.+/.test(value) ? '' : 'Please enter a valid website URL'
      
      case 'linkedin':
        // Optional field with no hard validation rules
        return ''
      
      case 'selectedRole':
        return value ? '' : 'Please select your role'
      
      default:
        return ''
    }
  }, [])

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    Object.keys(formData).forEach(key => {
      const field = key as keyof UserInfoData
      if ((field === 'website' || field === 'linkedin') && !formData[field]) {
        // Skip validation for empty optional website and linkedin fields
        return
      }
      const error = validateField(field, formData[field] || '')
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [formData, validateField])

  const updateField = useCallback((field: keyof UserInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Track role selection specifically
    if (field === 'selectedRole' && value) {
      trackEvent('user_role_selected', {
        category: 'onboarding',
        label: value,
        role: value
      })
    }
    
    // Clear field error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const handleWebsiteBlur = useCallback(() => {
    const website = formData.website?.trim()
    if (website && !website.match(/^https?:\/\//i)) {
      updateField('website', `https://${website}`)
    }
  }, [formData.website, updateField])

  const handleLinkedInBlur = useCallback(() => {
    const linkedin = formData.linkedin?.trim()
    // Only auto-add https:// if it looks like a URL (contains a dot) and doesn't already have a protocol
    if (linkedin && linkedin.includes('.') && !linkedin.match(/^https?:\/\//i)) {
      updateField('linkedin', `https://${linkedin}`)
    }
  }, [formData.linkedin, updateField])

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      trackEvent('user_info_validation_error', {
        category: 'onboarding',
        error_fields: Object.keys(errors)
      })
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone}`,
        website: formData.website || '',
        linkedin: formData.linkedin || '',
        role: formData.selectedRole
      }

      await apiClient.post("/api/update-user", payload);
      
      // Track successful completion
      const timeSpent = Math.floor((Date.now() - stepStartTime) / 1000)
      trackOnboardingStepComplete(1, 'User Info', timeSpent)
      
      trackEvent('user_info_submit_success', {
        category: 'onboarding',
        role: formData.selectedRole,
        has_website: !!formData.website,
        has_linkedin: !!formData.linkedin,
        time_spent: timeSpent
      })
      
      // Keep data in localStorage for potential back navigation
      onComplete(formData)
    } catch (error) {
      logger.error('[USER_INFO] Form submission failed:', error)
      trackEvent('user_info_submit_failed', {
        category: 'onboarding',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      setErrors({ submit: 'Failed to save information. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateForm, onComplete, errors, stepStartTime])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center pb-4">
          <img 
            src="/brandlogo.svg" 
            alt="CoFounder Circle" 
            className="h-6 w-auto mx-auto mb-2"
          />
          <CardTitle className="text-xl">Complete Your Profile</CardTitle>
          <p className="text-gray-600 text-sm">
            Tell us a bit about yourself to get started
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <ErrorAlert error={errors.submit} />
          <BasicInfoSection 
            formData={formData}
            errors={errors}
            onFieldChange={updateField}
            isEmailDisabled={!!user?.email}
            onWebsiteBlur={handleWebsiteBlur}
            onLinkedInBlur={handleLinkedInBlur}
          />
          <RoleSelectionSection 
            selectedRole={formData.selectedRole}
            error={errors.selectedRole}
            onRoleChange={(role) => updateField('selectedRole', role)}
          />
          <SubmitSection 
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
          <PrivacyNotice />
        </CardContent>
      </Card>
    </div>
  )
})

// Sub-components for better organization
const ErrorAlert = ({ error }: { error?: string }) => {
  if (!error) return null
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="w-4 h-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}

const BasicInfoSection = memo(({ 
  formData, 
  errors, 
  onFieldChange, 
  isEmailDisabled,
  onWebsiteBlur,
  onLinkedInBlur
}: {
  formData: UserInfoData
  errors: ValidationErrors
  onFieldChange: (field: keyof UserInfoData, value: string) => void
  isEmailDisabled: boolean
  onWebsiteBlur: () => void
  onLinkedInBlur: () => void
}) => (
  <div className="space-y-3">
    <SectionHeader icon={User} title="Basic Information" />
    
    <div className="grid grid-cols-2 gap-3">
      <FormField
        id="firstName"
        label="First Name *"
        placeholder="John"
        value={formData.firstName}
        error={errors.firstName}
        onChange={(value) => onFieldChange('firstName', value)}
      />
      <FormField
        id="lastName"
        label="Last Name *"
        placeholder="Doe"
        value={formData.lastName}
        error={errors.lastName}
        onChange={(value) => onFieldChange('lastName', value)}
      />
    </div>

    <FormField
      id="email"
      label={isEmailDisabled ? "Email Address * (from your account)" : "Email Address *"}
      type="email"
      placeholder="john@example.com"
      value={formData.email}
      error={errors.email}
      disabled={isEmailDisabled}
      icon={Mail}
      onChange={(value) => onFieldChange('email', value)}
    />

    <PhoneField
      countryCode={formData.countryCode}
      phone={formData.phone}
      error={errors.phone}
      onCountryChange={(code) => onFieldChange('countryCode', code)}
      onPhoneChange={(phone) => onFieldChange('phone', phone)}
    />

    <FormField
      id="website"
      label="Website URL (Optional)"
      type="url"
      placeholder="yourwebsite.com"
      value={formData.website || ''}
      error={errors.website}
      icon={Globe}
      onChange={(value) => onFieldChange('website', value)}
      onBlur={onWebsiteBlur}
    />

    <FormField
      id="linkedin"
      label="LinkedIn Profile (Optional)"
      type="text"
      placeholder="LinkedIn URL or username"
      value={formData.linkedin || ''}
      error={errors.linkedin}
      icon={ExternalLink}
      onChange={(value) => onFieldChange('linkedin', value)}
      onBlur={onLinkedInBlur}
    />
  </div>
))

const RoleSelectionSection = memo(({ 
  selectedRole, 
  error, 
  onRoleChange 
}: {
  selectedRole: string
  error?: string
  onRoleChange: (role: string) => void
}) => {
  const clickableRoles = ['founder', 'mentor']
  
  return (
    <div className="space-y-3">
      <SectionHeader icon={Briefcase} title="What describes you best?" />
      
      <div className="grid grid-cols-4 gap-2">
        {USER_ROLES.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            isSelected={selectedRole === role.id}
            isClickable={clickableRoles.includes(role.id)}
            onClick={() => onRoleChange(role.id)}
          />
        ))}
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
})

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType, title: string }) => (
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4 text-blue-600" />
    <h3 className="text-base font-semibold">{title}</h3>
  </div>
)

const FormField = memo(({ 
  id, 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  error, 
  disabled, 
  icon: Icon,
  onChange,
  onBlur
}: {
  id: string
  label: string
  type?: string
  placeholder: string
  value: string
  error?: string
  disabled?: boolean
  icon?: React.ElementType
  onChange: (value: string) => void
  onBlur?: () => void
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />}
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={`
          ${Icon ? 'pl-10' : ''} 
          ${error ? 'border-red-500' : ''} 
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : ''}
        `}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
))

const PhoneField = memo(({ 
  countryCode, 
  phone, 
  error, 
  onCountryChange, 
  onPhoneChange 
}: {
  countryCode: string
  phone: string
  error?: string
  onCountryChange: (code: string) => void
  onPhoneChange: (phone: string) => void
}) => (
  <div>
    <Label htmlFor="phone">Phone Number *</Label>
    <div className="flex gap-2">
      <Select value={countryCode} onValueChange={onCountryChange}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.flag} {country.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative flex-1">
        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          id="phone"
          type="tel"
          placeholder="9876543210"
          value={phone}
          onChange={(e) => {
            const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10)
            onPhoneChange(digitsOnly)
          }}
          maxLength={10}
          className={`pl-10 ${error ? 'border-red-500' : ''}`}
        />
      </div>
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
))

const RoleCard = memo(({ 
  role, 
  isSelected, 
  isClickable,
  onClick 
}: { 
  role: UserRole
  isSelected: boolean
  isClickable: boolean
  onClick: () => void 
}) => (
  <button
    type="button"
    onClick={isClickable ? onClick : undefined}
    disabled={!isClickable}
    className={`p-2 rounded-lg border-2 transition-all duration-200 text-center ${
      isClickable ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-50'
    } ${
      isSelected
        ? 'border-blue-500 bg-blue-50 shadow-md'
        : 'border-gray-200 hover:border-gray-300'
    }`}
  >
    <role.icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
    <span className={`text-xs font-medium ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>
      {role.label}
    </span>
  </button>
))

const SubmitSection = ({ isSubmitting, onSubmit }: { isSubmitting: boolean, onSubmit: () => void }) => (
  <div className="pt-3">
    <Button
      onClick={onSubmit}
      disabled={isSubmitting}
      className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white py-2"
    >
      {isSubmitting ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          Continue
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </Button>
  </div>
)

const PrivacyNotice = () => (
  <p className="text-xs text-center text-gray-500 mt-4">
    By continuing, you agree to our{' '}
    <a 
      href="/terms" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 underline"
    >
      Terms of Service
    </a>
    {' '}and{' '}
    <a 
      href="/privacy" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 underline"
    >
      Privacy Policy
    </a>
  </p>
)

UserInfo.displayName = 'UserInfo'

export default UserInfo