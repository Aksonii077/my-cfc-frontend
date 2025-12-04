import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Carousel, ConfigProvider } from 'antd';
import { BenefitsRewardsContent, ApplicationProcessContent, RequirementsCriteriaContent } from '../components/fef/SubmenuContent';
import { COLORS } from '../constants/fef';
import { StartupCard as StartupCardType } from '../types/fef';
import { apiClient } from '../utils/api';
import { useAnimation } from '../hooks/useAnimation';
import { useResponsive } from '../hooks/useResponsive';
import AnimatedContent from '../components/fef/AnimatedContent';
import ResponsiveButton from '../components/fef/ResponsiveButton';
import MenuButton from '../components/fef/MenuButton';
import StartupCard from '../components/fef/StartupCard';
import SignupModal from '../components/Modals/SignupModal';
import { MenuType, SubMenuType } from '../types/fef';

// Constants
const HEADER_MENU_ITEMS = ['PITCH TO GET RICH', 'PREDICT & WIN', 'ABOUT FEF'];
const MAIN_MENU_ITEMS: MenuType[] = ['CELEBRITY JURY', 'SEASONS STARTUPS', 'EPISODES', 'BEHIND THE SCENES'];
const SUB_MENU_ITEMS: SubMenuType[] = ['Benefits & rewards', 'Application process', 'Requirement & criteria'];
const CELEBRITIES = [
  'karan-johar-icon.svg', 'saif-ali-khan.svg', 'akshay-kumar.svg', 'manish.svg',
  'ananya.svg', 'gautam.svg', 'malaika.svg', 'darpan.svg', 'sara.svg', 'shibani.svg', 'ronnie.svg', 'dhruv.svg'
];



// Header Component
const FefHeader: React.FC<{
  setActiveMenu: (menu: MenuType) => void;
  setActiveSubMenu: (submenu: SubMenuType) => void;
  handleMenuChange: (menu: MenuType) => void;
}> = ({ setActiveMenu, setActiveSubMenu, handleMenuChange }) => {
  const { isMobile } = useResponsive();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <>
      <header className="w-full bg-black px-4 sm:px-6 md:px-8 lg:px-16 py-4 relative z-10">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <img src="/fef/fef-logo-main.svg" alt="FEF Logo" loading="eager" />
          </div>

          {!isMobile && (
            <>
              <nav className="flex items-center space-x-8 lg:space-x-12">
                {HEADER_MENU_ITEMS.map((item, index) => (
                  <button
                    key={index}
                    className="text-white font-bold transition-colors hover:text-gray-300 text-sm lg:text-base"
                    onClick={() => {
                      if (item === "PITCH TO GET RICH") {
                        const element = document.getElementById(
                          "celebrity-menu-section"
                        );
                        element?.scrollIntoView({ behavior: "smooth" });
                      } else if (item === "PREDICT & WIN") {
                        handleMenuChange("SEASONS STARTUPS");
                        setTimeout(() => {
                          const element = document.getElementById(
                            "seasons-startups-section"
                          );
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "start" });
                          } else {
                            console.log("Element seasons-startups-section not found");
                          }
                        }, 500);
                      } else if (item === "ABOUT FEF") {
                        setActiveMenu("CELEBRITY JURY");
                        setActiveSubMenu("Benefits & rewards");
                        setTimeout(() => {
                          const element =
                            document.getElementById("about-fef-section");
                          element?.scrollIntoView({ behavior: "smooth" });
                        }, 300);
                      }
                    }}
                  >
                    {item}
                  </button>
                ))}
              </nav>
              <ResponsiveButton
                variant="secondary"
                className="text-white"
                size="md"
                onClick={() => setIsSignupModalOpen(true)}
              >
               Apply For Season 2
              </ResponsiveButton>
            </>
          )}

          {isMobile && (
            <button
              onClick={toggleDrawer}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-50 transition-all duration-300 ${
            isDrawerOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 ${
              isDrawerOpen ? "bg-opacity-50" : "bg-opacity-0"
            }`}
            onClick={toggleDrawer}
          />
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-black shadow-lg transform transition-transform duration-300 ease-in-out ${
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold text-lg">Menu</span>
                <button
                  onClick={toggleDrawer}
                  className="text-white hover:text-gray-300 transition-colors text-xl"
                >
                  ×
                </button>
              </div>

              <div className="flex justify-center py-2 mb-4">
                <img
                  src="/fef/Vector 3.svg"
                  alt="Divider"
                  className="object-contain"
                  loading="eager"
                />
              </div>

              <nav className="flex-1 space-y-4">
                {HEADER_MENU_ITEMS.map((item, index) => (
                  <button
                    key={index}
                    className="text-white font-bold text-left py-2 text-lg transition-colors hover:text-gray-300 w-full"
                    onClick={() => {
                      if (item === "PITCH TO GET RICH") {
                        const element = document.getElementById(
                          "celebrity-menu-section"
                        );
                        element?.scrollIntoView({ behavior: "smooth" });
                      } else if (item === "PREDICT & WIN") {
                        handleMenuChange("SEASONS STARTUPS");
                        setTimeout(() => {
                          const element = document.getElementById(
                            "seasons-startups-section"
                          );
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "start" });
                          } else {
                            console.log("Element seasons-startups-section not found");
                          }
                        }, 500);
                      } else if (item === "ABOUT FEF") {
                        setActiveMenu("CELEBRITY JURY");
                        setActiveSubMenu("Benefits & rewards");
                        setTimeout(() => {
                          const element =
                            document.getElementById("about-fef-section");
                          element?.scrollIntoView({ behavior: "smooth" });
                        }, 300);
                      }
                      toggleDrawer();
                    }}
                  >
                    {item}
                  </button>
                ))}
              </nav>

              <ResponsiveButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  toggleDrawer();
                  setIsSignupModalOpen(true);
                }}
              >
                GET STARTED
              </ResponsiveButton>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        redirectPath="/pitch-tank-form?fef-application=true"
      />
    </>
  );
};

// Banner Section Component
const BannerSection: React.FC = () => {
  const { isMobile } = useResponsive();
  
  return (
    <section className="w-full">
      <video
        className={`w-full object-cover ${isMobile ? 'h-[50vh] min-h-[400px]' : 'h-screen'}`}
        autoPlay
        loop
        muted
        playsInline
        controls={!isMobile}
      >
        <source src="/fef/fef-landing.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
};

// Predict & Win Section Component
const PredictWinSection: React.FC = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  
  return (
    <section
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 py-8 md:py-16"
      style={{
        backgroundImage: "url('/fef/fef-background-1.svg')",
        backgroundColor: "#161616",
      }}
    >
      <div className="w-full max-w-7xl mx-auto text-center">
        {/* Main Heading */}
        <h1
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8"
          style={{ color: COLORS.primary }}
        >
          Predict & Win
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-white max-w-4xl mx-auto mb-8 md:mb-12 px-2">
          Test your fashion sense and business acumen with our interactive
          games. Join thousands of players competing for exclusive prizes and
          bragging rights.
        </p>

        {/* Prize Banner */}
        <div className="flex items-center justify-center mb-8 md:mb-12 px-2">
          <img
            src="/fef/Frame 47.svg"
            alt="Prize"
            className="w-auto h-6 sm:h-8 md:h-10 mr-2 flex-shrink-0"
            loading="lazy"
          />
          <span
            className="text-sm sm:text-lg md:text-xl font-bold text-center"
            style={{ color: COLORS.primary }}
          >
            AND GET A CHANCE TO WIN
          </span>
          <img
            src="/fef/Frame 47.svg"
            alt="Prize"
            className="w-auto h-6 sm:h-8 md:h-10 ml-2 flex-shrink-0"
            loading="lazy"
          />
        </div>

        {/* Game Card */}
        <div className="flex justify-center max-w-2xl mx-auto mb-12 md:mb-16 px-4">
          {/* Be An Angel Card */}
          <div className="bg-black/80 border border-yellow-600 rounded-lg p-4 sm:p-6 md:p-8 w-full">
            <div className="flex justify-center mb-4 md:mb-6">
              <img
                src="/fef/dollar.svg"
                alt="Dollar"
                className="w-10 h-10 sm:w-12 sm:h-12 filter brightness-0 invert"
                loading="lazy"
              />
            </div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
              BE AN ANGEL
            </h3>
            <p
              className="text-sm sm:text-base md:text-lg mb-6 md:mb-8"
              style={{ color: COLORS.primary }}
            >
              Guess the valuation and funding of each startup
            </p>

            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div className="flex flex-col items-center justify-center text-gray-300 text-sm sm:text-base">
                <img
                  src="/fef/trophy-daimond.svg"
                  alt="Globe"
                  className="w-6 h-6 mb-2"
                  loading="lazy"
                />
                Predict funding amounts (₹0-30cr)
              </div>
              <div className="flex flex-col items-center justify-center text-gray-300 text-sm sm:text-base">
                <img
                  src="/fef/trophy-rupees.svg"
                  alt="Dollar"
                  className="w-6 h-6 mb-2"
                  loading="lazy"
                />
                Guess valuations (₹0-300cr)
              </div>
              <div className="flex flex-col items-center justify-center text-gray-300 text-sm sm:text-base">
                <img
                  src="/fef/book-open.svg"
                  alt="Book"
                  className="w-6 h-6 mb-2"
                  loading="lazy"
                />
                Learn about each startup in detail
              </div>
            </div>

            <button 
              className="w-full border border-yellow-600 text-yellow-600 py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-yellow-600 hover:text-black transition-colors text-sm sm:text-base"
              onClick={() => {
                const element = document.getElementById("seasons-startups-section");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              START VOTING
            </button>
          </div>
        </div>

        {/* Divider Vector */}
        <div className="flex justify-center mb-12 md:mb-16">
          <img
            src="/fef/Vector 3.svg"
            alt="Divider"
            className="block md:hidden w-auto h-4"
            loading="lazy"
          />
          <img
            src="/fef/Vector 7.svg"
            alt="Divider"
            className="hidden md:block w-auto h-6"
            loading="lazy"
          />
        </div>

        {/* About Pitch To Get Rich Heading */}
        <h2
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-8 md:mb-12 px-2"
          style={{ color: "#F9AC02" }}
        >
          About Pitch To Get Rich
        </h2>

        {/* Vector below heading */}
        <div className="flex justify-center">
          <img
            src="/fef/Vector 3.svg"
            alt="Divider"
            className="block md:hidden w-auto h-4"
            loading="lazy"
          />
          <img
            src="/fef/Vector 7.svg"
            alt="Divider"
            className="hidden md:block w-auto h-6"
            loading="lazy"
          />
        </div>
      </div>

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        redirectPath="/pitch-tank-form?fef-application=true"
      />
    </section>
  );
};

// About Section Component
const AboutSection: React.FC = () => (
  <section
    className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 py-8 md:py-16"
    style={{
      backgroundImage: "url('/fef/fef-background-1.svg')",
      backgroundColor: "#161616",
    }}
  >
    <div className="w-full mx-auto text-center space-y-8 sm:space-y-10 md:space-y-12">
      {/* Main Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white font-thin leading-tight px-2">
        India's Ultimate Fashion
        <br />
        Reality Show
      </h1>

      {/* Coming Soon */}
      <div>
        <p
          className="font-semibold text-base sm:text-lg md:text-xl mb-4"
          style={{ color: COLORS.primary }}
        >
          Coming on OCT 20TH 2025
        </p>
        <div className="flex justify-center">
          <img src="/fef/Vector 7.svg" alt="Vector Design" className="w-auto h-4 sm:h-6" loading="lazy" />
        </div>
      </div>

      {/* JioHotstar Logo */}
      <div className="flex justify-center">
        <img src="/fef/jiohotstar.svg" alt="JioHotstar" className="w-auto h-8 sm:h-12 md:h-auto" loading="lazy" />
      </div>

      {/* Produced By */}
      <p className="text-white font-medium text-xs sm:text-sm md:text-base tracking-widest uppercase px-2">
        P R O D U C E D &nbsp; A N D &nbsp; P R E S E N T E D &nbsp; B Y
      </p>

      {/* Dharma Logo */}
      <div className="flex justify-center">
        <img src="/fef/dharma.svg" alt="Dharma Productions" className="w-auto h-8 sm:h-12 md:h-auto" loading="lazy" />
      </div>

      {/* Karan Johar Image */}
      <div className="flex justify-center">
        <img
          src="/fef/karan-johar.svg"
          alt="Karan Johar"
          className="object-contain"
          loading="lazy"
        />
      </div>

      {/* About Description */}
      <div className="text-center">
        <p className="text-white leading-relaxed text-sm sm:text-base md:text-lg max-w-xs sm:max-w-lg md:max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-24 mt-12 sm:mt-16 md:mt-24 px-2">
          Pitch To Get Rich is a part of The Fashion Entrepreneur Fund (FEF),
          which is more than just a venture studio — it's a movement, an
          ecosystem built to nurture the dreams of fashion and lifestyle
          visionaries. Born from a cause-driven initiative, FEF exists to
          empower talent, turning passion into thriving businesses. By blending
          funding, mentorship, and market access, we don't just launch brands —
          we build legacies. At its heart, FEF, through platforms like the FEF
          Global Fashion Awards, fuels employment, strengthens the fashion
          supply chain, and contributes to our nation's GDP. Pitch To Get Rich
          is only one chapter of our story. The larger narrative is that FEF is
          here to stay — creating sustainable opportunities, celebrating
          creativity, and shaping the future of fashion in India and beyond.
        </p>
      </div>
    </div>
  </section>
);

// Celebrity Jury Section
const CelebrityJurySection: React.FC<{ 
  activeSubMenu: SubMenuType; 
  setActiveSubMenu: (item: SubMenuType) => void 
}> = ({ activeSubMenu, setActiveSubMenu }) => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const renderSubmenuContent = () => {
    switch (activeSubMenu) {
      case 'Benefits & rewards':
        return <BenefitsRewardsContent onApplyNowClick={() => setIsSignupModalOpen(true)} />;
      case 'Application process':
        return <ApplicationProcessContent onApplyNowClick={() => setIsSignupModalOpen(true)} />;
      case 'Requirement & criteria':
        return <RequirementsCriteriaContent />;
      default:
        return null;
    }
  };

  return (
    <AnimatedContent className="text-center text-white">
      <h1 className="mb-4 sm:mb-6 md:mb-8 pt-4 sm:pt-6 md:pt-8 text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold px-2">
        Meet Our Celebrity Jury
      </h1>
      <p className="text-sm sm:text-base md:text-lg max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-12 px-4">
        Industry leaders, Bollywood stars, and fashion icons who guide and judge
        the entrepreneurs
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-6 px-4">
        {CELEBRITIES.map((celebrity, index) => (
          <div
            key={index}
            className="flex flex-col items-center group"
          >
            <div className="overflow-hidden rounded-lg w-full">
              <img
                src={`/fef/${celebrity}`}
                alt={`Celebrity ${index + 1}`}
                className="w-full h-auto object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
                style={{ aspectRatio: "1/1.2", maxHeight: "316px" }}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        redirectPath="/pitch-tank-form?fef-application=true"
      />
    </AnimatedContent>
  );
};

// Seasons Startups Section
const SeasonsStartupsSection: React.FC<{ startups: StartupCardType[]; isLoading: boolean }> = ({ 
  startups, 
  isLoading 
}) => (
  <AnimatedContent id="seasons-startups-section" className="text-center text-white py-8 md:py-16" style={{ backgroundColor: COLORS.background }}>
    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-white px-4">
      Meet the Startups from <span style={{ color: COLORS.primary }}>Season 1</span>
    </h2>
    <p className="text-base md:text-lg max-w-4xl mx-auto mb-12 md:mb-16 px-4">
      From fashion-tech disruptors to couture innovators, these are the trailblazing brands that were funded and incubated through Pitch to Get Rich.
    </p>

    {isLoading ? (
      <div className="flex justify-center items-center py-16">
        <div className="text-white text-lg">Loading startups...</div>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto px-4">
        {startups.map((startup, index) => (
          <StartupCard key={index} {...startup} />
        ))}
      </div>
    )}
  </AnimatedContent>
);

// Main FEF Landing Component
const FefLanding: React.FC = () => {
  useAnimation();
  const [activeMenu, setActiveMenu] = useState<MenuType>('CELEBRITY JURY');
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenuType>('Benefits & rewards');
  const [startups, setStartups] = useState<StartupCardType[]>([]);
  const [isLoadingStartups, setIsLoadingStartups] = useState(false);
  const [startupsLoaded, setStartupsLoaded] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { isMobile } = useResponsive();

  // Fetch startups when SEASONS STARTUPS tab is active
  const fetchStartups = async () => {
    if (startupsLoaded) return; // Don't fetch again if already loaded
    
    setIsLoadingStartups(true);
    try {
      const response = await apiClient.get<StartupCardType[]>('/gamification/startups');
      setStartups(response.data);
      setStartupsLoaded(true);
    } catch (error) {
      console.error('Error fetching startups:', error);
      // Fallback to empty array on error
      setStartups([]);
    } finally {
      setIsLoadingStartups(false);
    }
  };

  // Handle menu change and fetch startups when needed
  const handleMenuChange = (menu: MenuType) => {
    setActiveMenu(menu);
    if (menu === 'SEASONS STARTUPS') {
      fetchStartups();
    }
  };

  // Carousel images for Behind the Scenes section
  const carouselImages = [
    'panel-1.png',
    'panel-2.png', 
    'panel-3.png',
    'studio.jpg',
    'fashion-studio.jpg',
    'exhibition.png'
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'CELEBRITY JURY':
        return <CelebrityJurySection activeSubMenu={activeSubMenu} setActiveSubMenu={setActiveSubMenu} />;
      case 'SEASONS STARTUPS':
        return <SeasonsStartupsSection startups={startups} isLoading={isLoadingStartups} />;
      case 'EPISODES':
        return (
          <AnimatedContent className="text-center text-white py-6 sm:py-8 md:py-12 lg:py-16" style={{ backgroundColor: COLORS.background }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight text-white">
                The Journey Begins
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-16 leading-relaxed px-2 sm:px-0">
                Experience the ultimate entrepreneurship journey where fashion startups showcase their innovations in front of celebrity judges and industry experts.
              </p>
              
              {/* Season and Episodes Stats */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-16 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold mb-2 sm:mb-3" style={{ color: COLORS.primary }}>
                    1 SEASON
                  </div>
                  <img 
                    src="/fef/Vector 3.svg" 
                    alt="Divider" 
                    className="h-auto object-contain mx-auto"
                    loading="lazy"
                  />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold mb-2 sm:mb-3" style={{ color: COLORS.primary }}>
                    8 EPISODES
                  </div>
                  <img 
                    src="/fef/Vector 3.svg" 
                    alt="Divider" 
                    className="h-auto object-contain mx-auto"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Episode Guide Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 sm:mb-8 md:mb-10 lg:mb-12" style={{ color: COLORS.primary }}>
                Episode Guide
              </h2>
              
              {/* Episode Guide Image */}
              <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-2 sm:px-0">
                {/* Mobile Image */}
                <img 
                  src="/fef/Frame 91.svg" 
                  alt="Episode Guide" 
                  className="block md:hidden w-full max-w-sm sm:max-w-md h-auto object-contain"
                  loading="lazy"
                />
                {/* Desktop Image */}
                <img 
                  src="/fef/Frame 92.svg" 
                  alt="Episode Guide" 
                  className="hidden md:block w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl h-auto object-contain"
                  loading="lazy"
                />
              </div>
              
             
            </div>
          </AnimatedContent>
        );
      case 'BEHIND THE SCENES':
        return (
          <AnimatedContent
            className="text-center text-white py-6 sm:py-8 md:py-16"
            style={{ backgroundColor: COLORS.background }}
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
              <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-white px-2">
                Meet the Panel & Behind the Scenes
              </h1>

              {/* Main Studio Image with Navigation */}
              <div className="relative mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                <ConfigProvider
                  theme={{
                    components: {
                      Carousel: {
                        arrowSize: 40,
                      },
                    },
                  }}
                >
                  <Carousel
                    autoplay
                    arrows={!isMobile}
                    dots={{ className: "custom-carousel-dots" }}
                    className="rounded-xl sm:rounded-2xl overflow-hidden"
                    autoplaySpeed={4000}
                  >
                    {carouselImages.map((image, index) => (
                      <div key={index}>
                        <img
                          src={`/fef/${image}`}
                          alt={`Behind the Scenes ${index + 1}`}
                          className="w-full h-[200px] sm:h-[250px] md:h-[400px] lg:h-[500px] object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </Carousel>
                </ConfigProvider>
              </div>

              {/* Studio Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                {/* The Main Studio */}
                <div className="text-left px-2">
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6">
                    <img
                      src="/fef/studio.jpg"
                      alt="The Main Studio"
                      className="w-full h-[180px] sm:h-[220px] md:h-[280px] lg:h-[300px] object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3
                    className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 uppercase tracking-wide"
                    style={{ color: COLORS.primary }}
                  >
                    THE MAIN STUDIO
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
                    A luxurious space featuring distinctive hexagonal flooring
                    and sophisticated lighting where the celebrity panel
                    evaluates presentations.
                  </p>
                </div>

                {/* Creative Workspace */}
                <div className="text-left px-2">
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6">
                    <img
                      src="/fef/studio.jpg"
                      alt="Creative Workspace"
                      className="w-full h-[180px] sm:h-[220px] md:h-[280px] lg:h-[300px] object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3
                    className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 uppercase tracking-wide"
                    style={{ color: COLORS.primary }}
                  >
                    CREATIVE WORKSPACE
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
                    Where entrepreneurs bring their fashion visions to life,
                    equipped with professional-grade facilities for design and
                    production.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <img src="/fef/Vector 7.svg" />
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-2">
                <div className="text-center">
                  <div
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2"
                    style={{ color: COLORS.primary }}
                  >
                    10,000+
                  </div>
                  <div className="text-gray-300 text-xs sm:text-xs md:text-sm uppercase tracking-wide leading-tight">
                    Sq Ft Studio Space
                  </div>
                </div>

                <div className="text-center">
                  <div
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2"
                    style={{ color: COLORS.primary }}
                  >
                    50+
                  </div>
                  <div className="text-gray-300 text-xs sm:text-xs md:text-sm uppercase tracking-wide leading-tight">
                    Production Crew
                  </div>
                </div>

                <div className="text-center">
                  <div
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2"
                    style={{ color: COLORS.primary }}
                  >
                    24/7
                  </div>
                  <div className="text-gray-300 text-xs sm:text-xs md:text-sm uppercase tracking-wide leading-tight">
                    Live Recording
                  </div>
                </div>

                <div className="text-center">
                  <div
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2"
                    style={{ color: COLORS.primary }}
                  >
                    HD
                  </div>
                  <div className="text-gray-300 text-xs sm:text-xs md:text-sm uppercase tracking-wide leading-tight">
                    Broadcast Quality
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <img src="/fef/Vector 7.svg" />
              </div>
            </div>
          </AnimatedContent>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased">
      <Helmet>
        <title>Pitch to Get Rich - Karan Johar, Akshay Kumar, Darpan Sanghvi | Fashion Entrepreneur Fund</title>
        <meta
          name="description"
          content="Pitch to Get Rich - Fashion reality show featuring celebrity investors Karan Johar, Akshay Kumar, Saif Ali Khan, and Darpan Sanghvi. Watch fashion startups pitch for funding on Hotstar. Apply for Season 2 now!"
        />
        <meta
          name="keywords"
          content="pitch to get rich, karan johar, akshay kumar, darpan sanghvi, saif ali khan, hotstar, fashion entrepreneur fund, FEF, startup pitch show, celebrity investors, fashion reality show, pitch competition, shark tank India, entrepreneur show, CoFounder Circle"
        />
        <link rel="canonical" href="https://cofoundercircle.ai/fef" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Pitch to Get Rich - Karan Johar, Akshay Kumar, Darpan Sanghvi | FEF" />
        <meta property="og:description" content="Watch Pitch to Get Rich featuring celebrity investors Karan Johar, Akshay Kumar, and Darpan Sanghvi. Fashion startups pitch for funding on Hotstar." />
        <meta property="og:url" content="https://cofoundercircle.ai/fef" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Fashion Entrepreneur Fund - CoFounder Circle" />
        <meta property="og:image" content="https://cofoundercircle.ai/fef/fef-logo-main.svg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pitch to Get Rich - Karan Johar, Akshay Kumar | FEF" />
        <meta name="twitter:description" content="Watch Pitch to Get Rich featuring celebrity investors. Fashion startups pitch for funding on Hotstar." />
        <meta name="twitter:image" content="https://cofoundercircle.ai/fef/fef-logo-main.svg" />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="author" content="CoFounder Circle, Darpan Sanghvi" />
        
        {/* Structured Data - Event Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: 'Pitch to Get Rich - Fashion Entrepreneur Fund Season 2',
            description: 'Pitch to Get Rich is a fashion reality show where startups pitch to celebrity investors including Karan Johar, Akshay Kumar, Saif Ali Khan, and Darpan Sanghvi for funding and mentorship.',
            startDate: '2025-01-01',
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
            location: {
              '@type': 'VirtualLocation',
              name: 'Hotstar & CoFounder Circle Platform',
              url: 'https://cofoundercircle.ai/fef'
            },
            organizer: {
              '@type': 'Organization',
              name: 'CoFounder Circle',
              founder: {
                '@type': 'Person',
                name: 'Darpan Sanghvi'
              },
              url: 'https://cofoundercircle.ai'
            },
            performer: [
              {
                '@type': 'Person',
                name: 'Karan Johar',
                description: 'Celebrity Investor & Judge'
              },
              {
                '@type': 'Person',
                name: 'Akshay Kumar',
                description: 'Celebrity Investor & Judge'
              },
              {
                '@type': 'Person',
                name: 'Saif Ali Khan',
                description: 'Celebrity Investor & Judge'
              },
              {
                '@type': 'Person',
                name: 'Darpan Sanghvi',
                description: 'Founder & Host - CoFounder Circle'
              }
            ]
          })}
        </script>
        
        {/* Structured Data - TV Series Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TVSeries',
            name: 'Pitch to Get Rich',
            alternateName: 'Fashion Entrepreneur Fund',
            description: 'Pitch to Get Rich is a reality TV show where fashion entrepreneurs pitch their startups to celebrity investors Karan Johar, Akshay Kumar, and Darpan Sanghvi for funding.',
            genre: ['Reality TV', 'Business', 'Entrepreneurship', 'Fashion'],
            numberOfSeasons: 2,
            actor: [
              {
                '@type': 'Person',
                name: 'Karan Johar'
              },
              {
                '@type': 'Person',
                name: 'Akshay Kumar'
              },
              {
                '@type': 'Person',
                name: 'Saif Ali Khan'
              },
              {
                '@type': 'Person',
                name: 'Darpan Sanghvi'
              }
            ],
            productionCompany: {
              '@type': 'Organization',
              name: 'CoFounder Circle',
              founder: {
                '@type': 'Person',
                name: 'Darpan Sanghvi'
              }
            }
          })}
        </script>
        
        {/* Structured Data - Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Fashion Entrepreneur Fund',
            alternateName: 'FEF - CoFounder Circle',
            url: 'https://cofoundercircle.ai/fef',
            logo: 'https://cofoundercircle.ai/fef/fef-logo-main.svg',
            description: 'Fashion Entrepreneur Fund (FEF) - Pitch to Get Rich featuring celebrity investors Karan Johar, Akshay Kumar, Saif Ali Khan, and Darpan Sanghvi. Watch on Hotstar.',
            founder: {
              '@type': 'Person',
              name: 'Darpan Sanghvi',
              url: 'https://cofoundercircle.ai/darpansanghvi',
              jobTitle: 'Founder & CEO',
              description: 'Serial entrepreneur who built Good Glamm Group into a unicorn. Now building CoFounder Circle.'
            },
            keywords: 'pitch to get rich, karan johar, akshay kumar, darpan sanghvi, hotstar, fashion startup, celebrity investors'
          })}
        </script>
      </Helmet>
      
      <FefHeader
        setActiveMenu={setActiveMenu}
        setActiveSubMenu={setActiveSubMenu}
        handleMenuChange={handleMenuChange}
      />
      <BannerSection />

      {/* Application Section */}
      <section
        className="w-full py-6 sm:py-8 md:py-12"
        style={{ backgroundColor: COLORS.background }}
      >
        <div className="mt-8 sm:mt-12 md:mt-16 text-center px-4 sm:px-6">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-[#F9AC02] mb-4 sm:mb-6 md:mb-8 leading-tight">
            ITS TIME FOR YOU TO GET RICH TOO
          </h1>
          <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 mt-8 sm:mt-16 md:mt-32">
            <img src="/fef/Vector 3.svg" alt="Divider" className="block md:hidden w-auto h-4" loading="lazy" />
            <img src="/fef/Vector 7.svg" alt="Divider" className="hidden md:block w-auto h-6" loading="lazy" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-thin mt-4 sm:mt-6 md:mt-8 text-white mb-4 sm:mb-6 md:mb-8 leading-tight px-2">
            Pitch Your Startup.
            <br />
            Apply For Season 2.
            <br />
            Get Incubated. Get Famous.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
            Applications for Season 2 of Pitch to Get Rich are now open. This is
            your chance to secure Funding, get Incubated and get featured on
            Season 2 of Pitch To Get Rich.
          </p>

          <ResponsiveButton
            variant="primary"
            size="lg"
            onClick={() => setIsSignupModalOpen(true)}
          >
            Apply Now!
          </ResponsiveButton>

          <div className="mt-12 sm:mt-16 md:mt-24">
            <h1
              className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 px-2"
              style={{ color: COLORS.primary }}
            >
              Season 2 Application Details
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white max-w-4xl mx-auto px-2">
              Everything you need to know about applying for Season 2 of Pitch
              to Get Rich
            </p>
          </div>

          {/* Submenu Section */}
          <div
            className="mt-8 sm:mt-12 md:mt-16 px-2 sm:px-4 md:px-8 lg:px-16 py-2"
            style={{ backgroundColor: "#000000" }}
          >
            {/* Desktop Menu */}
            {!isMobile && (
              <div className="flex justify-center mb-8">
                <div className="flex max-w-6xl w-full">
                  {SUB_MENU_ITEMS.map((item) => (
                    <MenuButton
                      key={item}
                      item={item}
                      isActive={activeSubMenu === item}
                      onClick={() => setActiveSubMenu(item)}
                      className="flex-1"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {SUB_MENU_ITEMS.slice(0, 2).map((item) => (
                    <ResponsiveButton
                      key={item}
                      variant={activeSubMenu === item ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setActiveSubMenu(item)}
                    >
                      {item}
                    </ResponsiveButton>
                  ))}
                </div>
                <div className="flex justify-center">
                  <ResponsiveButton
                    variant={
                      activeSubMenu === SUB_MENU_ITEMS[2]
                        ? "primary"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setActiveSubMenu(SUB_MENU_ITEMS[2])}
                  >
                    {SUB_MENU_ITEMS[2]}
                  </ResponsiveButton>
                </div>
              </div>
            )}
          </div>

          {/* Submenu Content */}
          <div
            id={
              activeSubMenu === "Benefits & rewards"
                ? "benefits-rewards-section"
                : undefined
            }
            className="text-center text-white transition-all duration-700 ease-in-out"
            style={{ backgroundColor: COLORS.background }}
          >
            {/* Render submenu content based on activeSubMenu state */}
            {activeSubMenu === "Benefits & rewards" && (
              <BenefitsRewardsContent
                onApplyNowClick={() => setIsSignupModalOpen(true)}
              />
            )}
            {activeSubMenu === "Application process" && (
              <ApplicationProcessContent
                onApplyNowClick={() => setIsSignupModalOpen(true)}
              />
            )}
            {activeSubMenu === "Requirement & criteria" && (
              <RequirementsCriteriaContent />
            )}
          </div>
        </div>

        {/* Signup Modal */}
        <SignupModal
          isOpen={isSignupModalOpen}
          onClose={() => setIsSignupModalOpen(false)}
          redirectPath="/pitch-tank-form?fef-application=true"
        />
      </section>

      <PredictWinSection />
      <AboutSection />

      {/* Menu Section */}
      <section
        id="celebrity-menu-section"
        className="w-full bg-cover bg-center bg-no-repeat px-4 sm:px-6 md:px-8 lg:px-16 py-4"
        style={{ backgroundImage: "url('/fef/Rectangle 3.svg')" }}
      >
        <div className="w-full">
          {/* Desktop Menu */}
          {!isMobile && (
            <div className="grid grid-cols-4 gap-0 w-full justify-center">
              {MAIN_MENU_ITEMS.map((item) => (
                <MenuButton
                  key={item}
                  item={item}
                  isActive={activeMenu === item}
                  onClick={() => handleMenuChange(item)}
                  className="w-full"
                />
              ))}
            </div>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {MAIN_MENU_ITEMS.slice(0, 2).map((item) => (
                  <ResponsiveButton
                    key={item}
                    variant={activeMenu === item ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handleMenuChange(item)}
                  >
                    {item}
                  </ResponsiveButton>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {MAIN_MENU_ITEMS.slice(2, 4).map((item) => (
                  <ResponsiveButton
                    key={item}
                    variant={activeMenu === item ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handleMenuChange(item)}
                  >
                    {item}
                  </ResponsiveButton>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content Area */}
      <div
        className="w-full transition-all duration-500 ease-in-out"
        style={{ backgroundColor: COLORS.background }}
      >
        {renderContent()}
      </div>

      {/* Footer Section */}
      <footer className="bg-black py-8 px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="w-full flex flex-col md:flex-row justify-between items-center">
          <div className="text-white text-sm mb-4 md:mb-0">
            © 2025 Fashion Entrepreneur Fund. All rights reserved.
          </div>
          <div className="text-white text-sm flex items-center">
            <span className="mr-2">Powered by</span>
            <a
              href="#"
              className="font-bold underline transition-colors hover:opacity-80"
              style={{ color: COLORS.primary }}
            >
              CoFounder Circle
            </a>
            <span className="ml-1 text-white">↗</span>
          </div>
        </div>
      </footer>

      {/* Custom Carousel Styles */}
      <style>{`
        .custom-carousel-dots {
          margin-top: 16px !important;
        }

        .custom-carousel-dots .ant-carousel-dot {
          background-color: #666;
          border-radius: 50%;
          width: 8px !important;
          height: 8px !important;
          margin: 0 4px;
        }

        .custom-carousel-dots .ant-carousel-dot-active {
          background-color: #f9ac03 !important;
          width: 10px !important;
          height: 10px !important;
        }

        .ant-carousel .ant-carousel-prev,
        .ant-carousel .ant-carousel-next {
          color: #fff;
          font-size: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .ant-carousel .ant-carousel-prev:hover,
        .ant-carousel .ant-carousel-next:hover {
          color: #f9ac03;
          background-color: rgba(0, 0, 0, 0.6);
          transform: scale(1.1);
        }

        .ant-carousel .ant-carousel-prev {
          left: 12px;
        }

        .ant-carousel .ant-carousel-next {
          right: 12px;
        }

        /* Mobile specific styles */
        @media (max-width: 640px) {
          .custom-carousel-dots {
            margin-top: 12px !important;
          }

          .custom-carousel-dots .ant-carousel-dot {
            width: 6px !important;
            height: 6px !important;
            margin: 0 3px;
          }

          .custom-carousel-dots .ant-carousel-dot-active {
            width: 8px !important;
            height: 8px !important;
          }

          .ant-carousel .ant-carousel-prev,
          .ant-carousel .ant-carousel-next {
            font-size: 14px;
            width: 28px;
            height: 28px;
          }

          .ant-carousel .ant-carousel-prev {
            left: 8px;
          }

          .ant-carousel .ant-carousel-next {
            right: 8px;
          }
        }

        /* Extra small mobile */
        @media (max-width: 375px) {
          .custom-carousel-dots .ant-carousel-dot {
            width: 5px !important;
            height: 5px !important;
            margin: 0 2px;
          }

          .custom-carousel-dots .ant-carousel-dot-active {
            width: 7px !important;
            height: 7px !important;
          }

          .ant-carousel .ant-carousel-prev,
          .ant-carousel .ant-carousel-next {
            font-size: 12px;
            width: 24px;
            height: 24px;
          }

          .ant-carousel .ant-carousel-prev {
            left: 6px;
          }

          .ant-carousel .ant-carousel-next {
            right: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default FefLanding;