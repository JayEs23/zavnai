/**
 * Integration API service
 */
import { api } from '@/lib/api';

export interface Integration {
    id: string;
    provider: string;
    status: 'active' | 'inactive' | 'error';
    external_username?: string;
    created_at: string;
}

export interface ConnectRequest {
    provider: string;
    auth_data: Record<string, any>;
}

export const integrationApi = {
    async list(): Promise<Integration[]> {
        const res = await api.get<Integration[]>('/api/integrations/');
        if (res.error) throw new Error(res.error.message || 'Failed to list integrations');
        return res.data || [];
    },

    async connect(data: ConnectRequest): Promise<Integration> {
        const res = await api.post<Integration>('/api/integrations/connect', data);
        if (res.error) throw new Error(res.error.message || 'Failed to connect integration');
        return res.data!;
    }
};
