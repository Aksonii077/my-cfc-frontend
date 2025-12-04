import { apiClient } from '../../../../../utils/api'
import type { MentorFormData, UserInfoData } from '../../../types'

export interface MentorApiPayload {
  name: string
  number: string
  linkedin_url: string
  years_of_experience: string
  area_of_expertise: string
  bio: string
}

export interface MentorApiResponseData {
  id: string
  status: string
  [key: string]: unknown
}

export interface MentorApiResponse {
  success: boolean
  message: string
  data?: MentorApiResponseData
}

/**
 * Transforms form data and user info into the API payload format
 */
export const transformMentorData = (
  userInfo: UserInfoData,
  formData: MentorFormData
): MentorApiPayload => {
  return {
    name: `${userInfo.firstName} ${userInfo.lastName}`,
    number: `${userInfo.countryCode}${userInfo.phone}`,
    linkedin_url: userInfo.linkedin || '',
    years_of_experience: formData.yearsOfExperience,
    area_of_expertise: formData.expertise.join(', '), // Join array into comma-separated string
    bio: formData.bio
  }
}

/**
 * Submits mentor onboarding data to the backend
 */
export const submitMentorOnboarding = async (
  userInfo: UserInfoData,
  formData: MentorFormData
): Promise<MentorApiResponse> => {
  const payload = transformMentorData(userInfo, formData)
  
  const response = await apiClient.post<MentorApiResponse>(
    '/mentor-onboarding/verification',
    payload
  )
  
  return response.data
}

/**
 * Hook for mentor API submission with error handling
 */
export const useMentorApiSubmission = () => {
  const submitMentor = async (
    userInfo: UserInfoData,
    formData: MentorFormData
  ): Promise<MentorApiResponse> => {
    // Error handling is already done by apiClient interceptors
    // So we can directly return the result without wrapping in try/catch
    return await submitMentorOnboarding(userInfo, formData)
  }

  return {
    submitMentor
  }
}