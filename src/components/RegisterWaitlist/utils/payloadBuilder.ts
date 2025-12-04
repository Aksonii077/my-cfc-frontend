import axios from 'axios';
import type { WaitlistPayload } from '../types';
import {
  getRoleDisplayName,
  getStartupStageLabel,
  getTeamSizeLabel,
  getFieldOfStudyLabel,
  getAcademicYearLabel,
  getInvestmentStageLabel,
  getIndustryLabel,
  getServiceTypeLabel,
  getIndustryFocusLabel,
  getCompanySizeLabel,
  getAreaOfExpertiseLabel,
  getExperienceLevelLabel,
  getFunctionLabel,
  getProfessionalExperienceLevelLabel,
  getInterestedInLabel,
} from './labelMappings';

// Create payload based on selected role
export const createRoleBasedPayload = (values: Record<string, string | boolean>, role: string | undefined): WaitlistPayload => {
  const basePayload = {
    full_name: values.fullName as string,
    email: values.email as string,
    role: getRoleDisplayName(role),
  };

  switch (role) {
    case 'founder':
      return {
        ...basePayload,
        industry: getIndustryLabel(values.industry as string),
        startup_stage: getStartupStageLabel(values.startupStage as string),
        team_size: getTeamSizeLabel(values.teamSize as string),
        founder_type: values.founderType === 'idea' ? 'I have an Idea' : 'I have Startup',
        ...(values.startupUrl && { startup_url: values.startupUrl as string }),
        ...(values.registerPitchTank && { register_pitch_tank: true }),
      };

    case 'student':
      return {
        ...basePayload,
        university: values.university as string,
        field_of_study: getFieldOfStudyLabel(values.fieldOfStudy as string),
        academic_year: getAcademicYearLabel(values.academicYear as string),
      };

    case 'investor':
      return {
        ...basePayload,
        investment_stage: getInvestmentStageLabel(values.investmentStage as string),
        industries_of_interest: getIndustryLabel(values.investorIndustry as string),
      };

    case 'supplier':
      return {
        ...basePayload,
        service_type: getServiceTypeLabel(values.serviceType as string),
        industry_focus: getIndustryFocusLabel(values.industryFocus as string),
        company_size: getCompanySizeLabel(values.companySize as string),
      };

    case 'mentor':
      return {
        ...basePayload,
        area_of_expertise: getAreaOfExpertiseLabel(values.areaOfExpertise as string),
        experience_level: getExperienceLevelLabel(values.experienceLevel as string),
        industry_focus: getIndustryLabel(values.mentorIndustry as string),
      };

    case 'professional':
      return {
        ...basePayload,
        function: getFunctionLabel(values.function as string),
        experience_level: getProfessionalExperienceLevelLabel(values.professionalExperienceLevel as string),
        interested_in: getInterestedInLabel(values.interestedIn as string),
      };

    default:
      return basePayload;
  }
};

// API submission function
export const submitToAPI = async (payload: WaitlistPayload) => {
  try {
    
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/waitlist/`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    // Response logged in axios interceptor if needed
    return response.data;
    
  } catch (error) {
    console.error('API submission error:', error);
    throw error;
  }
};