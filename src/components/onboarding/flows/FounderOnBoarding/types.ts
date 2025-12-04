export interface OnboardingData extends Record<string, unknown> {
  path: 'idea' | 'startup' | null
  selectedSection?: 'idea-launch-pad' | 'growth-hub'
  ideaTitle?: string
  ideaDescription?: string
  startupName?: string
  startupDescription?: string
  startupIndustry?: string
  startupStage?: string
  isIncorporated?: boolean
  incorporationDate?: string
  registrationNumber?: string
}

export type OnboardingStep = 'welcome' | 'path-selection' | 'idea-form' | 'startup-form' | 'incorporation' | 'completion' | 'entry-animation'

export type ValidationErrors = Record<string, string>

export interface StartupStage {
  value: string
  label: string
  description: string
}

export interface Industry {
  value: string
  label: string
}

export interface StepComponentProps {
  formData: OnboardingData
  errors: ValidationErrors
  isSubmitting?: boolean
  onUpdate: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void
  onSubmit: () => void
  onBack: () => void
}

export interface IdeaFormStepProps extends StepComponentProps {}

export interface StartupFormStepProps extends StepComponentProps {
  getStageDescription: (stage: string) => string
}

export interface CompletionStepProps {
  isSubmitting: boolean
  onFinalSubmit: (selectedSection?: 'idea-launch-pad' | 'growth-hub') => void
  userPath?: 'idea' | 'startup' | null
}