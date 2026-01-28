/**
 * Settings API service - Updated with new preference fields
 */
import { api } from '@/lib/api';

export interface NotificationChannels {
    email?: boolean;
    push?: boolean;
    in_app?: boolean;
    whatsapp?: boolean;
    sms?: boolean;
    voice?: boolean;
}

export interface ChannelConfig {
    email?: { address?: string };
    whatsapp?: { number?: string };
    sms?: { number?: string };
    voice?: { number?: string; preferred_time?: string };
}

export interface ReminderPreference {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'custom';
    time?: string; // HH:MM format
    channels: string[];
}

export interface ReminderPreferences {
    reflection?: ReminderPreference;
    commitment_update?: ReminderPreference;
    journal?: ReminderPreference;
    deadline_reminder?: {
        enabled: boolean;
        advance_hours: number[];
        channels: string[];
    };
}

export interface IntegrationPreferences {
    calendar?: {
        enabled: boolean;
        provider?: 'google' | 'outlook' | 'ical' | null;
        sync_commitments?: boolean;
        sync_reflections?: boolean;
    };
    github?: {
        enabled: boolean;
        username?: string | null;
        auto_verify_commits?: boolean;
    };
}

export interface UserSettings {
    id: string;
    user_id: string;
    notification_channels: NotificationChannels;
    notification_frequency: 'instant' | 'daily_digest' | 'weekly_digest';
    channel_config?: ChannelConfig;
    reminder_preferences?: ReminderPreferences;
    integration_preferences?: IntegrationPreferences;
    quiet_hours: { start: string; end: string } | null;
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    created_at: string;
    updated_at: string;
}

export interface SettingsUpdate {
    notification_channels?: NotificationChannels;
    notification_frequency?: string;
    channel_config?: ChannelConfig;
    reminder_preferences?: ReminderPreferences;
    integration_preferences?: IntegrationPreferences;
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
