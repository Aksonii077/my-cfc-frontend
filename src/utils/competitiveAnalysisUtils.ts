
import { SimilarBusiness } from '@/types/business';

export const getSimilarBusinessesByCategory = (category: string): SimilarBusiness[] => {
  return [
    {
      id: 101,
      name: `Competitor 1 in ${category}`,
      description: 'A leading competitor in the market',
      successLevel: 'high',
      fundingAmount: 10000000, // Changed from string to number
      foundedYear: 2018,
      website: 'https://example.com',
      category: category,
      industry: category
    },
    {
      id: 102,
      name: `Competitor 2 in ${category}`,
      description: 'An emerging competitor with innovative technology',
      successLevel: 'medium',
      fundingAmount: 2000000, // Changed from string to number
      foundedYear: 2020,
      website: 'https://example2.com',
      category: category,
      industry: category
    }
  ];
};
