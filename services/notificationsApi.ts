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
    async getHistory(limit: number = 50, status?: string): Promise<NotificationLog[]> {
        const params = new URLSearchParams();
        params.append('limit', String(limit));
        if (status) params.append('status', status);
        const res = await api.get<NotificationLog[]>(`/api/notifications/history?${params.toString()}`);
        if (res.error) throw new Error(res.error.message || 'Failed to get notification history');
        return res.data || [];
    },

    async getUnread(limit: number = 50): Promise<NotificationLog[]> {
        const params = new URLSearchParams();
        params.append('limit', String(limit));
        const res = await api.get<NotificationLog[]>(`/api/notifications/unread?${params.toString()}`);
        if (res.error) throw new Error(res.error.message || 'Failed to get unread notifications');
        return res.data || [];
    },

    async markRead(id: string): Promise<void> {
        const res = await api.put<void>(`/api/notifications/${id}/read`, {});
        if (res.error) throw new Error(res.error.message || 'Failed to mark notification as read');
        // void methods don't return data
    },

    async delete(id: string): Promise<void> {
        const res = await api.delete<void>(`/api/notifications/${id}`);
        if (res.error) throw new Error(res.error.message || 'Failed to delete notification');
        // void methods don't return data
    }
};

