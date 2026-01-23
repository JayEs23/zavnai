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

export const onboardingApi = {
  // Start Session
  startSession: async (): Promise<{ session_id: string; current_step: number }> => {
    trackEvent('onboarding_start_attempt', {});
    const res = await api.post<{ session_id: string; current_step: number }>('/api/onboarding/start', {});
    trackEvent('onboarding_start_success', { session_id: res.session_id });
    return res;
  },

  // Submit Step (Generic)
  submitStep: async (stepNumber: number, data: Record<string, any>): Promise<StepResponse> => {
    trackEvent(`onboarding_step_${stepNumber}_submit`, { step: stepNumber });

    return api.post<StepResponse>('/api/onboarding/step', {
      step_number: stepNumber,
      data: data
    });
  },

  // Trigger Backend Analysis
  analyzeBaseline: async (): Promise<BaselineAnalysisResult> => {
    trackEvent('onboarding_analyze_start', {});
    const res = await api.post<BaselineAnalysisResult>('/api/onboarding/analyze', {});
    trackEvent('onboarding_analyze_complete', { readiness: res.readiness_score });
    return res;
  },

  // Legacy/Profile Update wrapper (Full type support now)
  updateProfile: async (data: ProfileUpdateRequest): Promise<any> => {
    return api.put('/api/onboarding/profile', data);
  },

  // Check Username
  checkUsername: async (username: string): Promise<UsernameCheckResponse> => {
    return api.get(`/api/onboarding/username/check?username=${encodeURIComponent(username)}`);
  }
};
