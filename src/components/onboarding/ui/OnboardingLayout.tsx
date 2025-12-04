import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Alert, AlertDescription } from '../../ui/alert'
import { Button } from '../../ui/button'
import { ArrowLeft, AlertCircle, Star } from 'lucide-react'
import cofounderCircleLogo from '/brandlogo.svg'

interface OnboardingLayoutProps {
  title: string
  subtitle?: string
  showInviteOnlyBadge?: boolean
  submitError?: string
  children: React.ReactNode
  onBack?: () => void
  onSubmit?: () => void
  submitText?: string
  isSubmitting?: boolean
  submitIcon?: React.ReactNode
  submitDisabled?: boolean
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  title,
  subtitle,
  showInviteOnlyBadge,
  submitError,
  children,
  onBack,
  onSubmit,
  submitText = 'Continue',
  isSubmitting = false,
  submitIcon,
  submitDisabled = false
}) => (
  <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-[#EDF2FF] to-[#F5F5F5] flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl"
    >
      <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm max-w-4xl w-full" role="main">
        <CardHeader className="text-center pb-3 pt-4">
          <div className="flex justify-center mb-2">
            <img 
              src={cofounderCircleLogo} 
              alt="CoFounder Circle Logo" 
              className="h-9 w-auto"
            />
          </div>
          
          {showInviteOnlyBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#114DFF]/10 to-[#3CE5A7]/10 border border-[#114DFF]/20 rounded-full mx-auto mb-2">
              <Star className="w-3 h-3 text-[#114DFF]" />
              <span className="text-xs text-[#114DFF]">Invite Only Program</span>
            </div>
          )}

          <CardTitle className="text-lg">{title}</CardTitle>
          {subtitle && (
            <p className="text-gray-600 text-xs mt-1">{subtitle}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-3 px-6 pb-4">
          {submitError && (
            <Alert variant="destructive" className="py-2" role="alert" aria-live="assertive">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <AlertDescription className="text-xs">{submitError}</AlertDescription>
            </Alert>
          )}

          {children}

          {(onBack || onSubmit) && (
            <div className="pt-2 flex gap-2">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                  disabled={isSubmitting}
                  className="flex-1 h-9 text-xs border-[#C8D6FF] hover:bg-[#EDF2FF] text-gray-700"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </span>
                </Button>
              )}
              {onSubmit && (
                <Button
                  onClick={onSubmit}
                  disabled={isSubmitting || submitDisabled}
                  className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white h-9 text-xs"
                  aria-describedby="submit-description"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <div 
                        className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" 
                        aria-hidden="true"
                      />
                      <span aria-live="polite">Submitting...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      {submitText}
                      {submitIcon && <span aria-hidden="true">{submitIcon}</span>}
                    </span>
                  )}
                </Button>
              )}
            </div>
          )}

          <p id="submit-description" className="text-[9px] text-center text-gray-500 leading-snug">
            By submitting, you agree to be contacted regarding the program
          </p>
        </CardContent>
      </Card>
    </motion.div>
  </div>
)