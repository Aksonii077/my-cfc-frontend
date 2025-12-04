import { UserCredential } from 'firebase/auth';

export interface Profile {
  id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  headline?: string;
  bio?: string;
  location?: string;
  expertise?: string[];
  role?: string;
  coins_balance?: number;
  updated_at?: string;
  created_at?: string;
  angel_investments?: Array<{
    id: number;
    name: string;
    amount: number;
    date: string;
  }>;
  // Add name for SimplifiedAuthContext compatibility
  name?: string;
  email?: string;
}

// Add User type definition for compatibility
export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  coinsBalance?: number;
  angelInvestments?: AngelInvestment[];
  portfolio?: Portfolio;
}

export interface AuthResult {
  data: boolean | any;
  error: Error | null;
}

export interface AngelInvestment {
  id: number;
  name: string;
  amount: number;
  date: string;
}

export interface Portfolio {
  ideas: any[];
  startups: any[];
}

export interface AuthOptions {
  provider?: string;
  redirectTo?: string;
}

export interface InvestInIdeaParams {
  idea_id: number;
  investment_amount: number;
}

export interface InvestInStartupParams {
  startup_id: number;
  investment_amount: number;
}

// Define the return type of the auth hook
export interface AuthReturnType {
  user: any | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, options?: AuthOptions) => Promise<AuthResult>;
  loginWithFirebase: (firebaseUser: UserCredential) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
  register: (email: string, password: string, name: string) => Promise<AuthResult>;
  registerWithFirebase: (firebaseUser: UserCredential, name?: string) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updateProfile: (updates: Partial<Profile>) => Promise<AuthResult>;
  getUserPortfolio: () => Portfolio;
  getCoinsBalance: () => number;
  getAngelInvestments: () => AngelInvestment[];
  investCoins: (ideaId: number, amount: number) => Promise<AuthResult>;
  investCoinsInStartup: (startupId: number, amount: number) => Promise<AuthResult>;
  isAdmin: () => boolean;
}
