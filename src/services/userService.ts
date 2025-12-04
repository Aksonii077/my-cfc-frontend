import { apiClient } from '../utils/api';
import { logger } from '@/utils/logger';

export interface UserCheckResponse {
  exists: boolean;
  message: string;
  user?: {
    user_id: string;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
    updated_at: string;
    onboarding_step: string | null;
    is_onboarded: boolean | null;
    onboarding_data: any | null;
  };
}

export const checkUserExists = async (email: string): Promise<UserCheckResponse> => {
  try {
    const response = await apiClient.get(`/api/check-user?email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    logger.error('UserService: Error checking user', error);
    throw error;
  }
};

export const getCurrentUserEmail = (): string | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    return user.email || null;
  } catch (error) {
    logger.error('UserService: Error getting current user email', error);
    return null;
  }
};