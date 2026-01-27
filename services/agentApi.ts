/**
 * Agents API service
 * Connects to the backend micro-agents (Echo, Doyn, etc.)
 */

import { api } from '@/lib/api';

export interface ReflectionRequest {
    content: string;
    mood?: string;
    energy_level?: number;
}

export interface ReflectionResponse {
    reflection: {
        id: string;
        content: string;
        created_at: string;
    };
    ai_reflection: {
        id: string;
        reflection: string;
        confidence_score: number;
    };
    questions: Array<{
        id: string;
        question_text: string;
        focus?: string;
    }>;
    insights_created: number;
}

export const agentApi = {
    /**
     * Submit a reflection to the Echo agent
     */
    reflect: async (data: ReflectionRequest): Promise<ReflectionResponse> => {
        return api.post<ReflectionResponse>('/api/agents/echo/reflect', data);
    },

    /**
     * Check if an agent can proceed (Gate Check)
     */
    checkGate: async (agentType: string, junctionType?: string): Promise<{ can_proceed: boolean }> => {
        const params = new URLSearchParams({ agent_type: agentType });
        if (junctionType) params.append('junction_type', junctionType);

        return api.get<{ can_proceed: boolean }>(`/api/agents/junctions/check?${params.toString()}`);
    }
};
