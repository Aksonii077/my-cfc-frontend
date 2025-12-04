import React from 'react';
import { COLORS } from '../../constants/fef';
import ResponsiveButton from './ResponsiveButton';
import AnimatedContent from './AnimatedContent';

// Benefits & Rewards Component
interface BenefitsRewardsContentProps {
  onApplyNowClick?: () => void;
}

export const BenefitsRewardsContent: React.FC<BenefitsRewardsContentProps> = ({ onApplyNowClick }) => (
  <AnimatedContent className="mt-16 px-4 sm:px-6 md:px-8 lg:px-16 py-16">
    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">What Winners Get</h1>
    <p className="text-base md:text-lg max-w-4xl mx-auto mb-12">
      Transform your startup with funding, incubation, and massive visibility
    </p>
    
    {/* Benefits Images */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {['Frame 16.svg', 'Group 43.svg', 'Group 44.svg'].map((image, index) => (
        <div key={index} className="flex justify-center">
          <img 
            src={`/fef/${image}`} 
            alt={`Benefit ${index + 1}`} 
            className="w-full max-w-sm h-auto object-contain" 
            loading="lazy" 
          />
        </div>
      ))}
    </div>
    
    {/* Call to Action Section */}
    <div className="mt-16 md:mt-24 text-center">
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-thin text-white mb-6">
        "You Can Be Season 2."
      </h1>
      <p className="text-base md:text-lg text-white max-w-4xl mx-auto mb-8">
        Don't let this opportunity slip away. Applications are limited.
      </p>
      
      <p className="font-bold text-lg mb-6 tracking-wider" style={{ color: COLORS.primary }}>
        LIMITED SPOTS!
      </p>
      
      <ResponsiveButton 
        variant="primary" 
        size="lg"
        onClick={onApplyNowClick}
      >
        Apply Now!
      </ResponsiveButton>
      
      <div className="mt-12 md:mt-16 flex justify-center">
        <img 
          src="/fef/Vector 7.svg" 
          alt="Vector Design" 
          className="h-auto object-contain" 
          loading="lazy" 
        />
      </div>
    </div>
  </AnimatedContent>
);

// Application Process Component
interface ApplicationProcessContentProps {
  onApplyNowClick?: () => void;
}

export const ApplicationProcessContent: React.FC<ApplicationProcessContentProps> = ({ onApplyNowClick }) => {
  const steps = [
    { number: '1', title: 'APPLY NOW', description: 'Submit your startup via our comprehensive application form.' },
    { number: '2', title: 'GET SHORTLISTED', description: 'Shortlisted startups are invited for detailed interviews.' },
    { number: '3', title: 'GET ON SEASON 2 & COMPETE', description: 'Selected founders showcase their ideas in Season 2 episodes.' },
    { number: '4', title: 'GET FUNDED & INCUBATED', description: 'Winners receive funding from Fashion Entrepreneur Fund + incubation partnership with CoFounder Circle.' }
  ];

  return (
    <AnimatedContent className="mt-16 md:mt-24 text-center px-4 sm:px-6 md:px-8 lg:px-16 py-16">
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: COLORS.primary }}>
        How It Works
      </h2>
      <p className="text-base md:text-lg text-white max-w-4xl mx-auto mb-12 md:mb-16">
        Your journey from application to funding in four simple steps
      </p>
      
      {/* Step Cards */}
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        {steps.map((step) => (
          <div key={step.number} className="bg-black rounded-2xl p-6 md:p-8 border border-[#f9ac03]">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="text-white text-4xl md:text-6xl font-bold">{step.number}</div>
              <div className="text-left flex-1">
                <h3 className="text-[#f9ac03] text-lg md:text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-300 text-base md:text-lg">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 md:mt-16 pb-8 md:pb-16">
        <ResponsiveButton 
          variant="primary" 
          size="lg"
          onClick={onApplyNowClick}
        >
          Apply Now!
        </ResponsiveButton>
      </div>
    </AnimatedContent>
  );
};

// Requirements & Criteria Component
export const RequirementsCriteriaContent: React.FC = () => {
  const criteria = [
    {
      title: 'STARTUP STAGE',
      items: [
        'Fashion, lifestyle, or beauty industry focus',
        'Minimum Viable Product (MVP) ready',
        'Some traction or customer validation',
        'Scalable business model',
        'India-based company registration'
      ]
    },
    {
      title: 'FOUNDER QUALIFICATIONS',
      items: [
        'Passionate and committed founding team',
        'Clear vision and business acumen',
        'Ability to articulate ideas effectively',
        'Willingness to relocate for filming',
        'Available for 6-8 weeks commitment'
      ]
    },
    {
      title: 'REQUIRED DOCUMENTS',
      items: [
        'Business plan and pitch deck',
        'Financial projections and statements',
        'Product portfolio and samples',
        'Team profiles and resumes',
        'Company incorporation documents'
      ]
    },
    {
      title: 'SELECTION CRITERIA',
      items: [
        'Innovation and uniqueness of concept',
        'Market potential and scalability',
        'Team strength and execution ability',
        'Financial viability and projections',
        'Alignment with show\'s values'
      ]
    }
  ];

  return (
    <AnimatedContent className="mt-16 md:mt-24 text-center px-4 sm:px-6 md:px-8 lg:px-16 py-16">
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: COLORS.primary }}>
        Requirements & Criteria
      </h2>
      <p className="text-base md:text-lg text-white max-w-4xl mx-auto mb-12 md:mb-16">
        Ensure your startup meets these eligibility criteria before applying
      </p>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {criteria.map((card, index) => (
          <div key={index} className="bg-black rounded-2xl p-6 md:p-8 border border-[#f9ac03] text-center">
            <h3 className="text-[#f9ac03] text-lg md:text-xl font-bold mb-6">{card.title}</h3>
            <div className="space-y-3 md:space-y-4">
              {card.items.map((item, idx) => (
                <p key={idx} className="text-gray-300 text-sm md:text-base">{item}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AnimatedContent>
  );
};