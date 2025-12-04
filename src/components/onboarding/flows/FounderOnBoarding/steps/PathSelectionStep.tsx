import { motion } from 'framer-motion'
import { Button } from '../../../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card'
import { ArrowLeft, Lightbulb, Building } from 'lucide-react'

const PathOption = ({ icon: Icon, title, description, onClick }: {
  icon: React.ElementType
  title: string
  description: string
  onClick: () => void
}) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Card 
      className="cursor-pointer border-2 border-[#C8D6FF] hover:border-[#114DFF] transition-all duration-200 bg-gradient-to-br from-[#EDF2FF] to-[#F7F9FF]"
      onClick={onClick}
    >
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
)

interface PathSelectionStepProps {
  onPathSelect: (path: 'idea' | 'startup') => void
  onBack: () => void
}

export const PathSelectionStep = ({ onPathSelect, onBack }: PathSelectionStepProps) => (
  <motion.div
    key="path-selection"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Tell us about your entrepreneurial journey</CardTitle>
        <p className="text-gray-600 mt-2">This helps us customize your RACE AI experience</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PathOption
            icon={Lightbulb}
            title="I have an Idea"
            description="I am just at Ideation stage and trying to move forward from it."
            onClick={() => onPathSelect('idea')}
          />
          <PathOption
            icon={Building}
            title="I have a Startup"
            description="I already have a Startup Registered and trying to move forward."
            onClick={() => onPathSelect('startup')}
          />
        </div>
        
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)