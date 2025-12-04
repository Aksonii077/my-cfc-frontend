import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';

const DarpanSanghviPage: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Darpan Sanghvi - Founder CoFounder Circle | Pitch to Get Rich Judge with Karan Johar & Akshay Kumar</title>
        <meta
          name="description"
          content="Darpan Sanghvi - Serial entrepreneur who built Good Glamm Group into a unicorn. Founder of CoFounder Circle and judge on Pitch to Get Rich with Karan Johar and Akshay Kumar on Hotstar."
        />
        <meta
          name="keywords"
          content="darpan sanghvi, cofounder circle, good glamm group, pitch to get rich, karan johar, akshay kumar, hotstar, fashion entrepreneur fund, unicorn founder, entrepreneur, startup mentor, business coach"
        />
        <link rel="canonical" href="https://cofoundercircle.ai/darpansanghvi" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Darpan Sanghvi - Founder CoFounder Circle | Pitch to Get Rich Judge" />
        <meta property="og:description" content="Serial entrepreneur who built Good Glamm Group into a unicorn. Now founder of CoFounder Circle and judge on Pitch to Get Rich with Karan Johar & Akshay Kumar." />
        <meta property="og:url" content="https://cofoundercircle.ai/darpansanghvi" />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="https://cofoundercircle.ai/Group 83.png" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Darpan Sanghvi - Founder CoFounder Circle" />
        <meta name="twitter:description" content="Unicorn founder, entrepreneur, and judge on Pitch to Get Rich with Karan Johar & Akshay Kumar" />
        
        {/* Structured Data - Person Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Darpan Sanghvi',
            jobTitle: 'Founder & CEO',
            worksFor: {
              '@type': 'Organization',
              name: 'CoFounder Circle'
            },
            alumniOf: 'Good Glamm Group',
            description: 'Serial entrepreneur who built Good Glamm Group into a unicorn startup. Founder of CoFounder Circle and judge on Pitch to Get Rich featuring Karan Johar and Akshay Kumar on Hotstar.',
            url: 'https://cofoundercircle.ai/darpansanghvi',
            sameAs: [
              'https://www.linkedin.com/in/darpansanghvi'
            ],
            knowsAbout: ['Entrepreneurship', 'Startups', 'Fashion Tech', 'E-commerce', 'Venture Capital'],
            performerIn: {
              '@type': 'TVSeries',
              name: 'Pitch to Get Rich',
              description: 'Fashion entrepreneur reality show on Hotstar'
            }
          })}
        </script>
        
        {/* Structured Data - ProfilePage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            mainEntity: {
              '@type': 'Person',
              name: 'Darpan Sanghvi',
              description: 'Founder of CoFounder Circle and Good Glamm Group. Judge on Pitch to Get Rich with Karan Johar and Akshay Kumar.',
              image: 'https://cofoundercircle.ai/Group 83.png'
            }
          })}
        </script>
      </Helmet>

      {/* Header from homepage */}
      <Header />

      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="flex flex-col items-center text-center mb-8">
                {/* Profile Picture */}
                <div className="relative mb-6 flex justify-center">
                  <img
                    src="/Group 83.png"
                    alt="Darpan Sanghvi"
                    className="w-36 h-45 md:w-44 md:h-55 object-contain"
                    onError={(e) => {
                      console.log('Image failed to load:', e.currentTarget.src);
                      e.currentTarget.src = '/Group%2083.png';
                    }}
                  />
                </div>

                <div className="w-full">
                  {/* Roles */}
                  <div className="mb-4">
                    <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      Founder • Venture Builder • Mentor
                    </span>
                  </div>

                  {/* Name */}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Darpan Sanghvi
                  </h1>

                  {/* Tagline */}
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    I built a unicorn. I also watched a company I loved fall apart. Both changed me. Now I help others build.
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-8">
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Darpan Sanghvi started his first venture at 20. At 46, Darpan Sanghvi has restarted with{' '}
                  <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                    CoFounder Circle
                  </Link>{' '}
                  — an AI-native acceleration platform to help founders and MSMEs go from idea to IPO. Think Y Combinator without walls, built with the power of AI.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Explore CoFounder Circle
                </Link>
                <a
                  href="https://linkedin.com/in/darpansanghvi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black border-2 border-gray-300 rounded-full font-semibold hover:border-gray-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Connect on LinkedIn
                </a>
              </div>
            </div>

            {/* Fact Pack */}
            <div className="lg:col-span-1 flex flex-col h-full">
              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 sticky top-8 flex flex-col h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Fact Pack</h2>
                <ul className="space-y-4 flex-1">
                  {[
                    "Built Good Glamm Group into a Unicorn",
                    "Raised $250M+ from Warburg Pincus, Prosus, Bessemer, Accel, L'Occitane, Amazon",
                    "11 acquisitions in under a year",
                    "Built one of India's largest creator ecosystem",
                    "Scaled DTC engine from 0 to ~18M orders/year",
                    "Grew net revenue from ₹50cr to ₹650cr in 24 months",
                    "1 Billion+ organic impressions on social media through content platforms",
                    "JVs and partnerships with icons like Serena Williams, Karan Johar, Manish Malhotra, Shraddha Kapoor and more",
                    "Judge & Mentor on JioHotstar Special 'Pitch To Get Rich' - coaching founders on-air"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm md:text-base text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-6">
                  For references and public reporting on above, See "Press & Sources" below.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            The Journey: Building, Breaking, Rebuilding
          </h2>
          
          <div className="space-y-8">
            {[
              {
                year: "2017",
                title: "Launched MyGlamm (D2C beauty)",
                description: "Built a modern, clean, cruelty-free beauty brand focused on Indian consumers; partnered early with Manish Malhotra to create India's first true designer-led beauty label."
              },
              {
                year: "2020-2021",
                title: "From brand to ecosystem: POPxo & BabyChakra → Good Glamm Group",
                description: "Acquisitions of POPxo (Aug 2020) and BabyChakra (2021) matured into the content-to-commerce strategy and the formation of the Good Glamm Group (Oct 2021)."
              },
              {
                year: "NOV 2021",
                title: "Unicorn milestone",
                description: "Raised $150M (Series D) co-led by Prosus & Warburg Pincus — valuing the group at $1.2B. Expanded portfolio with brands and media platforms including ScoopWhoop & MissMalini."
              },
              {
                year: "2024-2025",
                title: "Cash crunch, restructuring & hard calls",
                description: "The rapid pace of expansion and acquisitions eventually created a momentum trap. And I failed. I lost everything that we built. Along with me a lot of our stakeholders also lost money - and that weight will stay with me forever. I took responsibility for the failure and have committed to doing right by people through CoFounder Circle."
              },
              {
                year: "2025 →",
                title: "CoFounder Circle: Purpose to help others build",
                description: "Restarted as a builder of builders — creating an AI-native acceleration platform to help founders go from idea to IPO. I also mentor founders on the reality show Pitch To Get Rich."
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-xl shadow-sm">
                <div className="md:w-32 flex-shrink-0">
                  <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {item.year}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Article Link */}
          <div className="mt-12 text-center">
            <a
              href="https://www.fortuneindia.com/business-news/darpan-sanghvis-rise-fall-and-reinvention-from-good-glamm-groups-collapse-to-hitting-restart-with-cofounder-circle/126879"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Rise, Fall & Reinvention: From Good Glamm Group's Collapse to Hitting Restart with CoFounder Circle
              <span className="text-sm text-gray-500">- Fortune Magazine</span>
            </a>
          </div>
        </div>
      </section>

      {/* Momentum Trap Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The Momentum Trap - What Broke & What I'd Do Differently
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Momentum is a founder's fuel — until it drowns you. Here's my brutally honest post-mortem: three levers pulled together made fragility inevitable. Any two, we may have survived. All three? We burned. This is now a playbook I share with founders so they don't repeat my mistakes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Too Much",
                description: "Too many fronts at once — acquisitions, multiple brands/categories, media + commerce — scattered focus and stretched resources."
              },
              {
                title: "Too Fast",
                description: "Compressed timelines created fragility; sprinting from ₹50cr to ₹650cr revenue without steady improvements in unit economics."
              },
              {
                title: "Too Big",
                description: "Scaled unproven bets; when experiments failed, they failed big — magnifying risk and cash burn."
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Resource Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="https://www.linkedin.com/posts/darpansanghvi_the-momentum-trap-activity-7356924072087207938-wi3e"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">The Momentum Trap</h4>
                <p className="text-sm text-gray-600">LinkedIn Post</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>

            <a
              href="https://www.forbesindia.com/article/take-one-big-story-of-the-day/why-good-glamm-failed-lessons-in-overexpansion-and-the-houseofbrands-trap/96526/1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">Why Good Glamm Failed: Lessons in Overexpansion and the House-of-Brands Trap</h4>
                <p className="text-sm text-gray-600">Forbes Magazine</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Press & Sources */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Press & Sources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                title: "Good Glamm Group raises $150M Series D, becomes unicorn", 
                source: "BusinessWire", 
                date: "Nov 10, 2021",
                url: "https://www.businesswire.com/news/home/20211110005261/en/Good-Glamm-Group-Raises-%24150-Million-in-Series-D-Round-Co-Led-by-Warburg-Pincus-Prosus-Ventures"
              },
              { 
                title: "Good Glamm enters unicorn club at $1.2B valuation", 
                source: "Glossy", 
                date: "Nov 10, 2021",
                url: "https://www.glossy.co/beauty/indian-beauty-conglomerate-good-glamm-group-enters-unicorn-club-with-1-2-valuation/"
              },
              { 
                title: "MyGlamm acquires POPxo", 
                source: "Times of India", 
                date: "Aug 7, 2020",
                url: "https://timesofindia.indiatimes.com/myglamm-acquires-popxo/articleshow/77414508.cms"
              },
              { 
                title: "Formation of Good Glamm Group (POPxo + BabyChakra + MyGlamm)", 
                source: "Wikipedia", 
                date: "Updated 2025",
                url: "https://en.wikipedia.org/wiki/Good_Glamm_Group"
              },
              { 
                title: "Good Glamm acquires ScoopWhoop", 
                source: "Business Today", 
                date: "Oct 20, 2021",
                url: "https://www.businesstoday.in/latest/corporate/story/good-glamm-group-acquires-scoopwhoop-with-an-eye-on-the-fast-growing-male-segment-309947-2021-10-20"
              },
              { 
                title: "Good Glamm acquires MissMalini Entertainment", 
                source: "Mint", 
                date: "Dec 13, 2021",
                url: "https://www.livemint.com/companies/news/good-glamm-group-makes-fifth-acquisition-in-2021-acquires-miss-malini-11639405956204.html"
              },
              { 
                title: "Manish Malhotra Beauty exclusively by MyGlamm launches first ever brand national TVC", 
                source: "Times of India", 
                date: "Mar 15, 2022",
                url: "https://timesofindia.indiatimes.com/manish-malhotra-beauty-exclusively-by-myglamm-launches-first-ever-brand-national-tvc/articleshow/90223540.cms"
              },
              { 
                title: "Karan Johar partners with MyGlamm to launch MyGlamm POUT", 
                source: "afaqs", 
                date: "Dec 2023",
                url: "https://www.afaqs.com/news/advertising/karan-johar-partners-with-myglamm-to-launch-myglamm-pout"
              },
              { 
                title: "Good Glamm strikes JV with Serena Williams for Wyn Beauty", 
                source: "Economic Times", 
                date: "Apr 2024",
                url: "https://economictimes.indiatimes.com/tech/tech-bytes/good-glamm-eyes-an-ace-in-jv-with-serena-williams-cosmetics-company/articleshow/109013419.cms?from=mdr"
              },
              { 
                title: "JioHotstar announces 'Pitch to Get Rich' reality series featuring Darpan Sanghvi as judge", 
                source: "Economic Times", 
                date: "Oct 2025",
                url: "https://economictimes.indiatimes.com/industry/media/entertainment/jiohotstar-announces-new-reality-series-pitch-to-get-rich-to-spotlight-next-gen-of-fashion-talent/articleshow/124292354.cms?from=mdr"
              },
              { 
                title: "Good Glamm completes 100% acquisition of The Moms Co.", 
                source: "Entrepreneur India", 
                date: "Nov 18, 2024",
                url: "https://www.entrepreneur.com/en-in/news-and-trends/the-good-glamm-group-completes-100-acquisition-of-the-moms/483045"
              },
              { 
                title: "Good Glamm breaks up as lenders enforce charge; brands for individual sale", 
                source: "Economic Times", 
                date: "Jul 23, 2025",
                url: "https://economictimes.indiatimes.com/tech/startups/good-glamm-breaks-up-as-lenders-enforce-charge-brands-to-be-sold-individually-ceo-darpan-sanghvi/articleshow/122858439.cms"
              },
              { 
                title: "'Too much, too fast, too big,' Good Glamm Group's Darpan Sanghvi on company collapse", 
                source: "CNBC TV18", 
                date: "Aug 1, 2025",
                url: "https://www.cnbctv18.com/business/startup/good-glamm-group-darpan-sanghvi-company-collapse-linkedin-post-ws-l-19647352.htm"
              }
            ].map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-6 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              {
                question: "Who is Darpan Sanghvi?",
                answer: "Darpan Sanghvi is a founder, entrepreneur, and business coach who built Good Glamm Group into a unicorn startup valued at $1.2 billion. After the company's collapse, Darpan Sanghvi founded CoFounder Circle, an AI-native acceleration platform helping founders go from idea to IPO."
              },
              {
                question: "What is the Momentum Trap?",
                answer: "The Momentum Trap is a framework created by Darpan Sanghvi based on his experience at Good Glamm Group. It identifies three critical mistakes that led to the company's failure: Too Much (too many fronts at once), Too Fast (compressed timelines without steady improvements), and Too Big (scaling unproven bets). This framework is now shared with founders to help them avoid similar pitfalls."
              },
              {
                question: "What is CoFounder Circle?",
                answer: "CoFounder Circle is an AI-native acceleration platform founded by Darpan Sanghvi to help founders and MSMEs go from idea to IPO. Think Y Combinator without walls, built with the power of AI. Darpan Sanghvi personally reviews every submission to help founders build better businesses."
              },
              {
                question: "What happened to Good Glamm Group?",
                answer: "Good Glamm Group, founded by Darpan Sanghvi, achieved unicorn status with a $1.2B valuation in November 2021 after raising $150M. However, rapid expansion through 11 acquisitions in under a year, combined with scaling too fast without solid unit economics, led to a cash crunch and eventual restructuring in 2024-2025. Darpan Sanghvi acknowledged his failure, took responsibility and now shares his lessons with founders in scaling and things to do to avoid breaking."
              },
              {
                question: "How can I connect with Darpan Sanghvi?",
                answer: "You can connect with Darpan Sanghvi through his LinkedIn profile at linkedin.com/in/darpansanghvi, or apply to Pitch Tank on CoFounder Circle at cofoundercircle.ai where Darpan Sanghvi personally reads every submission. He also mentors founders on the JioHotstar reality show \"Pitch To Get Rich\"."
              }
            ].map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              If you're building, Darpan Sanghvi would love to help.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Apply to Pitch Tank on CoFounder Circle so Darpan Sanghvi can understand your business. Darpan Sanghvi personally reads every submission.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                Join CoFounder Circle
              </Link>
              <a
                href="https://linkedin.com/in/darpansanghvi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black border-2 border-gray-300 rounded-full font-semibold hover:border-gray-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DarpanSanghviPage;
