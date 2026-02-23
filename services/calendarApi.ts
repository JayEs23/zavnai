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
  start_time: string;
  end_time: string;
  location?: string;
  reminder_minutes?: number;
  commitment_id?: string;
  goal_id?: string;
  calendar_provider?: 'google' | 'outlook';
  external_id?: string;
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
// API METHODS — all paths hit /api/integrations (backend prefix)
// ============================================================================

export const calendarApi = {
  /** Get user's connected calendars */
  async getCalendars(): Promise<CalendarProvider[]> {
    const res = await api.get<CalendarProvider[]>('/api/integrations/calendars');
    if (res.error) throw new Error(res.error.message || 'Failed to get calendars');
    return res.data || [];
  },

  /** Get OAuth authorization URL for Google Calendar */
  async getGoogleAuthUrl(redirectUri: string): Promise<CalendarAuthUrl> {
    const res = await api.post<CalendarAuthUrl>('/api/integrations/google-calendar/auth', {
      redirect_uri: redirectUri,
    });
    if (res.error) throw new Error(res.error.message || 'Failed to get Google auth URL');
    return res.data!;
  },

  /** Get OAuth authorization URL for Outlook Calendar */
  async getOutlookAuthUrl(redirectUri: string): Promise<CalendarAuthUrl> {
    const res = await api.post<CalendarAuthUrl>('/api/integrations/outlook-calendar/auth', {
      redirect_uri: redirectUri,
    });
    if (res.error) throw new Error(res.error.message || 'Failed to get Outlook auth URL');
    return res.data!;
  },

  /** Complete OAuth flow and save tokens (Google) */
  async connectGoogleCalendar(
    code: string,
    state: string
  ): Promise<CalendarProvider> {
    const res = await api.post<CalendarProvider>('/api/integrations/google-calendar/callback', {
      code,
      state,
    });
    if (res.error) throw new Error(res.error.message || 'Failed to connect Google Calendar');
    return res.data!;
  },

  /** Complete Outlook OAuth flow */
  async connectOutlookCalendar(
    code: string,
    state: string
  ): Promise<CalendarProvider> {
    const res = await api.post<CalendarProvider>('/api/integrations/outlook-calendar/callback', {
      code,
      state,
    });
    if (res.error) throw new Error(res.error.message || 'Failed to connect Outlook Calendar');
    return res.data!;
  },

  /** Disconnect a calendar */
  async disconnectCalendar(
    provider: 'google' | 'outlook'
  ): Promise<{ success: boolean }> {
    const res = await api.delete<{ success: boolean }>(
      `/api/integrations/calendars/${provider}`
    );
    if (res.error) throw new Error(res.error.message || 'Failed to disconnect calendar');
    return res.data!;
  },

  /** Enable/disable calendar sync */
  async toggleSync(
    provider: 'google' | 'outlook',
    enabled: boolean
  ): Promise<CalendarProvider> {
    const res = await api.patch<CalendarProvider>(`/api/integrations/calendars/${provider}`, {
      sync_enabled: enabled,
    });
    if (res.error) throw new Error(res.error.message || 'Failed to toggle sync');
    return res.data!;
  },

  /** Get calendar events for user */
  async getEvents(
    startDate?: string,
    endDate?: string
  ): Promise<CalendarEvent[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const res = await api.get<CalendarEvent[]>(`/api/integrations/calendar-events?${params}`);
    if (res.error) throw new Error(res.error.message || 'Failed to get calendar events');
    return res.data || [];
  },

  /** Manually trigger calendar sync */
  async syncCalendar(
    provider: 'google' | 'outlook'
  ): Promise<CalendarSyncStatus> {
    const res = await api.post<CalendarSyncStatus>(
      `/api/integrations/calendars/${provider}/sync`,
      {}
    );
    if (res.error) throw new Error(res.error.message || 'Failed to sync calendar');
    return res.data!;
  },

  /** Create calendar event from commitment */
  async createEventFromCommitment(
    commitmentId: string,
    provider: 'google' | 'outlook'
  ): Promise<CalendarEvent> {
    const res = await api.post<CalendarEvent>('/api/integrations/calendar-events', {
      commitment_id: commitmentId,
      provider,
    });
    if (res.error) throw new Error(res.error.message || 'Failed to create calendar event');
    return res.data!;
  },

  /** Delete calendar event */
  async deleteEvent(eventId: string): Promise<{ success: boolean }> {
    const res = await api.delete<{ success: boolean }>(
      `/api/integrations/calendar-events/${eventId}`
    );
    if (res.error) throw new Error(res.error.message || 'Failed to delete calendar event');
    return res.data!;
  },

  /** Get sync status for all calendars */
  async getSyncStatus(): Promise<CalendarSyncStatus> {
    const res = await api.get<CalendarSyncStatus>('/api/integrations/calendars/sync-status');
    if (res.error) throw new Error(res.error.message || 'Failed to get sync status');
    return res.data!;
  },
};
