import { motion } from 'framer-motion'
import { Button } from '../../../../ui/button'
import { Card, CardContent, CardHeader } from '../../../../ui/card'
import { ArrowRight, ArrowLeft, Lightbulb, Target, Network, Zap } from 'lucide-react'

const RACE_FEATURES = [
  { icon: Lightbulb, title: 'Research', desc: 'Market insights & analysis', color: 'text-[#114DFF]' },
  { icon: Target, title: 'Advise', desc: 'Strategic guidance', color: 'text-[#114DFF]' },
  { icon: Network, title: 'Connect', desc: 'Find partners & resources', color: 'text-[#3CE5A7]' },
  { icon: Zap, title: 'Execute', desc: 'Turn ideas into action', color: 'text-[#06CB1D]' }
]

interface WelcomeStepProps {
  user: any
  onNext: () => void
  onBack?: () => void
}

export const WelcomeStep = ({ user, onNext, onBack }: WelcomeStepProps) => (
  <motion.div
    key="welcome"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <div className="space-y-3 mb-6">
          <h2 className="text-3xl text-gray-900">Welcome</h2>
          <p className="text-xl text-gray-600">to</p>
          <div className="flex justify-center my-4">
            <img 
              src="/brandlogo.svg" 
              alt="CoFounder Circle" 
              className="h-16 w-auto"
            />
          </div>
          <p className="text-sm text-gray-500">Powered by RACE AI</p>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          Hi {user?.firstName}! Let's set up your entrepreneurial journey. 
          This quick setup will help us personalize your AI companion to provide the most relevant guidance.
        </p>
      </CardHeader>
      <CardContent className="text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {RACE_FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="p-4 rounded-xl bg-gradient-to-br from-[#F7F9FF] to-white border border-[#C8D6FF] hover:shadow-md transition-all duration-200"
            >
              <feature.icon className={`w-8 h-8 mx-auto mb-2 ${feature.color}`} />
              <h3 className="mb-1 text-center">{feature.title}</h3>
              <p className="text-sm text-gray-600 text-center">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="flex items-center justify-between gap-4">
          {onBack ? (
            <Button
              variant="outline"
              size="lg"
              onClick={onBack}
              className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF] hover:border-[#114DFF] text-gray-700 px-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          ) : <div />}
          
          <Button 
            size="lg" 
            onClick={onNext}
            className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white px-8"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)