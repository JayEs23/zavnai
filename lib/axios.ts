/**
 * Centralized Axios Instance with Interceptors
 * Handles authentication, error handling, and common configurations
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds auth token automatically
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Only add auth token on client side
    if (typeof window !== 'undefined') {
      try {
        // Try NextAuth session first
        const session = await getSession();
        const token = (session as any)?.accessToken;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Fallback to localStorage for legacy flows
          const localToken = localStorage.getItem('auth_token');
          if (localToken) {
            config.headers.Authorization = `Bearer ${localToken}`;
          }
        }
      } catch (error) {
        console.warn('Failed to get auth token:', error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Log detailed error info for debugging
    if (error.response) {
      // Server responded with error status
      console.error('[API Error]', {
        status: error.response.status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data,
      });

      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - could redirect to login
        console.warn('Unauthorized request - token may be invalid');
        
        // Optional: Clear invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
      }

      if (error.response.status === 404) {
        console.error('Resource not found:', error.config?.url);
      }

      if (error.response.status === 500) {
        console.error('Server error - backend may be down');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('[Network Error]', {
        message: 'No response received from server',
        url: error.config?.url,
      });
    } else {
      // Something else happened
      console.error('[Request Error]', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to extract user-friendly error message
 */
export function getApiErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>;
    return axiosError.response?.data?.detail || 
           axiosError.response?.data?.message || 
           axiosError.message || 
           fallback;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return fallback;
}

export default axiosInstance;

