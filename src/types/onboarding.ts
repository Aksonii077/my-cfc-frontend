
export type PersonaType = 'entrepreneur' | 'investor' | 'partner' | 'supporter';

export interface PersonaDetectionResult {
  personaType: PersonaType;
  confidence: number;
  keywords: string[];
  suggestedActions: PersonaAction[];
}

export interface DetectedPersona extends PersonaDetectionResult {
  source: 'ai_analysis' | 'user_selection' | 'behavior_pattern';
  timestamp: string;
}

export interface PersonaAction {
  type: 'navigate' | 'create' | 'connect' | 'learn';
  route?: string;
  label: string;
  data?: Record<string, any>;
}

export interface PersonaCategory {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  isRequired: boolean;
  isCompleted: boolean;
}

export interface OnboardingState {
  currentStep: number;
  steps: OnboardingStep[];
  detectedPersona?: DetectedPersona;
  userSelections: Record<string, any>;
  isCompleted: boolean;
}
