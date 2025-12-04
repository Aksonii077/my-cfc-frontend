import React, { useState, useEffect } from "react";
import SignupModal from '@/components/Modals/SignupModal';
import { useGA4Analytics } from '@/hooks/useGA4Analytics';

// Types and interfaces
interface ResponsiveImageProps {
  mobileSrc: string;
  desktopSrc: string;
  alt: string;
  className?: string;
  width?: string;
  height?: string;
}

interface StatsItemProps {
  number: string;
  description: string[];
}

// Reusable Components
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  mobileSrc,
  desktopSrc,
  alt,
  className = "",
  width,
  height,
}) => (
  <>
    <img
      src={mobileSrc}
      alt={alt}
      className={`${className} md:hidden`}
      loading="lazy"
      width={width}
      height={height}
    />
    <img
      src={desktopSrc}
      alt={alt}
      className={`${className} hidden md:block`}
      loading="lazy"
      width={width}
      height={height}
    />
  </>
);

const StatsItem: React.FC<StatsItemProps> = ({ number, description }) => (
  <div className="flex flex-col items-center flex-1">
    <h3
      className="text-2xl md:text-4xl font-bold text-white mb-2"
    >
      {number}
    </h3>
    <p className="text-sm md:text-base leading-tight text-center" >
      {description.map((line, index) => (
        <span key={index}>
          {line}
          {index < description.length - 1 && <br />}
        </span>
      ))}
    </p>
  </div>
);

const FeatureImage: React.FC<{
  mobileSrc: string;
  desktopSrc: string;
  alt: string;
}> = ({ mobileSrc, desktopSrc, alt }) => (
  <div className="flex justify-center">
    <ResponsiveImage
      mobileSrc={mobileSrc}
      desktopSrc={desktopSrc}
      alt={alt}
      className="w-auto h-auto"
    />
  </div>
);

// Constants
const STATS_DATA = [
  { number: "1", description: ["Startup", "Selected Weekly"] },
  { number: "10", description: ["Weeks of", "Incubation"] },
  { number: "10", description: ["Startups Pitch", "to Investors"] },
];

const FEATURE_IMAGES = [
  { mobile: "/Structured.svg", desktop: "/Structured support.svg", alt: "Structured Support" },
  { mobile: "/Ai enabled (1).svg", desktop: "/AI enabled.svg", alt: "AI Enabled" },
  { mobile: "/Acess to.svg", desktop: "/Group 88.svg", alt: "Access To" },
  { mobile: "/Demo day (1).svg", desktop: "/Demo day.svg", alt: "Demo Day" },
];

const ACTION_IMAGES = [
  { src: "/Get incubated (1).svg", alt: "Get Incubated" },
  { src: "/Get funded (1).svg", alt: "Get Funded" },
];

// Styles
const styles = {
  heroBackground: { backgroundImage: "url('/Top card.svg')" },
  sectionBackground: { backgroundColor: "#021959" },
  statsGradient: {
    background: "linear-gradient(91.91deg, #3CE5B4 0.19%, #114DFF 39.48%, #031F75 98.29%)",
  },
  buttonStyle: {
    backgroundColor: "#3ae5a7",
    color: "#021959",
  },
  mobileTopPadding: { paddingTop: "21rem" },
  desktopTopPadding: { paddingTop: "10rem" },
};

const PitchTankLandingPage: React.FC = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { trackPitchTankEvent, trackButtonClick } = useGA4Analytics();

  // Track page view on component mount
  useEffect(() => {
    trackPitchTankEvent('landing_view', 'hero_section');
  }, [trackPitchTankEvent]);

  const handleStartApplication = () => {
    // Track button click
    trackButtonClick('start_application', 'pitch_tank_landing', {
      button_location: 'hero_section',
      user_action: 'cta_click'
    });
    
    // Track pitch tank event
    trackPitchTankEvent('form_start', 'application_modal');
    
    setIsSignupModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={styles.heroBackground}
      >

        <div className="relative z-10 flex items-center justify-center min-h-screen py-10 md:py-20">
          <div className="container mx-auto px-4 text-center">
            {/* Welcome Heading */}
            <h1
              className="font-bold text-white mb-2 md:mb-8 tracking-wider leading-tight"
              style={{
                fontSize: "20px",
                lineHeight: "1.2",
              }}
            >
              <span className="tracking-widest block md:inline">
                W E L C O M E
              </span>
              <span className="mx-2 md:mx-8 hidden md:inline"></span>
              <span className="tracking-widest block md:inline mt-1 md:mt-0">
                T O
              </span>
              <style>
                {`@media (min-width: 768px) { h1 { font-size: 36px !important; } }`}
              </style>
            </h1>

            {/* Pitch Tank Logo */}
            <div className="mb-4 md:mb-12">
              <img
                src="/Pitch tank logo.svg"
                alt="Pitch Tank Logo"
                className="w-auto mx-auto"
                loading="eager"
              />
            </div>

            {/* Tagline */}
            <div className="mb-6 md:mb-24">
              <h2 className="text-lg md:text-2xl font-bold text-white leading-tight">
                Where Ideas Get Real.
                <br />
                And Real Ideas Get Funded.
              </h2>
            </div>

            {/* Action Images */}
            <div className="mb-6 md:mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
                {ACTION_IMAGES.map((image, index) => (
                  <div key={index} className="flex justify-center">
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="eager"
                      width="174px"
                      {...(index === 1 && {
                        className: "pb-8",
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Pitch Tank Section */}
      <section
        className="relative py-8 md:py-16"
        style={styles.sectionBackground}
      >
        {/* Stats Bridge Section */}
        <div className="absolute left-0 right-0 -top-16 md:-top-20 z-10">
          <div className="container mx-auto px-4">
            <div
              className="rounded-3xl py-8 md:py-12 px-6 md:px-8"
              style={styles.statsGradient}
            >
              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-center text-center text-white">
                {STATS_DATA.map((stat, index) => (
                  <div key={index} className="flex items-center">
                    <StatsItem
                      number={stat.number}
                      description={stat.description}
                    />
                    {index < STATS_DATA.length - 1 && (
                      <div className="w-px h-20 bg-[#3CE5B4] mx-8 md:mx-12"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden space-y-6 text-center text-white">
                {STATS_DATA.map((stat, index) => (
                  <div key={index}>
                    <StatsItem
                      number={stat.number}
                      description={stat.description}
                    />
                    {index < STATS_DATA.length - 1 && (
                      <div className="w-full h-px bg-[#3CE5B4] my-6"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 text-center">
          <div className="md:hidden" style={styles.mobileTopPadding}>
            {/* What is Pitch Tank Image */}
            <ResponsiveImage
              mobileSrc="/Group 89.svg"
              desktopSrc="/What is pitch tank.svg"
              alt="What is Pitch Tank"
              className="w-full h-auto max-w-4xl mx-auto mb-6 md:mb-8"
            />

            {/* What You Get Image */}
            <img
              src="/What-You-Get.svg"
              alt="What You Get"
              className="mx-auto mb-6 mt-12 md:mb-12 w-64 h-auto md:w-auto md:h-auto"
              loading="lazy"
              width="456px"
              height="61px"
            />

            {/* Feature Images */}
            <div className="mt-6 md:mt-8 space-y-4 md:space-y-6 max-w-4xl mx-auto">
              {FEATURE_IMAGES.map((image, index) => (
                <FeatureImage
                  key={index}
                  mobileSrc={image.mobile}
                  desktopSrc={image.desktop}
                  alt={image.alt}
                />
              ))}
            </div>
          </div>

          {/* Desktop Content */}
          <div className="hidden md:block" style={styles.desktopTopPadding}>
            {/* What is Pitch Tank Image */}
            <ResponsiveImage
              mobileSrc="/Group 89.svg"
              desktopSrc="/What is pitch tank.svg"
              alt="What is Pitch Tank"
              className="w-full h-auto max-w-4xl mx-auto mb-6 md:mb-8"
            />

            {/* What You Get Image */}
            <img
              src="/What-You-Get.svg"
              alt="What You Get"
              className="mx-auto mb-6 mt-12 md:mb-12 w-64 h-auto md:w-auto md:h-auto"
              loading="lazy"
              width="456px"
              height="61px"
            />

            {/* Feature Images */}
            <div className="mt-6 md:mt-8 space-y-4 md:space-y-6 max-w-4xl mx-auto">
              {FEATURE_IMAGES.map((image, index) => (
                <FeatureImage
                  key={index}
                  mobileSrc={image.mobile}
                  desktopSrc={image.desktop}
                  alt={image.alt}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Your Journey Section */}
      <section
        className="py-8 md:py-16 pb-24 md:pb-16"
        style={styles.sectionBackground}
      >
        <div className="container mx-auto px-4 text-center">
          {/* Your Journey Title */}
          <img
            src="/Your Journey title.svg"
            alt="Your Journey Title"
            className="mx-auto mb-6 md:mb-8 w-64 h-auto md:w-auto md:h-auto"
            loading="lazy"
            width="456px"
            height="61px"
          />

          {/* Application Process Card */}
          <div className="max-w-4xl mx-auto mt-12 md:mt-16">
            <div
              className="relative rounded-3xl md:rounded-full p-6 md:p-6"
              style={{
                background:
                  "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Mobile Layout */}
              <div className="md:hidden">
                {/* Number circle - top center */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-blue-900 -mt-10"
                    style={{ backgroundColor: "#3ae5a7" }}
                  >
                    1
                  </div>
                </div>

                {/* Content - centered */}
                <div className="text-center mb-6">
                  <h3 className="text-white text-xl font-bold mb-2">
                    Apply through
                    <br />
                    this form
                  </h3>
                  <p className="text-blue-200 text-sm">(~30-40 min)</p>
                </div>

                {/* Button - centered */}
                <div className="flex justify-center">
                  <button
                    onClick={handleStartApplication}
                    className="px-8 py-3 rounded-full font-semibold text-blue-900 transition-all duration-300 hover:shadow-lg hover:scale-105"
                    style={{ backgroundColor: "#3ae5a7" }}
                  >
                    Apply now!
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between">
                {/* Left side with number and content */}
                <div className="flex items-center space-x-8 flex-1">
                  {/* Number circle */}
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-blue-900"
                    style={{ backgroundColor: "#3ae5a7" }}
                  >
                    1
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-white text-left text-2xl font-bold">
                      Apply through this form
                    </h3>
                    <p className="text-blue-200 text-left text-base">
                      (~30-40 min)
                    </p>
                  </div>
                </div>

                {/* Right side with button */}
                <div className="ml-4">
                  <button
                    onClick={handleStartApplication}
                    className="px-8 py-4 rounded-full font-semibold text-blue-900 transition-all duration-300 hover:shadow-lg hover:scale-105"
                    style={{ backgroundColor: "#3ae5a7" }}
                  >
                    Apply now!
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Incubation Program */}
          <div className="max-w-4xl mx-auto mt-6 md:mt-8">
            <div
              className="relative rounded-3xl md:rounded-full p-6 md:p-6"
              style={{
                background:
                  "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Mobile Layout */}
              <div className="md:hidden">
                {/* Number circle - top center */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-blue-900 -mt-10"
                    style={{ backgroundColor: "#3ae5a7" }}
                  >
                    2
                  </div>
                </div>

                {/* Content - centered */}
                <div className="text-center">
                  <h3 className="text-white text-xl font-bold">
                    Join 10-week
                    <br />
                    incubation
                    <br />
                    program
                  </h3>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex items-center">
                {/* Number circle */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-blue-900 mr-8"
                  style={{ backgroundColor: "#3ae5a7" }}
                >
                  2
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-white text-left text-2xl font-bold">
                    Join 10-week incubation program
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Demo Day */}
          <div className="max-w-4xl mx-auto mt-6 md:mt-8">
            <div
              className="relative rounded-3xl md:rounded-full p-6 md:p-6"
              style={{
                background:
                  "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Mobile Layout */}
              <div className="md:hidden">
                {/* Number circle - top center */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-blue-900 -mt-10"
                    style={{ backgroundColor: "#3ae5a7" }}
                  >
                    3
                  </div>
                </div>

                {/* Content - centered */}
                <div className="text-center">
                  <h3 className="text-white text-xl font-bold">
                    Present at
                    <br />
                    Demo Day
                    <br />
                    to investors
                  </h3>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex items-center">
                {/* Number circle */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-blue-900 mr-8"
                  style={{ backgroundColor: "#3ae5a7" }}
                >
                  3
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-white text-left text-2xl font-bold">
                    Present at Demo Day to investors
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-3xl mx-auto mt-12">
            <p className="text-base md:text-lg text-white leading-relaxed">
              Pitch Tank is open to founders from all verticals and at all
              stages <br /> (idea, MVP, early revenue, growth, scaling).
            </p>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:block mt-8 md:mt-12">
            <button
              onClick={handleStartApplication}
              className="px-8 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 hover:shadow-lg"
              style={styles.buttonStyle}
            >
              Start Your Application
            </button>
          </div>

          {/* About Image */}
          <div className="mt-24 md:mt-32">
            <ResponsiveImage
              mobileSrc="/About (2).svg"
              desktopSrc="/About.svg"
              alt="About"
              className="w-full h-auto mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#021959] p-4 shadow-lg">
        <div className="container mx-auto text-center">
          <button
            onClick={handleStartApplication}
            className="w-full max-w-md mx-auto px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
            style={styles.buttonStyle}
          >
            Start Your Application
          </button>
        </div>
      </div>

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        redirectPath="/pitch-tank-form"
      />
    </div>
  );
};

export default PitchTankLandingPage;