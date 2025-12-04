// Helper functions to get display labels
export const getRoleDisplayName = (role: string | undefined) => {
  const roleMap: Record<string, string> = {
    founder: 'Founder',
    supplier: 'Supplier/Service Provider',
    student: 'Student',
    professional: 'Professional',
    mentor: 'Mentor',
    investor: 'Investor',
  };
  return roleMap[role || ''] || role || '';
};

export const getStartupStageLabel = (value: string) => {
  const stageMap: Record<string, string> = {
    'idea': 'Idea Stage',
    'mvp': 'MVP',
    'early-revenue': 'Early Revenue',
    'growth': 'Growth Stage',
    'scale': 'Scale Stage'
  };
  return stageMap[value] || value;
};

export const getTeamSizeLabel = (value: string) => {
  const teamSizeMap: Record<string, string> = {
    'solo': 'Solo Founder',
    '2-5': '2-5 People',
    '6-10': '6-10 People',
    '11-25': '11-25 People',
    '25+': '25+ People'
  };
  return teamSizeMap[value] || value;
};

export const getFieldOfStudyLabel = (value: string) => {
  const fieldMap: Record<string, string> = {
    'business': 'Business',
    'computer-science': 'Computer Science',
    'design': 'Design',
    'marketing': 'Marketing',
    'finance': 'Finance',
    'other': 'Other'
  };
  return fieldMap[value] || value;
};

export const getAcademicYearLabel = (value: string) => {
  const yearMap: Record<string, string> = {
    '1st-year': 'Freshman',
    '2nd-year': 'Sophomore',
    '3rd-year': 'Junior',
    '4th-year': 'Senior',
    'graduate': 'Graduate',
    'post-graduate': 'Post Graduate',
    'phd': 'PhD'
  };
  return yearMap[value] || value;
};

export const getInvestmentStageLabel = (value: string) => {
  const stageMap: Record<string, string> = {
    'pre-seed': 'Pre-Seed',
    'seed': 'Seed',
    'series-a': 'Series A',
    'series-b+': 'Series B+',
    'all-stages': 'All Stages'
  };
  return stageMap[value] || value;
};

export const getIndustryLabel = (value: string) => {
  const industryMap: Record<string, string> = {
    'fintech': 'Fintech',
    'healthtech': 'Healthtech',
    'edtech': 'EdTech',
    'ecommerce': 'E-Commerce',
    'saas': 'SaaS',
    'aiml': 'AI/ML',
    'blockchain': 'Blockchain',
    'gaming': 'Gaming',
    'other': 'Other'
  };
  return industryMap[value] || value;
};

export const getServiceTypeLabel = (value: string) => {
  const serviceMap: Record<string, string> = {
    'legal': 'Legal Services',
    'accounting': 'Accounting',
    'marketing': 'Marketing / PR',
    'technology': 'Technology Services',
    'design': 'Design & Branding',
    'consulting': 'Consulting',
    'hr': 'HR Services',
    'manufacturing': 'Manufacturing',
    'distributors': 'Distributors/Suppliers',
    'logistics': 'Logistic Partners',
    'others': 'Others'
  };
  return serviceMap[value] || value;
};

export const getIndustryFocusLabel = (value: string) => {
  const focusMap: Record<string, string> = {
    'all': 'All Industries',
    'technology': 'Technology',
    'healthcare': 'Healthcare',
    'finance': 'Finance',
    'retail': 'Retail',
    'manufacturing': 'Manufacturing'
  };
  return focusMap[value] || value;
};

export const getCompanySizeLabel = (value: string) => {
  const sizeMap: Record<string, string> = {
    'freelance': 'Freelance',
    'small': 'Small (1-10)',
    'medium': 'Medium (11-50)',
    'large': 'Large (50+)'
  };
  return sizeMap[value] || value;
};

export const getAreaOfExpertiseLabel = (value: string) => {
  const expertiseMap: Record<string, string> = {
    'business-strategy': 'Business Strategy',
    'fundraising': 'Fundraising',
    'product-development': 'Product Development',
    'technology': 'Technology',
    'marketing-growth': 'Marketing & Growth',
    'operations': 'Operations',
    'legal-compliance': 'Legal & Compliance',
    'hr-talent': 'HR & Talent'
  };
  return expertiseMap[value] || value;
};

export const getExperienceLevelLabel = (value: string) => {
  const levelMap: Record<string, string> = {
    'mid-career': 'Mid Career (5 - 10 years)',
    'senior': 'Senior (10 - 15 Years)',
    'executive': 'Executive (15+ Years)',
    'serial-entrepreneur': 'Serial Entrepreneur'
  };
  return levelMap[value] || value;
};

export const getFunctionLabel = (value: string) => {
  const functionMap: Record<string, string> = {
    'technology': 'Technology',
    'finance': 'Finance',
    'marketing': 'Marketing',
    'operations': 'Operations',
    'sales': 'Sales',
    'consulting': 'Consulting',
    'other': 'Other'
  };
  return functionMap[value] || value;
};

export const getProfessionalExperienceLevelLabel = (value: string) => {
  const levelMap: Record<string, string> = {
    'entry-level': 'Entry Level (0 - 2 Years)',
    'mid-level': 'Mid Level (3 - 5 Years)',
    'senior-level': 'Senior (6+ Years)',
    'executive-level': 'Executive (10+ Years)'
  };
  return levelMap[value] || value;
};

export const getInterestedInLabel = (value: string) => {
  const interestMap: Record<string, string> = {
    'side-hustle': 'Side Hustle',
    'full-time': 'Full Time',
    'both': 'Both',
    'cofounder-role': 'CoFounder role'
  };
  return interestMap[value] || value;
};