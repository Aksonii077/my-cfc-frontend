import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTypewriterEffect } from '../hooks/useTypewriterEffect';
import { useModal } from '../components/PublicLayout';
import { useGetStartedHandler } from '../hooks/useGetStartedHandler';
import SignupModal from '../components/Modals/SignupModal';

// Static assets - public directory paths
const bubbleBoxTopMobile = '/Bubble box top.svg';
const bubbleBoxTopDesktop = '/Bubbles box top.svg';
const group7Image = '/Group 7.png';
const whyWeExistImage = '/Why we exist.svg';
const group13Image = '/Group 13.png';
const partnerImage = '/Partner.svg';

// Centralized design tokens
const localTheme = {
  colors: {
    primary: '#114DFF',
    secondary: '#3CD9A7',
    gray: {
      600: '#6B7280',
      700: '#374151',
      800: '#1F2937'
    }
  },
  spacing: {
    section: 'py-8 md:py-16',
    container: 'px-4 md:px-8 max-w-6xl mx-auto'
  },
  text: {
    hero: 'text-3xl md:text-4xl font-bold',
    title: 'text-2xl md:text-4xl font-bold',
    subtitle: 'text-xl md:text-2xl font-bold',
    body: 'text-base md:text-lg'
  },
  gradients: {
    primary: 'bg-gradient-to-r from-[#3CD9A7] to-[#114CFF]',
    button: 'linear-gradient(92.58deg, #3CE5A7 1.95%, #114DFF 100%)'
  }
};




const SearchInput: React.FC<{ placeholder: string; className?: string; onSearchClick: () => Promise<void> }> = ({ placeholder, className = '', onSearchClick }) => {
  const animatedPlaceholder = useTypewriterEffect(placeholder, 80);
  
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={animatedPlaceholder}
        className="w-full p-4 md:p-6 text-sm md:text-base rounded-full border-2 border-gray-200 focus:outline-none focus:border-[#114dff] transition-colors shadow-lg bg-white/95 backdrop-blur-sm pr-12 md:pr-16"
        style={{fontFamily: 'Roboto, sans-serif'}}
      />
      <button 
        onClick={onSearchClick}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-[#114dff] rounded-full flex items-center justify-center hover:bg-[#0f40d8] transition-colors shadow-lg"
      >
        <img src="/Group 163.svg" alt="Search" />
      </button>
    </div>
  );
};

const Homepage: React.FC = () => {
  const { openModal, openSignupModal } = useModal();
  const { handleGetStarted } = useGetStartedHandler();
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  // Handle search button click with Get Started logic
  const handleSearchClick = async () => {
    const wasHandled = await handleGetStarted();
    if (!wasHandled) {
      setSignupModalOpen(true);
    }
  };

  // Determine redirect path based on current page
  const getRedirectPath = () => {
    return '/onboarding'; // Default for homepage
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Helmet>
        <title>CoFounder Circle - Connect with Founders, Mentors & Investors</title>
        <meta
          name="description"
          content="CoFounder Circle is a startup community where entrepreneurs connect with cofounders, mentors, and investors to build and scale their ideas."
        />
        <link rel="canonical" href="https://cofoundercircle.ai/" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'CoFounder Circle',
            url: 'https://cofoundercircle.ai',
            logo: 'https://cofoundercircle.ai/brandlogo.svg',
            sameAs: [
              'https://twitter.com/yourhandle',
              'https://www.linkedin.com/company/yourcompany/'
            ]
          })}
        </script>
      </Helmet>
      {/* Hero Section - Mobile */}
      <main
        className="md:hidden relative w-full h-screen max-h-[716px] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4"
        style={{ backgroundImage: `url('${bubbleBoxTopMobile}')` }}
      >
        <h1
          className="text-lg font-bold text-gray-800 text-center mb-6"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          What are you looking to build today?
        </h1>
        <SearchInput
          placeholder="I want to start a D2C skincare brand..."
          className="w-full max-w-sm"
          onSearchClick={handleSearchClick}
        />
      </main>

      {/* Desktop View */}
      <main
        className="hidden md:flex relative w-full h-screen bg-cover bg-center bg-no-repeat items-center justify-center"
        style={{ backgroundImage: `url('${bubbleBoxTopDesktop}')` }}
      >
        <div className="flex flex-col items-center justify-center text-center px-4 w-full">
          <h1
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-8"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            What are you looking to build today?
          </h1>

          <SearchInput
            placeholder="I want to start a D2C skincare brand..."
            className="w-full max-w-2xl"
            onSearchClick={handleSearchClick}
          />
        </div>
      </main>

      {/* Pitch Tank Section */}
      <section className="bg-[#114DFF] m-6 rounded-[50px] md:rounded-full">
        <div className="text-center py-4 md:py-12 px-12 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-evenly gap-4 md:gap-8">
            <img src="/pitch-tank-icon.svg" alt="pitch-tank-icon" />
            <div className="text-center md:text-left">
              <p
                className="text-[21px] md:text-[21px] text-white leading-relaxed capitalize"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                WHERE IDEAS GET REAL.
              </p>
              <p
                className="text-[21px] md:text-[21px] text-white leading-relaxed"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                AND REAL IDEAS GET FUNDED.
              </p>
            </div>
            <button
              onClick={openSignupModal}
              className="px-16 py-2 text-lg font-semibold text-[#114DFF] rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                background: "#3CE5A7",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              Apply Now
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section
        className="relative w-full py-8 md:py-16 bg-cover bg-center bg-no-repeat overflow-hidden drop-shadow-sm rounded-b-[50px] md:rounded-b-[200px]"
        style={{ backgroundImage: `url('${group7Image}')` }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center px-4 md:px-8 h-full">
          <h2
            className="text-2xl md:text-4xl font-bold text-[#114DFF] text-center mb-6 md:mb-8"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            About Us
          </h2>
          <p
            className="text-[21px] md:text-xl text-gray-700 text-center max-w-4xl leading-relaxed"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            CoFounder Circle is an AI-native acceleration platform for startups
            and MSMEs - built by founders, for founders. We bring together AI,
            capital, community & execution to enable companies from Idea to IPO,
            and everything in between.
          </p>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="relative w-full py-8 md:py-16 overflow-hidden">
        <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
          {/* Mobile Title and Description */}
          <div className="md:hidden w-full mb-8 text-center px-4">
            <h2
              className="text-2xl md:text-4xl font-bold leading-tight text-[#114DFF] mb-6"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Why We Exist
            </h2>

            <div className="space-y-4 text-gray-700">
              <span
                className="text-base md:text-lg leading-relaxed"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                The journey of a founder is often lonely.
              </span>
              <span
                className="text-base md:text-lg leading-relaxed"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Most ideas never make it off the napkin.
              </span>
              <span
                className="text-base md:text-lg leading-relaxed"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                And those that do get lost in a maze of building, hiring,
                funding, scaling - with no map, no guide, no support.
              </span>
            </div>

            <p
              className="text-base md:text-lg font-bold text-gray-800 py-4"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              We exist to change that.
            </p>

            <span
              className="text-base md:text-lg text-gray-700 leading-relaxed"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              CoFounder Circle democratizes and accelerates business creation &
              scaling by giving founders one unified platform and ecosystem -
              powered by AI, built by community, and fueled by capital.
            </span>
          </div>

          {/* Desktop Image */}
          <div className="relative hidden md:block md:w-1/2 mb-8 md:mb-0 md:-ml-8 lg:-ml-16">
            <img
              src={whyWeExistImage}
              alt="Why We Exist illustration"
              className="w-full h-auto object-contain drop-shadow-xl"
              loading="lazy"
            />
          </div>

          <div className="hidden md:block w-full md:w-1/2 px-4 text-center md:text-left md:px-4 md:px-8">
            <div className="space-y-6">
              <div className="space-y-4 text-gray-700">
                <p
                  className="text-base md:text-lg leading-relaxed"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  The journey of a founder is often lonely.
                </p>
                <p
                  className="text-base md:text-lg leading-relaxed"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  Most ideas never make it off the napkin.
                </p>
                <p
                  className="text-base md:text-lg leading-relaxed"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  And those that do get lost in a maze of building, hiring,
                  funding, scaling - with no map, no guide, no support.
                </p>
              </div>

              <p
                className="text-lg md:text-2xl font-bold text-gray-800 py-4"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                We exist to change that.
              </p>

              <p
                className="text-base md:text-lg text-gray-700 leading-relaxed"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                CoFounder Circle democratizes and accelerates business creation
                & scaling by giving founders one unified platform and ecosystem
                - powered by AI, built by community, and fueled by capital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Stack Platform Section */}
      <section className="mb-8 md:mb-12">
        {/* Mobile View */}
        <div className="md:hidden">
          {/* Mobile Image with Title and Description */}
          <div className="relative overflow-hidden mb-6 rounded-[100px]">
            <img
              src={group13Image}
              alt="Full-Stack Platform background"
              className="w-full h-[400px] object-cover"
              width="1200"
              height="400"
              loading="lazy"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
              <h2
                className="text-[36px] font-bold text-[#114DFF] leading-tight mb-4"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                We Are A Full-Stack Startup Ecosystem & Operating Platform
              </h2>
              <p
                className="text-[18px] text-gray-700 leading-relaxed"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                No more piecing together tools, talent, resources or capital.
                CoFounder Circle brings it all to one place:
              </p>
            </div>
          </div>

          {/* Mobile Content Outside Image */}
          <div className="px-4 mx-4 rounded-3xl">
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <img
                  src="/people.svg"
                  alt="People"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>

              <div>
                <img
                  src={partnerImage}
                  alt="Partners"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>

              <div>
                <img
                  src="/tools.svg"
                  alt="Tools"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>

              <div>
                <img
                  src="/Mentors & incubators.svg"
                  alt="Mentors & Incubators"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>

              <div>
                <img
                  src="/Group 18.svg"
                  alt="Investors"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Mobile Bottom Section */}
            <div className="text-center mb-6">
              <p
                className="text-[18px] text-[#114DFF] font-semibold mb-4"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Think of it as the only startup operating system you will need.
              </p>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block relative w-full h-screen rounded-[200px] overflow-hidden">
          <img
            src="/Group 13.png"
            alt="Full-Stack Platform background"
            className="w-full h-full object-cover"
            width="1200"
            height="800"
            loading="lazy"
          />

          <div className="absolute inset-0 flex flex-col justify-center items-center p-8 md:p-12">
            {/* Part 1 and Part 2 - Flex Container */}
            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mb-6 md:mb-8">
              {/* Part 1 - Title and Description */}
              <div className="w-full md:w-1/3 mb-8 md:mb-0 px-4 text-center md:text-left">
                <h2
                  className="text-xl md:text-4xl font-bold text-[#114DFF] leading-tight mb-6"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  We Are A Full-Stack
                  <br />
                  Startup Ecosystem
                  <br />& Operating Platform
                </h2>
                <p
                  className="text-sm md:text-xl text-gray-700 leading-relaxed"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  No more piecing together tools, talent, resources or capital.
                  CoFounder Circle brings it all to one place:
                </p>
              </div>

              {/* Part 2 - Small Blocks */}
              <div className="w-full md:w-2/3 px-2 md:px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div>
                    <img
                      src="/people.svg"
                      alt="People"
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <img
                      src={partnerImage}
                      alt="Partners"
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <img
                      src="/tools.svg"
                      alt="Tools"
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <img
                      src="/Mentors & incubators.svg"
                      alt="Mentors & Incubators"
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <img
                      src="/Group 18.svg"
                      alt="Investors"
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Part 3 - Bottom Section */}
            <div className="w-full text-center px-4 max-w-3xl mt-4 md:mt-6">
              <p
                className="text-sm md:text-xl text-[#114DFF] font-semibold"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Think of it as the only startup operating system you will need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Race AI Section - Mobile */}
      <section className="md:hidden w-full py-8">
        <div className="flex justify-center px-4">
          <img
            src="/Race Ai whole.svg"
            alt="Race AI illustration"
            className="w-full max-w-md h-auto object-contain"
            loading="lazy"
          />
        </div>
      </section>

      {/* Who It's For Section - Mobile */}
      <section className="md:hidden w-full py-8 px-4">
        <h2
          className="text-2xl font-bold text-center mb-8 text-[#114DFF]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Who It's For
        </h2>

        <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
          <div>
            <img
              src="/Founders.svg"
              alt="Founders"
              className="w-full h-auto object-contain"
              loading="lazy"
              width="299px"
              height="299px"
            />
          </div>

          <div>
            <img
              src="/Mentors.svg"
              alt="Mentors & Incubators"
              className="w-full h-auto object-contain"
              loading="lazy"
              width="299px"
              height="299px"
            />
          </div>

          <div>
            <img
              src="/Investors.svg"
              alt="Investors"
              className="w-full h-auto object-contain"
              loading="lazy"
              width="299px"
              height="299px"
            />
          </div>

          <div>
            <img
              src="/Professionals.svg"
              alt="Professionals"
              className="w-full h-auto object-contain"
              loading="lazy"
              width="299px"
              height="299px"
            />
          </div>

          <div>
            <img
              src="/Students.svg"
              alt="Students"
              className="w-full h-auto object-contain"
              loading="lazy"
              width="299px"
              height="299"
            />
          </div>

          <div>
            <img
              src="/Suppliers.svg"
              alt="Suppliers & Service Providers"
              className="w-full h-auto object-contain"
              loading="lazy"
              width="299"
              height="299"
            />
          </div>
        </div>

        {/* Bottom Center Image */}
        <div className="flex justify-center mt-8">
          <img
            src="/Group 46.svg"
            alt="Group illustration"
            className="w-full max-w-md h-auto object-contain"
            loading="lazy"
          />
        </div>
      </section>

      {/* The RACE AI Stack Section */}
      <section className="hidden md:block relative w-full py-8 md:py-16 bg-white border-b-4 border-gray-200 rounded-b-none md:rounded-b-[200px]">
        <div className="flex flex-col items-center justify-center px-4 md:px-8">
          <h2
            className="text-2xl md:text-4xl font-bold text-[#114DFF] text-center mb-6 md:mb-8"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            The RACE AI Stack
          </h2>
          <p
            className="text-sm md:text-xl text-gray-700 text-center max-w-4xl leading-relaxed"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            From Advice to Action
          </p>
        </div>
      </section>

      {/* RACE AI Components Section */}
      <section
        className="hidden md:block relative w-full py-8 md:py-16 bg-cover bg-center bg-no-repeat md:mb-12"
        style={{ backgroundImage: "url('/Group 13.png')" }}
      >
        <div className="relative z-10 px-4 md:px-8 min-h-[400px] md:min-h-[500px]">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto pt-8 md:pt-12">
            {[
              "/retrieval.svg",
              "/Advisory.svg",
              "/Connection.svg",
              "/Execution.svg",
            ].map((imageSrc, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center text-center flex-1 px-4">
                  <img
                    src={imageSrc}
                    alt={`RACE AI Component ${index + 1}`}
                    className="w-full h-auto object-contain"
                    width="300"
                    height="200"
                    loading="lazy"
                  />
                </div>
                {index < 3 && (
                  <div className="hidden md:block w-px h-24 bg-gray-300 mx-4"></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-12 text-center max-w-4xl mx-auto pb-8 md:pb-12">
            <p
              className="text-xs md:text-xl text-[#114DFF] leading-relaxed"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Most platforms offer content. We deliver outcomes because RACE AI
              doesn't just guide. It gets things done.
            </p>
          </div>

          {/* Who It's For Section */}
          <div className="mt-12 mb-12 md:mt-16 md:mb-16">
            <h2
              className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-[#114DFF]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Who It's For
            </h2>

            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              <div>
                <img
                  src="/Founders.svg"
                  alt="Founders"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  width="299"
                  height="299"
                />
              </div>

              <div>
                <img
                  src="/Mentors.svg"
                  alt="Mentors & Incubators"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  width="299"
                  height="299"
                />
              </div>

              <div>
                <img
                  src="/Investors.svg"
                  alt="Investors"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  width="299"
                  height="299"
                />
              </div>

              <div>
                <img
                  src="/Professionals.svg"
                  alt="Professionals"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  width="299"
                  height="299"
                />
              </div>

              <div>
                <img
                  src="/Students.svg"
                  alt="Students"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  width="299"
                  height="299"
                />
              </div>

              <div>
                <img
                  src="/Suppliers.svg"
                  alt="Suppliers & Service Providers"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  width="299"
                  height="299"
                />
              </div>
            </div>

            {/* Bottom Center Image */}
            <div className="flex justify-center mt-8 md:mt-12">
              <img
                src="/Group 46.svg"
                alt="Group illustration"
                loading="lazy"
                width="299"
                height="299"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Story Section */}
      <section className="relative w-full py-8 md:py-16 bg-white mb-8 md:mb-12 md:shadow-lg md:rounded-b-[200px]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Mobile Title Above Image */}
            <h2
              className="md:hidden text-2xl md:text-4xl font-bold text-center mb-4 text-[#114DFF]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Founder's Story
            </h2>

            <div className="w-full md:w-1/2 flex justify-center md:justify-start">
              <img
                src="/Group 83.png"
                alt="Founder's Story illustration"
                className="w-2/3 md:w-full h-auto object-contain drop-shadow-xl"
                style={{ maxWidth: "333px", height: "402px" }}
                width="333"
                height="402"
                loading="lazy"
              />
            </div>

            <div className="w-full md:w-1/2">
              <h2
                className="hidden md:block text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-[#114DFF] text-center md:text-left"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Founder's Story
              </h2>

              <div className="space-y-4 text-gray-700 text-center leading-relaxed md:text-left">
                {[
                  "CoFounder Circle is founded by ",
                  "Darpan Sanghvi",
                  ", an entrepreneur whose journey has been anything but linear.",
                  "Darpan built one of India's fastest-scaling consumer startups, taking it from a late entrant in a crowded Personal Care category to becoming the first DTC beauty brand Unicorn of India backed by global investors such as Warburg Pincus, Accel, Prosus, Bessemer, Amazon, L'Occitane and more.",
                  'But the very pace that fueled the rise also led to failure, in what Darpan later called "The Momentum Trap" - too many bets, too fast and at too large a scale.',
                  "Having built a unicorn and then lived through its unravelling, Darpan has built, seen and experienced what very few entrepreneurs have. It also helped him discover his purpose in life, which is to help others build.",
                  "And he has taken all his learnings into building CoFounder Circle; a platform forged from all the lessons he has learnt in his entrepreneurial journey of 25 years.",
                ].map((text, index) => {
                  if (index === 0) {
                    return (
                      <p
                        key={index}
                        className="text-base md:text-lg"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        CoFounder Circle is founded by{" "}
                        <Link
                          to="/darpansanghvi"
                          className="text-blue-600 hover:text-blue-800 font-semibold underline"
                        >
                          Darpan Sanghvi
                        </Link>
                        , an entrepreneur whose journey has been anything but linear.
                      </p>
                    );
                  }
                  return (
                    <p
                      key={index}
                      className="text-base md:text-lg"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {text}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CoFounding with the Community Section */}
      {/* Mobile View */}
      <section className="md:hidden relative w-full overflow-hidden mb-8">
        <div
          className="relative w-full h-auto bg-cover bg-center bg-no-repeat px-6 py-12 rounded-[100px]"
          style={{ backgroundImage: "url('/Group 96.png')" }}
        >
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Part 1: Main Title */}
            <div className="space-y-4">
              <h2
                className="text-2xl md:text-4xl font-bold text-[#6C6C6C]"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                CoFunding with
                <br />
                the Community
              </h2>
              <div className="w-80 h-px bg-gray-400 mx-auto"></div>
            </div>

            {/* Part 2: 50% Community Equity */}
            <div className="space-y-4">
              <h3
                className="text-xl md:text-2xl font-bold text-[#114DFF]"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                50% Community Equity
              </h3>
              <p
                className="text-base md:text-lg text-[#6C6C6C] leading-relaxed"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                50% of CoFounder Circle's equity is reserved for its community -
                including CoFounder Circle's employees, mentors + former Good
                Glamm stakeholders, as part of a personal restitution pledge by
                Darpan.
              </p>
              <div className="w-80 h-px bg-gray-400 mx-auto"></div>
            </div>

            {/* Part 3: 100% Reinvestment Commitment */}
            <div className="space-y-4">
              <h3
                className="text-xl md:text-2xl font-bold text-[#114DFF]"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                100% Reinvestment Commitment
              </h3>
              <p
                className="text-base md:text-lg text-[#6C6C6C] leading-relaxed"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                100% of our free cash flow above 20% PAT will be reinvested into
                startups on the platform - directly funding innovation, founder
                growth, and ecosystem compounding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop View */}
      <section className="hidden md:block relative w-full py-8 md:py-16 overflow-hidden">
        <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-1/2 mb-8 md:mb-0 md:-ml-8 lg:-ml-16">
            <img
              src="/CoFounding with the.svg"
              alt="CoFounding with Community illustration"
              className="w-full h-auto object-contain drop-shadow-xl"
              loading="lazy"
            />
          </div>

          <div className="w-full md:w-1/2 px-4 text-center md:text-left md:px-4 md:px-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3
                  className="text-xl md:text-2xl font-bold text-[#114DFF]"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  50% Community Equity
                </h3>
                <p
                  className="text-base md:text-lg text-gray-700 leading-relaxed"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  50% of CoFounder Circle's equity is reserved for its community
                  - including CoFounder Circle's employees, mentors + former
                  Good Glamm stakeholders, as part of a personal restitution
                  pledge by Darpan.
                </p>
                <p
                  className="text-base md:text-lg text-gray-700 italic font-medium"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  "Startups may fail. But people's faith in supporting them
                  should not."
                </p>
              </div>

              <div className="space-y-4">
                <h3
                  className="text-xl md:text-2xl font-bold text-[#114DFF]"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  100% Reinvestment Commitment
                </h3>
                <p
                  className="text-base md:text-lg text-gray-700 leading-relaxed"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  100% of our free cash flow above 20% PAT will be reinvested
                  into startups on the platform - directly funding innovation,
                  founder growth, and ecosystem compounding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pitch Tank Section */}
      <section className="hidden md:block relative w-full py-16 md:py-24 overflow-hidden bg-[#114DFF]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <div className='flex justify-center items-center mb-8 md:mb-12'>
            {" "}
            <img src="/pitch-tank-icon.svg" alt="pitch-tank-icon" />
          </div>

          <div className="mb-12 md:mb-16">
            <p
              className="text-lg md:text-xl text-white leading-relaxed"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              WHERE IDEAS GET REAL.
            </p>
            <p
              className="text-lg md:text-xl text-white leading-relaxed"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              AND REAL IDEAS GET FUNDED.
            </p>
          </div>

          <div className="flex flex-row justify-center items-center gap-6 md:gap-12">
            {/* First Image */}
            <div className="flex flex-col items-center text-center">
              <img
                src="/Get incubated.svg"
                alt="Pitch Tank 1"
                className="w-full h-auto object-contain"
                width="200"
                height="150"
                loading="lazy"
              />
            </div>

            {/* Centered Divider */}
            <div className="w-px h-24 md:h-32 bg-white/30"></div>

            {/* Second Image */}
            <div className="flex flex-col items-center text-center">
              <img
                src="/Get funded.svg"
                alt="Pitch Tank 2"
                className="w-full h-auto object-contain mb-8"
                width="200"
                height="150"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section
        className="hidden md:block relative w-full py-8 md:py-12 shadow-lg overflow-hidden rounded-b-none md:rounded-b-[200px]"
        style={{
          background:
            "linear-gradient(91.69deg, #FFFFFF 1.84%, #F6F8FF 48.35%, #3CE5A7 72.53%, #114DFF 98.57%)",
          borderImageSlice: 1,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-row md:flex-row justify-center items-center gap-4 md:gap-16">
            {[
              { number: "1", desc: "Startup\nSelected Weekly" },
              { number: "10", desc: "Weeks of\nIncubation" },
              { number: "10", desc: "Startups Pitch\nto Investors" },
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center text-center">
                  <h2
                    className="text-2xl md:text-6xl font-bold mb-1 md:mb-2 text-[#114DFF]"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {item.number}
                  </h2>
                  <p
                    className="text-xs md:text-base font-medium text-[#114DFF] whitespace-pre-line"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {item.desc}
                  </p>
                </div>
                {index < 2 && (
                  <div className="w-px h-12 md:h-20 bg-cyan-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="hidden md:block relative w-full py-16 md:py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1
            className="text-3xl md:text-5xl font-bold text-center mb-16 md:mb-20 text-[#114DFF]"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            How It Works
          </h1>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                { src: "/Sign Up.svg", alt: "Sign Up" },
                { src: "/Build application.svg", alt: "Build Application" },
                { src: "/Get selected.svg", alt: "Get Selected" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-6">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-40 h-40 md:w-full md:h-full object-contain drop-shadow-lg"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-12 md:mt-16 mb-8 md:mb-0">
            <button
              onClick={openSignupModal}
              className="px-8 py-4 text-lg font-semibold text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[#3CD9A7] to-[#114CFF]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Sign up for early access
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-6">
          <Link 
            to="/privacy" 
            className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-400">|</span>
          <Link 
            to="/terms" 
            className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
          >
            Terms and Conditions
          </Link>
        </div>
      </footer>

      {/* Signup Modal for Search */}
      <SignupModal 
        isOpen={signupModalOpen} 
        onClose={() => setSignupModalOpen(false)}
        redirectPath={getRedirectPath()}
      />
    </div>
  );
};

export default Homepage;