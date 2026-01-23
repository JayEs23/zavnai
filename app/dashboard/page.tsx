'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardApi, DashboardData } from '@/services/dashboardApi';
import {
  MdGpsFixed,
  MdAnalytics,
  MdUpcoming,
  MdGroups,
  MdPsychology,
  MdDataset,
  MdCheckCircle,
  MdTrendingUp,
  MdSchedule,
  MdPerson,
  MdArrowForward,
  MdRefresh,
} from 'react-icons/md';

export default function DashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardApi.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-red-400">{error || 'Failed to load dashboard'}</p>
          <button
            onClick={loadDashboard}
            className="bg-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto"
          >
            <MdRefresh /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const displayName = dashboardData.first_name || dashboardData.full_name || 'there';
  const greeting = `Welcome back, ${displayName}`;

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">{greeting}</h1>
          <p className="text-slate-400">
            {dashboardData.pronouns && `(${dashboardData.pronouns}) `}
            Here's your alignment overview
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Thrive Score */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <MdAnalytics className="text-primary text-2xl" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Thrive Score</p>
                  <p className="text-3xl font-black text-primary">{dashboardData.thrive_score}</p>
                </div>
              </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${dashboardData.thrive_score}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Your alignment readiness</p>
          </div>

          {/* Primary Goal */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <MdGpsFixed className="text-primary text-2xl" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Primary Intention</p>
                <p className="text-lg font-bold line-clamp-2">
                  {dashboardData.primary_goal || dashboardData.goal_progress?.goal || 'No goal set'}
                </p>
                {dashboardData.goal_progress?.days_remaining !== undefined && (
                  <p className="text-xs text-slate-500 mt-2">
                    {dashboardData.goal_progress.days_remaining > 0
                      ? `${dashboardData.goal_progress.days_remaining} days remaining`
                      : 'Target date reached'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Next Session */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <MdUpcoming className="text-primary text-2xl" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Next Session</p>
                {dashboardData.next_session ? (
                  <>
                    <p className="text-lg font-bold">
                      {dashboardData.next_session.date}, {dashboardData.next_session.time}
                    </p>
                    {dashboardData.next_session.day && (
                      <p className="text-xs text-slate-500 mt-1">{dashboardData.next_session.day}</p>
                    )}
                  </>
                ) : (
                  <p className="text-slate-400">No session scheduled</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Capacity Insights */}
          {dashboardData.capacity_insights && (
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MdSchedule className="text-primary text-2xl" />
                <h2 className="text-xl font-bold">Capacity Insights</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">High Capacity</p>
                    <p className="text-2xl font-bold text-primary">
                      {dashboardData.capacity_insights.high_capacity_slots}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Moderate</p>
                    <p className="text-2xl font-bold text-slate-400">
                      {dashboardData.capacity_insights.moderate_capacity_slots}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Restricted</p>
                    <p className="text-2xl font-bold text-slate-500">
                      {dashboardData.capacity_insights.restricted_capacity_slots}
                    </p>
                  </div>
                </div>
                {dashboardData.capacity_insights.peak_days.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Peak Days</p>
                    <div className="flex gap-2 flex-wrap">
                      {dashboardData.capacity_insights.peak_days.map((day) => (
                        <span
                          key={day}
                          className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {dashboardData.capacity_insights.peak_times.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Peak Times</p>
                    <div className="flex gap-2 flex-wrap">
                      {dashboardData.capacity_insights.peak_times.map((time) => (
                        <span
                          key={time}
                          className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-bold"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pattern Insights */}
          {dashboardData.pattern_insights && (
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MdTrendingUp className="text-primary text-2xl" />
                <h2 className="text-xl font-bold">Pattern Awareness</h2>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-slate-400">
                  You've identified {dashboardData.pattern_insights.selected_patterns.length} pattern
                  {dashboardData.pattern_insights.selected_patterns.length !== 1 ? 's' : ''}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {dashboardData.pattern_insights.selected_patterns.map((patternId) => {
                    const label =
                      dashboardData.pattern_insights?.pattern_labels[patternId] || patternId;
                    return (
                      <span
                        key={patternId}
                        className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-semibold"
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-500 italic mt-3">
                  Awareness is the first step to transformation
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tribe Members */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MdGroups className="text-primary text-2xl" />
              <h2 className="text-xl font-bold">Your Tribe</h2>
            </div>
            {dashboardData.tribe_members.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.tribe_members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <MdPerson className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.relationship}</p>
                      </div>
                    </div>
                    <MdCheckCircle className="text-primary" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No tribe members added yet</p>
            )}
          </div>

          {/* Verification Methods */}
          {dashboardData.verification_status && (
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MdCheckCircle className="text-primary text-2xl" />
                <h2 className="text-xl font-bold">Verification Methods</h2>
              </div>
              <div className="space-y-3">
                {dashboardData.verification_status.methods.map((methodId) => {
                  const label =
                    dashboardData.verification_status?.method_labels[methodId] || methodId;
                  const icon =
                    methodId === 'echo' ? (
                      <MdPsychology className="text-primary" />
                    ) : methodId === 'data' ? (
                      <MdDataset className="text-primary" />
                    ) : (
                      <MdGroups className="text-primary" />
                    );
                  return (
                    <div
                      key={methodId}
                      className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg"
                    >
                      {icon}
                      <p className="font-semibold flex-1">{label}</p>
                      <MdCheckCircle className="text-primary" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => router.push('/onboarding')}
            className="px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl font-semibold hover:bg-slate-700 transition-colors"
          >
            Edit Profile
          </button>
          <button
            className="px-6 py-3 bg-primary rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            Start Session <MdArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
}

