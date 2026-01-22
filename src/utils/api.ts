import axios, { AxiosError, AxiosResponse } from "axios";
import { message } from "antd";

// Type for API error response
interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: any;
}

/**
 * Centralized API client with automatic token handling
 *
 * Features:
 * - Automatically adds Authorization header with Bearer token from localStorage
 * - Handles common error responses (401, 403, 404, 422, 429, 500)
 * - Shows user-friendly error messages via antd message
 * - Automatic logout on 401 (session expired)
 * - ✅ Sends cookies for session-based auth (service provider onboarding)
 *
 * Usage:
 * ```
 * import { apiClient, endpoints } from '@/utils/api';
 *
 * // Simple GET request
 * const response = await apiClient.get('/endpoint');
 *
 * // POST request with data
 * const response = await apiClient.post('/endpoint', data);
 *
 * // Using predefined endpoints
 * const response = await apiClient.get(endpoints.mentor.profile);
 * ```
 */

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8002",
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // ✅ Send cookies with all requests
  headers: {
    "Content-Type": "application/json",
    'ngrok-skip-browser-warning': '1', // Skip ngrok browser warning
    "Accept": "application/json",
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure ngrok header is always present  
    config.headers['ngrok-skip-browser-warning'] = '1';

    // ✅ FIX: Don't double-stringify data
    // Axios automatically serializes objects to JSON
    // Only manually stringify if absolutely necessary
    if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
      // Axios will handle JSON.stringify automatically
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common response scenarios
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // Handle 401 status specially
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user_id");

      // Use backend message if available, otherwise fallback
      const unauthorizedMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Your session has expired. Please log in again.";
      message.error(unauthorizedMessage);

      // Redirect to home page
      window.location.href = "/";
    } else {
      // For all other errors, show backend message
      const errorMessage = error.response?.data?.message || error.response?.data?.error;
      if (errorMessage) {
        message.error(errorMessage);
      }
    }

    return Promise.reject(error);
  }
);

// ✅ UPDATED: Helper functions with proper typing
export const apiClient = {
  // GET request
  get: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => 
    api.get<T>(url, config),

  // POST request - ✅ FIX: Return AxiosResponse, not just data
  post: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> =>
    api.post<T>(url, data, config),

  // PUT request
  put: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> =>
    api.put<T>(url, data, config),

  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> =>
    api.patch<T>(url, data, config),

  // DELETE request
  delete: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => 
    api.delete<T>(url, config),

  // POST with FormData (for file uploads)
  postFormData: <T = any>(url: string, formData: FormData, config?: any): Promise<AxiosResponse<T>> =>
    api.post<T>(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
        'ngrok-skip-browser-warning': '1'
      },
    }),

  // PUT with FormData (for file uploads)
  putFormData: <T = any>(url: string, formData: FormData, config?: any): Promise<AxiosResponse<T>> =>
    api.put<T>(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
        'ngrok-skip-browser-warning': '1'
      },
    }),
};

// Export default axios instance for direct use if needed
export default api;
