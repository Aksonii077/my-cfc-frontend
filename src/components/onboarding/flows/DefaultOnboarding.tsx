import { useState } from 'react'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react'
import type { RoleOnboardingProps } from '../types'

export const DefaultOnboarding = ({ userInfo, onComplete, onBack }: RoleOnboardingProps) => {
  const [interests, setInterests] = useState('')
  const [goals, setGoals] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      onComplete({ interests, goals })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleDisplayName = () => {
    const roleLabels = {
      job_seeker: 'Job Seeker',
      supplier: 'Supplier',
      data_provider: 'Data Provider',
      exploring: 'Explorer'
    }
    return roleLabels[userInfo.selectedRole as keyof typeof roleLabels] || 'Member'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-6 h-6 text-blue-600" />
            <img 
              src="/brandlogo.svg" 
              alt="CoFounder Circle" 
              className="h-6 w-auto"
            />
          </div>
          <CardTitle className="text-xl">Welcome {getRoleDisplayName()}!</CardTitle>
          <p className="text-gray-600 text-sm">
            Tell us more about your interests and goals
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="interests">What are you interested in?</Label>
            <Textarea
              id="interests"
              placeholder="Tell us about your interests in the startup ecosystem..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="goals">What are your goals on CoFounder Circle?</Label>
            <Textarea
              id="goals"
              placeholder="What do you hope to achieve? Learning, networking, opportunities..."
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Complete Setup
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}