/**
 * Settings API service
 */
import { api } from '@/lib/api';

export interface UserSettings {
    id: string;
    user_id: string;
    notification_channels: Record<string, boolean>;
    notification_frequency: string;
    quiet_hours: { start: string; end: string } | null;
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
}

export interface SettingsUpdate {
    notification_channels?: Record<string, boolean>;
    notification_frequency?: string;
    quiet_hours?: { start: string; end: string } | null;
    theme?: string;
    language?: string;
    timezone?: string;
}

export const settingsApi = {
    get: async (): Promise<UserSettings> => {
        return api.get<UserSettings>('/api/settings/');
    },

    update: async (data: SettingsUpdate): Promise<UserSettings> => {
        return api.put<UserSettings>('/api/settings/', data);
    }
};
