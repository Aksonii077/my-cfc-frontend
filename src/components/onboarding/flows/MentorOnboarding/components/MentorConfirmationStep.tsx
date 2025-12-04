import { motion } from 'framer-motion'
import { Card, CardContent } from '../../../../ui/card'
import { Button } from '../../../../ui/button'
import { CheckCircle, Calendar, Mail, Home } from 'lucide-react'
import { trackEvent } from '../../../../../utils/analytics'

interface MentorConfirmationStepProps {
  userEmail: string
}

const handleSupportEmailClick = () => {
  trackEvent('mentor_support_email_click', {
    category: 'onboarding',
    action: 'support_contact',
    label: 'support@raceai.com'
  })
}

const handleBackToHome = () => {
  trackEvent('mentor_back_to_home_click', {
    category: 'onboarding',
    action: 'navigation',
    label: 'back_to_landing'
  })
  window.location.href = '/'
}

export const MentorConfirmationStep = ({ userEmail }: MentorConfirmationStepProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-[#EDF2FF] to-[#F5F5F5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-2xl border-[#C8D6FF] overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] py-8 text-center relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
              className="inline-block"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">Interest Submitted!</h1>
            <p className="text-white/90 text-sm">Thank you for your interest in joining CoFounder Circle</p>
          </div>

          <CardContent className="p-6">
            {/* Confirmation Message */}
            <div className="text-center mb-6">
              <img 
                src="/brandlogo.svg" 
                alt="CoFounder Circle" 
                className="h-10 w-auto mx-auto mb-3"
              />
              <h2 className="text-lg font-semibold text-gray-900">
                We've received your mentor program application
              </h2>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Box - What Happens Next */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-[#114DFF]" />
                  <h3 className="text-base font-semibold text-gray-900">What Happens Next?</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-[#114DFF] text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-sm text-gray-700"><span className="font-medium">Review:</span> 2-3 business days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-[#114DFF] text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-sm text-gray-700"><span className="font-medium">Call:</span> If selected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-[#114DFF] text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-sm text-gray-700"><span className="font-medium">Access:</span> Dashboard upon approval</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-[#114DFF] text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="text-sm text-gray-700"><span className="font-medium">Mentor:</span> Start reviewing applications</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Box - Response Time & Actions */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col justify-between">
                <div className="flex-1 flex items-center justify-center">
                  <div className="bg-white rounded-lg px-4 py-4 text-center border border-gray-200 w-full">
                    <p className="text-xs text-gray-600 mb-2">Confirmation will be email sent to:</p>
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg mb-3">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="font-medium text-xs">{userEmail}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-sm text-gray-700"><span className="font-medium">Response:</span> 2-3 business days</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    Questions?{' '}
                    <a 
                      href="mailto:support@raceai.com" 
                      className="text-blue-600 hover:underline"
                      onClick={handleSupportEmailClick}
                    >
                      support@raceai.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Home Button */}
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleBackToHome}
                variant="outline"
                className="border-[#114DFF] text-[#114DFF] hover:bg-[#114DFF] hover:text-white px-8"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

