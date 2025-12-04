export interface UserInfoData {
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  website?: string
  linkedin?: string
  selectedRole: string
}

export interface ValidationErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  website?: string
  linkedin?: string
  selectedRole?: string
  submit?: string
}

export type UserRole = {
  id: string
  label: string
  icon: React.ElementType
}

export type CountryCode = {
  code: string
  country: string
  flag: string
}

export type OnboardingStep = 'userInfo' | 'roleSpecific' | 'completed'

export interface RoleOnboardingProps {
  userInfo: UserInfoData
  onComplete: (additionalData?: Record<string, unknown>) => void
  onBack: () => void
}

// Role-specific data interfaces
export interface FounderData extends Record<string, unknown> {
  companyName?: string
  industry?: string
  stage?: string
  teamSize?: string
  fundingNeeds?: string
}

export interface InvestorData extends Record<string, unknown> {
  investmentStage?: string[]
  industries?: string[]
  investmentRange?: string
  portfolioSize?: string
}

export interface MentorData extends Record<string, unknown> {
  linkedinUrl?: string
  bio: string
  expertise: string[]
  yearsOfExperience: string
}

export interface MentorFormData {
  bio: string
  expertise: string[]
  yearsOfExperience: string
}

export interface FreelancerData extends Record<string, unknown> {
  skills?: string[]
  experience?: string
  hourlyRate?: string
  availability?: string
}

export interface ServiceProviderData extends Record<string, unknown> {
  services?: string[]
  businessType?: string
  clientTypes?: string[]
  pricing?: string
}

export interface StudentData extends Record<string, unknown> {
  school?: string
  major?: string
  graduationYear?: string
  interests?: string[]
}