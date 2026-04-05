'use client';

import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { goalsApi, GoalSummary, CommitmentSummary } from '@/services/goalsApi';
import AppNavbar from '@/components/AppNavbar';
import { CommitmentOffCanvas } from '@/components/dashboard/CommitmentOffCanvas';
import { CreateCommitmentGoalSelector } from '@/components/dashboard/CreateCommitmentGoalSelector';
import { api } from '@/lib/api';
import { echoVoiceReflectionHref, echoJournalReflectPath } from '@/lib/echoCommitmentLinks';
import { ensureCommitmentFlowStarted, trackProductEvent } from '@/lib/productAnalytics';
import {
  DashboardLoadingSkeleton,
  CommitmentsListPanelSkeleton,
} from '@/components/skeletons/PageSkeletons';
import {
  MdSchedule,
  MdChevronRight,
  MdArrowBack,
  MdCheckCircle,
  MdRecordVoiceOver,
} from 'react-icons/md';

function hoursLabel(dueAt: string, nowMs: number): number {
  return (new Date(dueAt).getTime() - nowMs) / (1000 * 60 * 60);
}

function relativeDueLine(hours: number, overdue: boolean): string {
  if (overdue) {
    const past = Math.abs(hours);
    if (past < 24) {
      const h = Math.max(1, Math.ceil(past));
      return `${h}h overdue`;
    }
    const d = Math.floor(past / 24);
    return `${d}d overdue`;
  }
  if (hours < 1) {
    const m = Math.max(1, Math.round(hours * 60));
    return `Due in ${m} min`;
  }
  if (hours < 24) {
    const h = Math.max(1, Math.round(hours));
    return `Due in ${h}h`;
  }
  if (hours < 72) {
    const d = Math.ceil(hours / 24);
    return `Due in ${d}d`;
  }
  const d = Math.ceil(hours / 24);
  return `Due in ${d}d`;
}

function getStatusColor(status: string) {
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
}

function CommitmentsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const openParam = searchParams.get('open');

  const [goals, setGoals] = useState<GoalSummary[]>([]);
  const [activeCommitments, setActiveCommitments] = useState<CommitmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [goalCommitments, setGoalCommitments] = useState<CommitmentSummary[]>([]);
  const [commitmentsLoading, setCommitmentsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCommitment, setDrawerCommitment] = useState<CommitmentSummary | null>(null);

  const selectedGoalIdRef = useRef<string | null>(null);
  useEffect(() => {
    selectedGoalIdRef.current = selectedGoalId;
  }, [selectedGoalId]);

  const loadData = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      const [goalsData, commitmentsData] = await Promise.all([
        goalsApi.list(),
        goalsApi.getPendingCommitments(),
      ]);
      setGoals(goalsData);
      setActiveCommitments(commitmentsData);

      const gid = selectedGoalIdRef.current;
      if (gid) {
        try {
          const all = await goalsApi.getCommitments(gid);
          setGoalCommitments(
            all.filter((c) => c.status === 'pending' || c.status === 'escalated')
          );
        } catch {
          setGoalCommitments([]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedGoalId === null) {
      setGoalCommitments([]);
      setCommitmentsLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setCommitmentsLoading(true);
      try {
        const all = await goalsApi.getCommitments(selectedGoalId);
        const filtered = all.filter((c) => c.status === 'pending' || c.status === 'escalated');
        if (!cancelled) setGoalCommitments(filtered);
      } catch {
        if (!cancelled) setGoalCommitments([]);
      } finally {
        if (!cancelled) setCommitmentsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedGoalId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const status = await api.get<{ is_onboarded: boolean }>(
          `/api/onboarding/status?_t=${Date.now()}`
        );
        if (cancelled) return;
        if (status.error || !status.data?.is_onboarded) {
          router.replace('/onboarding');
          return;
        }
      } catch {
        console.warn('Could not check onboarding status');
      }
      loadData();
    })();
    return () => {
      cancelled = true;
    };
  }, [router, loadData]);

  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const visibleCommitments = selectedGoalId ? goalCommitments : activeCommitments;

  useEffect(() => {
    if (!openParam) {
      setDrawerOpen(false);
      return;
    }
    const c = activeCommitments.find((x) => x.id === openParam);
    if (c) {
      setDrawerCommitment(c);
      setDrawerOpen(true);
    }
  }, [openParam, activeCommitments]);

  useEffect(() => {
    if (!drawerOpen || !drawerCommitment?.id) return;
    const still = activeCommitments.find((c) => c.id === drawerCommitment.id);
    if (!still) {
      setDrawerOpen(false);
      router.replace('/dashboard/commitments', { scroll: false });
      return;
    }
    if (still === drawerCommitment) return;
    setDrawerCommitment(still);
  }, [activeCommitments, drawerCommitment, drawerOpen, router]);

  const openDrawer = (c: CommitmentSummary) => {
    setDrawerCommitment(c);
    setDrawerOpen(true);
    router.replace(`/dashboard/commitments?open=${c.id}`, { scroll: false });
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    router.replace('/dashboard/commitments', { scroll: false });
  };

  const handleExitComplete = () => {
    setDrawerCommitment(null);
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
      <main className="w-full max-w-[min(100%,96rem)] mx-auto px-2 sm:px-3 lg:px-4 py-4 sm:py-6 space-y-5">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <MdArrowBack size={18} />
          Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Active commitments</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Use <span className="font-medium text-foreground/90">Voice</span> for Echo with this
              commitment loaded, <span className="font-medium text-foreground/90">Journal</span> for
              the written reflect page, or tap the row to open the side panel.
            </p>
          </div>
          <CreateCommitmentGoalSelector goals={goals} variant="button" />
        </div>

        <section className="flex flex-col lg:flex-row gap-4 lg:gap-5 lg:items-start">
          <aside className="w-full lg:w-[min(100%,20rem)] xl:w-[22rem] flex-shrink-0 lg:sticky lg:top-20 lg:z-10">
            <div className="bg-white rounded-xl border border-border p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Goals</h2>
                <Link
                  href="/echo"
                  className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 whitespace-nowrap"
                >
                  + New
                </Link>
              </div>

              {goals.length === 0 ? (
                <div className="text-center py-6 px-2">
                  <MdCheckCircle className="mx-auto text-muted-foreground mb-2" size={36} />
                  <p className="text-xs text-muted-foreground mb-3">Create a goal with Echo to filter by goal.</p>
                  <Link
                    href="/echo"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-medium"
                  >
                    Talk to Echo
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 max-h-[min(60vh,28rem)] overflow-y-auto pr-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectedGoalId(null)}
                    className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-colors border ${
                      selectedGoalId === null
                        ? 'border-primary bg-primary/10 text-foreground font-semibold'
                        : 'border-transparent hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    All goals
                    <span className="block text-[10px] font-normal text-muted-foreground mt-0.5">
                      {activeCommitments.length} active
                    </span>
                  </button>
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoalId(goal.id)}
                      className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-colors border ${
                        selectedGoalId === goal.id
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-transparent hover:bg-muted/80 text-muted-foreground'
                      }`}
                    >
                      <span className="line-clamp-2 font-medium text-foreground">{goal.title}</span>
                      <span className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                        <span className={`px-1.5 py-0.5 rounded border ${getStatusColor(goal.status)}`}>
                          {goal.status}
                        </span>
                        {new Date(goal.deadline).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </button>
                  ))}
                  <Link
                    href="/goals"
                    className="text-center text-xs text-primary font-medium pt-2 hover:underline"
                  >
                    Manage goals
                  </Link>
                </div>
              )}
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-3">
            {commitmentsLoading && selectedGoalId ? (
              <CommitmentsListPanelSkeleton />
            ) : visibleCommitments.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed border-border p-8 sm:p-10 text-center">
                <MdCheckCircle className="mx-auto text-muted-foreground mb-3" size={40} />
                <h3 className="text-base font-semibold text-foreground mb-1">Nothing active here</h3>
                <p className="text-muted-foreground text-sm mb-5">
                  {goals.length === 0
                    ? 'Create a goal with Echo first, then add commitments with Doyn.'
                    : selectedGoalId
                      ? 'No pending or escalated commitments for this goal.'
                      : 'When something is due, it will show here—use How did it go? to stay on track, or add a commitment in Doyn.'}
                </p>
                {goals.length > 0 ? (
                  <CreateCommitmentGoalSelector goals={goals} variant="button" />
                ) : (
                  <Link
                    href="/echo"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl text-sm font-medium"
                  >
                    Create goal with Echo
                  </Link>
                )}
              </div>
            ) : (
              <ul className="space-y-2">
                {visibleCommitments.map((c) => {
                  const h = hoursLabel(c.due_at, nowMs);
                  const overdue = h <= 0;
                  const rel = relativeDueLine(h, overdue);
                  const title =
                    c.task_detail.charAt(0).toUpperCase() + c.task_detail.slice(1);
                  return (
                    <li key={c.id}>
                      <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-white/90 dark:bg-card/95 backdrop-blur-[2px] p-3 sm:p-4 sm:flex-row sm:items-start sm:justify-between hover:border-primary/30 hover:bg-primary/5 transition-colors">
                        <button
                          type="button"
                          onClick={() => openDrawer(c)}
                          className="flex flex-1 items-start gap-3 min-w-0 text-left rounded-lg -m-1 p-1 sm:p-0 sm:m-0"
                        >
                          <MdSchedule
                            className={`shrink-0 mt-0.5 ${
                              overdue
                                ? 'text-rose-500'
                                : h < 24
                                  ? 'text-orange-500'
                                  : 'text-muted-foreground'
                            }`}
                            size={20}
                            aria-hidden
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground truncate max-w-[14rem] sm:max-w-[28rem]">
                              {c.goal_title}
                            </p>
                            <p className="font-semibold text-foreground leading-snug line-clamp-2">
                              {title}
                            </p>
                            <p className="text-xs text-muted-foreground tabular-nums mt-0.5">{rel}</p>
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-2 sm:hidden">
                              Open panel
                              <MdChevronRight size={18} />
                            </span>
                          </div>
                        </button>
                        <div className="flex flex-wrap gap-2 shrink-0 sm:flex-col sm:items-stretch sm:min-w-[8.5rem] pl-8 sm:pl-0">
                          <Link
                            href={echoVoiceReflectionHref(c.id)}
                            onClick={() =>
                              trackProductEvent('commitment.list_voice_click', { commitmentId: c.id })
                            }
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                          >
                            <MdRecordVoiceOver size={16} aria-hidden />
                            Voice
                          </Link>
                          <Link
                            href={echoJournalReflectPath(c.id)}
                            onClick={() =>
                              trackProductEvent('commitment.list_journal_click', { commitmentId: c.id })
                            }
                            className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/80 transition-colors"
                          >
                            Journal
                          </Link>
                          <button
                            type="button"
                            onClick={() => openDrawer(c)}
                            className="hidden sm:inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-primary/30 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
                          >
                            Open panel
                            <MdChevronRight size={18} aria-hidden />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </main>

      <CommitmentOffCanvas
        open={drawerOpen}
        commitment={drawerCommitment}
        onClose={closeDrawer}
        onUpdated={() => loadData({ silent: true })}
        onExitComplete={handleExitComplete}
      />
    </div>
  );
}

export default function CommitmentsPage() {
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      <CommitmentsInner />
    </Suspense>
  );
}
