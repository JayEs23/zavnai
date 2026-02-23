import { api } from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────────

export interface GoalInsights {
  goals?: string[];
  motivation?: string;
  implementation_style?: string;
  blockers?: string[];
  common_excuses?: string[];
}

export interface GoalSummary {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  status: string;
  is_staked: boolean;
  stake_amount: number;
  stake_currency: string;
  vault_status: string;
  created_at: string;
  insights?: GoalInsights;
}

/** Extended Goal type used by the goals management page */
export interface Goal {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  status: 'active' | 'completed' | 'failed' | 'paused' | 'archived';
  is_staked: boolean;
  stake_amount: number;
  stake_currency: string;
  vault_status: string;
  created_at: string;
  insights?: GoalInsights;
}

export interface Commitment {
  id: string;
  goal_id: string;
  task_detail: string;
  due_at: string;
  status: 'pending' | 'verified' | 'escalated' | 'failed' | 'missed';
  escalation_level?: number;
  verification_score?: number;
  proof_url?: string;
  proof_text?: string;
  created_at: string;
  verified_at?: string;
}

export interface CommitmentSummary {
  id: string;
  goal_id: string;
  goal_title: string;
  task_detail: string;
  due_at: string;
  status: string;
  escalation_level: number;
  verification_score?: number;
  created_at: string;
}

export interface CreateGoalRequest {
  goal: string;
  deadline: string;
  financial_stake: number;
  common_excuses: string[];
  transcript?: string;
}

// ── API ────────────────────────────────────────────────────────────────

export const goalsApi = {
  /** List all goals (lightweight summary for dashboard) */
  async list(): Promise<GoalSummary[]> {
    const response = await api.get<GoalSummary[]>('/api/v1/goals/list');
    if (response.error || !response.data) {
      console.error('Failed to load goals:', response.error);
      return [];
    }
    return response.data;
  },

  /** Get a single goal by ID */
  async get(goalId: string): Promise<GoalSummary> {
    const response = await api.get<GoalSummary>(`/api/v1/goals/${goalId}`);
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to load goal');
    }
    return response.data;
  },

  /** List all goals (full Goal type for goals page) */
  async getGoals(): Promise<Goal[]> {
    const response = await api.get<Goal[]>('/api/v1/goals/list');
    if (response.error || !response.data) {
      console.error('Failed to load goals:', response.error);
      return [];
    }
    return response.data;
  },

  /** Get commitments for a specific goal */
  async getCommitments(goalId: string): Promise<CommitmentSummary[]> {
    const response = await api.get<CommitmentSummary[]>(`/api/v1/goals/${goalId}/commitments`);
    if (response.error || !response.data) {
      console.error('Failed to load commitments:', response.error);
      return [];
    }
    return response.data;
  },

  /** Alias used by goals page */
  async getGoalCommitments(goalId: string): Promise<Commitment[]> {
    const response = await api.get<Commitment[]>(`/api/v1/goals/${goalId}/commitments`);
    if (response.error || !response.data) {
      console.error('Failed to load commitments:', response.error);
      return [];
    }
    return response.data;
  },

  /** Get today's commitments across all goals */
  async getTodaysCommitments(): Promise<CommitmentSummary[]> {
    const response = await api.get<CommitmentSummary[]>('/api/v1/goals/commitments/today');
    if (response.error || !response.data) {
      console.error('Failed to load today\'s commitments:', response.error);
      return [];
    }
    return response.data;
  },

  /** Create a new goal (via Echo contract ingestion) */
  async createGoal(data: CreateGoalRequest): Promise<{ success: boolean; goal_id: string; message: string }> {
    const response = await api.post<{ success: boolean; goal_id: string; message: string }>('/api/v1/goals/ingest-contract', data);
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to create goal');
    }
    return response.data;
  },

  /** Archive a goal */
  async archiveGoal(goalId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.put<{ success: boolean; message: string }>(`/api/v1/goals/${goalId}/archive`);
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to archive goal');
    }
    return response.data;
  },

  /** Mark a goal as completed */
  async completeGoal(goalId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.put<{ success: boolean; message: string }>(`/api/v1/goals/${goalId}/complete`);
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to complete goal');
    }
    return response.data;
  },

  /** Auto-generate commitments for a goal using Doyn AI */
  async generateCommitments(goalId: string, count = 3): Promise<{
    success: boolean;
    goal_id: string;
    commitments_created: number;
    commitments: { id: string; task_detail: string; due_at: string }[];
  }> {
    const response = await api.post<{
      success: boolean;
      goal_id: string;
      commitments_created: number;
      commitments: { id: string; task_detail: string; due_at: string }[];
    }>(`/api/v1/goals/${goalId}/generate-commitments`, { count });
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to generate commitments');
    }
    return response.data;
  },

  /** Add a financial stake to an existing goal */
  async stakeGoal(goalId: string, stakeAmount: number, antiCharityId?: string): Promise<{ success: boolean; message: string; payment_intent_id?: string }> {
    const response = await api.post<{ success: boolean; message: string; payment_intent_id?: string }>(`/api/v1/goals/${goalId}/stake`, {
      stake_amount: stakeAmount,
      anti_charity_id: antiCharityId,
    });
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to stake goal');
    }
    return response.data;
  },
};
