
// Define types for the PitchTank module

export interface PitchEvent {
  id: string;
  title: string;
  entrepreneur: string;
  category: string;
  pitchDate: string;
  description: string;
  votes: number;
  predictions: {
    success: number;
    moderate: number;
    failure: number;
  };
  previewVideo?: string;
  shortlisted: boolean;
  startupName: string;
  date: string;
  time: string;
  duration: number;
  registeredUsers: number;
  imageUrl: string;
}

export interface InvestorTier {
  id: string;
  name: string;
  requirements: {
    coins: number;
    investments: number;
    successRate: number;
  };
  benefits: string[];
  nextTier?: {
    name: string;
    requirements: {
      coins: number;
      investments: number;
      successRate: number;
    };
  };
}

export interface InvestorChallenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  progress?: number;
  total?: number;
  completedBy: number;
  deadline: string;
}

export interface InvestorLeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  tier: string;
  tierName: string;
  coins: number;
  successfulPredictions: number;
  investments: number;
  successRate: number;
  rank?: number;
}

export interface Syndicate {
  id: string;
  name: string;
  description: string;
  leader: {
    id: string;
    name: string;
    tier: string;
  };
  members: Array<{
    id: string;
    name: string;
    tier: string;
    contribution: number;
  }>;
  totalCommitment: number;
  investmentThesis: string;
  startups: Array<{
    id: string;
    name: string;
    commitment: number;
    date: string;
  }>;
}

export interface PitchSubmission {
  id: string;
  title: string;
  startupName: string;
  industry: string;
  status: 'pending' | 'shortlisted' | 'rejected';
  entrepreneur: {
    id: string;
    name: string;
  };
  category: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  competitiveAdvantage: string;
  financials: {
    currentRevenue?: number;
    projectedRevenue?: number;
    burnRate?: number;
    fundingSought: number;
  };
  pitchVideo?: string;
  pitchDeck?: string;
  submissionDate: string;
}

export interface LivePitchSession {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  entrepreneurs: Array<{
    id: string;
    name: string;
    role: string;
    startup?: string;
  }>;
  angelPanel: Array<{
    id: string;
    name: string;
    tier: string;
  }>;
  viewers: number;
  duration: number;
  virtualInvestments?: {
    coins: number;
    investors: number;
  };
  angelCommitments?: {
    amount: number;
    investors: number;
  };
  questions: Array<{
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: string;
    votes: number;
    answered: boolean;
    from?: {
      id: string;
      name: string;
      role: string;
    };
    question?: string;
    time?: string;
  }>;
  investedCoins?: number;
  description?: string;
  startupId?: string;
  startupName?: string;
  founderName?: string;
}
