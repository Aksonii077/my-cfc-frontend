import React from 'react'
import { SelectItem } from '../../../../ui/select'
import { 
  OnboardingTextarea, 
  OnboardingSelect, 
  OnboardingMultiSelect 
} from '../../../ui/OnboardingFormComponents'
import { 
  EXPERTISE_OPTIONS, 
  YEARS_OF_EXPERIENCE_OPTIONS, 
  MENTOR_FORM_CONFIG 
} from '../constants/mentorConstants'
import type { MentorFormData } from '../../../types'

interface MentorFormFieldsProps {
  formData: MentorFormData
  errors: Record<string, string>
  onUpdateField: (field: keyof MentorFormData, value: string | string[]) => void
  onAddExpertise: (area: string) => void
  onRemoveExpertise: (area: string) => void
}

export const MentorFormFields: React.FC<MentorFormFieldsProps> = ({
  formData,
  errors,
  onUpdateField,
  onAddExpertise,
  onRemoveExpertise
}) => (
  <>

    <OnboardingTextarea
      id="bio"
      label="Brief Bio"
      required
      placeholder="Tell us about your background and experience..."
      value={formData.bio}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
        onUpdateField('bio', e.target.value.slice(0, MENTOR_FORM_CONFIG.bioMaxLength))
      }
      error={errors.bio}
      showCharCount
      maxLength={MENTOR_FORM_CONFIG.bioMaxLength}
    />

    <OnboardingSelect
      label="Years of Experience"
      required
      placeholder="Select years"
      value={formData.yearsOfExperience}
      onValueChange={(value: string) => onUpdateField('yearsOfExperience', value)}
      error={errors.yearsOfExperience}
    >
      {YEARS_OF_EXPERIENCE_OPTIONS.map(option => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </OnboardingSelect>

    <OnboardingMultiSelect
      label="Areas of Expertise"
      required
      placeholder="Select expertise areas"
      value={formData.expertise}
      onValueChange={() => {}} // Not used in this implementation
      options={EXPERTISE_OPTIONS}
      maxSelections={MENTOR_FORM_CONFIG.maxExpertiseSelections}
      onAddItem={onAddExpertise}
      onRemoveItem={onRemoveExpertise}
      error={errors.expertise}
    />
  </>
)