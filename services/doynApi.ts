/**
 * Doyn API - Chat-based negotiation and commitment management
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
  metadata?: any;
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
  private getAuthHeaders() {
    if (typeof window === 'undefined') return {};
    
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get all active commitments for the user
   */
  async getCommitments(): Promise<Commitment[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/goals/commitments`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching commitments:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch commitments');
    }
  }

  /**
   * Get all goals with their commitments
   */
  async getGoals(): Promise<Goal[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/goals`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch goals');
    }
  }

  /**
   * Send a message to Doyn and get response
   */
  async sendMessage(message: string, context?: any): Promise<DoynMessage> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/agents/doyn/chat`,
        {
          message,
          context,
        },
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error sending message to Doyn:', error);
      throw new Error(error.response?.data?.detail || 'Failed to send message');
    }
  }

  /**
   * Request to negotiate a commitment
   */
  async negotiateCommitment(request: NegotiationRequest): Promise<NegotiationResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/agents/doyn/negotiate`,
        request,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error negotiating commitment:', error);
      throw new Error(error.response?.data?.detail || 'Failed to negotiate commitment');
    }
  }

  /**
   * Mark commitment as completed
   */
  async completeCommitment(commitmentId: string, proofText?: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/goals/commitments/${commitmentId}/complete`,
        { proof_text: proofText },
        {
          headers: this.getAuthHeaders(),
        }
      );
    } catch (error: any) {
      console.error('Error completing commitment:', error);
      throw new Error(error.response?.data?.detail || 'Failed to complete commitment');
    }
  }

  /**
   * Get chat history with Doyn
   */
  async getChatHistory(limit: number = 50): Promise<DoynMessage[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/agents/doyn/history?limit=${limit}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching chat history:', error);
      return []; // Return empty array if no history
    }
  }
}

export const doynApi = new DoynApi();

