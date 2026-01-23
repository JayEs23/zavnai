/**
 * Dashboard API service
 */

import { api } from '@/lib/api';

export interface TribeMember {
  name: string;
  relationship: string;
  contact: string;
}

export interface CapacityInsight {
  high_capacity_slots: number;
  moderate_capacity_slots: number;
  restricted_capacity_slots: number;
  peak_days: string[];
  peak_times: string[];
}

export interface PatternInsight {
  selected_patterns: string[];
  pattern_labels: Record<string, string>;
  category: string;
}

export interface VerificationStatus {
  methods: string[];
  method_labels: Record<string, string>;
}

export interface GoalProgress {
  goal: string;
  success_criteria?: string;
  target_date?: string;
  days_remaining?: number;
  progress_percentage?: number;
}

export interface DashboardData {
  full_name?: string;
  first_name?: string;
  username?: string;
  pronouns?: string;
  primary_goal?: string;
  goal_progress?: GoalProgress;
  thrive_score: number;
  capacity_insights?: CapacityInsight;
  pattern_insights?: PatternInsight;
  verification_status?: VerificationStatus;
  tribe_members: TribeMember[];
  next_session?: {
    date: string;
    time: string;
    day?: string;
  };
  onboarding_completed_at?: string;
  last_active?: string;
}

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardData> => {
    return api.get<DashboardData>('/api/dashboard');
  },
};

