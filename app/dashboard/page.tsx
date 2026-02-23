'use client';

import React, { useState, useEffect } from 'react';
import { goalsApi, GoalSummary, CommitmentSummary } from '@/services/goalsApi';
import {
  MdCheckCircle,
  MdAccessTime,
  MdTrendingUp,
  MdRecordVoiceOver,
  MdLocalFireDepartment,
  MdAutoGraph,
  MdLightbulb,
  MdEmojiEvents,
  MdFavorite,
  MdPeople,
} from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import AppNavbar from '@/components/AppNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { DoynChat } from '@/components/dashboard/DoynChat';
import { CommitmentsSidebar } from '@/components/dashboard/CommitmentsSidebar';

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
  const [todaysCommitments, setTodaysCommitments] = useState<CommitmentSummary[]>([]);
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
  const [commitmentRefresh, setCommitmentRefresh] = useState(0);

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
        goalsApi.getTodaysCommitments(),
      ]);
      setGoals(goalsData);
      setTodaysCommitments(commitmentsData);

      // Calculate growth metrics from real data
      const completedGoals = goalsData.filter(g => g.status === 'completed').length;
      const activeGoals = goalsData.filter(g => g.status === 'active').length;
      const totalGoals = goalsData.length;
      const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

      // Try to fetch growth metrics from backend
      try {
        const metrics = await api.get<GrowthMetrics>('/api/dashboard/growth-metrics');
        setGrowthMetrics(metrics);
      } catch {
        // Fallback: compute from local data
        setGrowthMetrics({
          streak_days: commitmentsData.filter(c => c.status === 'verified').length > 0 ? 1 : 0,
          total_reflections: commitmentsData.length,
          completion_rate: completionRate,
          growth_score: Math.min(100, completedGoals * 20 + activeGoals * 10),
          insights_count: 0,
          patterns_detected: [],
          recent_insight: null,
        });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCommitmentStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'escalated':
        return 'text-orange-600 bg-orange-50';
      case 'failed':
      case 'missed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
        <AppNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="text-lg font-semibold text-foreground">Loading your growth journey...</p>
          </div>
        </div>
      </div>
    );
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
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

        {/* Growth Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                <MdTrendingUp className="text-primary" size={22} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold text-foreground">{goals.filter(g => g.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center">
                <MdCheckCircle className="text-green-600" size={22} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today&apos;s Tasks</p>
                <p className="text-2xl font-bold text-foreground">{todaysCommitments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center">
                <MdAccessTime className="text-accent" size={22} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{goals.filter(g => g.status === 'completed').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Commitments */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Today&apos;s Commitments</h2>
          </div>

          {todaysCommitments.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-border p-10 text-center">
              <MdCheckCircle className="mx-auto text-muted-foreground mb-3" size={44} />
              <h3 className="text-lg font-semibold text-foreground mb-1">No commitments due today</h3>
              <p className="text-muted-foreground text-sm">Check your goals to create new commitments.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysCommitments.map((commitment) => {
                const dueDate = new Date(commitment.due_at);
                const hoursLeft = (dueDate.getTime() - Date.now()) / (1000 * 60 * 60);
                const isUrgent = hoursLeft > 0 && hoursLeft < 2;
                const isOverdue = hoursLeft <= 0 && commitment.status === 'pending';

                return (
                  <Link
                    key={commitment.id}
                    href={`/doyn/${commitment.goal_id}`}
                    className={`block bg-white rounded-2xl border p-5 hover:shadow-md transition-all ${
                      isOverdue ? 'border-red-300 bg-red-50/30' : isUrgent ? 'border-amber-300 bg-amber-50/30' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${getCommitmentStatusColor(commitment.status)}`}>
                            {commitment.status}
                          </span>
                          <span className="text-sm text-muted-foreground">{commitment.goal_title}</span>
                          {isOverdue && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600 animate-pulse">
                              OVERDUE
                            </span>
                          )}
                          {isUrgent && !isOverdue && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-600">
                              DUE SOON
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-1">{commitment.task_detail}</h3>
                        <p className="text-sm text-muted-foreground">
                          Due: {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className="text-sm text-primary font-medium whitespace-nowrap ml-4">Chat with Doyn →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Your Goals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Your Goals</h2>
            <Link
              href="/echo"
              className="px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm"
            >
              Create New Goal
            </Link>
          </div>

          {goals.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-border p-10 text-center">
              <MdTrendingUp className="mx-auto text-muted-foreground mb-3" size={44} />
              <h3 className="text-lg font-semibold text-foreground mb-1">No goals yet</h3>
              <p className="text-muted-foreground mb-5 text-sm">Start your growth journey by creating your first goal with Echo.</p>
              <Link
                href="/echo"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm"
              >
                <MdRecordVoiceOver size={18} />
                Talk to Echo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className={`px-3 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                          {goal.status}
                        </span>
                        {goal.stake_amount > 0 && (
                          <span className="text-xs font-semibold text-amber-600">
                            ${goal.stake_amount} staked
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{goal.description}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-border">
                    <Link
                      href={`/doyn/${goal.id}`}
                      className="flex-1 py-2 px-4 bg-primary text-white rounded-xl hover:opacity-90 transition-all text-center font-medium text-sm"
                    >
                      Chat with Doyn
                    </Link>
                    <Link
                      href="/goals"
                      className="py-2 px-4 border border-border rounded-xl hover:bg-muted transition-all text-center font-medium text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Doyn Chat + Commitments Side-by-Side */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Doyn &amp; Commitments</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Doyn Chat — takes 3 cols */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-border shadow-sm overflow-hidden" style={{ height: '520px' }}>
              <DoynChat
                onCommitmentUpdate={() => setCommitmentRefresh((n) => n + 1)}
              />
            </div>
            {/* Commitments Sidebar — takes 2 cols */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm overflow-hidden" style={{ height: '520px' }}>
              <CommitmentsSidebar refreshTrigger={commitmentRefresh} />
            </div>
          </div>
        </section>

        {/* Quick Actions / Learning Section */}
        <section className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Continue Your Growth</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/echo"
              className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MdRecordVoiceOver className="text-primary" size={24} />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Reflect with Echo</p>
                <p className="text-xs text-muted-foreground">Voice-guided self-reflection</p>
              </div>
            </Link>

            <Link
              href="/thrive"
              className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-green-300 hover:bg-green-50/50 transition-all group"
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
              className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent/30 hover:bg-accent/5 transition-all group"
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

