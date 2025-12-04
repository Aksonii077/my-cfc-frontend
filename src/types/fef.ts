export interface StartupCard {
  id: string;
  startup_name: string;
  startup_valuation: number;
  description: string | null;
  founder: string | null;
  whyStandsOut: string | null;
  image: string | null;
  website: string | null;
  brandIcon?: string | null;
  representing?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CriteriaCard {
  id: string;
  title: string;
  icon: string;
  items: string[];
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

export type MenuType = 'CELEBRITY JURY' | 'SEASONS STARTUPS' | 'EPISODES' | 'BEHIND THE SCENES';
export type SubMenuType = 'Benefits & rewards' | 'Application process' | 'Requirement & criteria';

export interface MenuButtonProps {
  item: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export interface AnimatedContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}