/**
 * Goals API Service
 * 
 * Handles all goal-related API calls including:
 * - Creating goals with financial stakes
 * - Fetching user's goals
 * - Updating goal progress
 * - Managing commitments tied to goals
 */

import { api } from '@/lib/api';

// ============================================================================
// TYPES
// ============================================================================

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category?: 'work' | 'health' | 'social' | 'personal' | 'financial';
  
  // Stakes
  is_staked: boolean;
  stake_amount: number;
  stake_currency: string;
  vault_status: 'none' | 'escrow' | 'returned' | 'forfeited';
  
  // Schedule
  deadline: string; // ISO date string
  frequency?: 'one_time' | 'daily' | 'weekly' | 'monthly';
  
  // Progress
  status: 'active' | 'completed' | 'failed' | 'paused' | 'archived';
  created_at: string;
  completed_at?: string;
  
  // Privacy
  is_private: boolean;
  
  // Metadata
  metadata?: {
    extraction_method?: string;
    common_excuses?: string[];
    transcript?: string;
    stripe_payment_intent_id?: string;
    encryption_enabled?: boolean;
  };
}

export interface CreateGoalRequest {
  goal: string; // Goal title/description
  deadline: string; // ISO date string
  financial_stake: number; // Amount in USD
  common_excuses: string[]; // Min 2 required
  transcript?: string; // Optional Echo interview transcript
}

export interface CreateGoalResponse {
  success: boolean;
  goal_id: string;
  payment_intent_id?: string;
  message: string;
}

export interface Commitment {
  id: string;
  goal_id: string;
  task_detail: string;
  due_at: string; // ISO date string
  status: 'pending' | 'verified' | 'failed' | 'escalated' | 'negotiated';
  escalation_level: number;
  created_at: string;
  verified_at?: string;
}

export interface GoalWithCommitments extends Goal {
  commitments: Commitment[];
}

// ============================================================================
// API METHODS
// ============================================================================

export const goalsApi = {
  /**
   * Create a new goal with financial stake (The Mother Lode)
   */
  createGoal: async (data: CreateGoalRequest): Promise<CreateGoalResponse> => {
    return api.post<CreateGoalResponse>('/goals/ingest-contract', data);
  },

  /**
   * Get all goals for the current user
   */
  getGoals: async (): Promise<Goal[]> => {
    return api.get<Goal[]>('/goals');
  },

  /**
   * Get a specific goal by ID with its commitments
   */
  getGoal: async (goalId: string): Promise<GoalWithCommitments> => {
    return api.get<GoalWithCommitments>(`/goals/${goalId}`);
  },

  /**
   * Update a goal's details
   */
  updateGoal: async (goalId: string, updates: Partial<Goal>): Promise<Goal> => {
    return api.patch<Goal>(`/goals/${goalId}`, updates);
  },

  /**
   * Delete a goal (and all associated commitments)
   */
  deleteGoal: async (goalId: string): Promise<{ success: boolean }> => {
    return api.delete<{ success: boolean }>(`/goals/${goalId}`);
  },

  /**
   * Archive a goal (soft delete)
   */
  archiveGoal: async (goalId: string): Promise<Goal> => {
    return api.patch<Goal>(`/goals/${goalId}`, { status: 'archived' });
  },

  /**
   * Mark goal as completed
   */
  completeGoal: async (goalId: string): Promise<Goal> => {
    return api.patch<Goal>(`/goals/${goalId}/complete`, {});
  },

  /**
   * Get commitments for a specific goal
   */
  getGoalCommitments: async (goalId: string): Promise<Commitment[]> => {
    return api.get<Commitment[]>(`/goals/${goalId}/commitments`);
  },

  /**
   * Get active goals (not archived or completed)
   */
  getActiveGoals: async (): Promise<Goal[]> => {
    const goals = await goalsApi.getGoals();
    return goals.filter(
      (g) => g.status === 'active' || g.status === 'paused'
    );
  },

  /**
   * Get goals by status
   */
  getGoalsByStatus: async (status: Goal['status']): Promise<Goal[]> => {
    const goals = await goalsApi.getGoals();
    return goals.filter((g) => g.status === status);
  },

  /**
   * Get staked goals (with financial stakes)
   */
  getStakedGoals: async (): Promise<Goal[]> => {
    const goals = await goalsApi.getGoals();
    return goals.filter((g) => g.is_staked && g.stake_amount > 0);
  },
};

