export interface Startup {
  id: number;
  founderId: string;
  name: string;
  description: string;
  category: string;
  stage: string;
  location?: string;
  website?: string;
  logoUrl?: string;
  tagline?: string;
  lookingFor?: string[];
  fundingStage?: string;
  teamSize?: number;
  foundedDate?: string;
  votes: number;
  viewsCount: number;
  coinsReceived: number;
  engagementScore: number;
  createdAt: string;
  updatedAt: string;
  
  // Additional properties that components are expecting
  logo?: string; // Alias for logoUrl for backward compatibility
  userId?: string; // For backward compatibility, should map to founderId
  status?: string;
  mission?: string;
  vision?: string;
  fundingReceived?: number;
  employeeCount?: number;
  industryTrends?: string;
  investors?: any[];
  ambassadors?: number;
  angelCommitments?: number;
  leaderboardTier?: string;
  integrations?: Record<string, { connected: boolean; [key: string]: any }>;
  images?: string[];
  metrics?: any;
  resources?: any[];
  founderName?: string;
  foundedAt?: string; // Alias for foundedDate
  problemStatement?: string;
  uniqueSellingPoint?: string;
  targetMarket?: string;
  businessModel?: string;
  pitchVideo?: string;
  industry?: string;
  integrationSettings?: any;
  
  // New properties from updated API response
  startup_id?: string;
  user_id?: string;
  company_name?: string;
  company_description?: string;
  creator_full_name?: string;
  team_members?: Array<{
    name: string;
    skills: string[];
    position: string;
  }>;
  current_monthly_revenue?: number;
  funding_sought?: number;
  revenue_model?: string;
  investor_package?: {
    financial_projections?: boolean;
  };
  market_analysis?: {
    competitors?: string[];
    market_size?: string;
    opportunity_score?: number;
    market_intelligence_insights?: string[];
  };
  is_creator?: boolean;
  pitch_deck?: string;
}

// Investment-related interfaces
export interface LeaderboardEntry {
  id: number;
  name: string;
  category: string;
  votes: number;
  coinsReceived: number;
  angelCommitments: number;
  fundingReceived: number;
  engagementScore: number;
  rank: number;
  tier?: string;
  logo?: string;
  progress?: number;
  investors?: number;
}

export interface FundOpportunity {
  id: number;
  name: string;
  description: string;
  category: string;
  stage: string;
  fundingTarget: number;
  fundingRaised: number;
  minInvestment: number;
  expectedROI: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  timeframe: string;
  logoUrl?: string;
  startupId?: number;
  startupLogo?: string;
  startupName?: string;
  valuation?: number;
  minCommitment?: number;
  targetAmount?: number;
  currentCommitments?: number;
  angelCount?: number;
  dueDiligenceStatus?: string;
  logo?: string;
}
