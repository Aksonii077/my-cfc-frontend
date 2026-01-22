import { apiClient } from '../../../../../utils/api'
import { logger } from '../../../../../utils/logger'
import type { UserInfoData } from '../../../types'

// ✅ ADD THIS INTERFACE
export interface ServiceProviderFormData {
  bio: string
  services: string[]
  businessType: string
  yearsOfExperience: string
}

export interface ServiceProviderApiResponse {
  success: boolean
  data: {
    id: string
    status: string
    message: string
  }
}

// ✅ FIX: Remove space in function name (useSer viceProviderApiSubmission → useServiceProviderApiSubmission)
export const useServiceProviderApiSubmission = () => {
  const submitServiceProvider = async (
    userInfo: UserInfoData,
    formData: ServiceProviderFormData
  ): Promise<ServiceProviderApiResponse> => {
    try {
      logger.info('[SERVICE_PROVIDER_API] Submitting service provider data')

      const payload = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        phone: `${userInfo.countryCode}${userInfo.phone}`,
        website: userInfo.website || '',
        linkedin: userInfo.linkedin || '',
        bio: formData.bio,
        services: formData.services,
        businessType: formData.businessType,
        yearsOfExperience: formData.yearsOfExperience
      }

      // ✅ FIX: Properly type the response
      const response = await apiClient.post<ServiceProviderApiResponse>(
        '/api/partners/service-provider-onboarding',
        payload
      )

      logger.info('[SERVICE_PROVIDER_API] Submission successful', {
        partnerId: response.data.data.id  
      })

      // ✅ FIX: Return response.data (which contains success, data fields)
      return response.data
    } catch (error) {
      logger.error('[SERVICE_PROVIDER_API] Submission failed', error)
      throw error
    }
  }

  return { submitServiceProvider }
}
