/**
 * Authentication API service
 */

import { api } from '@/lib/api';

export interface RegisterRequest {
  email: string;
  password: string;
  auth_provider?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  onboarding_completed: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  email_verified: boolean;
  onboarding_completed: boolean;
  created_at: string;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/api/auth/register', data);
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to register');
    }
    return response.data;
  },

  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/api/auth/login', data);
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to login');
    }
    // Store token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user_id', response.data.user_id);
    }
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
    }
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/api/auth/me');
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to get current user');
    }
    return response.data;
  },
};

