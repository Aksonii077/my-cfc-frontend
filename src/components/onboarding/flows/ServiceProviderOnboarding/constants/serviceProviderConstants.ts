export const SERVICE_PROVIDER_FORM_CONFIG = {
  maxServicesSelections: 5,
  minBioLength: 50,
  maxBioLength: 500
}

export const SERVICE_CATEGORIES = [
  'Legal & Compliance',
  'Tech Development',
  'Marketing & Growth',
  'Design & Branding',
  'Business Consulting',
  'Financial Advisory',
  'HR & Recruitment',
  'Operations & Logistics',
  'Sales & Business Development',
  'Product Management'
] as const

export const EXPERIENCE_OPTIONS = [
  { value: '0-2', label: '0-2 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '6-10', label: '6-10 years' },
  { value: '10+', label: '10+ years' }
] as const
