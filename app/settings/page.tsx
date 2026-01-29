'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { settingsApi, UserSettings, ReminderPreferences, NotificationChannels } from '@/services/settingsApi';
import { remindersApi, ReminderSchedule } from '@/services/remindersApi';
import { integrationApi, Integration } from '@/services/integrationApi';
import { dashboardApi } from '@/services/dashboardApi';
import { MdNotifications, MdSchedule, MdLink, MdPerson, MdSave, MdAdd } from 'react-icons/md';

export default function SettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('notifications');
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [reminders, setReminders] = useState<ReminderSchedule[]>([]);
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsData, remindersData, integrationsData, dashboardData] = await Promise.all([
                    settingsApi.get(),
                    remindersApi.list(),
                    integrationApi.list(),
                    dashboardApi.getDashboard()
                ]);
                setSettings(settingsData);
                setReminders(remindersData);
                setIntegrations(integrationsData);
                setProfile(dashboardData);
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSaveSettings = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            const updated = await settingsApi.update(settings);
            setSettings(updated);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleChannel = (channel: keyof NotificationChannels) => {
        if (!settings) return;
        const updatedChannels = {
            ...settings.notification_channels,
            [channel]: !settings.notification_channels[channel]
        };
        setSettings({ ...settings, notification_channels: updatedChannels });
    };

    const handleUpdateReminderPreference = (type: keyof ReminderPreferences, updates: any) => {
        if (!settings) return;
        const updated = {
            ...settings.reminder_preferences,
            [type]: { ...settings.reminder_preferences?.[type], ...updates }
        };
        setSettings({ ...settings, reminder_preferences: updated });
    };

    if (loading) return <div className="min-h-screen bg-[var(--background)] p-10 flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
            <p className="text-[var(--muted-foreground)]">Loading settings...</p>
        </div>
    </div>;

    return (
        <div className="min-h-screen bg-[var(--background)] p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-[var(--muted-foreground)]">Manage your preferences and connections.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar / Tabs */}
                <nav className="w-full lg:w-64 space-y-2">
                    {[
                        { id: 'notifications', label: 'Notifications', icon: MdNotifications },
                        { id: 'reminders', label: 'Reminders', icon: MdSchedule },
                        { id: 'integrations', label: 'Integrations', icon: MdLink },
                        { id: 'profile', label: 'Profile', icon: MdPerson }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                                    activeTab === tab.id
                                        ? 'bg-[var(--primary)] text-white font-medium'
                                        : 'hover:bg-[var(--card-bg)] text-[var(--foreground)]'
                                }`}
                            >
                                <Icon size={20} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Content */}
                <main className="flex-1 bg-[var(--card-bg)] rounded-3xl p-8 border border-[var(--border-subtle)]">
                    {activeTab === 'notifications' && settings && (
                        <section className="space-y-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Notification Preferences</h2>
                                <button
                                    onClick={handleSaveSettings}
                                    disabled={saving}
                                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-80 transition flex items-center gap-2 disabled:opacity-50"
                                >
                                    <MdSave size={18} />
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Notification Channels</h3>
                                {(['email', 'push', 'in_app', 'whatsapp', 'sms', 'voice'] as const).map((channel) => (
                                    <div key={channel} className="flex items-center justify-between p-4 border rounded-xl border-[var(--border-subtle)]">
                                        <div>
                                            <h4 className="font-semibold capitalize">{channel.replace('_', ' ')}</h4>
                                            <p className="text-sm text-[var(--muted-foreground)]">
                                                {channel === 'email' && 'Receive updates via email'}
                                                {channel === 'push' && 'Get push notifications on your device'}
                                                {channel === 'in_app' && 'Receive alerts within Zavn'}
                                                {channel === 'whatsapp' && 'Get reminders via WhatsApp'}
                                                {channel === 'sms' && 'Receive SMS notifications'}
                                                {channel === 'voice' && 'Get voice call reminders'}
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={settings.notification_channels?.[channel] ?? false}
                                                onChange={() => handleToggleChannel(channel)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
                                <h3 className="font-semibold text-lg">Notification Frequency</h3>
                                <select
                                    value={settings.notification_frequency}
                                    onChange={(e) => setSettings({ ...settings, notification_frequency: e.target.value as any })}
                                    className="w-full p-3 border rounded-lg border-[var(--border-subtle)] bg-[var(--background)]"
                                >
                                    <option value="instant">Instant</option>
                                    <option value="daily_digest">Daily Digest</option>
                                    <option value="weekly_digest">Weekly Digest</option>
                                </select>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
                                <h3 className="font-semibold text-lg">Quiet Hours</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Start Time</label>
                                        <input
                                            type="time"
                                            value={settings.quiet_hours?.start || '22:00'}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                quiet_hours: { ...settings.quiet_hours, start: e.target.value, end: settings.quiet_hours?.end || '08:00' } as any
                                            })}
                                            className="w-full p-3 border rounded-lg border-[var(--border-subtle)] bg-[var(--background)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">End Time</label>
                                        <input
                                            type="time"
                                            value={settings.quiet_hours?.end || '08:00'}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                quiet_hours: { ...settings.quiet_hours, start: settings.quiet_hours?.start || '22:00', end: e.target.value } as any
                                            })}
                                            className="w-full p-3 border rounded-lg border-[var(--border-subtle)] bg-[var(--background)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'reminders' && settings && (
                        <section className="space-y-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Reminder Preferences</h2>
                                <button
                                    onClick={handleSaveSettings}
                                    disabled={saving}
                                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-80 transition flex items-center gap-2 disabled:opacity-50"
                                >
                                    <MdSave size={18} />
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Reflection Reminders */}
                                <div className="p-6 border rounded-xl border-[var(--border-subtle)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-lg">Reflection Reminders</h3>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={settings.reminder_preferences?.reflection?.enabled ?? true}
                                                onChange={(e) => handleUpdateReminderPreference('reflection', { enabled: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                                        </label>
                                    </div>
                                    {settings.reminder_preferences?.reflection?.enabled && (
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Frequency</label>
                                                <select
                                                    value={settings.reminder_preferences.reflection.frequency}
                                                    onChange={(e) => handleUpdateReminderPreference('reflection', { frequency: e.target.value })}
                                                    className="w-full p-3 border rounded-lg border-[var(--border-subtle)] bg-[var(--background)]"
                                                >
                                                    <option value="daily">Daily</option>
                                                    <option value="weekly">Weekly</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Time</label>
                                                <input
                                                    type="time"
                                                    value={settings.reminder_preferences.reflection.time || '20:00'}
                                                    onChange={(e) => handleUpdateReminderPreference('reflection', { time: e.target.value })}
                                                    className="w-full p-3 border rounded-lg border-[var(--border-subtle)] bg-[var(--background)]"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Commitment Update Reminders */}
                                <div className="p-6 border rounded-xl border-[var(--border-subtle)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-lg">Commitment Update Reminders</h3>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={settings.reminder_preferences?.commitment_update?.enabled ?? true}
                                                onChange={(e) => handleUpdateReminderPreference('commitment_update', { enabled: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                                        </label>
                                    </div>
                                    {settings.reminder_preferences?.commitment_update?.enabled && (
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Frequency</label>
                                                <select
                                                    value={settings.reminder_preferences.commitment_update.frequency}
                                                    onChange={(e) => handleUpdateReminderPreference('commitment_update', { frequency: e.target.value })}
                                                    className="w-full p-3 border rounded-lg border-[var(--border-subtle)] bg-[var(--background)]"
                                                >
                                                    <option value="daily">Daily</option>
                                                    <option value="weekly">Weekly</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Time</label>
                                                <input
                                                    type="time"
                                                    value={settings.reminder_preferences.commitment_update.time || '18:00'}
                                                    onChange={(e) => handleUpdateReminderPreference('commitment_update', { time: e.target.value })}
                                                    className="w-full p-3 border rounded-lg border-[var(--border-subtle)] bg-[var(--background)]"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Deadline Reminders */}
                                <div className="p-6 border rounded-xl border-[var(--border-subtle)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-lg">Deadline Reminders</h3>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={settings.reminder_preferences?.deadline_reminder?.enabled ?? true}
                                                onChange={(e) => handleUpdateReminderPreference('deadline_reminder', { enabled: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                                        </label>
                                    </div>
                                    {settings.reminder_preferences?.deadline_reminder?.enabled && (
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium mb-2">Remind me before deadline (hours)</label>
                                            <div className="flex gap-2">
                                                {[24, 12, 6, 2, 1].map((hours) => (
                                                    <label key={hours} className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.reminder_preferences?.deadline_reminder?.advance_hours?.includes(hours) ?? false}
                                                            onChange={(e) => {
                                                                const current = settings.reminder_preferences?.deadline_reminder?.advance_hours || [];
                                                                const updated = e.target.checked
                                                                    ? [...current, hours]
                                                                    : current.filter(h => h !== hours);
                                                                handleUpdateReminderPreference('deadline_reminder', { advance_hours: updated });
                                                            }}
                                                            className="rounded"
                                                        />
                                                        <span className="text-sm">{hours}h</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Active Reminders List */}
                            <div className="pt-6 border-t border-[var(--border-subtle)]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-lg">Active Reminders</h3>
                                    <button
                                        onClick={() => router.push('/settings/reminders/new')}
                                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-80 transition flex items-center gap-2"
                                    >
                                        <MdAdd size={18} />
                                        New Reminder
                                    </button>
                                </div>
                                {reminders.length > 0 ? (
                                    <div className="space-y-2">
                                        {reminders.map((reminder) => (
                                            <div key={reminder.id} className="p-4 border rounded-lg border-[var(--border-subtle)]">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold capitalize">{reminder.reminder_type.replace('_', ' ')}</p>
                                                        <p className="text-sm text-[var(--muted-foreground)]">
                                                            {reminder.frequency} at {reminder.time || 'default time'}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        reminder.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {reminder.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[var(--muted-foreground)] text-sm">No active reminders</p>
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === 'integrations' && (
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold">Connected Integrations</h2>
                            <div className="grid gap-4">
                                <div className="p-6 border rounded-xl border-[var(--border-subtle)] flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xl">GH</div>
                                        <div>
                                            <h3 className="font-bold">GitHub</h3>
                                            <p className="text-sm text-[var(--muted-foreground)]">Connect to verify coding goals.</p>
                                        </div>
                                    </div>
                                    {integrations.find(i => i.provider === 'github') ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Connected</span>
                                    ) : (
                                        <button
                                            onClick={async () => {
                                                const token = prompt("Enter GitHub Personal Access Token:");
                                                if (!token) return;
                                                try {
                                                    await integrationApi.connect({
                                                        provider: 'github',
                                                        auth_data: { access_token: token }
                                                    });
                                                    const updated = await integrationApi.list();
                                                    setIntegrations(updated);
                                                } catch (error) {
                                                    alert("Failed to connect GitHub");
                                                }
                                            }}
                                            className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:opacity-80 transition"
                                        >
                                            Connect
                                        </button>
                                    )}
                                </div>

                                <div className="p-6 border rounded-xl border-[var(--border-subtle)] flex items-center justify-between opacity-50">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-xl">Cal</div>
                                        <div>
                                            <h3 className="font-bold">Google Calendar</h3>
                                            <p className="text-sm text-[var(--muted-foreground)]">Coming soon.</p>
                                        </div>
                                    </div>
                                    <button disabled className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed">
                                        Connect
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'profile' && profile && (
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold">Profile Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.full_name || profile.first_name || ''}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        className="w-full p-3 border rounded-lg border-[var(--border-subtle)] bg-[var(--background)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={profile.username || ''}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                        className="w-full p-3 border rounded-lg border-[var(--border-subtle)] bg-[var(--background)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Pronouns</label>
                                    <input
                                        type="text"
                                        value={profile.pronouns || ''}
                                        onChange={(e) => setProfile({ ...profile, pronouns: e.target.value })}
                                        placeholder="e.g., they/them, she/her, he/him"
                                        className="w-full p-3 border rounded-lg border-[var(--border-subtle)] bg-[var(--background)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Primary Goal</label>
                                    <textarea
                                        value={profile.primary_goal || ''}
                                        onChange={(e) => setProfile({ ...profile, primary_goal: e.target.value })}
                                        rows={4}
                                        className="w-full p-3 border rounded-lg border-[var(--border-subtle)] bg-[var(--background)]"
                                    />
                                </div>
                                <button
                                    onClick={async () => {
                                        try {
                                            const { profileApi } = await import('@/services/profileApi');
                                            await profileApi.update({
                                                full_name: profile.full_name,
                                                username: profile.username,
                                                pronouns: profile.pronouns,
                                                primary_goal: profile.primary_goal
                                            });
                                            alert('Profile updated successfully!');
                                        } catch (error) {
                                            console.error('Failed to update profile:', error);
                                            alert('Failed to update profile');
                                        }
                                    }}
                                    className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-80 transition"
                                >
                                    Save Profile
                                </button>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
