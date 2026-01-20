/**
 * Onboarding API service
 */

import { api } from '@/lib/api';

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

export interface UsernameCheckResponse {
  available: boolean;
  message: string;
}

export interface OnboardingStatusResponse {
  current_step: number;
  completed_steps: number[];
  is_completed: boolean;
  step_data: Record<string, any>;
}

export interface StepResponse {
  success: boolean;
  message: string;
  next_step?: number;
  onboarding_completed?: boolean;
}

export const onboardingApi = {
  checkUsername: async (username: string): Promise<UsernameCheckResponse> => {
    return api.get<UsernameCheckResponse>(
      `/api/onboarding/username/check?username=${encodeURIComponent(username)}`
    );
  },

  getStatus: async (): Promise<OnboardingStatusResponse> => {
    return api.get<OnboardingStatusResponse>(`/api/onboarding/status`);
  },

  completeStep1: async (
    data: NameStepData
  ): Promise<StepResponse> => {
    return api.post<StepResponse>(`/api/onboarding/step-1`, data);
  },

  completeStep2: async (
    data: UsernameStepData
  ): Promise<StepResponse> => {
    return api.post<StepResponse>(`/api/onboarding/step-2`, data);
  },

  completeStep3: async (
    data: PreferencesStepData
  ): Promise<StepResponse> => {
    return api.post<StepResponse>(`/api/onboarding/step-3`, data);
  },
};

