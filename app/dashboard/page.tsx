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
      <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-background-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Architecting Dashboard...</p>
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
    <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-background-dark text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row items-baseline justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">{greeting}</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
              {dashboardData.pronouns && `(${dashboardData.pronouns}) `}
              Here&apos;s your daily alignment pulse.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadDashboard} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400">
              <MdRefresh size={24} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Thrive Score */}
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm transition-all hover:bg-white dark:hover:bg-white/10 group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary transition-colors">
                  <MdAnalytics className="text-primary text-3xl group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">Thrive Potential</p>
                  <p className="text-4xl font-black text-primary">{dashboardData.thrive_score}</p>
                </div>
              </div>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${dashboardData.thrive_score}%` }}
              />
            </div>
            <p className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-widest">Alignment Readiness</p>
          </div>

          {/* Primary Goal */}
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm transition-all hover:bg-white dark:hover:bg-white/10 group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary transition-colors">
                <MdGpsFixed className="text-primary text-3xl group-hover:text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">Active Goal</p>
                <p className="text-xl font-extrabold leading-tight line-clamp-2">
                  {dashboardData.primary_goal || dashboardData.goal_progress?.goal || 'No goal set'}
                </p>
                {dashboardData.goal_progress?.days_remaining !== undefined && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mt-2">
                    {dashboardData.goal_progress.days_remaining > 0
                      ? `${dashboardData.goal_progress.days_remaining} Days Left`
                      : 'Completed'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Next Session */}
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm transition-all hover:bg-white dark:hover:bg-white/10 group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary transition-colors">
                <MdUpcoming className="text-primary text-3xl group-hover:text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">Upcoming Sync</p>
                {dashboardData.next_session ? (
                  <>
                    <p className="text-xl font-extrabold">
                      {dashboardData.next_session.date}
                    </p>
                    <p className="text-lg font-bold text-primary">{dashboardData.next_session.time}</p>
                  </>
                ) : (
                  <p className="text-slate-400">No session scheduled</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Capacity Insights */}
          {dashboardData.capacity_insights && (
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MdSchedule size={24} />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">Capacity Insights</h2>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peak</p>
                    <p className="text-3xl font-black text-primary">
                      {dashboardData.capacity_insights.high_capacity_slots}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mid</p>
                    <p className="text-3xl font-black text-slate-400 dark:text-white/40">
                      {dashboardData.capacity_insights.moderate_capacity_slots}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rest</p>
                    <p className="text-3xl font-black text-slate-300 dark:text-white/20">
                      {dashboardData.capacity_insights.restricted_capacity_slots}
                    </p>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-6">
                  {dashboardData.capacity_insights.peak_days.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Peak Days</p>
                      <div className="flex gap-2 flex-wrap">
                        {dashboardData.capacity_insights.peak_days.slice(0, 3).map((day) => (
                          <span
                            key={day}
                            className="px-3 py-1 bg-white dark:bg-white/10 border border-slate-100 dark:border-white/10 rounded-lg text-xs font-bold"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {dashboardData.capacity_insights.peak_times.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Peak Times</p>
                      <div className="flex gap-2 flex-wrap">
                        {dashboardData.capacity_insights.peak_times.slice(0, 2).map((time) => (
                          <span
                            key={time}
                            className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pattern Insights */}
          {dashboardData.pattern_insights && (
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MdTrendingUp size={24} />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">Pattern Awareness</h2>
              </div>
              <div className="space-y-6">
                <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
                  {dashboardData.pattern_insights.selected_patterns.length} Active behavioral patterns identified:
                </p>
                <div className="flex flex-wrap gap-3">
                  {dashboardData.pattern_insights.selected_patterns.map((patternId) => {
                    const label =
                      dashboardData.pattern_insights?.pattern_labels[patternId] || patternId;
                    return (
                      <span
                        key={patternId}
                        className="px-5 py-2.5 bg-white dark:bg-white/10 border border-slate-100 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-2xl text-sm font-bold shadow-sm"
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-6 p-6 bg-primary/5 rounded-[2rem] border border-primary/10 italic text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  &quot;Awareness is the only bridge between a habit and a choice.&quot;
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Tribe Members */}
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MdGroups size={24} />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Your Tribe</h2>
            </div>
            {dashboardData.tribe_members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dashboardData.tribe_members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center">
                        <MdPerson size={24} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold dark:text-white">{member.name}</p>
                        <p className="text-xs font-black uppercase tracking-widest text-primary">{member.relationship}</p>
                      </div>
                    </div>
                    <MdCheckCircle className="text-primary text-xl opacity-20" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No tribe members added yet</p>
            )}
          </div>

          {/* Verification Methods */}
          {dashboardData.verification_status && (
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MdCheckCircle size={24} />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">Verification</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dashboardData.verification_status.methods.map((methodId) => {
                  const label =
                    dashboardData.verification_status?.method_labels[methodId] || methodId;
                  const icon =
                    methodId === 'echo' ? (
                      <MdPsychology className="text-primary text-2xl" />
                    ) : methodId === 'data' ? (
                      <MdDataset className="text-primary text-2xl" />
                    ) : (
                      <MdGroups className="text-primary text-2xl" />
                    );
                  return (
                    <div
                      key={methodId}
                      className="flex items-center gap-4 p-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl shadow-sm"
                    >
                      <div className="size-12 rounded-xl bg-primary/5 flex items-center justify-center">{icon}</div>
                      <p className="font-bold flex-1 dark:text-white">{label}</p>
                      <MdCheckCircle className="text-emerald-500" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-6 pt-12 border-t border-slate-100 dark:border-white/5">
          <button
            onClick={() => router.push('/onboarding')}
            className="px-10 py-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.5rem] font-bold text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-[0.98] shadow-sm"
          >
            Adjust Baselines
          </button>
          <button
            onClick={() => router.push('/echo')}
            className="px-12 py-5 bg-slate-900 dark:bg-primary rounded-[1.5rem] font-black text-xl text-white hover:scale-[1.03] transition-all active:scale-[0.98] flex items-center gap-4 shadow-xl shadow-slate-200 dark:shadow-primary/20"
          >
            Launch Mirror Session <MdArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
}

