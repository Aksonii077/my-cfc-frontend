import { MenuType, SubMenuType, StartupCard, CriteriaCard } from './types';

export const MENU_ITEMS: MenuType[] = [
  'CELEBRITY JURY',
  'SEASONS STARTUPS', 
  'EPISODES',
  'BEHIND THE SCENES'
];

export const SUB_MENU_ITEMS: SubMenuType[] = [
  'Benefits & rewards',
  'Application process',
  'Requirement & criteria'
];

export const CELEBRITIES = [
  'karan-johar-icon.svg',
  'saif-ali-khan.svg',
  'akshay-kumar.svg',
  'manish.svg',
  'ananya.svg',
  'gautam.svg',
  'malaika.svg',
  'darpan.svg',
  'sara.svg',
  'shibani.svg',
  'ronnie.svg',
  'dhruv.svg'
];

export const CRITERIA_CARDS: CriteriaCard[] = [
  {
    id: 'startup-stage',
    title: 'STARTUP STAGE',
    icon: '/fef/icon 1.svg',
    items: [
      'Fashion, lifestyle, or beauty industry focus',
      'Minimum Viable Product (MVP) ready',
      'Some traction or customer validation',
      'Scalable business model',
      'India-based company registration'
    ]
  },
  {
    id: 'founder-qualifications',
    title: 'FOUNDER QUALIFICATIONS',
    icon: 'user-icon',
    items: [
      'Passionate and committed founding team',
      'Clear vision and business acumen',
      'Ability to articulate ideas effectively',
      'Willingness to relocate for filming',
      'Available for 6-8 weeks commitment'
    ]
  },
  {
    id: 'required-documents',
    title: 'REQUIRED DOCUMENTS',
    icon: 'document-icon',
    items: [
      'Business plan and pitch deck',
      'Financial projections and statements',
      'Product portfolio and samples',
      'Team profiles and resumes',
      'Company incorporation documents'
    ]
  },
  {
    id: 'selection-criteria',
    title: 'SELECTION CRITERIA',
    icon: 'lightning-icon',
    items: [
      'Innovation and uniqueness of concept',
      'Market potential and scalability',
      'Team strength and execution ability',
      'Financial viability and projections',
      'Alignment with show\'s values'
    ]
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'APPLY NOW',
    description: 'Submit your startup via our comprehensive application form.'
  },
  {
    step: 2,
    title: 'GET SHORTLISTED',
    description: 'Shortlisted startups are invited for detailed interviews.'
  },
  {
    step: 3,
    title: 'GET ON SEASON 2 & COMPETE',
    description: 'Selected founders showcase their ideas in Season 2 episodes.'
  },
  {
    step: 4,
    title: 'GET FUNDED & INCUBATED',
    description: 'Winners receive funding from Fashion Entrepreneur Fund + incubation partnership with CoFounder Circle.'
  }
];

export const COLORS = {
  primary: '#f9ac03',
  background: '#161616',
  black: '#000000',
  gray: '#242322'
} as const;