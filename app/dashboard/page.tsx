'use client';

import React, { useState, useEffect } from 'react';
import { goalsApi, GoalSummary, CommitmentSummary } from '@/services/goalsApi';
import {
  MdCheckCircle,
  MdRecordVoiceOver,
  MdLocalFireDepartment,
  MdAutoGraph,
  MdLightbulb,
  MdEmojiEvents,
  MdFavorite,
  MdPeople,
  MdChevronRight,
} from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import AppNavbar from '@/components/AppNavbar';
import { DashboardNowStrip } from '@/components/dashboard/DashboardNowStrip';
import { CreateCommitmentGoalSelector } from '@/components/dashboard/CreateCommitmentGoalSelector';
import { ensureCommitmentFlowStarted } from '@/lib/productAnalytics';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLoadingSkeleton } from '@/components/skeletons/PageSkeletons';

interface GrowthMetrics {
  streak_days: number;
  total_reflections: number;
  completion_rate: number;
  growth_score: number;
  insights_count: number;
  patterns_detected: string[];
  recent_insight: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<GoalSummary[]>([]);
  const [activeCommitments, setActiveCommitments] = useState<CommitmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetrics>({
    streak_days: 0,
    total_reflections: 0,
    completion_rate: 0,
    growth_score: 0,
    insights_count: 0,
    patterns_detected: [],
    recent_insight: null,
  });
  const [showCelebration, setShowCelebration] = useState(false);

  // Check onboarding status — redirect if not onboarded
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        // Cache-bust: append timestamp to prevent 304 stale responses
        const status = await api.get<{ is_onboarded: boolean }>(
          `/api/onboarding/status?_t=${Date.now()}`
        );
        if (status.error || !status.data?.is_onboarded) {
          router.replace('/onboarding');
          return;
        }
      } catch {
        console.warn('Could not check onboarding status');
      }
      loadDashboardData();
    };
    checkOnboarding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [goalsData, commitmentsData] = await Promise.all([
        goalsApi.list(),
        goalsApi.getPendingCommitments(),
      ]);
      setGoals(goalsData);
      setActiveCommitments(commitmentsData);

      // Calculate growth metrics from real data
      const completedGoals = goalsData.filter(g => g.status === 'completed').length;
      const activeGoals = goalsData.filter(g => g.status === 'active').length;
      const totalGoals = goalsData.length;
      const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

      // Try to fetch growth metrics from backend
      const metricsResponse = await api.get<GrowthMetrics>('/api/dashboard/growth-metrics');
      if (metricsResponse.error || !metricsResponse.data) {
        // Fallback: pending list has no verified rows — avoid fake streak/reflection counts
        setGrowthMetrics({
          streak_days: 0,
          total_reflections: 0,
          completion_rate: completionRate,
          growth_score: Math.min(100, completedGoals * 20 + activeGoals * 10),
          insights_count: 0,
          patterns_detected: [],
          recent_insight: null,
        });
      } else {
        setGrowthMetrics(metricsResponse.data);
      }

      // Show celebration if there are newly completed goals
      if (completedGoals > 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    if (!loading) ensureCommitmentFlowStarted();
  }, [loading]);

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      <AppNavbar />

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <MdEmojiEvents className="text-amber-400 mx-auto mb-2" size={80} />
              <p className="text-2xl font-bold text-foreground bg-white/90 backdrop-blur-md rounded-2xl px-8 py-4 shadow-xl">
                You&apos;re making progress! Keep going!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-[min(100%,96rem)] mx-auto px-2 sm:px-3 lg:px-4 py-4 sm:py-6 space-y-5 sm:space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
              {getGreeting()} 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your growth, reflect on patterns, and stay accountable.
            </p>
          </div>
          <Link
            href="/echo"
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm self-start sm:self-auto"
          >
            <MdRecordVoiceOver size={18} />
            Talk to Echo
          </Link>
        </div>

        <DashboardNowStrip commitments={activeCommitments} />

        {/* Growth Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <MetricCard
            icon={<MdLocalFireDepartment className="text-orange-500" size={24} />}
            label="Streak"
            value={`${growthMetrics.streak_days}d`}
            sublabel="consecutive days"
            bgColor="bg-orange-50"
          />
          <MetricCard
            icon={<MdAutoGraph className="text-primary" size={24} />}
            label="Growth Score"
            value={`${growthMetrics.growth_score}`}
            sublabel="out of 100"
            bgColor="bg-primary/5"
          />
          <MetricCard
            icon={<MdCheckCircle className="text-green-500" size={24} />}
            label="Completion"
            value={`${growthMetrics.completion_rate}%`}
            sublabel="of commitments"
            bgColor="bg-green-50"
          />
          <MetricCard
            icon={<MdLightbulb className="text-amber-500" size={24} />}
            label="Insights"
            value={`${growthMetrics.insights_count}`}
            sublabel="patterns found"
            bgColor="bg-amber-50"
          />
        </div>

        {/* Growth Insight Banner */}
        {growthMetrics.recent_insight && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-5 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MdLightbulb className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary mb-1">Echo&apos;s Latest Insight</p>
              <p className="text-sm text-foreground leading-relaxed">{growthMetrics.recent_insight}</p>
            </div>
          </motion.div>
        )}

        {/* Patterns Detected */}
        {growthMetrics.patterns_detected.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MdAutoGraph className="text-primary" size={18} />
              Behavioral Patterns Detected
            </h3>
            <div className="flex flex-wrap gap-2">
              {growthMetrics.patterns_detected.map((pattern, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-primary/5 text-primary text-xs font-medium rounded-full border border-primary/10"
                >
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border/80 bg-white/90 dark:bg-card/95 backdrop-blur-[2px] p-4 sm:p-5 shadow-sm shadow-black/[0.02] dark:shadow-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-foreground">Active commitments</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Open the full list in a dedicated view—each commitment opens in a wide side panel.
            </p>
          </div>
          <Link
            href="/dashboard/commitments"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 shrink-0"
          >
            View commitments
            {activeCommitments.length > 0 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold tabular-nums">
                {activeCommitments.length}
              </span>
            )}
            <MdChevronRight size={20} aria-hidden />
          </Link>
        </div>

        {/* Quick Actions / Learning Section */}
        <section className="bg-white rounded-2xl border border-border p-5 sm:p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Continue Your Growth</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
            <Link
              href="/echo"
              className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group h-full min-h-[88px]"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MdRecordVoiceOver className="text-primary" size={24} />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Reflect with Echo</p>
                <p className="text-xs text-muted-foreground">Voice-guided self-reflection</p>
              </div>
            </Link>

            <div className="h-full min-h-[88px] flex [&>*]:w-full [&>*]:h-full [&>*]:min-h-[88px]">
              <CreateCommitmentGoalSelector
                goals={goals}
                variant="card"
              />
            </div>

            <Link
              href="/thrive"
              className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-green-300 hover:bg-green-50/50 transition-all group h-full min-h-[88px]"
            >
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MdFavorite className="text-green-500" size={24} />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Wellbeing Check</p>
                <p className="text-xs text-muted-foreground">Monitor your Thrive score</p>
              </div>
            </Link>

            <Link
              href="/tribe"
              className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent/30 hover:bg-accent/5 transition-all group h-full min-h-[88px]"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MdPeople className="text-accent" size={24} />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Your Tribe</p>
                <p className="text-xs text-muted-foreground">Social accountability network</p>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ───────── Metric Card ───────── */
function MetricCard({
  icon,
  label,
  value,
  sublabel,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  bgColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-2xl border border-border p-4 shadow-sm`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-xl font-bold text-foreground leading-tight">{value}</p>
          <p className="text-[10px] text-muted-foreground">{sublabel}</p>
        </div>
      </div>
    </div>
  );
}

