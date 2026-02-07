import { api } from '@/lib/api';

export interface GoalSummary {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  status: string;
  stake_amount: number;
  created_at: string;
  insights?: {
    goals?: string[];
    motivation?: string;
    implementation_style?: string;
    blockers?: string[];
    common_excuses?: string[];
  };
}

export interface CommitmentSummary {
  id: string;
  goal_id: string;
  goal_title: string;
  task_detail: string;
  due_at: string;
  status: string;
  created_at: string;
}

export const goalsApi = {
  async list(): Promise<GoalSummary[]> {
    const response = await api.get<GoalSummary[]>('/api/v1/goals/list');
    return response;
  },

  async get(goalId: string): Promise<GoalSummary> {
    const response = await api.get<GoalSummary>(`/api/v1/goals/${goalId}`);
    return response;
  },

  async getCommitments(goalId: string): Promise<CommitmentSummary[]> {
    const response = await api.get<CommitmentSummary[]>(`/api/v1/goals/${goalId}/commitments`);
    return response;
  },

  async getTodaysCommitments(): Promise<CommitmentSummary[]> {
    const response = await api.get<CommitmentSummary[]>('/api/v1/goals/commitments/today');
    return response;
  },
};
