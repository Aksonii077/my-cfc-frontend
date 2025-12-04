export interface BasePayload {
  full_name: string;
  email: string;
  role: string;
}

export interface FounderPayload extends BasePayload {
  industry: string;
  startup_stage: string;
  team_size: string;
  founder_type: string;
  startup_url?: string;
  register_pitch_tank?: boolean;
}

export interface StudentPayload extends BasePayload {
  university: string;
  field_of_study: string;
  academic_year: string;
}

export interface InvestorPayload extends BasePayload {
  investment_stage: string;
  industries_of_interest: string;
}

export interface SupplierPayload extends BasePayload {
  service_type: string;
  industry_focus: string;
  company_size: string;
}

export interface MentorPayload extends BasePayload {
  area_of_expertise: string;
  experience_level: string;
  industry_focus: string;
}

export interface ProfessionalPayload extends BasePayload {
  function: string;
  experience_level: string;
  interested_in: string;
}

export type WaitlistPayload = FounderPayload | StudentPayload | InvestorPayload | SupplierPayload | MentorPayload | ProfessionalPayload | BasePayload;

export interface RoleFormProps {
  form: any;
  values: Record<string, any>;
}

export interface RegisterWaitlistProps {
  isOpen: boolean;
  onClose: () => void;
}