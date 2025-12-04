export interface PartnerProfile {
  id: string;
  partnerId: string;
  companyName: string;
  tagline?: string;
  description: string;
  industry?: string;
  serviceType: 'service' | 'distribution' | 'supplier' | 'franchise';
  website?: string;
  logo?: string;
  coverImage?: string;
  location?: string;
  contactEmail: string;
  contactPhone?: string;
  verified: boolean;
  partnerRoles: string[];
  expertise: string[];
  services: string[];
  joinDate: string;
  dateCreated?: string;
  portfolioLinks?: string[];
  testimonials?: Array<{
    quote: string;
    author: string;
    company?: string;
  }>;
  tags?: string[];
  offerings?: string[];
  notificationPreferences?: {
    emailNotifications: boolean;
    weeklyDigest: boolean;
    matchAlerts: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'founder' | 'investor';
  joinDate: string;
  verified: boolean;
  coinsBalance: number;
  coinsHistory: any[];
  successfulFavors: number;
  portfolio: {
    ideas: any[];
    startups: any[];
  };
  headline?: string;
  expertise?: string[];
  about?: string;
  angelInvestments?: any[];
  
  // Additional properties
  avatar?: string;
  profileImage?: string;
  cofounderCoins?: number;
  companyName?: string;
  roleStats?: {
    ideasCreated?: number;
    startupsCreated?: number;
    mentorships?: number;
    favorsCompleted?: number;
    investmentsCount?: number;
    investmentsAmount?: number;
    teamContributions?: number;
    ambassadorships?: number;
    virtualAngelPoints?: number;
  };
  subscription?: {
    tier: string;
    planId: string;
    status: 'active' | 'canceled' | 'expired' | 'trial';
    startDate: string;
    endDate?: string;
    autoRenew: boolean;
    aiCredits: number;
  };
  displayName?: string;
  location?: string;
  contentLanguage?: string;
  partnerProfile?: PartnerProfile;
  phoneNumber?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  linkedinVerified?: boolean;
  browniePoints?: number;
  
  verification?: UserVerification;
  verificationLevel?: 'none' | 'basic' | 'enhanced' | 'full';
  trustScore?: number;
  riskScore?: number;
}

export interface UserVerification {
  userId: string;
  phoneVerification?: {
    number: string;
    verified: boolean;
    verificationDate?: string;
  };
  emailVerification?: {
    email: string;
    verified: boolean;
    verificationDate?: string;
  };
  linkedinVerification?: {
    verified: boolean;
    verificationDate?: string;
    profileUrl?: string;
  };
  documents?: Array<{
    type: 'id' | 'passport' | 'driver_license' | 'other';
    verified: boolean;
    uploadDate: string;
    verificationDate?: string;
  }>;
  twoFactorEnabled?: boolean;
  lastVerificationCheck?: string;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: string;
}

export interface LoginHistoryEntry {
  id: string;
  userId: string;
  timestamp: string;
  success: boolean;
  ipAddress: string;
  userAgent: string;
  location?: string;
  method: 'password' | 'oauth' | '2fa' | 'magic_link';
}

export interface RoleTierCriteria {
  roleType: string;
  silver: {
    description: string;
    requirements: string[];
  };
  gold: {
    description: string;
    requirements: string[];
  };
  platinum: {
    description: string;
    requirements: string[];
  };
}

export interface Profile {
  id: string;
  userId: string;
  display_name?: string;
  username?: string;
  role?: string;
  coins_balance?: number;
  angel_investments?: any[];
  created_at?: string;
  updated_at?: string;
}
