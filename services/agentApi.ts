/**
 * Agents API service
 * Connects to the backend micro-agents (Echo, Doyn, etc.)
 */

import { api } from '@/lib/api';

export interface ReflectionRequest {
    /** User reflection text (mapped to Echo `message`). */
    content: string;
    mood?: string;
    energy_level?: number;
    thread_id?: string;
}

/** Echo text chat response shape (`POST /api/echo/chat`, mode reflection). */
export interface EchoChatAgentResponse {
    response: string;
    timestamp: string;
    thread_id: string;
}

export interface GoalRefinementRequest {
    goal: string;
    successCriteria?: string;
    targetDate?: string;
}

export interface GoalRefinementResponse {
    refined_goal: string;
    refined_success_criteria?: string;
    explanation?: string;
}

export const agentApi = {
    /**
     * Text reflection turn with Echo (`mode=reflection`). Prefer `coreLoopApi` for commitment outcomes.
     */
    async reflect(data: ReflectionRequest): Promise<EchoChatAgentResponse> {
        const res = await api.post<EchoChatAgentResponse>('/api/echo/chat', {
            message: data.content,
            mode: 'reflection',
            history: [],
            user_name: '',
            thread_id: data.thread_id,
        });
        if (res.error) throw new Error(res.error.message || 'Failed to submit reflection');
        return res.data!;
    },

    /**
     * Refine a goal using Doyn's goal architecture approach
     * Turns vague intentions into SMART goals
     * Uses the backend Python SDK which works reliably with Gemini
     */
    async refineGoal(data: GoalRefinementRequest): Promise<GoalRefinementResponse> {
        const res = await api.post<GoalRefinementResponse>('/api/agents/doyn/refine-goal', {
            goal: data.goal,
            success_criteria: data.successCriteria,
            target_date: data.targetDate,
        });
        if (res.error) throw new Error(res.error.message || 'Failed to refine goal');
        return res.data!;
    },

    /**
     * Check if an agent can proceed (Gate Check)
     */
    async checkGate(agentType: string, junctionType?: string): Promise<{ can_proceed: boolean }> {
        const params = new URLSearchParams({ agent_type: agentType });
        if (junctionType) params.append('junction_type', junctionType);
        const res = await api.get<{ can_proceed: boolean }>(`/api/agents/junctions/check?${params.toString()}`);
        if (res.error) throw new Error(res.error.message || 'Failed to check gate');
        return res.data!;
    }
};
