/**
 * Utility functions for calculating startup and idea valuations
 */

// Calculate valuation based on coins, ambassadors, and funding
export const calculateValuation = (
  coinsReceived: number = 0,
  ambassadors: number = 0,
  angelCommitments: number = 0,
  fundingReceived: number = 0,
  favorsCount: number = 0
): number => {
  // Base value from coins (each coin = ₹10,000)
  const coinValue = coinsReceived * 10000;
  
  // Ambassador value (each ambassador = ₹50,000) 
  const ambassadorValue = ambassadors * 50000;
  
  // Favors value (each favor = ₹5,000)
  const favorsValue = favorsCount * 5000;
  
  // If funding commitments exist, they define the value
  if (angelCommitments > 0 || fundingReceived > 0) {
    // Add community value to the funding
    return angelCommitments + fundingReceived + (coinValue * 0.1) + (ambassadorValue * 0.1) + (favorsValue * 0.1);
  }
  
  // Otherwise, calculate from coins, ambassadors and favors
  return coinValue + ambassadorValue + favorsValue;
};

// Format valuation for display
export const formatValuation = (value: number): string => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

// Determine tier based on coins received
export const determineTier = (
  coinsReceived: number = 0,
  angelCommitments: number = 0,
  fundingReceived: number = 0
): 'bronze' | 'silver' | 'gold' | 'angel' | 'fund' => {
  if (fundingReceived > 0) return 'fund';
  if (angelCommitments > 0) return 'angel';
  if (coinsReceived >= 500) return 'gold';
  if (coinsReceived >= 200) return 'silver';
  return 'bronze';
};

// Calculate potential ROI for investors
export const calculatePotentialROI = (
  currentValuation: number,
  coinsInvested: number,
  coinValue: number = 10000
): number => {
  const investmentValue = coinsInvested * coinValue;
  const ownershipPercentage = investmentValue / currentValuation;
  
  // Estimate future valuation (2x for bronze, 3x for silver, 5x for gold)
  const tier = determineTier(coinsInvested);
  const multiplier = tier === 'gold' ? 5 : tier === 'silver' ? 3 : 2;
  
  const futureValuation = currentValuation * multiplier;
  const futureValue = futureValuation * ownershipPercentage;
  
  return futureValue / investmentValue;
};

// Track valuation history for a startup/idea
interface ValuationDataPoint {
  date: string;
  value: number;
}

const valuationHistoryStore: Record<string, Record<number, ValuationDataPoint[]>> = {
  startup: {},
  idea: {}
};

// Add a valuation data point to history
export const trackValuation = (
  type: 'startup' | 'idea',
  id: number,
  value: number
): void => {
  if (!valuationHistoryStore[type][id]) {
    valuationHistoryStore[type][id] = [];
  }
  
  // Only add a new data point if it's a different day or value has changed
  const today = new Date().toISOString().split('T')[0];
  const lastPoint = valuationHistoryStore[type][id][valuationHistoryStore[type][id].length - 1];
  
  if (!lastPoint || lastPoint.date !== today || lastPoint.value !== value) {
    valuationHistoryStore[type][id].push({
      date: today,
      value: value
    });
  }
};

// Get valuation history for a startup/idea
export const getValuationHistory = (
  type: 'startup' | 'idea',
  id: number
): ValuationDataPoint[] => {
  return valuationHistoryStore[type][id] || [];
};

// Generate sample historical data for demo purposes
export const generateSampleValuationHistory = (
  type: 'startup' | 'idea',
  id: number,
  currentValue: number,
  days: number = 30
): ValuationDataPoint[] => {
  // If real data exists, return it
  if (valuationHistoryStore[type][id] && valuationHistoryStore[type][id].length > 0) {
    return valuationHistoryStore[type][id];
  }
  
  // Otherwise generate sample data
  const data: ValuationDataPoint[] = [];
  const endDate = new Date();
  const startValue = currentValue * 0.7; // Start at 70% of current value
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(endDate.getDate() - i);
    
    // Create a somewhat realistic growth curve
    const progress = 1 - (i / days);
    const randomFactor = 0.95 + (Math.random() * 0.1); // Random factor between 0.95 and 1.05
    const value = Math.round(startValue + ((currentValue - startValue) * progress * randomFactor));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: value
    });
  }
  
  // Store the generated data
  valuationHistoryStore[type][id] = data;
  
  return data;
};
