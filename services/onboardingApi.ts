/**
 * Onboarding API service
 * Updated for Phase 2 Backend + Opik
 */

import { api } from '@/lib/api';

// --- Request types matching Backend Schemas ---

export interface OnboardingStepSubmission {
  step_number: number;
  data: Record<string, any>;
}

export interface OnboardingAnalysisRequest {
  session_id?: string;
}

export interface BaselineAnalysisResult {
  user_id: string;
  summary: string;
  top_patterns: string[];
  suggested_focus: string;
  readiness_score: number;
}

export interface StepResponse {
  status: string;
  next_step: number;
}

// --- Legacy Step Interfaces (Restored for Component Compatibility) ---

export interface NameStepData {
  first_name: string;
  last_name: string;
  middle_name?: string;
}

export interface UsernameStepData {
  username: string;
}

export interface PreferencesStepData {
  communication_style: 'direct' | 'gentle' | 'conversational';
  time_commitment: 'low' | 'medium' | 'high';
  growth_areas: string[];
  additional_responses?: Record<string, any>;
}

// Complete definition matching page.tsx usage
export interface ProfileUpdateRequest {
  full_name?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  pronouns?: string;
  username?: string;
  primary_goal?: string;
  goal_timeline?: string;
  availability_mins?: number;
  availability_days?: string[];
  interaction_mode?: string;
  motivation?: string;
  notification_preference?: string;
  baseline_responses?: Record<string, any>;
}

export interface UsernameCheckResponse {
  available: boolean;
  message: string;
}

// Echo voice config returned by the backend
export interface EchoVoiceConfig {
  onboarding: {
    model: string;
    api_version: string;
    system_instruction: string;
  };
  reflection: {
    model: string;
    api_version: string;
    system_instruction: string;
  };
}

export const onboardingApi = {
  // Start Session
  startSession: async (): Promise<{ session_id: string; current_step: number }> => {
    const res = await api.post<{ session_id: string; current_step: number }>('/api/onboarding/start', {});
    if (res.error || !res.data) {
      throw new Error(res.error?.message || 'Failed to start onboarding session');
    }
    return res.data;
  },

  // Submit Step (Generic)
  submitStep: async (stepNumber: number, data: Record<string, any>): Promise<StepResponse> => {
    const response = await api.post<StepResponse>('/api/onboarding/step', {
      step_number: stepNumber,
      data: data
    });
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to submit step');
    }
    return response.data;
  },

  // Trigger Backend Analysis
  analyzeBaseline: async (): Promise<BaselineAnalysisResult> => {
    const res = await api.post<BaselineAnalysisResult>('/api/onboarding/analyze', {});
    if (res.error || !res.data) {
      throw new Error(res.error?.message || 'Failed to analyze baseline');
    }
    return res.data;
  },

  // Legacy/Profile Update wrapper (Full type support now)
  updateProfile: async (data: ProfileUpdateRequest): Promise<any> => {
    const response = await api.put('/api/onboarding/profile', data);
    if (response.error) {
      throw new Error(response.error.message || 'Failed to update profile');
    }
    return response.data;
  },

  // Check Username
  checkUsername: async (username: string): Promise<UsernameCheckResponse> => {
    const response = await api.get<UsernameCheckResponse>(`/api/onboarding/username/check?username=${encodeURIComponent(username)}`);
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to check username');
    }
    return response.data;
  },

  // Legacy Status Check (Restored for store compatibility)
  getStatus: async (): Promise<any> => {
    const response = await api.get('/api/onboarding/status');
    if (response.error) {
      throw new Error(response.error.message || 'Failed to get onboarding status');
    }
    return response.data;
  },

  // Get Echo voice config (model, API version, system instruction) from backend
  getEchoVoiceConfig: async (): Promise<EchoVoiceConfig> => {
    const response = await api.get<EchoVoiceConfig>('/api/echo/voice-config');
    if (response.error) {
      throw new Error(response.error.message || 'Failed to fetch Echo voice config');
    }
    if (!response.data) {
      throw new Error('No data received from voice config endpoint');
    }
    return response.data;
  },
};
