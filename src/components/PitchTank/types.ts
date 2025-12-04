import type { FormInstance } from 'antd';

export interface FormData {
  // Tab 1: Founder & Startup Basics
  fullName?: string;
  email?: string;
  phone?: string;
  startupName?: string;
  pitch?: string;
  website?: string;
  socialProductLinks?: string[];
  stage?: string;
  sector?: string;
  location?: string;
  
  // Fashion-specific fields (conditional)
  isFashionBusiness?: boolean;
  fashionBrandStory?: string;
  fashionDesignPhilosophy?: string;
  fashionSustainability?: string;
  
  // Tab 2: Problem & Solution
  problemDescription?: string;
  targetCustomer?: string;
  solutionDescription?: string;
  
  // Tab 3: Market & Differentiation
  marketOpportunity?: string;
  competitionDifferentiation?: string;
  marketTiming?: string;
  
  // Tab 4: Traction & Validation
  tractionEvidence?: string;
  preTractionExperiments?: string;
  
  // Key metrics input structure (for form)
  key_metrics_input?: Array<{ metric: string; value: string }>;
  // Key metrics final payload (array of combined strings)
  key_metrics?: string[];
  
  // Tab 5: Team
  uniquePositioning?: string;
  // Team members input structure (for form)
  team_members_input?: Array<{
    name: string;
    role: string;
    background: string;
    linkedin?: string;
  }>;
  // Team members final payload (array of objects)
  team_members?: Array<{
    name: string;
    role: string;
    background: string;
    linkedin?: string;
  }>;
  
  // Tab 6: Vision & Ambition
  longTermVision?: string;
  fiveYearOutlook?: string;
  
  // Tab 7: Growth & Support Needs
  creativeGrowthStrategy?: string;
  fundingAmount?: string;
  supportNeeded?: string[];
  pitchVideo?: any[];
  
  // References input structure (for form)
  references_input?: Array<{
    name: string;
    relationship: string;
    email?: string;
    phone?: string;
    linkedin?: string;
  }>;
  // References final payload (array of combined strings)
  references?: string[];
  // Video file for payload
  video_file?: File;
  
  // Tab 8: Review & Submit
  termsAgreement?: boolean;
  
  // Dynamic fields support
  [key: string]: unknown;
}

export interface TabComponentProps {
  form: FormInstance;
}