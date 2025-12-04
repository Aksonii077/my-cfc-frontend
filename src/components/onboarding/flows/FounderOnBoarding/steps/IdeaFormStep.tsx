import { motion } from 'framer-motion'
import { Button } from '../../../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card'
import { Input } from '../../../../ui/input'
import { Textarea } from '../../../../ui/textarea'
import { Label } from '../../../../ui/label'
import { Lightbulb, ArrowRight, ArrowLeft } from 'lucide-react'
import type { IdeaFormStepProps } from '../types'

const FormField = ({ id, label, placeholder, value, error, onChange }: {
  id: string
  label: string
  placeholder: string
  value: string
  error?: string
  onChange: (value: string) => void
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={error ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}
    />
    {error && (
      <p className="text-[#FF220E] text-sm mt-1">{error}</p>
    )}
    
  </div>
)

export const IdeaFormStep = ({ 
  formData, 
  errors, 
  isSubmitting = false, 
  onUpdate, 
  onSubmit, 
  onBack 
}: IdeaFormStepProps) => (
  <motion.div
    key="idea-form"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl">Tell us about your idea</CardTitle>
        <p className="text-gray-600 mt-2">
          Help us understand your vision so we can provide targeted guidance
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          id="idea-title"
          label="Short Title *"
          placeholder="e.g., AI-powered fitness coach app"
          value={formData.ideaTitle || ''}
          error={errors.ideaTitle}
          onChange={(value) => onUpdate('ideaTitle', value)}
        />


        <div>
          <Label htmlFor="idea-description">Explain the Idea & Problem Statement *</Label>
          <Textarea
            id="idea-description"
            placeholder="Describe your idea in detail. What problem does it solve? Who is your target audience? What makes it unique?"
            value={formData.ideaDescription || ''}
            onChange={(e) => onUpdate('ideaDescription', e.target.value)}
            className={`min-h-32 ${errors.ideaDescription ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}`}
          />
          {errors.ideaDescription && (
            <p className="text-[#FF220E] text-sm mt-1">{errors.ideaDescription}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {formData.ideaDescription?.length || 0} characters (minimum 50)
          </p>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            disabled={isSubmitting}
            className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)