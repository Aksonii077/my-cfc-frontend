
import { toast } from "sonner";

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'template' | 'guide' | 'video' | 'tool' | 'article' | 'legal' | 'financial' | 'hr';
  link: string;
  isPremium?: boolean;
  category?: 'accounting' | 'legal' | 'hr' | 'marketing' | 'operations' | 'funding' | 'general';
  content?: string; // For resources hosted directly on the platform
  isHosted?: boolean; // Indicates if resource is hosted on our platform
}

/**
 * Handle resource access based on its type, link, and premium status
 */
export const handleResourceAccess = (resource: Resource): void => {
  // Check if resource is premium
  if (resource.isPremium) {
    toast.info("This is a premium resource. Upgrade to access this content.");
    return;
  }
  
  // Handle hosted resources
  if (resource.isHosted) {
    viewHostedResource(resource);
    return;
  }
  
  // Handle different types of resources
  if (resource.type === 'video') {
    // Open videos in a new tab
    window.open(resource.link, '_blank');
    toast.success(`Opening video: ${resource.title}`);
  } else if (resource.link.startsWith('http')) {
    // Open external links in a new tab
    window.open(resource.link, '_blank');
    toast.success(`Opening resource: ${resource.title}`);
  } else {
    // Handle downloadable resources
    downloadResource(resource);
  }
};

/**
 * View a resource hosted on our platform
 */
export const viewHostedResource = (resource: Resource): void => {
  toast.success(`Opening ${resource.title} in our platform viewer`);
  
  // Use absolute path to ensure routing works correctly
  window.location.href = `/resource-viewer/${resource.id}`;
};

/**
 * Download a resource file
 */
const downloadResource = (resource: Resource): void => {
  // In a real app, this would make an API call to fetch the file
  // For demo purposes, we'll simulate the download with a timeout
  toast.loading(`Preparing ${resource.title} for download...`);
  
  setTimeout(() => {
    toast.dismiss();
    toast.success(`${resource.title} downloaded successfully!`);
    
    // For actual implementation, we would use the fetch API to download the file
    // and create a download link for the user
    const link = document.createElement('a');
    link.href = `/resources/${resource.link.split('/').pop()}`;
    link.download = resource.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, 1500);
};

/**
 * Get all resources by category
 */
export const getResourcesByCategory = (category: string): Resource[] => {
  return STARTUP_RESOURCES.filter(resource => 
    resource.category === category || category === 'all'
  );
};

/**
 * Get resource by ID
 */
export const getResourceById = (id: string): Resource | undefined => {
  return STARTUP_RESOURCES.find(resource => resource.id === id);
};

/**
 * A comprehensive collection of startup resources
 */
export const STARTUP_RESOURCES: Resource[] = [
  // Accounting & Financial
  { 
    id: 'financial-model-template', 
    title: 'Startup Financial Model', 
    description: 'A comprehensive Excel template for financial projections',
    type: 'template',
    category: 'accounting',
    link: '/resources/financial-model-template.xlsx',
    isHosted: true,
    content: 'This is a financial model template with revenue projections, expense tracking, and cash flow analysis.'
  },
  { 
    id: 'accounting-software-guide', 
    title: 'Accounting Software Comparison', 
    description: 'Detailed comparison of accounting tools for startups',
    type: 'guide',
    category: 'accounting',
    link: '/resources/accounting-software-guide.pdf',
    isHosted: true,
    content: 'This guide compares different accounting software options for startups.'
  },
  { 
    id: 'expense-tracking', 
    title: 'Expense Tracking Template', 
    description: 'Simple spreadsheet to track business expenses',
    type: 'template',
    category: 'accounting',
    link: '/resources/expense-tracking.xlsx',
    isHosted: true,
    content: 'Use this template to track all your business expenses efficiently.'
  },
  { 
    id: 'cashflow-management', 
    title: 'Cash Flow Management Tool', 
    description: 'Interactive tool to manage and forecast cash flow',
    type: 'tool',
    category: 'accounting',
    link: 'https://example.com/cashflow-tool',
    isPremium: true
  },
  
  // Legal Resources
  { 
    id: 'founder-agreement', 
    title: 'Co-Founder Agreement Template', 
    description: 'Legal template for founder equity and responsibilities',
    type: 'legal',
    category: 'legal',
    link: '/resources/founder-agreement.docx',
    isHosted: true,
    content: 'This agreement outlines equity distribution, roles, and responsibilities among co-founders.'
  },
  { 
    id: 'nda-template', 
    title: 'Non-Disclosure Agreement', 
    description: 'Standard NDA template for business discussions',
    type: 'legal',
    category: 'legal',
    link: '/resources/nda-template.docx',
    isHosted: true,
    content: 'Use this NDA template to protect confidential information during business discussions.'
  },
  { 
    id: 'ip-assignment', 
    title: 'IP Assignment Agreement', 
    description: 'Template for intellectual property assignment',
    type: 'legal',
    category: 'legal',
    link: '/resources/ip-assignment.docx',
    isHosted: true,
    content: 'This agreement assigns intellectual property rights to the company.'
  },
  { 
    id: 'terms-of-service', 
    title: 'Terms of Service Generator', 
    description: 'Tool to generate custom terms of service for your product',
    type: 'tool',
    category: 'legal',
    link: 'https://example.com/tos-generator',
    isPremium: true
  },
  
  // HR & Team
  { 
    id: 'employment-contract', 
    title: 'Employment Contract Template', 
    description: 'Standard employment agreement for startup hires',
    type: 'hr',
    category: 'hr',
    link: '/resources/employment-contract.docx',
    isHosted: true,
    content: 'This employment contract template covers all essential elements for hiring employees.'
  },
  { 
    id: 'payroll-calculator', 
    title: 'Startup Payroll Calculator', 
    description: 'Calculate payroll costs including taxes and benefits',
    type: 'tool',
    category: 'hr',
    link: '/resources/payroll-calculator.xlsx',
    isHosted: true,
    content: 'Use this calculator to determine payroll costs including taxes and benefits.'
  },
  { 
    id: 'equity-calculator', 
    title: 'Equity Compensation Calculator', 
    description: 'Tool to calculate equity grants for employees',
    type: 'tool',
    category: 'hr',
    link: 'https://example.com/equity-calculator'
  },
  { 
    id: 'hr-policy-handbook', 
    title: 'HR Policy Handbook Template', 
    description: 'Comprehensive HR policies for startups',
    type: 'template',
    category: 'hr',
    link: '/resources/hr-policy-handbook.docx',
    isPremium: true
  },
  
  // Marketing & Growth
  { 
    id: 'marketing-plan', 
    title: 'Startup Marketing Plan Template', 
    description: 'Framework for creating a focused marketing strategy',
    type: 'template',
    category: 'marketing',
    link: '/resources/marketing-plan.docx'
  },
  { 
    id: 'social-media-calendar', 
    title: 'Social Media Content Calendar', 
    description: 'Template to plan and organize social media content',
    type: 'template',
    category: 'marketing',
    link: '/resources/social-media-calendar.xlsx'
  },
  
  // General Operations
  { 
    id: 'idea-validation-checklist', 
    title: 'Idea Validation Checklist', 
    description: 'A comprehensive checklist to validate your startup idea',
    type: 'template',
    category: 'general',
    link: '/resources/idea-validation-checklist.pdf'
  },
  { 
    id: 'market-sizing-guide', 
    title: 'Market Sizing Guide', 
    description: 'Learn how to estimate your total addressable market (TAM)',
    type: 'guide',
    category: 'general',
    link: '/resources/market-sizing-guide.pdf'
  },
  { 
    id: 'problem-solution-canvas', 
    title: 'Problem-Solution Canvas', 
    description: "Framework to define the problem you're solving and your solution",
    type: 'template',
    category: 'general',
    link: '/resources/problem-solution-canvas.pdf'
  }
];
