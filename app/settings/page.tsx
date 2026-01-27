'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { settingsApi, UserSettings } from '@/services/settingsApi';
import { integrationApi, Integration } from '@/services/integrationApi';
// import { Sidebar } from '@/components/dashboard/Sidebar'; // Assuming a sidebar exists or layout handles it

export default function SettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('notifications');
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsData, integrationsData] = await Promise.all([
                    settingsApi.get(),
                    integrationApi.list()
                ]);
                setSettings(settingsData);
                setIntegrations(integrationsData);
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleToggleNotification = async (channel: string) => {
        if (!settings) return;
        const updatedChannels = { ...settings.notification_channels, [channel]: !settings.notification_channels[channel] };
        try {
            const updated = await settingsApi.update({ notification_channels: updatedChannels });
            setSettings(updated);
        } catch (error) {
            console.error('Failed to update notification settings:', error);
        }
    };

    const handleConnectGitHub = async () => {
        // Stub for GitHub connection
        const token = prompt("Enter generic GitHub Personal Access Token (Stub):");
        if (!token) return;
        try {
            await integrationApi.connect({
                provider: 'github',
                auth_data: { access_token: token, username: 'demo-user' }
            });
            // Refresh list
            const updated = await integrationApi.list();
            setIntegrations(updated);
        } catch (error) {
            alert("Failed to connect GitHub");
        }
    };

    if (loading) return <div className="p-10">Loading settings...</div>;

    return (
        <div className="min-h-screen bg-[var(--background)] p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-[var(--muted-foreground)]">Manage your preferences and connections.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar / Tabs */}
                <nav className="w-full lg:w-64 space-y-2">
                    {['notifications', 'integrations', 'account'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-4 py-3 rounded-lg capitalize ${activeTab === tab
                                    ? 'bg-[var(--primary)] text-white font-medium'
                                    : 'hover:bg-[var(--card-bg)] text-[var(--foreground)]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <main className="flex-1 bg-[var(--card-bg)] rounded-3xl p-8 border border-[var(--border-subtle)]">
                    {activeTab === 'notifications' && settings && (
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold">Notification Preferences</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-xl border-[var(--border-subtle)]">
                                    <div>
                                        <h3 className="font-semibold">Email Notifications</h3>
                                        <p className="text-sm text-[var(--muted-foreground)]">Receive updates via email.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={settings.notification_channels?.email ?? true}
                                            onChange={() => handleToggleNotification('email')}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-xl border-[var(--border-subtle)]">
                                    <div>
                                        <h3 className="font-semibold">In-App Notifications</h3>
                                        <p className="text-sm text-[var(--muted-foreground)]">Receive alerts within Zavn.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={settings.notification_channels?.in_app ?? true}
                                            onChange={() => handleToggleNotification('in_app')}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                                    </label>
                                </div>
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
                                            onClick={handleConnectGitHub}
                                            className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:opacity-80 transition"
                                        >
                                            Connect
                                        </button>
                                    )}
                                </div>

                                {/* Placeholder for Calendar */}
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

                    {activeTab === 'account' && (
                        <div className="text-center py-20 text-[var(--muted-foreground)]">
                            <p>Profile settings are managed in your Account page.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
