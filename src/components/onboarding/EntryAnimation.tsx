import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Rocket, TrendingUp } from 'lucide-react'

interface EntryAnimationProps {
  onComplete: () => void
  selectedSection?: 'idea-launch-pad' | 'growth-hub'
}

export const EntryAnimation = ({ onComplete, selectedSection }: EntryAnimationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000) // 3 second animation

    return () => clearTimeout(timer)
  }, [onComplete])

  const icon = selectedSection === 'growth-hub' ? TrendingUp : Rocket
  const title = selectedSection === 'growth-hub' ? 'Growth Hub' : 'Launch Pad'
  const subtitle = selectedSection === 'growth-hub' 
    ? 'Scaling your startup...' 
    : 'Launching your journey...'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-[#EDF2FF] to-[#F5F5F5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
          }}
          className="w-24 h-24 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-3xl flex items-center justify-center mx-auto mb-6"
        >
          {React.createElement(icon, { className: "w-12 h-12 text-white" })}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl mb-2 text-gray-900"
        >
          Welcome to {title}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-gray-600"
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </div>
  )
}