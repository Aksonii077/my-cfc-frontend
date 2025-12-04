export const EXPERTISE_OPTIONS = [
  'Strategy',
  'Marketing', 
  'Sales',
  'Product Development',
  'Technology',
  'Finance',
  'Operations',
  'HR',
  'Legal',
  'Fundraising',
  'Growth Hacking',
  'Design',
  'Customer Success',
  'Data Analytics'
] as const

export const YEARS_OF_EXPERIENCE_OPTIONS = [
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10-15', label: '10-15 years' },
  { value: '15+', label: '15+ years' }
] as const

export const MENTOR_FORM_CONFIG = {
  maxExpertiseSelections: 5,
  bioMaxLength: 150,
  validationMessages: {
    bio: {
      required: 'Please provide a brief bio',
      maxLength: 'Bio must be 150 characters or less'
    },
    expertise: {
      required: 'Please select at least one area of expertise'
    },
    yearsOfExperience: {
      required: 'Please select your years of experience'
    }
  }
} as const

export type ExpertiseOption = typeof EXPERTISE_OPTIONS[number]
export type YearsOfExperienceOption = typeof YEARS_OF_EXPERIENCE_OPTIONS[number]['value']