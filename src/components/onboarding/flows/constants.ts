export const STARTUP_STAGES = [
  { value: 'ideation', label: 'Ideation', description: 'Just brainstorming and researching your idea' },
  { value: 'validation', label: 'Validation', description: 'Testing your idea with potential customers' },
  { value: 'registered', label: 'Registered', description: 'Business is legally registered but not fully operational' },
  { value: 'mvp', label: 'MVP', description: 'Built a minimum viable product for testing' },
  { value: 'initial-traction', label: 'Initial Traction', description: 'Have first customers and some revenue' },
  { value: 'growth', label: 'Growth', description: 'Scaling operations and growing customer base' },
  { value: 'scale', label: 'Scale', description: 'Established business looking to expand significantly' }
]

export const INDUSTRIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'food-beverage', label: 'Food & Beverage' },
  { value: 'travel-hospitality', label: 'Travel & Hospitality' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'energy', label: 'Energy' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'other', label: 'Other' }
]

export const STEP_CONFIG = {
  welcome: { number: 1, name: 'Welcome' },
  'path-selection': { number: 2, name: 'Path Selection' },
  'idea-form': { number: 3, name: 'Idea Form' },
  'startup-form': { number: 3, name: 'Startup Form' },
  incorporation: { number: 4, name: 'Incorporation' },
  completion: { number: 5, name: 'Completion' }
}

export const RACE_FEATURES = [
  { icon: 'Lightbulb', title: 'Research', desc: 'Market insights & analysis', color: 'text-[#114DFF]' },
  { icon: 'Target', title: 'Advise', desc: 'Strategic guidance', color: 'text-[#114DFF]' },
  { icon: 'Network', title: 'Connect', desc: 'Find partners & resources', color: 'text-[#3CE5A7]' },
  { icon: 'Zap', title: 'Execute', desc: 'Turn ideas into action', color: 'text-[#06CB1D]' }
]

export const ADVANCED_STARTUP_STAGES = ['registered', 'mvp', 'initial-traction', 'growth', 'scale']