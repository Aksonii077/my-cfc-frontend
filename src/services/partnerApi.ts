import { apiClient } from '@/utils/api';

/**
 * Partner API Service
 * Handles all partner-related API calls
 */

export interface PartnerLookupPayload {
  email: string;
  phone: string;
}

// Backend response interface (raw from API)
export interface PartnerProfileBackend {
  partner_id: string;
  name?: string;
  type?: string;
  description?: string;
  website?: string;
  location?: string;
  industry?: string;
  industry_parent?: string;
  industry_sub_category?: string;
  company_overview?: string | null;
  company_founded_year?: string | null;
  company_address?: string;
  city?: string;
  country?: string | null;
  zip_code?: string | null;
  industries_served?: string | null;
  services_offered?: string | null;
  pricing_model?: string | null;
  certifications_and_patents?: string | null;
  portfolio?: string | null;
  company_email?: string | null;
  contact_number?: string;
  linkedin_url?: string;
  similarity_score?: number;
  has_contact?: boolean;
  tags?: string | null;
  services?: string | null;
  partnership_models?: string | null;
  target_customers?: string | null;
  years_of_experience?: string | null;
  company_size?: string | null;
  reviews?: string | null;
}

// Frontend interface (normalized)
export interface PartnerProfile {
  id: string;
  idx?: number;
  partner_type?: string;
  industry_parent?: string;
  industry_sub_category?: string;
  employee_size?: string | null;
  company_name?: string;
  company_address?: string;
  company_city?: string;
  company_country?: string | null;
  company_pincode?: string | null;
  company_founding_year?: string | null;
  company_sub_text?: string | null;
  company_overview?: string | null;
  industries_served?: string | null;
  certifications?: string | null;
  services_offered?: string | null;
  pricing_model?: string | null;
  portfolio?: string | null;
  company_website?: string;
  company_linkedin_url?: string | null;
  company_email?: string | null;
  company_contact_number?: string;
  created_at?: string;
  updated_at?: string;
  location?: string;
  similarity_score?: number;
  // Legacy fields for backward compatibility
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  verified?: boolean;
}

export interface PartnerLookupResponse {
  success: boolean;
  message: string;
  data?: PartnerProfile;
}

/**
 * Transform backend partner profile to frontend format
 */
const transformPartnerProfile = (backend: PartnerProfileBackend): PartnerProfile => {
  return {
    id: backend.partner_id,
    company_name: backend.name,
    partner_type: backend.type,
    company_overview: backend.company_overview,
    company_address: backend.company_address,
    company_city: backend.city,
    company_country: backend.country,
    company_pincode: backend.zip_code,
    company_founding_year: backend.company_founded_year,
    industry_parent: backend.industry_parent,
    industry_sub_category: backend.industry_sub_category,
    industries_served: backend.industries_served,
    services_offered: backend.services_offered,
    pricing_model: backend.pricing_model,
    certifications: backend.certifications_and_patents,
    portfolio: backend.portfolio,
    company_website: backend.website,
    company_linkedin_url: backend.linkedin_url,
    company_email: backend.company_email,
    company_contact_number: backend.contact_number,
    location: backend.location,
    similarity_score: backend.similarity_score,
    employee_size: backend.company_size,
  };
};

/**
 * Look up a partner by email and phone number
 * The backend will match on email or phone
 * 
 * @param payload - Partner lookup information (email and phone only)
 * @returns Partner profile if found
 */
export const lookupPartner = async (
  payload: PartnerLookupPayload
): Promise<PartnerLookupResponse> => {
  try {
    const response = await apiClient.post<PartnerProfileBackend[]>(
      '/partners/check',
      payload
    );
    
    // Backend returns an array, take the first match
    const partners = response.data;
    
    if (Array.isArray(partners) && partners.length > 0) {
      const transformedPartner = transformPartnerProfile(partners[0]);
      return {
        success: true,
        message: 'Partner profile found',
        data: transformedPartner
      };
    } else {
      return {
        success: false,
        message: 'No matching partner found',
      };
    }
  } catch (error: any) {
    // If it's a 404, it means no partner was found
    if (error.response?.status === 404) {
      return {
        success: false,
        message: 'No matching partner found',
      };
    }
    throw error;
  }
};

/**
 * Register a new partner
 * 
 * @param payload - Partner registration information
 * @returns Registration response
 */
export const registerPartner = async (
  payload: PartnerLookupPayload & {
    name?: string;
    company_name?: string;
    partner_type?: string;
    services_offered?: string;
    website?: string;
    description?: string;
  }
): Promise<{ success: boolean; message: string; data?: { id: string } }> => {
  const response = await apiClient.post(
    '/partners/register',
    payload
  );
  return response.data;
};

/**
 * Get partner profile by ID
 * 
 * @param partnerId - The partner's ID
 * @returns Partner profile
 */
export const getPartnerProfile = async (
  partnerId: string
): Promise<PartnerProfile> => {
  const response = await apiClient.get<{ data: PartnerProfile }>(
    `/partners/${partnerId}`
  );
  return response.data.data;
};

/**
 * Update partner profile
 * 
 * @param partnerId - The partner's ID
 * @param updates - Fields to update
 * @returns Updated partner profile
 */
export const updatePartnerProfile = async (
  partnerId: string,
  updates: Partial<PartnerProfile>
): Promise<PartnerProfile> => {
  const response = await apiClient.put<{ data: PartnerProfile }>(
    `/partners/${partnerId}`,
    updates
  );
  return response.data.data;
};

/**
 * Claim a partner profile
 * 
 * @param partnerId - The partner's ID to claim
 * @returns Claim response
 */
export const claimPartnerProfile = async (
  partnerId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    `/partners/${partnerId}/claim`,
    { claimed: true }
  );
  return response.data;
};

