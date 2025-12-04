// Stage options
export const STAGE_OPTIONS = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'mvp', label: 'MVP/Prototype' },
  { value: 'early-revenue', label: 'Early Revenue' },
  { value: 'growth', label: 'Growth Stage' },
  { value: 'scale', label: 'Scale Stage' }
];

// Sector options
export const SECTOR_OPTIONS = [
  { value: 'fintech', label: 'Fintech' },
  { value: 'healthtech', label: 'Healthtech' },
  { value: 'edtech', label: 'EdTech' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'aiml', label: 'AI/ML' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'foodtech', label: 'Food Tech' },
  { value: 'agritech', label: 'AgriTech' },
  { value: 'cleantech', label: 'CleanTech' },
  { value: 'other', label: 'Other' }
];

// Support areas options
export const SUPPORT_AREAS = [
  'Technology / Product',
  'Brand & Marketing',
  'Distribution & Partnerships',
  'Operations & Supply Chain',
  'Digital User Acquisition',
  'Fundraising & Investor Access',
  'Talent & Team Building',
  'Legal & Compliance',
  'Finance & Accounting',
  'Manufacturing / Prototyping',
  'Retail / Merchandising',
  'Export / Cross-Border',
  'Data / Analytics',
  'Other'
];

// Team roles options
export const TEAM_ROLES = [
  { value: 'ceo', label: 'CEO' },
  { value: 'cto', label: 'CTO' },
  { value: 'cfo', label: 'CFO' },
  { value: 'cmo', label: 'CMO' },
  { value: 'coo', label: 'COO' },
  { value: 'co-founder', label: 'Co-Founder' },
  { value: 'founder', label: 'Founder' },
  { value: 'head-engineering', label: 'Head of Engineering' },
  { value: 'head-product', label: 'Head of Product' },
  { value: 'head-design', label: 'Head of Design' },
  { value: 'head-marketing', label: 'Head of Marketing' },
  { value: 'head-sales', label: 'Head of Sales' },
  { value: 'product-manager', label: 'Product Manager' },
  { value: 'tech-lead', label: 'Tech Lead' },
  { value: 'designer', label: 'Designer' },
  { value: 'developer', label: 'Developer' },
  { value: 'data-scientist', label: 'Data Scientist' },
  { value: 'business-analyst', label: 'Business Analyst' },
  { value: 'advisor', label: 'Advisor' },
  { value: 'other', label: 'Other' }
];

// Tab field validation mapping
export const TAB_FIELDS_MAP: Record<string, string[]> = {
  '1': [
    'fullName',
    'email',
    'phone',
    'startupName',
    'pitch',
    'website',
    'socialProductLinks',
    'stage',
    'isFashionBusiness',
    'fashionBrandStory',
    'fashionDesignPhilosophy',
    'fashionSustainability',
    'sector',
    'location',
    'hasPitchDeck'
  ],
  '2': [
    'problemDescription',
    'targetCustomer', 
    'solutionDescription'
  ],
  '3': [
    'marketOpportunity',
    'competitionDifferentiation',
    'marketTiming'
  ],
  '4': [
    'tractionEvidence'
  ],
  '5': [
    'uniquePositioning',
    'teamMember_1_name',
    'teamMember_1_role', 
    'teamMember_1_background'
  ],
  '6': [
    'longTermVision',
    'fiveYearOutlook'
  ],
  '7': [
    'creativeGrowthStrategy',
    'fundingAmount',
    'supportNeeded'
  ],
  '8': [
    'termsAgreement'
  ]
};