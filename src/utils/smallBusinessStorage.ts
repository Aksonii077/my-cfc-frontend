
import { SmallBusinessData, SmallBusinessCategory, AIBusinessResponse } from '@/types/smallBusiness';

const SMALL_BUSINESS_STORAGE_KEY = 'small_business_data';
const AI_BUSINESS_RESPONSES_KEY = 'small_business_ai_responses';

export const saveSmallBusinessData = (data: SmallBusinessData) => {
  const existingData = getSmallBusinessData();
  existingData[data.id] = data;
  localStorage.setItem(SMALL_BUSINESS_STORAGE_KEY, JSON.stringify(existingData));
};

export const getSmallBusinessData = (): Record<string, SmallBusinessData> => {
  const stored = localStorage.getItem(SMALL_BUSINESS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getUserSmallBusinessData = (userId: string): SmallBusinessData | null => {
  const allData = getSmallBusinessData();
  return Object.values(allData).find(data => data.userId === userId) || null;
};

export const saveAIBusinessResponse = (userId: string, response: AIBusinessResponse) => {
  const responseKey = `${AI_BUSINESS_RESPONSES_KEY}_${userId}`;
  localStorage.setItem(responseKey, JSON.stringify(response));
};

export const getAIBusinessResponse = (userId: string): AIBusinessResponse | null => {
  const responseKey = `${AI_BUSINESS_RESPONSES_KEY}_${userId}`;
  const stored = localStorage.getItem(responseKey);
  return stored ? JSON.parse(stored) : null;
};

export const createMockSmallBusinessData = (userId: string): SmallBusinessData => {
  return {
    id: `sb_${Date.now()}`,
    userId,
    offerings: [],
    currentStep: 'define-offering',
    steps: {
      'define-offering': { status: 'pending' },
      'build-identity': { status: 'pending' },
      'payment-setup': { status: 'pending' },
      'delivery-setup': { status: 'pending' },
      'launch-promotion': { status: 'pending' },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateBusinessNameSuggestions = (category: SmallBusinessCategory): string[] => {
  const suggestions: Record<SmallBusinessCategory, string[]> = {
    food: ['Homely Delights', 'Kitchen Stories', 'Tasty Treats Co.', 'Fresh Flavors', 'Spice Route'],
    art: ['Creative Canvas', 'Artisan Studio', 'Handmade Haven', 'Color Craft', 'Artist\'s Touch'],
    clothing: ['Style Studio', 'Fashion Forward', 'Trendy Threads', 'Wardrobe Wonders', 'Chic Boutique'],
    'digital-products': ['Digital Craft', 'Online Solutions', 'Tech Creations', 'Digital Studio', 'Pixel Perfect'],
    services: ['Pro Services', 'Expert Solutions', 'Service Plus', 'Professional Touch', 'Skill Hub'],
    beauty: ['Glow Studio', 'Beauty Bliss', 'Radiant Touch', 'Glamour Hub', 'Natural Glow'],
    handicrafts: ['Craft Corner', 'Handmade Heritage', 'Artisan Alley', 'Traditional Touch', 'Craft Masters'],
    fitness: ['Fit Life', 'Wellness Hub', 'Active Living', 'Health First', 'Fitness Pro'],
    education: ['Learn Hub', 'Knowledge Point', 'Skill Academy', 'Education Plus', 'Smart Learning'],
  };
  
  return suggestions[category] || ['My Business', 'Startup Hub', 'Dream Venture'];
};

export const generateOfferingSuggestions = (category: SmallBusinessCategory): string[] => {
  const suggestions: Record<SmallBusinessCategory, string[]> = {
    food: ['Homemade Snacks', 'Fresh Meals', 'Baked Goods', 'Traditional Sweets', 'Healthy Smoothies'],
    art: ['Custom Portraits', 'Wall Art', 'Digital Illustrations', 'Handmade Cards', 'Art Classes'],
    clothing: ['Custom T-shirts', 'Ethnic Wear', 'Accessories', 'Tailoring Services', 'Fashion Consultation'],
    'digital-products': ['Website Templates', 'Social Media Graphics', 'Online Courses', 'Digital Planners', 'Stock Photos'],
    services: ['Home Cleaning', 'Tutoring', 'Photography', 'Event Planning', 'Consultation'],
    beauty: ['Makeup Services', 'Skincare Products', 'Hair Styling', 'Beauty Workshops', 'Natural Cosmetics'],
    handicrafts: ['Handmade Jewelry', 'Home Decor', 'Gift Items', 'Traditional Crafts', 'Custom Orders'],
    fitness: ['Personal Training', 'Yoga Classes', 'Nutrition Plans', 'Fitness Coaching', 'Group Workouts'],
    education: ['Online Tutoring', 'Skill Courses', 'Language Classes', 'Test Prep', 'Career Guidance'],
  };
  
  return suggestions[category] || ['Custom Service', 'Product Offering', 'Consultation'];
};

export const generateWhatsAppMessage = (businessName: string, offerings: string[]): string => {
  return `🎉 Exciting News! ${businessName} is now LIVE! 🎉

✨ We're thrilled to offer you:
${offerings.map(offering => `• ${offering}`).join('\n')}

📱 Place your order by messaging us directly
💳 Easy payments available
🚚 Quick delivery to your doorstep

Ready to experience something amazing? Let's chat! 👇`;
};

export const generateInstagramCaption = (businessName: string, offerings: string[]): string => {
  return `🌟 Welcome to ${businessName}! 🌟

We're here to bring you the best:
${offerings.slice(0, 3).map(offering => `✨ ${offering}`).join('\n')}

💬 DM us to order
🔗 Link in bio for more details
📍 Serving locally with love

#SmallBusiness #LocalBusiness #Entrepreneur #IndianBusiness #SupportLocal`;
};
