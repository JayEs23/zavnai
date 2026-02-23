/**
 * Tribe API Service
 *
 * Handles all tribe member management including:
 * - Adding accountability partners
 * - AI vetting process
 * - Trust score tracking
 * - Permissions management
 */

import { api } from '@/lib/api';

// ============================================================================
// TYPES
// ============================================================================

export interface TribeMember {
  id: string;
  name: string;
  contact_info: string;
  platform: 'in_app' | 'whatsapp' | 'sms' | 'email' | 'phone';
  relationship?: 'peer' | 'mentor' | 'partner' | 'spouse' | 'inner_circle' | 'professional';
  relationship_tier?: 'inner_circle' | 'mentor' | 'professional';

  // Vetting Status
  vetting_status: 'pending' | 'invited' | 'assessing' | 'verified' | 'rejected';
  vetting_score?: number; // 0-100 (AI-determined trust score)
  trust_level?: 'high' | 'medium' | 'low' | 'unverified';
  reliability_notes?: string;

  // Permissions
  can_see_private_goals: boolean;
  view_vault: boolean;
  can_pity_override: boolean;

  // Timestamps
  created_at: string;
  verified_at?: string;
}

export interface CreateTribeMemberRequest {
  name: string;
  contact_info: string;
  platform?: 'in_app' | 'whatsapp' | 'sms' | 'email' | 'phone';
  relationship?: string;
  relationship_tier?: 'inner_circle' | 'mentor' | 'professional';
  can_see_private_goals?: boolean;
  view_vault?: boolean;
  can_pity_override?: boolean;
}

export interface TrustScoreUpdate {
  interaction_type: 'message_sent' | 'message_responded' | 'accountability_check' | 'goal_shared' | 'intervention_requested';
  interaction_outcome: 'positive' | 'negative' | 'neutral' | 'unresponsive';
}

export interface TribeMemberWithHistory extends TribeMember {
  interaction_history?: {
    date: string;
    type: string;
    outcome: string;
    notes?: string;
  }[];
  trust_score_history?: {
    date: string;
    score: number;
    reason: string;
  }[];
}

// ============================================================================
// API METHODS — all paths hit /api/tribe (backend prefix="/api" + router="/tribe")
// ============================================================================

export const tribeApi = {
  /** Get all tribe members for the current user */
  getTribeMembers: async (): Promise<TribeMember[]> => {
    const response = await api.get<TribeMember[]>('/api/tribe');
    if (response.error || !response.data) {
      console.error('Failed to load tribe members:', response.error);
      return [];
    }
    return response.data;
  },

  /** Add a new tribe member (initiates AI vetting) */
  addTribeMember: async (data: CreateTribeMemberRequest): Promise<TribeMember> => {
    const response = await api.post<TribeMember>('/api/tribe', data);
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to add tribe member');
    }
    return response.data;
  },

  /** Get a specific tribe member by ID */
  getTribeMember: async (memberId: string): Promise<TribeMemberWithHistory> => {
    const response = await api.get<TribeMemberWithHistory>(`/api/tribe/${memberId}`);
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to load tribe member');
    }
    return response.data;
  },

  /** Update tribe member details */
  updateTribeMember: async (
    memberId: string,
    updates: Partial<CreateTribeMemberRequest>
  ): Promise<TribeMember> => {
    const response = await api.put<TribeMember>(`/api/tribe/${memberId}`, updates);
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to update tribe member');
    }
    return response.data;
  },

  /** Remove a tribe member */
  removeTribeMember: async (memberId: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/api/tribe/${memberId}`);
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to remove tribe member');
    }
    return response.data;
  },

  /** Update trust score based on interaction */
  updateTrustScore: async (
    memberId: string,
    update: TrustScoreUpdate
  ): Promise<TribeMember> => {
    const response = await api.post<TribeMember>(`/api/tribe/${memberId}/trust-score`, update);
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to update trust score');
    }
    return response.data;
  },

  /** Resend vetting invitation to tribe member */
  resendVetting: async (memberId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      `/api/tribe/${memberId}/resend-vetting`,
      {}
    );
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to resend vetting');
    }
    return response.data;
  },

  /** Request tribe verification for a commitment */
  requestVerification: async (
    commitmentId: string,
    tribeMemberIds?: string[]
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      `/api/tribe/request-verification/${commitmentId}`,
      { tribe_member_ids: tribeMemberIds }
    );
    if (response.error || !response.data) {
      throw new Error(response.error?.message || 'Failed to request verification');
    }
    return response.data;
  },

  /** Get verified tribe members only */
  getVerifiedMembers: async (): Promise<TribeMember[]> => {
    const members = await tribeApi.getTribeMembers();
    return members.filter((m) => m.vetting_status === 'verified');
  },

  /** Get pending tribe members (awaiting vetting) */
  getPendingMembers: async (): Promise<TribeMember[]> => {
    const members = await tribeApi.getTribeMembers();
    return members.filter(
      (m) => m.vetting_status === 'pending' || m.vetting_status === 'invited' || m.vetting_status === 'assessing'
    );
  },

  /** Get high-trust tribe members (trust score >= 70) */
  getHighTrustMembers: async (): Promise<TribeMember[]> => {
    const members = await tribeApi.getTribeMembers();
    return members.filter(
      (m) => m.vetting_status === 'verified' && m.vetting_score != null && m.vetting_score >= 70
    );
  },

  /** Get inner circle members */
  getInnerCircle: async (): Promise<TribeMember[]> => {
    const members = await tribeApi.getTribeMembers();
    return members.filter((m) => m.relationship_tier === 'inner_circle');
  },
};
