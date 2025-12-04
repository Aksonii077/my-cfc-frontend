
import { ECommerceData, ECommercePlatform, AIHelpResponse } from '@/types/ecommerce';

const ECOMMERCE_STORAGE_KEY = 'ecommerce_data';
const AI_RESPONSES_KEY = 'ecommerce_ai_responses';

export const saveECommerceData = (data: ECommerceData) => {
  const existingData = getECommerceData();
  existingData[data.id] = data;
  localStorage.setItem(ECOMMERCE_STORAGE_KEY, JSON.stringify(existingData));
};

export const getECommerceData = (): Record<string, ECommerceData> => {
  const stored = localStorage.getItem(ECOMMERCE_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getUserECommerceData = (userId: string): ECommerceData | null => {
  const allData = getECommerceData();
  return Object.values(allData).find(data => data.userId === userId) || null;
};

export const saveAIResponse = (userId: string, response: AIHelpResponse) => {
  const responseKey = `${AI_RESPONSES_KEY}_${userId}`;
  localStorage.setItem(responseKey, JSON.stringify(response));
};

export const getAIResponse = (userId: string): AIHelpResponse | null => {
  const responseKey = `${AI_RESPONSES_KEY}_${userId}`;
  const stored = localStorage.getItem(responseKey);
  return stored ? JSON.parse(stored) : null;
};

export const generatePlatformReferralUrl = (platform: ECommercePlatform) => {
  const utmSource = 'cofounder-circle';
  const utmMedium = 'partner';
  const utmCampaign = 'ecommerce-kit';
  
  switch (platform) {
    case 'shopify':
      return `https://www.shopify.com/in?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
    case 'amazon':
      return `https://sell.amazon.in/get-started?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
    case 'flipkart':
      return `https://seller.flipkart.com/sell-online?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
    default:
      return '#';
  }
};

export const createMockECommerceData = (userId: string): ECommerceData => {
  return {
    id: `ecom_${Date.now()}`,
    userId,
    currentStep: 'choose-strategy',
    steps: {
      'choose-strategy': {
        status: 'pending',
      },
      'setup-store': {
        status: 'pending',
      },
      'product-listings': {
        status: 'pending',
      },
      'logistics-payments': {
        status: 'pending',
      },
      'launch-plan': {
        status: 'pending',
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
