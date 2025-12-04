import React, { useState } from 'react';
import { theme } from '@/lib/theme';
import SignupModal from '@/components/Modals/SignupModal';

// Constants
const IMPACT_IMAGES = [
  { src: '/impact.svg', alt: 'Impact 1' },
  { src: '/impact (1).svg', alt: 'Impact 2' },
  { src: '/impact (2).svg', alt: 'Impact 3' },
  { src: '/impact (3).svg', alt: 'Impact 4' },
];

const ECOSYSTEM_IMAGES = [
  { src: '/people.svg', alt: 'People' },
  { src: '/Partner.svg', alt: 'Partners' },
  { src: '/tools.svg', alt: 'Tools' },
  { src: '/Group 18.svg', alt: 'Investors' },
  { src: '/Mentors & incubators.svg', alt: 'Mentors & Incubators' },
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

const ResponsiveImage: React.FC<{ 
  src: string; 
  alt: string; 
  className?: string;
  maxWidth?: string;
}> = ({ 
  src, 
  alt, 
  className = "w-full h-auto object-contain",
  maxWidth = "max-w-xs"
}) => (
  <img src={src} alt={alt} className={`${className} ${maxWidth}`} loading="lazy" />
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

const ImageGrid: React.FC<{ 
  images: Array<{ src: string; alt: string }>;
  maxWidth?: string;
  className?: string;
}> = ({ images, maxWidth = "max-w-xs", className = "" }) => (
  <div className={`flex justify-center ${className}`}>
    <ResponsiveImage src={images[0].src} alt={images[0].alt} maxWidth={maxWidth} />
  </div>
);

const MentorPage: React.FC = () => {
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const handleStartJourney = () => setSignupModalOpen(true);
  
  const handleViewProgramDetails = () => {
    const programSection = document.getElementById('mentor-incubation-program');
    if (programSection) {
      programSection.scrollIntoView({ 
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
                Invite-Only · Founding Mentor
              </span>
            </div>

            {/* Hero Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-semibold text-white mb-6 md:mb-8 text-center leading-tight">
              <span className="block">Shape India's</span>
              <span className="block">Entrepreneurial Future</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-6 md:mb-8 text-center leading-tight md:leading-relaxed px-2">
              Join the elite circle of mentors building tomorrow's unicorns through our AI-native incubation platform.
            </p>

            {/* Sub-description */}
            <p className="text-base sm:text-lg md:text-xl font-semibold text-white mb-8 md:mb-12 text-center px-2 leading-relaxed">
              As a Founding Mentor, you'll incubate startups, earn sweat equity, and leverage cutting-edge AI tools to accelerate founders across India.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 px-4">
              <PrimaryButton onClick={handleStartJourney} className="w-full sm:w-auto">
                Start Your Journey
                <ArrowIcon className="w-4 h-4 md:w-5 md:h-5" />
              </PrimaryButton>

              <button
                onClick={handleViewProgramDetails}
                className="w-full sm:w-auto px-8 md:px-12 py-3 md:py-4 text-base md:text-lg font-semibold bg-white rounded-full transition-all duration-300 hover:shadow-xl border-2 text-gray-700"
                style={{
                  background: "linear-gradient(white, white) padding-box, linear-gradient(92.58deg, #3CE5A7 1.95%, #114DFF 100%) border-box"
                }}
              >
                View Program Details
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* About CoFounder Circle */}
      <BackgroundSection backgroundImage="/Group 7.png" className="rounded-b-[50px] md:rounded-b-[200px]">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle className="mb-6 md:mb-8">About CoFounder Circle</SectionTitle>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed px-2">
            No more piecing together tools, talent, resources or capital. CoFounder Circle brings it all to one place:
          </p>

          {/* Ecosystem Images */}
          <div className="max-w-5xl mx-auto mb-12">
            {/* First row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
              {ECOSYSTEM_IMAGES.slice(0, 3).map((image, index) => (
                <ImageGrid key={index} images={[image]} />
              ))}
            </div>
            
            {/* Second row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto">
              {ECOSYSTEM_IMAGES.slice(3).map((image, index) => (
                <ImageGrid key={index + 3} images={[image]} />
              ))}
            </div>
          </div>

          <p className="text-lg sm:text-xl md:text-2xl text-[#114DFF] max-w-3xl mx-auto px-2 leading-relaxed">
            Think of it as the only startup operating system you will need.
          </p>
        </div>
      </BackgroundSection>

      {/* Mentor Incubation Program */}
      <section id="mentor-incubation-program" className="relative bg-white">
        <div className="bg-white shadow-lg rounded-b-[50px] md:rounded-b-[200px] py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <SectionTitle className="px-2">About the Mentor Incubation Program</SectionTitle>
          </div>
        </div>

        <div className="container mx-auto px-4 text-center py-8 md:py-12">
          <ResponsiveImage 
            src="/The mentor.svg" 
            alt="The Mentor Program" 
            className="w-full h-auto object-contain md:hidden" 
            maxWidth=""
          />
          <ResponsiveImage 
            src="/Group 101.svg" 
            alt="Mentor Incubation Program" 
            className="w-full h-auto object-contain hidden md:block max-w-6xl mx-auto" 
            maxWidth=""
          />
        </div>
      </section>

      {/* Mentor Benefits */}
      <BackgroundSection backgroundImage="/Group 13.png">
        <div className="container mx-auto px-4 text-center">
          {/* Desktop */}
          <div className="hidden md:block">
            <SectionTitle className="mb-6 md:mb-8">Mentor Benefits</SectionTitle>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
              Everything you need to build a successful portfolio
            </p>
            <div className="flex justify-center">
              <ResponsiveImage src="/Mentor benifits.svg" alt="Mentor Benefits" maxWidth="max-w-5xl" />
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex justify-center">
            <ResponsiveImage src="/Mentor benefits.svg" alt="Mentor Benefits" maxWidth="" />
          </div>
        </div>
      </BackgroundSection>

      {/* Ready To Shape The Future */}
      <section className="relative py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle className="mb-12 md:mb-16">Ready To Shape The Future?</SectionTitle>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-center max-w-6xl mx-auto">
            {IMPACT_IMAGES.map((image, index) => (
              <div key={index} className="flex items-center">
                <ImageGrid images={[image]} />
                {index < IMPACT_IMAGES.length - 1 && (
                  <div className="w-px h-32 bg-gray-300 mx-8" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-8">
            {IMPACT_IMAGES.map((image, index) => (
              <div key={index}>
                <ImageGrid images={[image]} maxWidth="max-w-48" />
                {index < IMPACT_IMAGES.length - 1 && (
                  <div className="w-full h-px bg-gray-300" />
                )}
              </div>
            ))}
          </div>
          
          {/* Final CTA */}
          <div className="flex justify-center mt-12 md:mt-16">
            <PrimaryButton onClick={handleStartJourney}>
              Start Your Journey
              <ArrowIcon className="w-4 h-4 md:w-5 md:h-5" />
            </PrimaryButton>
          </div>
        </div>
      </section>
      
      {/* Signup Modal */}
      <SignupModal 
        isOpen={signupModalOpen} 
        onClose={() => setSignupModalOpen(false)}
        redirectPath="/mentor-profile"
      />
    </div>
  );
};

export default MentorPage;