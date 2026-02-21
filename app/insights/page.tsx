'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  MdLightbulb,
  MdAutoGraph,
  MdLocalFireDepartment,
  MdTrendingUp,
  MdRecordVoiceOver,
  MdCheckCircle,
  MdWarning,
  MdRefresh,
} from 'react-icons/md';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import AppNavbar from '@/components/AppNavbar';
import { toast } from 'react-hot-toast';

interface GrowthMetrics {
  streak_days: number;
  total_reflections: number;
  completion_rate: number;
  growth_score: number;
  insights_count: number;
  patterns_detected: string[];
  recent_insight: string | null;
  blockers: string[];
  common_excuses: string[];
  weekly_progress: { date: string; total: number; verified: number }[];
  thrive_score: number;
}

export default function InsightsPage() {
  const [metrics, setMetrics] = useState<GrowthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<GrowthMetrics>('/api/dashboard/growth-metrics');
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load growth metrics:', err);
      toast.error('Could not load growth data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
        <AppNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="text-lg font-semibold text-foreground">Analyzing your growth journey...</p>
          </div>
        </div>
      </div>
    );
  }

  const m = metrics || {
    streak_days: 0,
    total_reflections: 0,
    completion_rate: 0,
    growth_score: 0,
    insights_count: 0,
    patterns_detected: [],
    recent_insight: null,
    blockers: [],
    common_excuses: [],
    weekly_progress: [],
    thrive_score: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      <AppNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1 flex items-center gap-3">
              <MdAutoGraph className="text-primary" size={36} />
              Growth Journey
            </h1>
            <p className="text-lg text-muted-foreground">
              Your personal growth insights, patterns, and reflections over time.
            </p>
          </div>
          <button
            onClick={loadMetrics}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors self-start sm:self-auto"
          >
            <MdRefresh size={18} />
            Refresh
          </button>
        </div>

        {/* Growth Score Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center"
        >
          <p className="text-sm font-medium text-muted-foreground mb-2">Overall Growth Score</p>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="url(#growthGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 56}
                strokeDashoffset={2 * Math.PI * 56 * (1 - m.growth_score / 100)}
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--accent)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{m.growth_score}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Based on your commitment completion ({m.completion_rate}%), streak ({m.streak_days}d),
            reflections ({m.total_reflections}), and {m.insights_count} detected patterns.
          </p>
        </motion.div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricTile
            icon={<MdLocalFireDepartment className="text-orange-500" size={22} />}
            label="Streak"
            value={`${m.streak_days}d`}
            desc="consecutive days"
            bg="bg-orange-50"
          />
          <MetricTile
            icon={<MdCheckCircle className="text-green-500" size={22} />}
            label="Completion"
            value={`${m.completion_rate}%`}
            desc="commitments verified"
            bg="bg-green-50"
          />
          <MetricTile
            icon={<MdRecordVoiceOver className="text-primary" size={22} />}
            label="Reflections"
            value={`${m.total_reflections}`}
            desc="with Echo & Doyn"
            bg="bg-primary/5"
          />
          <MetricTile
            icon={<MdLightbulb className="text-amber-500" size={22} />}
            label="Insights"
            value={`${m.insights_count}`}
            desc="patterns found"
            bg="bg-amber-50"
          />
        </div>

        {/* Weekly Progress Chart */}
        {m.weekly_progress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <MdTrendingUp className="text-primary" size={22} />
              Weekly Progress
            </h2>
            <div className="flex items-end gap-2 h-40">
              {m.weekly_progress.map((day, idx) => {
                const maxBar = Math.max(...m.weekly_progress.map((d) => d.total), 1);
                const totalH = (day.total / maxBar) * 100;
                const verifiedH = (day.verified / maxBar) * 100;
                const dayLabel = new Date(day.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' });

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full relative flex flex-col justify-end" style={{ height: '120px' }}>
                      {/* Total bar */}
                      <div
                        className="w-full bg-muted rounded-t-md transition-all"
                        style={{ height: `${totalH}%`, minHeight: day.total > 0 ? '4px' : '0' }}
                      />
                      {/* Verified overlay */}
                      <div
                        className="w-full bg-gradient-to-t from-primary to-primary/70 rounded-t-md absolute bottom-0 transition-all"
                        style={{ height: `${verifiedH}%`, minHeight: day.verified > 0 ? '4px' : '0' }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">{dayLabel}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary inline-block" /> Verified
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-muted inline-block" /> Total
              </span>
            </div>
          </motion.div>
        )}

        {/* AI Insight Banner */}
        {m.recent_insight && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MdLightbulb className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary mb-1">Echo&apos;s Latest Insight</p>
              <p className="text-foreground leading-relaxed">{m.recent_insight}</p>
            </div>
          </motion.div>
        )}

        {/* Patterns Detected */}
        {m.patterns_detected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl border border-border p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <MdAutoGraph className="text-primary" size={22} />
              Behavioral Patterns Detected
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Echo has identified these recurring patterns from your reflections and commitments.
              Awareness is the first step to growth.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {m.patterns_detected.map((pattern, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MdAutoGraph className="text-primary" size={16} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{pattern}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Known Blockers & Common Excuses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Blockers */}
          {m.blockers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-border p-6"
            >
              <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <MdWarning className="text-amber-500" size={20} />
                Known Blockers
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                These obstacles came up during your conversations with Echo.
              </p>
              <ul className="space-y-2">
                {m.blockers.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Common Excuses */}
          {m.common_excuses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl border border-border p-6"
            >
              <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <MdWarning className="text-red-400" size={20} />
                Self-Identified Excuses
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                You told Echo these are the excuses you tend to make. Doyn will call you out on them.
              </p>
              <ul className="space-y-2">
                {m.common_excuses.map((e, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="w-5 h-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    {e}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center py-4">
          <Link
            href="/echo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            <MdRecordVoiceOver size={20} />
            Reflect with Echo to Discover More
          </Link>
        </div>
      </main>
    </div>
  );
}

/* ───────── Metric Tile ───────── */
function MetricTile({
  icon,
  label,
  value,
  desc,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  desc: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-2xl border border-border p-4 shadow-sm`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-xl font-bold text-foreground leading-tight">{value}</p>
          <p className="text-[10px] text-muted-foreground">{desc}</p>
        </div>
      </div>
    </div>
  );
}

