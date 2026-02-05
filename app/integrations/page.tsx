'use client';

import React, { useState, useEffect } from 'react';
import { calendarApi, type CalendarProvider } from '@/services/calendarApi';
import { MdCalendarToday, MdCheckCircle, MdSync, MdDelete, MdWarning } from 'react-icons/md';
import { FaGoogle, FaMicrosoft, FaGithub } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function IntegrationsPage() {
  const [calendars, setCalendars] = useState<CalendarProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);

  useEffect(() => {
    loadCalendars();
  }, []);

  const loadCalendars = async () => {
    try {
      setLoading(true);
      const data = await calendarApi.getCalendars();
      setCalendars(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load calendars');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const redirectUri = `${window.location.origin}/integrations/callback`;
      const { auth_url } = await calendarApi.getGoogleAuthUrl(redirectUri);
      window.location.href = auth_url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect Google Calendar');
    }
  };

  const handleConnectOutlook = async () => {
    try {
      const redirectUri = `${window.location.origin}/integrations/callback`;
      const { auth_url } = await calendarApi.getOutlookAuthUrl(redirectUri);
      window.location.href = auth_url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect Outlook Calendar');
    }
  };

  const handleDisconnect = async (provider: 'google' | 'outlook') => {
    if (!confirm(`Disconnect ${provider === 'google' ? 'Google' : 'Outlook'} Calendar?`)) {
      return;
    }

    try {
      await calendarApi.disconnectCalendar(provider);
      toast.success('Calendar disconnected successfully');
      loadCalendars();
    } catch (error: any) {
      toast.error(error.message || 'Failed to disconnect calendar');
    }
  };

  const handleToggleSync = async (provider: 'google' | 'outlook', enabled: boolean) => {
    try {
      await calendarApi.toggleSync(provider, enabled);
      toast.success(enabled ? 'Sync enabled' : 'Sync disabled');
      loadCalendars();
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle sync');
    }
  };

  const handleSync = async (provider: 'google' | 'outlook') => {
    try {
      setSyncingProvider(provider);
      const result = await calendarApi.syncCalendar(provider);
      toast.success(`Synced ${result.synced_count} events`);
      loadCalendars();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sync calendar');
    } finally {
      setSyncingProvider(null);
    }
  };

  const googleCalendar = calendars.find((c) => c.provider === 'google');
  const outlookCalendar = calendars.find((c) => c.provider === 'outlook');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border-subtle bg-card-bg">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
            <p className="text-muted-foreground mt-1">
              Connect your tools to automatically sync commitments
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Calendars Section */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Calendar Sync
              </h2>
              <div className="space-y-4">
                {/* Google Calendar */}
                <IntegrationCard
                  icon={<FaGoogle size={32} />}
                  title="Google Calendar"
                  description="Sync your commitments with Google Calendar"
                  connected={googleCalendar?.connected || false}
                  syncEnabled={googleCalendar?.sync_enabled}
                  email={googleCalendar?.email}
                  lastSync={googleCalendar?.last_sync}
                  onConnect={handleConnectGoogle}
                  onDisconnect={() => handleDisconnect('google')}
                  onToggleSync={(enabled) => handleToggleSync('google', enabled)}
                  onSync={() => handleSync('google')}
                  syncing={syncingProvider === 'google'}
                  iconColor="text-red-500"
                />

                {/* Outlook Calendar */}
                <IntegrationCard
                  icon={<FaMicrosoft size={32} />}
                  title="Outlook Calendar"
                  description="Sync your commitments with Outlook Calendar"
                  connected={outlookCalendar?.connected || false}
                  syncEnabled={outlookCalendar?.sync_enabled}
                  email={outlookCalendar?.email}
                  lastSync={outlookCalendar?.last_sync}
                  onConnect={handleConnectOutlook}
                  onDisconnect={() => handleDisconnect('outlook')}
                  onToggleSync={(enabled) => handleToggleSync('outlook', enabled)}
                  onSync={() => handleSync('outlook')}
                  syncing={syncingProvider === 'outlook'}
                  iconColor="text-blue-500"
                />
              </div>
            </section>

            {/* GitHub Section */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Code Verification
              </h2>
              <div className="space-y-4">
                {/* GitHub */}
                <IntegrationCard
                  icon={<FaGithub size={32} />}
                  title="GitHub"
                  description="Verify code commitments with GitHub activity"
                  connected={false}
                  onConnect={() => toast.info('GitHub integration coming soon!')}
                  iconColor="text-gray-900 dark:text-white"
                  comingSoon
                />
              </div>
            </section>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3">
              <MdCalendarToday className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm">
                <p className="font-medium text-blue-500 mb-1">How Calendar Sync Works</p>
                <p className="text-muted-foreground">
                  When enabled, ZAVN automatically creates calendar events for your commitments
                  with reminders. Two-way sync keeps your calendar and commitments in sync.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// INTEGRATION CARD COMPONENT
// ============================================================================

interface IntegrationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  connected: boolean;
  syncEnabled?: boolean;
  email?: string;
  lastSync?: string;
  onConnect: () => void;
  onDisconnect?: () => void;
  onToggleSync?: (enabled: boolean) => void;
  onSync?: () => void;
  syncing?: boolean;
  iconColor?: string;
  comingSoon?: boolean;
}

function IntegrationCard({
  icon,
  title,
  description,
  connected,
  syncEnabled,
  email,
  lastSync,
  onConnect,
  onDisconnect,
  onToggleSync,
  onSync,
  syncing,
  iconColor = 'text-brand-primary',
  comingSoon,
}: IntegrationCardProps) {
  return (
    <div className="bg-card-bg border border-border-subtle rounded-lg p-6">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 ${iconColor}`}>{icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            
            {/* Status Badge */}
            {connected ? (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium whitespace-nowrap">
                <MdCheckCircle size={16} />
                Connected
              </span>
            ) : comingSoon ? (
              <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-medium whitespace-nowrap">
                Coming Soon
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-500/10 text-gray-500 rounded-full text-sm font-medium whitespace-nowrap">
                Not Connected
              </span>
            )}
          </div>

          {/* Connected Details */}
          {connected && email && (
            <div className="mt-3 text-sm text-muted-foreground">
              <p>Account: {email}</p>
              {lastSync && (
                <p className="mt-1">
                  Last synced: {new Date(lastSync).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Sync Toggle */}
          {connected && onToggleSync && (
            <div className="mt-4 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncEnabled}
                  onChange={(e) => onToggleSync(e.target.checked)}
                  className="w-5 h-5 rounded border-border-subtle"
                />
                <span className="text-sm font-medium text-foreground">
                  Enable automatic sync
                </span>
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            {!connected ? (
              <button
                onClick={onConnect}
                disabled={comingSoon}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Connect
              </button>
            ) : (
              <>
                {onSync && (
                  <button
                    onClick={onSync}
                    disabled={syncing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {syncing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Syncing...
                      </>
                    ) : (
                      <>
                        <MdSync size={18} />
                        Sync Now
                      </>
                    )}
                  </button>
                )}
                {onDisconnect && (
                  <button
                    onClick={onDisconnect}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <MdDelete size={18} />
                    Disconnect
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

