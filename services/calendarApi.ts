/**
 * Calendar API Service
 * 
 * Handles calendar integration for Google Calendar and Outlook
 * Syncs commitments as calendar events
 */

import { api } from '@/lib/api';

// ============================================================================
// TYPES
// ============================================================================

export interface CalendarProvider {
  provider: 'google' | 'outlook';
  connected: boolean;
  email?: string;
  calendar_id?: string;
  last_sync?: string;
  sync_enabled: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string; // ISO datetime
  end_time: string;
  location?: string;
  reminder_minutes?: number;
  commitment_id?: string;
  goal_id?: string;
  calendar_provider?: 'google' | 'outlook';
  external_id?: string; // ID in Google/Outlook calendar
}

export interface CalendarSyncStatus {
  last_sync: string;
  synced_count: number;
  pending_count: number;
  errors: string[];
}

export interface CalendarAuthUrl {
  auth_url: string;
  state: string;
}

// ============================================================================
// API METHODS
// ============================================================================

export const calendarApi = {
  /**
   * Get user's connected calendars
   */
  getCalendars: async (): Promise<CalendarProvider[]> => {
    return api.get<CalendarProvider[]>('/integrations/calendars');
  },

  /**
   * Get OAuth authorization URL for Google Calendar
   */
  getGoogleAuthUrl: async (redirectUri: string): Promise<CalendarAuthUrl> => {
    return api.post<CalendarAuthUrl>('/integrations/google-calendar/auth', {
      redirect_uri: redirectUri,
    });
  },

  /**
   * Get OAuth authorization URL for Outlook Calendar
   */
  getOutlookAuthUrl: async (redirectUri: string): Promise<CalendarAuthUrl> => {
    return api.post<CalendarAuthUrl>('/integrations/outlook-calendar/auth', {
      redirect_uri: redirectUri,
    });
  },

  /**
   * Complete OAuth flow and save tokens
   */
  connectGoogleCalendar: async (
    code: string,
    state: string
  ): Promise<CalendarProvider> => {
    return api.post<CalendarProvider>('/integrations/google-calendar/callback', {
      code,
      state,
    });
  },

  /**
   * Complete Outlook OAuth flow
   */
  connectOutlookCalendar: async (
    code: string,
    state: string
  ): Promise<CalendarProvider> => {
    return api.post<CalendarProvider>('/integrations/outlook-calendar/callback', {
      code,
      state,
    });
  },

  /**
   * Disconnect a calendar
   */
  disconnectCalendar: async (
    provider: 'google' | 'outlook'
  ): Promise<{ success: boolean }> => {
    return api.delete<{ success: boolean }>(
      `/integrations/calendars/${provider}`
    );
  },

  /**
   * Enable/disable calendar sync
   */
  toggleSync: async (
    provider: 'google' | 'outlook',
    enabled: boolean
  ): Promise<CalendarProvider> => {
    return api.patch<CalendarProvider>(`/integrations/calendars/${provider}`, {
      sync_enabled: enabled,
    });
  },

  /**
   * Get calendar events for user
   */
  getEvents: async (
    startDate?: string,
    endDate?: string
  ): Promise<CalendarEvent[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return api.get<CalendarEvent[]>(`/integrations/calendar-events?${params}`);
  },

  /**
   * Manually trigger calendar sync
   */
  syncCalendar: async (
    provider: 'google' | 'outlook'
  ): Promise<CalendarSyncStatus> => {
    return api.post<CalendarSyncStatus>(
      `/integrations/calendars/${provider}/sync`,
      {}
    );
  },

  /**
   * Create calendar event from commitment
   */
  createEventFromCommitment: async (
    commitmentId: string,
    provider: 'google' | 'outlook'
  ): Promise<CalendarEvent> => {
    return api.post<CalendarEvent>('/integrations/calendar-events', {
      commitment_id: commitmentId,
      provider,
    });
  },

  /**
   * Delete calendar event
   */
  deleteEvent: async (eventId: string): Promise<{ success: boolean }> => {
    return api.delete<{ success: boolean }>(
      `/integrations/calendar-events/${eventId}`
    );
  },

  /**
   * Get sync status for all calendars
   */
  getSyncStatus: async (): Promise<CalendarSyncStatus> => {
    return api.get<CalendarSyncStatus>('/integrations/calendars/sync-status');
  },
};

