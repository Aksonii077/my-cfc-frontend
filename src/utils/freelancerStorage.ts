
import { FreelancerData, FreelancerCategory, AIFreelancerResponse, ServicePackage, ClientData } from '@/types/freelancer';

const FREELANCER_STORAGE_KEY = 'freelancer_data';
const AI_FREELANCER_RESPONSES_KEY = 'freelancer_ai_responses';

export const saveFreelancerData = (data: FreelancerData) => {
  const existingData = getFreelancerData();
  existingData[data.id] = data;
  localStorage.setItem(FREELANCER_STORAGE_KEY, JSON.stringify(existingData));
};

export const getFreelancerData = (): Record<string, FreelancerData> => {
  const stored = localStorage.getItem(FREELANCER_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getUserFreelancerData = (userId: string): FreelancerData | null => {
  const allData = getFreelancerData();
  return Object.values(allData).find(data => data.userId === userId) || null;
};

export const saveAIFreelancerResponse = (userId: string, response: AIFreelancerResponse) => {
  const responseKey = `${AI_FREELANCER_RESPONSES_KEY}_${userId}`;
  localStorage.setItem(responseKey, JSON.stringify(response));
};

export const getAIFreelancerResponse = (userId: string): AIFreelancerResponse | null => {
  const responseKey = `${AI_FREELANCER_RESPONSES_KEY}_${userId}`;
  const stored = localStorage.getItem(responseKey);
  return stored ? JSON.parse(stored) : null;
};

export const createMockFreelancerData = (userId: string): FreelancerData => {
  return {
    id: `fl_${Date.now()}`,
    userId,
    services: [],
    currentStep: 'define-services',
    steps: {
      'define-services': { status: 'pending' },
      'create-identity': { status: 'pending' },
      'setup-payments': { status: 'pending' },
      'market-promote': { status: 'pending' },
      'manage-clients': { status: 'pending' },
    },
    milestones: [
      { id: 'identity', name: 'Identity Created', description: 'Created your freelancer profile and bio', completed: false, icon: '🪪', xpPoints: 100 },
      { id: 'payment', name: 'Payment Active', description: 'Set up payment links and booking system', completed: false, icon: '💳', xpPoints: 150 },
      { id: 'pitch', name: 'First Pitch Sent', description: 'Sent your first client pitch', completed: false, icon: '📧', xpPoints: 200 },
      { id: 'client', name: 'First Client', description: 'Got your first confirmed client', completed: false, icon: '🎉', reward: 'Celebrate! You\'re officially in business!', xpPoints: 300 },
      { id: 'revenue', name: '₹5000 Revenue Earned', description: 'Reached your first revenue milestone', completed: false, icon: '💰', reward: 'You\'re on your way to freelance success!', xpPoints: 500 },
    ],
    totalXP: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateServiceSuggestions = (category: FreelancerCategory): ServicePackage[] => {
  const suggestions: Record<FreelancerCategory, Partial<ServicePackage>[]> = {
    designer: [
      { name: 'Logo Design', price: 2500, duration: '3-5 days', description: 'Professional logo with 3 concepts and unlimited revisions' },
      { name: 'Brand Identity Package', price: 8000, duration: '1-2 weeks', description: 'Complete brand kit with logo, colors, fonts, and guidelines' },
      { name: 'Social Media Graphics', price: 1500, duration: '2-3 days', description: '10 custom graphics for Instagram, Facebook, and LinkedIn' },
    ],
    writer: [
      { name: 'Blog Article Writing', price: 800, duration: '2-3 days', description: '1000-word SEO-optimized blog post with research' },
      { name: 'Website Copy Package', price: 5000, duration: '1 week', description: 'Complete website copy for 5-7 pages' },
      { name: 'Social Media Content', price: 3000, duration: '3-5 days', description: '30 posts with captions for one month' },
    ],
    coach: [
      { name: '1-on-1 Coaching Session', price: 2000, duration: '1 hour', description: 'Personalized coaching session with action plan' },
      { name: 'Monthly Coaching Package', price: 6000, duration: '4 weeks', description: '4 sessions + WhatsApp support + resources' },
      { name: 'Group Coaching Program', price: 3500, duration: '6 weeks', description: 'Weekly group sessions with workbooks' },
    ],
    consultant: [
      { name: 'Business Consultation', price: 3000, duration: '1-2 hours', description: 'Strategic business advice with written recommendations' },
      { name: 'Market Research Report', price: 8000, duration: '1 week', description: 'Comprehensive market analysis and competitor research' },
      { name: 'Monthly Retainer', price: 15000, duration: '1 month', description: 'Ongoing consultation with weekly check-ins' },
    ],
    photographer: [
      { name: 'Portrait Photography', price: 4000, duration: '2-3 hours', description: 'Professional portraits with 15 edited photos' },
      { name: 'Event Photography', price: 8000, duration: '4-6 hours', description: 'Complete event coverage with 100+ photos' },
      { name: 'Product Photography', price: 2500, duration: '2-4 hours', description: '20 product photos with professional editing' },
    ],
    beautician: [
      { name: 'Bridal Makeup', price: 6000, duration: '3-4 hours', description: 'Complete bridal look with trial session' },
      { name: 'Party Makeup', price: 2500, duration: '1-2 hours', description: 'Glamorous party look with touch-up kit' },
      { name: 'Makeup Workshop', price: 4000, duration: '3 hours', description: 'Learn professional makeup techniques' },
    ],
    tutor: [
      { name: 'Subject Tutoring', price: 1000, duration: '1 hour', description: 'One-on-one subject tutoring with materials' },
      { name: 'Exam Preparation', price: 8000, duration: '1 month', description: 'Comprehensive exam prep with mock tests' },
      { name: 'Assignment Help', price: 1500, duration: '2-3 days', description: 'Professional assignment assistance and review' },
    ],
    editor: [
      { name: 'Content Editing', price: 800, duration: '1-2 days', description: 'Professional editing for articles up to 2000 words' },
      { name: 'Book Editing', price: 15000, duration: '2-3 weeks', description: 'Complete book editing with detailed feedback' },
      { name: 'Academic Paper Review', price: 2000, duration: '3-5 days', description: 'Thorough review with improvement suggestions' },
    ],
    developer: [
      { name: 'Website Development', price: 12000, duration: '1-2 weeks', description: 'Responsive website with 5 pages' },
      { name: 'App Development', price: 25000, duration: '1 month', description: 'Mobile app with basic features' },
      { name: 'Website Maintenance', price: 3000, duration: 'Monthly', description: 'Monthly website updates and maintenance' },
    ],
    marketer: [
      { name: 'Social Media Strategy', price: 5000, duration: '1 week', description: 'Complete social media strategy with content calendar' },
      { name: 'Digital Marketing Campaign', price: 10000, duration: '2-3 weeks', description: 'Full campaign setup and management' },
      { name: 'SEO Optimization', price: 8000, duration: '1-2 weeks', description: 'Website SEO audit and optimization' },
    ],
  };
  
  return suggestions[category]?.map((service, index) => ({
    id: `${category}_${index}`,
    ...service,
    category,
  })) as ServicePackage[] || [];
};

export const generatePitchTemplates = (category: FreelancerCategory, businessName?: string): string[] => {
  const name = businessName || 'I';
  const templates: Record<FreelancerCategory, string[]> = {
    designer: [
      `${name} help small businesses create stunning visual identities that attract customers and build trust.`,
      `Professional design solutions that make your business stand out in the crowded marketplace.`,
      `Transform your business vision into compelling visuals that convert visitors into customers.`,
    ],
    writer: [
      `${name} craft compelling content that tells your story and drives business growth.`,
      `Words that work: Professional content that engages your audience and boosts your brand.`,
      `From blogs to websites, I create content that converts readers into loyal customers.`,
    ],
    coach: [
      `${name} help ambitious professionals unlock their potential and achieve breakthrough results.`,
      `Transform your career and life with personalized coaching that delivers real outcomes.`,
      `Ready to level up? I guide high-achievers to their next breakthrough.`,
    ],
    consultant: [
      `${name} help businesses solve complex challenges and accelerate growth through strategic guidance.`,
      `Strategic insights that transform your business challenges into competitive advantages.`,
      `Expert consultation that turns your business vision into actionable, profitable strategies.`,
    ],
    photographer: [
      `${name} capture moments that matter, creating stunning visuals for your special occasions.`,
      `Professional photography that tells your story through beautiful, timeless images.`,
      `From portraits to events, I create photographs that you'll treasure forever.`,
    ],
    beautician: [
      `${name} help you look and feel your absolute best for life's most important moments.`,
      `Expert beauty services that enhance your natural radiance and boost your confidence.`,
      `Professional makeup and beauty treatments that make you shine on your special day.`,
    ],
    tutor: [
      `${name} help students excel academically through personalized, effective teaching methods.`,
      `Unlock your academic potential with expert tutoring that makes learning enjoyable.`,
      `From struggling to succeeding: I help students achieve their educational goals.`,
    ],
    editor: [
      `${name} polish your content to perfection, ensuring clarity, impact, and professional quality.`,
      `Professional editing that transforms good writing into exceptional communication.`,
      `Make your words count: Expert editing that enhances clarity and impact.`,
    ],
    developer: [
      `${name} build powerful digital solutions that help your business thrive online.`,
      `Custom websites and apps that deliver exceptional user experiences and drive results.`,
      `Transform your digital presence with professional development that works.`,
    ],
    marketer: [
      `${name} help businesses grow through strategic marketing that delivers measurable results.`,
      `Data-driven marketing strategies that turn your audience into loyal customers.`,
      `Grow your business with marketing that actually works and delivers real ROI.`,
    ],
  };
  
  return templates[category] || ['Professional services tailored to your unique needs and goals.'];
};

export const generateWhatsAppTemplates = (category: FreelancerCategory, businessName?: string): string[] => {
  const name = businessName || 'My';
  return [
    `🎉 Exciting News! ${name} freelance services are now LIVE! 🎉

✨ Offering professional ${category} services:
• Quality work with quick turnaround
• Affordable pricing for all budgets  
• 100% satisfaction guaranteed

📱 Message me directly to get started
💳 Easy payment options available
🚚 Digital delivery within promised time

Ready to work together? Let's chat! 👇`,

    `🌟 Hello! I'm your go-to ${category} expert! 🌟

Looking for professional ${category} services? You're in the right place!

✅ Experienced & reliable
✅ Fast delivery
✅ Great prices
✅ Happy clients

Drop me a message and let's discuss your project! 

#Freelancer #${category.charAt(0).toUpperCase() + category.slice(1)} #QualityWork`,

    `👋 Hi there! 

Need help with ${category}? I've got you covered!

What I offer:
🎯 Professional quality
⏰ On-time delivery  
💰 Competitive pricing
🤝 Dedicated support

Let's turn your ideas into reality! Send me a message to get started.

Available for immediate projects! 📲`
  ];
};

export const generateInstagramCaptions = (category: FreelancerCategory, businessName?: string): string[] => {
  const name = businessName || 'I';
  return [
    `✨ Ready to elevate your ${category === 'beautician' ? 'beauty game' : 'business'}? ✨

${name === 'I' ? 'I' : name} specialize in ${category} services that deliver results you'll love! 

💡 What makes me different?
• Attention to detail
• Quick turnaround  
• Affordable pricing
• 100% satisfaction guarantee

💬 DM me to get started
🔗 Link in bio for more details
📍 Serving clients with passion

#${category.charAt(0).toUpperCase() + category.slice(1)} #Freelancer #QualityWork #LocalBusiness #SupportSmallBusiness`,

    `🚀 Transform your vision into reality! 🚀

Struggling with ${category}? Let me help you achieve amazing results!

✅ Professional quality
✅ Fast delivery
✅ Great communication
✅ Happy clients

Ready to get started? Send me a DM! 📩

#ProfessionalServices #${category.charAt(0).toUpperCase() + category.slice(1)} #FreelanceLife #QualityFirst`,

    `🎯 Your ${category} expert is here! 🎯

${name === 'I' ? 'I' : name} help clients achieve their goals through:
• Creative solutions
• Professional approach
• Timely delivery
• Ongoing support

What's your next project? Let's make it happen! 💪

DM me for a free consultation! 📱

#${category.charAt(0).toUpperCase() + category.slice(1)}Expert #Freelancer #YourSuccess #LetsCollaborate`
  ];
};

export const generateReferralMessages = (category: FreelancerCategory, businessName?: string): string[] => {
  const name = businessName || 'I';
  return [
    `🎉 REFERRAL REWARD! 🎉

Know someone who needs ${category} services?

Refer them to ${name === 'I' ? 'me' : name} and you BOTH get:
🎁 ₹100 cashback on their first project
🎁 ₹100 credit for your next booking

It's a win-win! 

Simply share my contact and mention your name when they book.

Help your friends while earning rewards! 🌟`,

    `💰 EARN ₹100 FOR EVERY REFERRAL! 💰

Love my ${category} work? Share the love!

How it works:
1️⃣ Refer a friend who needs ${category} services
2️⃣ They mention your name when booking
3️⃣ You both get ₹100 off!

No limit on referrals = Unlimited earnings! 

Start referring today! 📲`,

    `🌟 FRIEND REFERRAL PROGRAM 🌟

Your friends deserve great ${category} services too!

When you refer someone to ${name === 'I' ? 'me' : name}:
✅ They get ₹100 off their first project
✅ You get ₹100 credit for future bookings  
✅ Both of you get priority booking

Sharing is caring (and rewarding)! 💝

Tag a friend who could use my services! 👇`
  ];
};
