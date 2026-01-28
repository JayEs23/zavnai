/**
 * Notifications API service
 */
import { api } from '@/lib/api';

export interface NotificationLog {
    id: string;
    user_id: string;
    type: 'reminder' | 'alert' | 'digest';
    category: 'reflection' | 'commitment' | 'journal' | 'deadline';
    channel: 'email' | 'push' | 'whatsapp' | 'sms' | 'voice' | 'in_app';
    subject?: string;
    content: string;
    status: 'pending' | 'sent' | 'failed' | 'delivered';
    sent_at?: string;
    delivered_at?: string;
    error_message?: string;
    notification_metadata?: Record<string, any>;
    retry_count: number;
    commitment_id?: string;
    reflection_id?: string;
    reminder_id?: string;
    created_at: string;
}

export const notificationsApi = {
    getHistory: async (limit: number = 50, status?: string): Promise<NotificationLog[]> => {
        const params = new URLSearchParams();
        params.append('limit', String(limit));
        if (status) params.append('status', status);
        return api.get<NotificationLog[]>(`/api/notifications/history?${params.toString()}`);
    },

    getUnread: async (limit: number = 50): Promise<NotificationLog[]> => {
        const params = new URLSearchParams();
        params.append('limit', String(limit));
        return api.get<NotificationLog[]>(`/api/notifications/unread?${params.toString()}`);
    },

    markRead: async (id: string): Promise<void> => {
        return api.put<void>(`/api/notifications/${id}/read`, {});
    },

    delete: async (id: string): Promise<void> => {
        return api.delete<void>(`/api/notifications/${id}`);
    }
};

