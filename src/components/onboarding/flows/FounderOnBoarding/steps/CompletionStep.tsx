import { motion } from 'framer-motion'
import { Card, CardContent } from '../../../../ui/card'
import { Badge } from '../../../../ui/badge'
import { 
  CheckCircle, 
  Rocket, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  FileText, 
  Zap, 
  Users, 
  Building, 
  Network, 
  ArrowRight,
  DollarSign,
  GraduationCap,
} from 'lucide-react'
import type { CompletionStepProps } from '../types'

const DashboardOption = ({
  icon: Icon,
  title,
  badge,
  description,
  features,
  onClick,
  buttonText,
  disabled = false,
}: {
  icon: React.ElementType;
  title: string;
  badge: string;
  description: string;
  features: Array<{ icon: React.ElementType; text: string }>;
  onClick: () => void;
  buttonText?: string;
  disabled?: boolean;
}) => (
  <motion.div
    whileHover={disabled ? {} : { scale: 1.02 }}
    whileTap={disabled ? {} : { scale: 0.98 }}
    onClick={disabled ? undefined : onClick}
    className={disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
  >
    <Card className={`h-full bg-gradient-to-br from-[#EDF2FF] to-[#F7F9FF] border-[#C8D6FF] transition-all duration-200 ${
      disabled ? "" : "hover:border-[#114DFF]"
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center mr-4">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <Badge
              variant="outline"
              className={`mb-1 ${
                badge === "Coming Soon"
                  ? "bg-yellow-50 text-yellow-600 border-yellow-300"
                  : "bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]"
              }`}
            >
              {badge}
            </Badge>
            <h3 className="text-xl text-left">{title}</h3>
          </div>
        </div>

        <p className="text-gray-700 mb-4 text-left">{description}</p>

        <div className="space-y-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center text-sm text-gray-600"
            >
              <feature.icon
                className={`w-4 h-4 mr-2 ${
                  index < 2 ? "text-[#114DFF]" : "text-[#3CE5A7]"
                }`}
              />
              {feature.text}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center text-[#114DFF]">
          <span className="text-sm">{buttonText}</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export const CompletionStep = ({
  isSubmitting,
  onFinalSubmit,
  userPath,
}: CompletionStepProps) => {
  // Only Mentor should be clickable for all paths
  // Launch Pad is coming soon
  const isMentorEnabled = true  // Always enabled
  const isLaunchPadEnabled = false  // Always disabled (coming soon)

  return (
  <motion.div
    key="completion"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm">
      <CardContent className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
          className="w-24 h-24 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-3xl flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl mb-4">Perfect! You're all set</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Welcome! We're excited to help you on your entrepreneurial journey.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-6">
            <DashboardOption
              icon={GraduationCap}
              title="Mentor"
              badge="Perfect for Your Journey"
              description="Connect with experienced mentors and advisor to guide your entrepreneurial journey."
              features={[
                { icon: Users, text: "Find Expert Mentors" },
                { icon: Building, text: "One-on-One Guidance" },
                { icon: Network, text: "Industry Connections" },
              ]}
              onClick={() => onFinalSubmit("growth-hub")}
              buttonText="Click to explore"
              disabled={false}
            />
            <DashboardOption
              icon={Rocket}
              title="Launch Pad"
              badge="Coming Soon"
              description="Transform your concepts into viable business plans with AI-powered tools and guidance."
              features={[
                { icon: Lightbulb, text: "Ideation & Brainstorming Tools" },
                { icon: Target, text: "Market Research & Analysis" },
                { icon: FileText, text: "Business Plan Builder" },
              ]}
              onClick={() => onFinalSubmit("idea-launch-pad")}
              buttonText="Available Soon"
              disabled={true}
            />

            <DashboardOption
              icon={TrendingUp}
              title="Growth Hub"
              badge="Coming Soon"
              description="Scale your registered startup with strategic connections and growth-focused resources."
              features={[
                { icon: Lightbulb, text: "Connect with Mentors" },
                { icon: Target, text: "Find Service Providers" },
                { icon: FileText, text: "Access Investors Network" },
              ]}
              onClick={() => onFinalSubmit("idea-launch-pad")}
              buttonText="Available Soon"
              disabled={true}
            />
            <DashboardOption
              icon={DollarSign}
              title="Funding"
              badge="Coming Soon"
              description="Access investor, funding opportunities, and resources to fuel your growth."
              features={[
                { icon: Lightbulb, text: "Investor Network Access" },
                { icon: Target, text: "Funding Opportunities" },
                { icon: FileText, text: "Pitch Desk Preparation" },
              ]}
              onClick={() => onFinalSubmit("idea-launch-pad")}
              buttonText="Available Soon"
              disabled={true}
            />
          </div>
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
  )
};