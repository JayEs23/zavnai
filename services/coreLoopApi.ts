/**
 * Core Loop API Service
 * Handles the continuous reflection-action cycle
 */

import { api } from '@/lib/api';

export interface CommitmentOutcomeRequest {
  commitment_id: string;
  outcome: 'completed' | 'failed' | 'missed' | 'negotiated';
  reflection_text?: string;
}

export interface ReflectionResponse {
  success: boolean;
  reflection_prompt?: string;
  echo_response?: string;
  insights?: Array<{
    title: string;
    description: string;
    confidence: number;
    pattern_labels?: string[];
  }>;
  thrive_score?: number;
  error?: string;
}

export interface DoynInsights {
  goal_id: string;
  insights: Array<{
    type: string;
    value: unknown;
    source: string;
  }>;
  thrive_score: number;
  risk_level: string;
  completion_rate: number;
  recommendations: {
    intensity: 'low' | 'normal';
    commitment_size: 'tiny' | 'small' | 'normal';
    tone: 'supportive' | 'direct';
  };
}

export const coreLoopApi = {
  /**
   * Handle commitment outcome and trigger reflection
   */
  async handleCommitmentOutcome(
    commitmentId: string,
    outcome: 'completed' | 'failed' | 'missed' | 'negotiated',
    reflectionText?: string
  ): Promise<ReflectionResponse> {
    const response = await api.post<ReflectionResponse>('/api/core-loop/commitment-outcome', {
      commitment_id: commitmentId,
      outcome,
      reflection_text: reflectionText,
    });
    if (response.error || !response.data) {
      return {
        success: false,
        error: response.error?.message || 'Failed to handle commitment outcome',
      };
    }
    return response.data;
  },

  /**
   * Process reflection on a specific commitment
   */
  async reflectOnCommitment(
    commitmentId: string,
    reflectionText: string
  ): Promise<ReflectionResponse> {
    const response = await api.post<ReflectionResponse>(
      `/api/core-loop/reflect/${commitmentId}`,
      { reflection_text: reflectionText }
    );
    if (response.error || !response.data) {
      return {
        success: false,
        error: response.error?.message || 'Failed to process reflection',
      };
    }
    return response.data;
  },

  /**
   * Get Echo insights for Doyn to inform decision-making
   */
  async getInsightsForDoyn(goalId: string): Promise<DoynInsights> {
    const response = await api.get<DoynInsights>(`/api/core-loop/insights-for-doyn/${goalId}`);
    if (response.error || !response.data) {
      // Return a safe default structure
      return {
        goal_id: goalId,
        insights: [],
        thrive_score: 50,
        risk_level: 'unknown',
        completion_rate: 0,
        recommendations: {
          intensity: 'normal',
          commitment_size: 'normal',
          tone: 'supportive',
        },
      };
    }
    return response.data;
  },
};

