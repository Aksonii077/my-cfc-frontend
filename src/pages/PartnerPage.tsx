import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '@/lib/theme';

// Constants
const PARTNER_TYPES = [
  { title: 'Service Providers', description: 'Offer specialized services to startups' },
  { title: 'Suppliers', description: 'Supply essential products and materials' },
  { title: 'Vendors', description: 'Provide tools and technology solutions' },
  { title: 'Distributors', description: 'Distribute products to wider markets' },
];

const PARTNER_BENEFITS = [
  {
    title: 'Access to Growing Startups',
    description: 'Connect with innovative startups looking for reliable partners',
    icon: '🚀'
  },
  {
    title: 'Expand Your Network',
    description: 'Build relationships within the entrepreneurial ecosystem',
    icon: '🤝'
  },
  {
    title: 'Business Growth',
    description: 'Grow your business by serving emerging companies',
    icon: '📈'
  },
  {
    title: 'Early Access',
    description: 'Get early access to new market opportunities',
    icon: '⚡'
  },
];

// Reusable Components
const ArrowIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={`inline ml-2 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const PrimaryButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ 
  onClick, 
  children, 
  className = "" 
}) => (
  <button 
    onClick={onClick}
    className={`px-8 md:px-12 py-3 md:py-4 text-base md:text-lg font-semibold text-white rounded-full transition-all duration-300 hover:shadow-xl ${className}`}
    style={{ background: theme.gradients.primary }}
  >
    {children}
  </button>
);

const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#114DFF] leading-tight ${className}`}>
    {children}
  </h2>
);

const BackgroundSection: React.FC<{ 
  backgroundImage: string; 
  className?: string; 
  children: React.ReactNode 
}> = ({ backgroundImage, className = "", children }) => (
  <section
    className={`relative py-16 md:py-24 bg-cover bg-center bg-no-repeat ${className}`}
    style={{ backgroundImage: `url('${backgroundImage}')` }}
  >
    {children}
  </section>
);

const PartnerPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/partner-lookup');
  };
  
  const handleViewBenefits = () => {
    const benefitsSection = document.getElementById('partner-benefits');
    if (benefitsSection) {
      benefitsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <main
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/mentor-background.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
          <div className="text-center max-w-6xl mx-auto">
            {/* Badge */}
            <div className="inline-block px-4 md:px-6 py-2 mb-6 md:mb-8 rounded-full bg-primary-gradient">
              <span className="text-xs md:text-sm font-semibold text-white">
                Partner Program · Join Our Ecosystem
              </span>
            </div>

            {/* Hero Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-semibold text-white mb-6 md:mb-8 text-center leading-tight">
              <span className="block">Partner with</span>
              <span className="block">India's Rising Startups</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl text-white mb-8 md:mb-12 text-center leading-relaxed px-2 max-w-4xl mx-auto">
              Connect with innovative founders and grow your business in India's thriving startup ecosystem.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 px-4">
              <PrimaryButton onClick={handleGetStarted} className="w-full sm:w-auto">
                Get Started
                <ArrowIcon className="w-4 h-4 md:w-5 md:h-5" />
              </PrimaryButton>

              <button
                onClick={handleViewBenefits}
                className="w-full sm:w-auto px-8 md:px-12 py-3 md:py-4 text-base md:text-lg font-semibold bg-white rounded-full transition-all duration-300 hover:shadow-xl border-2 text-gray-700"
                style={{
                  background: "linear-gradient(white, white) padding-box, linear-gradient(92.58deg, #3CE5A7 1.95%, #114DFF 100%) border-box"
                }}
              >
                View Benefits
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Partner Types Section */}
      <BackgroundSection backgroundImage="/Group 7.png" className="rounded-b-[50px] md:rounded-b-[200px]">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle className="mb-6 md:mb-8">Who Can Join?</SectionTitle>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed px-2">
            We welcome all types of partners who want to support and grow with startups:
          </p>

          {/* Partner Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto mb-12">
            {PARTNER_TYPES.map((type, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-[#114DFF] mb-2">{type.title}</h3>
                <p className="text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>

          <p className="text-lg sm:text-xl md:text-2xl text-[#114DFF] max-w-3xl mx-auto px-2 leading-relaxed">
            Be part of the startup revolution and grow your business alongside India's next unicorns.
          </p>
        </div>
      </BackgroundSection>

      {/* Partner Benefits */}
      <section id="partner-benefits" className="relative py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle className="text-center mb-12 md:mb-16">Partner Benefits</SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {PARTNER_BENEFITS.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-semibold text-[#114DFF] mb-3">{benefit.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <BackgroundSection backgroundImage="/Group 13.png">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle className="mb-6 md:mb-8">How It Works</SectionTitle>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-[#114DFF] text-white rounded-full text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-2xl font-semibold text-[#114DFF] mb-3">Register Your Details</h3>
              <p className="text-gray-700 text-lg">Provide your contact information to get started</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-[#114DFF] text-white rounded-full text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-2xl font-semibold text-[#114DFF] mb-3">Verification & Onboarding</h3>
              <p className="text-gray-700 text-lg">Our team will verify your details and onboard you to the platform</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-[#114DFF] text-white rounded-full text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-2xl font-semibold text-[#114DFF] mb-3">Connect & Grow</h3>
              <p className="text-gray-700 text-lg">Start connecting with startups and grow your business</p>
            </div>
          </div>
        </div>
      </BackgroundSection>

      {/* Final CTA */}
      <section className="relative py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle className="mb-8">Ready To Join Our Partner Network?</SectionTitle>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Take the first step towards partnering with India's most promising startups
          </p>
          
          <div className="flex justify-center">
            <PrimaryButton onClick={handleGetStarted}>
              Get Started Now
              <ArrowIcon className="w-4 h-4 md:w-5 md:h-5" />
            </PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerPage;

