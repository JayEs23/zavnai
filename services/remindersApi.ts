/**
 * Reminders API service
 */
import { api } from '@/lib/api';

export interface ReminderSchedule {
    id: string;
    user_id: string;
    reminder_type: 'reflection' | 'commitment_update' | 'journal' | 'deadline';
    frequency: 'daily' | 'weekly' | 'custom' | 'one_time';
    time?: string; // HH:MM format
    days_of_week?: number[]; // [0,1,2,3,4,5,6] for custom (0=Monday)
    next_reminder_at: string;
    channels: string[];
    message_template?: string;
    is_active: boolean;
    last_sent_at?: string;
    target_id?: string;
    created_at: string;
    updated_at: string;
}

export interface ReminderCreate {
    reminder_type: 'reflection' | 'commitment_update' | 'journal' | 'deadline';
    frequency: 'daily' | 'weekly' | 'custom' | 'one_time';
    channels: string[];
    time?: string;
    days_of_week?: number[];
    target_id?: string;
    message_template?: string;
}

export interface ReminderUpdate {
    frequency?: string;
    time?: string;
    days_of_week?: number[];
    channels?: string[];
    message_template?: string;
    is_active?: boolean;
}

export const remindersApi = {
    create: async (data: ReminderCreate): Promise<ReminderSchedule> => {
        return api.post<ReminderSchedule>('/api/reminders', data);
    },

    list: async (reminder_type?: string, is_active?: boolean): Promise<ReminderSchedule[]> => {
        const params = new URLSearchParams();
        if (reminder_type) params.append('reminder_type', reminder_type);
        if (is_active !== undefined) params.append('is_active', String(is_active));
        const query = params.toString();
        return api.get<ReminderSchedule[]>(`/api/reminders${query ? `?${query}` : ''}`);
    },

    get: async (id: string): Promise<ReminderSchedule> => {
        return api.get<ReminderSchedule>(`/api/reminders/${id}`);
    },

    update: async (id: string, data: ReminderUpdate): Promise<ReminderSchedule> => {
        return api.put<ReminderSchedule>(`/api/reminders/${id}`, data);
    },

    delete: async (id: string): Promise<void> => {
        return api.delete<void>(`/api/reminders/${id}`);
    }
};

