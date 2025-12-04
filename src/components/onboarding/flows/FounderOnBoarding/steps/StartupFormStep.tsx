import { motion } from 'framer-motion'
import { Button } from '../../../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card'
import { Input } from '../../../../ui/input'
import { Textarea } from '../../../../ui/textarea'
import { Label } from '../../../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../ui/tooltip'
import { Building, ArrowRight, ArrowLeft, Info } from 'lucide-react'
import type { StartupFormStepProps } from '../types'
import { INDUSTRIES, STARTUP_STAGES } from '../constants'

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

export const StartupFormStep = ({ 
  formData, 
  errors, 
  isSubmitting = false, 
  onUpdate, 
  onSubmit, 
  onBack,
  getStageDescription 
}: StartupFormStepProps) => {
  return (
    <motion.div
      key="startup-form"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Tell us about your startup</CardTitle>
          <p className="text-gray-600 mt-2">
            Help us understand your business so we can provide relevant support
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            id="startup-name"
            label="Startup Name *"
            placeholder="e.g., TechFlow Solutions"
            value={formData.startupName || ''}
            error={errors.startupName}
            onChange={(value) => onUpdate('startupName', value)}
          />

          <div>
            <Label htmlFor="startup-industry">Industry *</Label>
            <Select 
              value={formData.startupIndustry || ''} 
              onValueChange={(value) => onUpdate('startupIndustry', value)}
            >
              <SelectTrigger className={errors.startupIndustry ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry.value} value={industry.value}>
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.startupIndustry && (
              <p className="text-[#FF220E] text-sm mt-1">{errors.startupIndustry}</p>
            )}
          </div>

          <div>
            <Label htmlFor="startup-description">Tell us more about your startup *</Label>
            <Textarea
              id="startup-description"
              placeholder="What is your startup? What problem does it solve? What's your solution? Who are your customers?"
              value={formData.startupDescription || ''}
              onChange={(e) => onUpdate('startupDescription', e.target.value)}
              className={`min-h-32 ${errors.startupDescription ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}`}
            />
            {errors.startupDescription && (
              <p className="text-[#FF220E] text-sm mt-1">{errors.startupDescription}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {formData.startupDescription?.length || 0} characters (minimum 50)
            </p>
          </div>

          <div>
            <Label htmlFor="startup-stage">Startup Stage *</Label>
            <Select 
              value={formData.startupStage || ''} 
              onValueChange={(value) => onUpdate('startupStage', value)}
            >
              <SelectTrigger className={errors.startupStage ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}>
                <SelectValue placeholder="Select your current stage" />
              </SelectTrigger>
              <SelectContent>
                {STARTUP_STAGES.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <span>{stage.label}</span>
                            <Info className="w-3 h-3 ml-2 text-gray-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="right" 
                          align="center"
                          sideOffset={10}
                          className="max-w-xs z-[100]"
                          avoidCollisions={true}
                          collisionPadding={10}
                        >
                          <p>{stage.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.startupStage && (
              <p className="text-[#FF220E] text-sm mt-1">{errors.startupStage}</p>
            )}
            {formData.startupStage && (
              <p className="text-sm text-gray-600 mt-1">
                {getStageDescription(formData.startupStage)}
              </p>
            )}
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
}