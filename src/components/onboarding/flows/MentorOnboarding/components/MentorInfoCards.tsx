import React from 'react'
import { Card, CardContent } from '../../../../ui/card'
import { Building } from 'lucide-react'

export const MentorBenefitsCard: React.FC = () => (
  <Card className="bg-gradient-to-br from-[#EDF2FF] to-[#F7F9FF] border-[#C8D6FF]">
    <CardContent className="p-3">
      <div className="flex items-start gap-2">
        <Building className="w-4 h-4 text-[#114DFF] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-gray-900 text-sm mb-1.5">Why Join as a Mentor?</h4>
          <ul className="space-y-1 text-xs text-gray-600">
            <li>• Guide promising startups</li>
            <li>• Expand your network</li>
            <li>• Shape entrepreneurship future</li>
            <li>• Access exclusive community</li>
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
)

export const MentorProcessCard: React.FC = () => (
  <Card className="bg-[#F7F9FF] border-[#C8D6FF]">
    <CardContent className="p-3">
      <h4 className="text-gray-900 text-sm mb-1.5">What Happens Next?</h4>
      <ol className="space-y-1 text-xs text-gray-600">
        <li className="flex gap-1.5">
          <span className="text-[#114DFF]">1.</span>
          <span>Review within 2-3 business days</span>
        </li>
        <li className="flex gap-1.5">
          <span className="text-[#114DFF]">2.</span>
          <span>Schedule introductory call if selected</span>
        </li>
        <li className="flex gap-1.5">
          <span className="text-[#114DFF]">3.</span>
          <span>Access mentor dashboard upon approval</span>
        </li>
      </ol>
    </CardContent>
  </Card>
)