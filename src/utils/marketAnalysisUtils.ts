
import { MARKET_GROWTH_RATES, MARKET_TAM_SIZES, DEFAULT_GROWTH_RATE, DEFAULT_TAM_SIZE } from '@/data/startupConstants';

export interface MarketAnalysis {
  targetAddressableMarket: number;
  marketSize: number;
  marketGrowthRate: number;
  summary: string;
}

export interface Competitor {
  name: string;
  description: string;
  website?: string;
  strengths?: string[];
  weaknesses?: string[];
  marketShare?: number;
}

export const generateMarketAnalysis = (category: string): { marketAnalysis: MarketAnalysis, competitors: Competitor[] } => {
  const mockTAM = MARKET_TAM_SIZES[category] || DEFAULT_TAM_SIZE;
  const mockMarketSize = mockTAM * 0.7; // 70% of TAM
  const mockGrowthRate = MARKET_GROWTH_RATES[category] || DEFAULT_GROWTH_RATE;
  
  const mockCompetitors = [
    {
      name: `Leading ${category} Player`,
      description: `The current market leader in the ${category} space with established presence.`,
      website: 'https://example.com',
      strengths: ['Strong brand recognition', 'Large customer base', 'Established distribution channels'],
      weaknesses: ['Aging technology stack', 'High prices', 'Slow to innovate'],
      marketShare: Math.floor(Math.random() * 20) + 30 // 30-50%
    },
    {
      name: `${category} Innovator`,
      description: `An innovative startup disrupting the ${category} industry with new approaches.`,
      website: 'https://example2.com',
      strengths: ['Cutting-edge technology', 'Lower price point', 'Agile development'],
      weaknesses: ['Limited market reach', 'Less capital', 'Smaller team'],
      marketShare: Math.floor(Math.random() * 15) + 10 // 10-25%
    }
  ];
  
  if (['FinTech', 'HealthTech', 'SaaS'].includes(category)) {
    mockCompetitors.push({
      name: `${category} Enterprise`,
      description: `A large enterprise focused on the ${category} B2B market segment.`,
      website: 'https://example3.com',
      strengths: ['Strong enterprise relationships', 'Global presence', 'Comprehensive solution'],
      weaknesses: ['Expensive', 'Complex implementation', 'Less user-friendly'],
      marketShare: Math.floor(Math.random() * 10) + 10 // 10-20%
    });
  }
  
  const marketAnalysis = {
    targetAddressableMarket: mockTAM,
    marketSize: mockMarketSize,
    marketGrowthRate: mockGrowthRate,
    summary: `The ${category} market is valued at $${(mockTAM/1000000000).toFixed(1)}B with a growth rate of ${mockGrowthRate}% annually.`
  };
  
  return { marketAnalysis, competitors: mockCompetitors };
};
