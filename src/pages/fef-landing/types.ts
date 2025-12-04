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
}

export interface StartupCard {
  id: string;
  name: string;
  description: string;
  founder: string;
  whyStandsOut: string;
  image: string;
}

export interface CriteriaCard {
  id: string;
  title: string;
  icon: string;
  items: string[];
}

export type MenuType = 'CELEBRITY JURY' | 'SEASONS STARTUPS' | 'EPISODES' | 'BEHIND THE SCENES';
export type SubMenuType = 'Benefits & rewards' | 'Application process' | 'Requirement & criteria';