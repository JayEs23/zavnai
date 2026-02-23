/**
 * Thrive API service — wellbeing monitoring
 */

import { api } from '@/lib/api';

export interface ThriveComponents {
  vocal_biomarkers: number;
  commitment_elasticity: number;
  sentiment_drift: number;
  completion_rate: number;
}

export interface ThriveScore {
  thrive_score: number;
  risk_level: 'excellent' | 'green' | 'yellow' | 'red';
  risk_label: string;
  components: ThriveComponents;
  recommendations: string[];
}

export interface CanCreateGoal {
  allowed: boolean;
  reason: string | null;
  thrive_score: number | null;
}

export const thriveApi = {
  /** Fetch current Thrive score with component breakdown */
  async getScore(): Promise<ThriveScore> {
    const res = await api.get<ThriveScore>('/api/thrive/score');
    if (res.error) throw new Error(res.error.message || 'Failed to get Thrive score');
    return res.data!;
  },

  /** Check if the user can create a new goal */
  async canCreateGoal(): Promise<CanCreateGoal> {
    const res = await api.get<CanCreateGoal>('/api/thrive/can-create-goal');
    if (res.error) throw new Error(res.error.message || 'Failed to check if can create goal');
    return res.data!;
  },
};

