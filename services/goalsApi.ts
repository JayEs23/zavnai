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
  stake_amount: number;
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
    return api.get<GoalSummary[]>('/api/v1/goals/list');
  },

  /** Get a single goal by ID */
  async get(goalId: string): Promise<GoalSummary> {
    return api.get<GoalSummary>(`/api/v1/goals/${goalId}`);
  },

  /** List all goals (full Goal type for goals page) */
  async getGoals(): Promise<Goal[]> {
    return api.get<Goal[]>('/api/v1/goals/list');
  },

  /** Get commitments for a specific goal */
  async getCommitments(goalId: string): Promise<CommitmentSummary[]> {
    return api.get<CommitmentSummary[]>(`/api/v1/goals/${goalId}/commitments`);
  },

  /** Alias used by goals page */
  async getGoalCommitments(goalId: string): Promise<Commitment[]> {
    return api.get<Commitment[]>(`/api/v1/goals/${goalId}/commitments`);
  },

  /** Get today's commitments across all goals */
  async getTodaysCommitments(): Promise<CommitmentSummary[]> {
    return api.get<CommitmentSummary[]>('/api/v1/goals/commitments/today');
  },

  /** Create a new goal (via Echo contract ingestion) */
  async createGoal(data: CreateGoalRequest): Promise<{ success: boolean; goal_id: string; message: string }> {
    return api.post('/api/v1/goals/ingest-contract', data);
  },

  /** Archive a goal */
  async archiveGoal(goalId: string): Promise<{ success: boolean; message: string }> {
    return api.put(`/api/v1/goals/${goalId}/archive`);
  },

  /** Mark a goal as completed */
  async completeGoal(goalId: string): Promise<{ success: boolean; message: string }> {
    return api.put(`/api/v1/goals/${goalId}/complete`);
  },

  /** Auto-generate commitments for a goal using Doyn AI */
  async generateCommitments(goalId: string, count = 3): Promise<{
    success: boolean;
    goal_id: string;
    commitments_created: number;
    commitments: { id: string; task_detail: string; due_at: string }[];
  }> {
    return api.post(`/api/v1/goals/${goalId}/generate-commitments`, { count });
  },

  /** Add a financial stake to an existing goal */
  async stakeGoal(goalId: string, amount: number): Promise<{ success: boolean; message: string; payment_intent_id?: string }> {
    return api.post(`/api/v1/goals/${goalId}/stake`, { amount });
  },
};
