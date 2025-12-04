import { useState } from 'react'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { ArrowLeft, ArrowRight, DollarSign } from 'lucide-react'
import type { RoleOnboardingProps, InvestorData } from '../types'

const INVESTMENT_RANGES = [
  '$1K - $10K',
  '$10K - $50K',
  '$50K - $250K',
  '$250K - $1M',
  '$1M+'
]

const INVESTMENT_STAGES = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+'
]

export const InvestorOnboarding = ({ userInfo, onComplete, onBack }: RoleOnboardingProps) => {
  const [formData, setFormData] = useState<InvestorData>({
    investmentRange: '',
    portfolioSize: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      onComplete(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof InvestorData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <img 
              src="/brandlogo.svg" 
              alt="CoFounder Circle" 
              className="h-6 w-auto"
            />
          </div>
          <CardTitle className="text-xl">Investment Preferences</CardTitle>
          <p className="text-gray-600 text-sm">
            Help us match you with relevant startups
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="investmentRange">Typical Investment Range</Label>
            <Select value={formData.investmentRange} onValueChange={(value) => updateField('investmentRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your investment range" />
              </SelectTrigger>
              <SelectContent>
                {INVESTMENT_RANGES.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="portfolioSize">Current Portfolio Size (Optional)</Label>
            <Input
              id="portfolioSize"
              placeholder="e.g., 15 companies"
              value={formData.portfolioSize || ''}
              onChange={(e) => updateField('portfolioSize', e.target.value)}
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