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
    list: async (): Promise<Integration[]> => {
        return api.get<Integration[]>('/api/integrations/');
    },

    connect: async (data: ConnectRequest): Promise<Integration> => {
        return api.post<Integration>('/api/integrations/connect', data);
    }
};
