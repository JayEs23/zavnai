/**
 * Doyn API - Chat-based negotiation and commitment management
 */

import axiosInstance, { getApiErrorMessage } from '@/lib/axios';

export interface Commitment {
  id: string;
  goal_id: string;
  task_detail: string;
  due_at: string;
  status: 'pending' | 'verified' | 'escalated' | 'failed' | 'missed';
  escalation_level: number;
  verification_score?: number;
  proof_url?: string;
  proof_text?: string;
  created_at: string;
  verified_at?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  status: 'active' | 'completed' | 'failed' | 'paused';
  is_staked: boolean;
  stake_amount?: number;
  commitments?: Commitment[];
}

export interface DoynMessage {
  id: string;
  role: 'doyn' | 'user';
  content: string;
  timestamp: string;
  action?: 'commitment_created' | 'commitment_updated' | 'deadline_extended' | 'micro_win_suggested';
  metadata?: Record<string, unknown>;
}

export interface NegotiationRequest {
  commitment_id: string;
  reason: string;
  proposed_deadline?: string;
  proposed_task?: string;
}

export interface NegotiationResponse {
  success: boolean;
  negotiation_id: string;
  accepted: boolean;
  new_commitment?: Commitment;
  doyn_response: string;
}


class DoynApi {

  /**
   * Get all active commitments for the user (via goals endpoint)
   */
  async getCommitments(): Promise<Commitment[]> {
    try {
      const response = await axiosInstance.get('/api/v1/goals/commitments/today');
      return response.data;
    } catch (error) {
      console.error('[DoynApi] Error fetching commitments:', error);
      throw new Error(getApiErrorMessage(error, 'Failed to fetch commitments'));
    }
  }

  /**
   * Get all goals with their commitments
   */
  async getGoals(): Promise<Goal[]> {
    try {
      const response = await axiosInstance.get('/api/v1/goals/list');
      return response.data;
    } catch (error) {
      console.error('[DoynApi] Error fetching goals:', error);
      throw new Error(getApiErrorMessage(error, 'Failed to fetch goals'));
    }
  }

  /**
   * Send a message to Doyn and get response
   */
  async sendMessage(
    message: string,
    context?: Record<string, unknown>
  ): Promise<DoynMessage> {
    try {
      const response = await axiosInstance.post('/api/agents/doyn/chat', {
        message,
        context,
      });
      return response.data;
    } catch (error) {
      console.error('[DoynApi] Error sending message to Doyn:', error);
      throw new Error(getApiErrorMessage(error, 'Failed to send message'));
    }
  }

  /**
   * Request to negotiate a commitment
   */
  async negotiateCommitment(request: NegotiationRequest): Promise<NegotiationResponse> {
    try {
      const response = await axiosInstance.post('/api/agents/doyn/negotiate', request);
      return response.data;
    } catch (error) {
      console.error('[DoynApi] Error negotiating commitment:', error);
      throw new Error(getApiErrorMessage(error, 'Failed to negotiate commitment'));
    }
  }

  /**
   * Mark commitment as completed
   */
  async completeCommitment(commitmentId: string, proofText?: string): Promise<void> {
    try {
      await axiosInstance.post(`/api/v1/goals/commitments/${commitmentId}/complete`, {
        proof_text: proofText,
      });
    } catch (error) {
      console.error('[DoynApi] Error completing commitment:', error);
      throw new Error(getApiErrorMessage(error, 'Failed to complete commitment'));
    }
  }

  /**
   * Get chat history with Doyn
   */
  async getChatHistory(limit: number = 50): Promise<DoynMessage[]> {
    try {
      const response = await axiosInstance.get(`/api/agents/doyn/history?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('[DoynApi] Error fetching chat history:', error);
      return [];
    }
  }

  /**
   * Get chat history for a specific goal
   */
  async getGoalChatHistory(goalId: string, limit: number = 20): Promise<DoynMessage[]> {
    try {
      const response = await axiosInstance.get(`/api/agents/doyn/history/${goalId}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('[DoynApi] Error fetching goal chat history:', error);
      return [];
    }
  }
}

export const doynApi = new DoynApi();
