/**
 * Profile API service
 */
import { api } from '@/lib/api';

export interface UserProfile {
    id: string;
    user_id: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    pronouns?: string;
    username?: string;
    notification_preference?: string;
    primary_goal?: string;
    goal_timeline?: string;
    availability_mins?: number;
    availability_days?: string;
    interaction_mode?: 'voice' | 'text';
    motivation?: string;
    communication_style?: string;
    time_commitment?: string;
    growth_areas?: string;
    preferences_json?: string;
    baseline_responses?: string;
    created_at: string;
    updated_at: string;
}

export interface ProfileUpdate {
    full_name?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    pronouns?: string;
    username?: string;
    notification_preference?: string;
    primary_goal?: string;
    goal_timeline?: string;
    availability_mins?: number;
    availability_days?: string;
    interaction_mode?: 'voice' | 'text';
    motivation?: string;
    communication_style?: string;
    time_commitment?: string;
    growth_areas?: string;
}

export const profileApi = {
    get: async (): Promise<UserProfile> => {
        return api.get<UserProfile>('/api/profile');
    },

    update: async (data: ProfileUpdate): Promise<UserProfile> => {
        return api.put<UserProfile>('/api/profile', data);
    }
};

