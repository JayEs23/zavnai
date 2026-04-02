'use client';

import React, { useState, useMemo, useRef, useEffect, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CommitmentSummary } from '@/services/goalsApi';
import {
  trackProductEvent,
  trackCommitmentOutcomeSaved,
  trackModalAbandoned,
} from '@/lib/productAnalytics';
import { CommitmentVerification } from '@/components/core-loop/CommitmentVerification';
import { LogCommitmentOutcomeModal } from '@/components/core-loop/LogCommitmentOutcomeModal';
import {
  MdSchedule,
  MdDone,
  MdEditNote,
  MdOutlineChat,
  MdSmartToy,
  MdMoreHoriz,
  MdGroups,
} from 'react-icons/md';

function commitmentStatusColor(status: string) {
  switch (status) {
    case 'verified':
      return 'text-emerald-800/95 bg-emerald-50/80 border-emerald-100/90';
    case 'pending':
      return 'text-amber-800/90 bg-amber-50/60 border-amber-100/80';
    case 'escalated':
      return 'text-orange-800/90 bg-orange-50/60 border-orange-100/80';
    case 'failed':
    case 'missed':
      return 'text-rose-800/90 bg-rose-50/70 border-rose-100/80';
    default:
      return 'text-muted-foreground bg-muted/50 border-border/80';
  }
}

/** Title Case for status and UI labels */
function toTitleCase(text: string): string {
  return text
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

type DueUrgency = 'overdue' | 'critical' | 'soon' | 'thisWeek' | 'later' | 'neutral';

function getDueUrgency(hoursLeft: number, actionable: boolean): DueUrgency {
  if (!actionable) return 'neutral';
  if (hoursLeft <= 0) return 'overdue';
  if (hoursLeft < 2) return 'critical';
  if (hoursLeft < 24) return 'soon';
  if (hoursLeft < 72) return 'thisWeek';
  return 'later';
}

function formatRelativeDueLine(hoursLeft: number, overdue: boolean): string {
  if (overdue) {
    const past = Math.abs(hoursLeft);
    if (past < 24) {
      const h = Math.max(1, Math.ceil(past));
      return `${h} Hour${h === 1 ? '' : 's'} Overdue`;
    }
    const d = Math.floor(past / 24);
    return `${d} Day${d === 1 ? '' : 's'} Overdue`;
  }
  if (hoursLeft < 1) {
    const m = Math.max(1, Math.round(hoursLeft * 60));
    return `Due In ${m} Minute${m === 1 ? '' : 's'}`;
  }
  if (hoursLeft < 24) {
    const h = Math.max(1, Math.round(hoursLeft));
    return `Due In ${h} Hour${h === 1 ? '' : 's'}`;
  }
  if (hoursLeft < 72) {
    const d = Math.ceil(hoursLeft / 24);
    return `Due In ${d} Day${d === 1 ? '' : 's'}`;
  }
  const d = Math.ceil(hoursLeft / 24);
  return `Due In ${d} Days`;
}

const URGENCY_DATE_CLASS: Record<DueUrgency, string> = {
  overdue:
    'text-rose-700 dark:text-rose-300 font-semibold tracking-tight tabular-nums',
  critical:
    'text-amber-700 dark:text-amber-300 font-semibold tracking-tight tabular-nums',
  soon:
    'text-orange-600/95 dark:text-orange-400 font-semibold tabular-nums',
  thisWeek:
    'text-amber-800/90 dark:text-amber-200/95 font-semibold tabular-nums',
  later:
    'text-slate-600 dark:text-slate-400 font-medium tabular-nums',
  neutral:
    'text-muted-foreground font-medium tabular-nums',
};

const URGENCY_LABEL_CLASS: Record<DueUrgency, string> = {
  overdue: 'text-rose-600/95 dark:text-rose-400 font-semibold uppercase tracking-wide',
  critical: 'text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wide',
  soon: 'text-orange-600/95 dark:text-orange-400 font-semibold uppercase tracking-wide',
  thisWeek: 'text-amber-700/85 dark:text-amber-300/95 font-semibold uppercase tracking-wide',
  later: 'text-slate-500 dark:text-slate-500 font-medium uppercase tracking-wide',
  neutral: 'text-muted-foreground font-medium uppercase tracking-wide',
};

const URGENCY_BADGE_CLASS: Record<DueUrgency, string> = {
  overdue:
    'bg-rose-50 text-rose-800 ring-1 ring-rose-200/60 dark:bg-rose-950/35 dark:text-rose-200 dark:ring-rose-800/50',
  critical:
    'bg-amber-50 text-amber-900 ring-1 ring-amber-200/60 dark:bg-amber-950/35 dark:text-amber-200 dark:ring-amber-800/45',
  soon:
    'bg-orange-50 text-orange-900 ring-1 ring-orange-200/55 dark:bg-orange-950/35 dark:text-orange-200 dark:ring-orange-800/45',
  thisWeek:
    'bg-amber-50/90 text-amber-900 ring-1 ring-amber-100/90 dark:bg-amber-950/25 dark:text-amber-200 dark:ring-amber-900/40',
  later:
    'bg-slate-50 text-slate-700 ring-1 ring-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:ring-slate-700/80',
  neutral: 'bg-muted/80 text-muted-foreground ring-1 ring-border/80',
};

interface DashboardCommitmentCardProps {
  commitment: CommitmentSummary;
  onUpdated: () => void;
  /** Use inside a drawer/panel: no scroll anchor, optional style tweaks */
  embedInPanel?: boolean;
  className?: string;
}

export function DashboardCommitmentCard({
  commitment,
  onUpdated,
  embedInPanel = false,
  className = '',
}: DashboardCommitmentCardProps) {
  const router = useRouter();
  const statusDialogId = useId();
  const moreMenuId = useId();
  const moreWrapRef = useRef<HTMLDivElement>(null);

  const [verifyOpen, setVerifyOpen] = useState(false);
  const [outcomeOpen, setOutcomeOpen] = useState(false);
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    if (!moreMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (moreWrapRef.current && !moreWrapRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [moreMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStatusSheetOpen(false);
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const dueDate = useMemo(() => new Date(commitment.due_at), [commitment.due_at]);
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const hoursLeft = (dueDate.getTime() - nowMs) / (1000 * 60 * 60);
  const canAct = commitment.status === 'pending' || commitment.status === 'escalated';
  const isActionOverdue = hoursLeft <= 0 && canAct;
  const isUrgentWindow = hoursLeft > 0 && hoursLeft < 2 && canAct;

  const urgency = useMemo(
    () => getDueUrgency(hoursLeft, canAct),
    [hoursLeft, canAct]
  );

  const relativeLine = useMemo(
    () => formatRelativeDueLine(hoursLeft, isActionOverdue),
    [hoursLeft, isActionOverdue]
  );

  const formattedDateTime = useMemo(
    () =>
      dueDate.toLocaleString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    [dueDate]
  );

  const statusLabel = toTitleCase(commitment.status);
  const goalTitleDisplay = commitment.goal_title
    ? commitment.goal_title
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    : '';

  const urgencyBadgeText =
    urgency === 'overdue'
      ? 'Overdue'
      : urgency === 'critical'
        ? 'Due Very Soon'
        : urgency === 'soon'
          ? 'Due Today'
          : urgency === 'thisWeek'
            ? 'Due This Week'
            : null;

  const shell =
    isActionOverdue
      ? 'border-rose-200/70 bg-gradient-to-br from-rose-50/50 to-white dark:from-rose-950/20 dark:to-card ring-1 ring-rose-100/50 dark:ring-rose-900/25'
      : isUrgentWindow
        ? 'border-amber-200/70 bg-gradient-to-br from-amber-50/40 to-white dark:from-amber-950/18 dark:to-card ring-1 ring-amber-100/45 dark:ring-amber-900/25'
        : urgency === 'soon' || urgency === 'thisWeek'
          ? 'border-orange-100/90 bg-gradient-to-br from-orange-50/35 to-white dark:border-orange-900/35 dark:from-orange-950/12 dark:to-card ring-1 ring-orange-50/80 dark:ring-orange-900/20'
          : 'border-border/90 shadow-sm shadow-black/[0.02] dark:shadow-none';

  return (
    <div
      id={embedInPanel ? undefined : `commitment-${commitment.id}`}
      className={`${embedInPanel ? '' : 'scroll-mt-24'} rounded-2xl border p-5 transition-all flex flex-col bg-white/90 dark:bg-card/95 backdrop-blur-[2px] ${
        embedInPanel ? 'h-auto min-h-0 flex-none' : 'h-full'
      } ${shell} ${className}`.trim()}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between flex-1 min-h-0">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${commitmentStatusColor(commitment.status)}`}
            >
              {statusLabel}
            </span>
            {goalTitleDisplay && (
              <span className="text-xs sm:text-sm font-medium text-foreground/85 tracking-tight">
                {goalTitleDisplay}
              </span>
            )}
            {urgencyBadgeText && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${URGENCY_BADGE_CLASS[urgency]}`}
              >
                {urgencyBadgeText}
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-foreground mb-2 leading-snug">
            {commitment.task_detail.charAt(0).toUpperCase() + commitment.task_detail.slice(1)}
          </h3>

          <div
            className={`rounded-xl px-3 py-2.5 border ${
              urgency === 'overdue'
                ? 'border-rose-100/90 bg-rose-50/50 dark:border-rose-900/35 dark:bg-rose-950/25'
                : urgency === 'critical' || urgency === 'soon'
                  ? 'border-orange-100/90 bg-orange-50/40 dark:border-orange-900/35 dark:bg-orange-950/18'
                  : urgency === 'thisWeek'
                    ? 'border-amber-100/85 bg-amber-50/35 dark:border-amber-900/30 dark:bg-amber-950/12'
                    : 'border-border/70 bg-muted/25'
            }`}
          >
            <div className="flex items-start gap-2">
              <MdSchedule
                className={`shrink-0 mt-0.5 ${
                  urgency === 'overdue'
                    ? 'text-rose-500 dark:text-rose-400'
                    : urgency === 'critical' || urgency === 'soon'
                      ? 'text-orange-500 dark:text-orange-400'
                      : 'text-muted-foreground'
                }`}
                size={18}
              />
              <div className="min-w-0 space-y-0.5">
                <p className={`text-[10px] sm:text-xs ${URGENCY_LABEL_CLASS[urgency]}`}>
                  Due Date & Time
                </p>
                <p className={`text-sm sm:text-base ${URGENCY_DATE_CLASS[urgency]}`}>
                  {formattedDateTime}
                </p>
                {canAct && (
                  <p
                    className={`text-xs font-semibold tracking-tight ${
                      urgency === 'overdue'
                        ? 'text-rose-600 dark:text-rose-400'
                        : urgency === 'critical'
                          ? 'text-amber-700 dark:text-amber-300'
                          : urgency === 'soon'
                            ? 'text-orange-600/95 dark:text-orange-400'
                            : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {relativeLine}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {(commitment.verification_method === 'tribe_vouch' || commitment.tribe_vouch) && (
        <div className="mt-4 rounded-xl border border-violet-200/80 bg-violet-50/50 px-3 py-2.5 dark:border-violet-900/50 dark:bg-violet-950/25">
          <div className="flex items-start gap-2">
            <MdGroups className="shrink-0 mt-0.5 text-violet-600 dark:text-violet-400" size={18} aria-hidden />
            <div className="min-w-0 space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-800 dark:text-violet-200">
                Tribe verification
              </p>
              {commitment.tribe_vouch ? (
                <>
                  <p className="text-sm text-foreground">
                    {commitment.tribe_vouch.tribe_member_name
                      ? `${commitment.tribe_vouch.tribe_member_name}: `
                      : ''}
                    {commitment.tribe_vouch.vouched === true && (
                      <span className="text-emerald-700 dark:text-emerald-300 font-medium">Confirmed completion</span>
                    )}
                    {commitment.tribe_vouch.vouched === false && (
                      <span className="text-rose-700 dark:text-rose-300 font-medium">Did not confirm</span>
                    )}
                    {(commitment.tribe_vouch.vouched === null ||
                      commitment.tribe_vouch.vouched === undefined) && (
                      <span className="text-amber-800 dark:text-amber-200 font-medium">Unsure / unclear</span>
                    )}
                  </p>
                  {commitment.tribe_vouch.assessment && (
                    <p className="text-xs text-muted-foreground leading-snug">
                      {commitment.tribe_vouch.assessment}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Tribe response will appear here after your members submit their verification.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {canAct && (
        <div className="mt-auto pt-4 flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3">
          <button
            type="button"
            onClick={() => {
              trackProductEvent('commitment.status_sheet_open', { commitmentId: commitment.id });
              setStatusSheetOpen(true);
            }}
            aria-haspopup="dialog"
            aria-expanded={statusSheetOpen}
            aria-controls={statusDialogId}
            className="inline-flex w-full sm:flex-1 items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 dark:shadow-emerald-900/30"
          >
            <MdDone size={18} aria-hidden />
            How did it go?
          </button>
          <div ref={moreWrapRef} className="relative w-full sm:w-auto sm:shrink-0">
            <button
              type="button"
              onClick={() => setMoreMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={moreMenuOpen}
              aria-controls={moreMenuId}
              className="inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              <MdMoreHoriz size={20} aria-hidden />
              More
            </button>
            {moreMenuOpen && (
              <div
                id={moreMenuId}
                role="menu"
                aria-label="More actions for this commitment"
                className="absolute z-30 right-0 bottom-full mb-1 sm:bottom-auto sm:top-full sm:mt-1 sm:mb-0 w-full sm:min-w-[220px] rounded-xl border border-border bg-white dark:bg-card py-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
              >
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-muted transition-colors"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    trackProductEvent('commitment.verify_modal_open', {
                      commitmentId: commitment.id,
                      surface: 'more_menu',
                    });
                    setVerifyOpen(true);
                  }}
                >
                  <MdDone size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  Verify completion
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-muted transition-colors"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    trackProductEvent('commitment.outcome_modal_open', {
                      commitmentId: commitment.id,
                      surface: 'more_menu',
                    });
                    setOutcomeOpen(true);
                  }}
                >
                  <MdEditNote size={18} className="shrink-0" aria-hidden />
                  Log other outcome
                </button>
                <Link
                  href={`/echo/reflect/${commitment.id}`}
                  role="menuitem"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                  onClick={() => setMoreMenuOpen(false)}
                >
                  <MdOutlineChat size={18} className="shrink-0" aria-hidden />
                  Reflect with Echo
                </Link>
                <Link
                  href={`/doyn/${commitment.goal_id}`}
                  role="menuitem"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors"
                  onClick={() => setMoreMenuOpen(false)}
                >
                  <MdSmartToy size={18} className="shrink-0" aria-hidden />
                  Open in Doyn
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {!canAct && (
        <div className="mt-auto pt-4">
          <Link
            href={`/doyn/${commitment.goal_id}`}
            className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            <MdSmartToy size={16} />
            Open Goal In Doyn
          </Link>
        </div>
      )}

      {statusSheetOpen && (
        <div
          className={`fixed inset-0 flex items-end justify-center sm:items-center p-0 sm:p-4 ${
            embedInPanel ? 'z-[120]' : 'z-[60]'
          }`}
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px]"
            aria-label="Close"
            onClick={() => setStatusSheetOpen(false)}
          />
          <div
            id={statusDialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${statusDialogId}-title`}
            className={`relative w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-border bg-white dark:bg-card p-5 pb-6 sm:pb-5 shadow-xl ${
              embedInPanel ? 'z-[121]' : 'z-[61]'
            }`}
          >
            <h4 id={`${statusDialogId}-title`} className="text-lg font-semibold text-foreground mb-1">
              How did it go?
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Pick the option that fits— you can always use More for other actions.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/15 dark:shadow-emerald-900/25"
                onClick={() => {
                  setStatusSheetOpen(false);
                  trackProductEvent('commitment.verify_modal_open', {
                    commitmentId: commitment.id,
                    surface: 'status_sheet',
                  });
                  setVerifyOpen(true);
                }}
              >
                <MdDone size={18} aria-hidden />
                Done — verify completion
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors"
                onClick={() => {
                  setStatusSheetOpen(false);
                  trackProductEvent('commitment.outcome_modal_open', {
                    commitmentId: commitment.id,
                    surface: 'status_sheet',
                  });
                  setOutcomeOpen(true);
                }}
              >
                <MdEditNote size={18} aria-hidden />
                Not yet — log an outcome
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                onClick={() => {
                  setStatusSheetOpen(false);
                  router.push(`/doyn/${commitment.goal_id}`);
                }}
              >
                <MdSmartToy size={18} aria-hidden />
                Change plan — adjust with Doyn
              </button>
              <button
                type="button"
                className="mt-1 py-2 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setStatusSheetOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {verifyOpen && (
        <CommitmentVerification
          commitmentId={commitment.id}
          commitmentTask={commitment.task_detail}
          proofTier={commitment.proof_tier}
          onVerified={() => {
            setVerifyOpen(false);
            trackCommitmentOutcomeSaved(commitment.id, 'verify');
            onUpdated();
          }}
          onCancel={() => {
            trackModalAbandoned('verify', commitment.id);
            setVerifyOpen(false);
          }}
        />
      )}

      {outcomeOpen && (
        <LogCommitmentOutcomeModal
          commitmentId={commitment.id}
          goalId={commitment.goal_id}
          taskDetail={commitment.task_detail}
          onSuccess={() => {
            trackCommitmentOutcomeSaved(commitment.id, 'outcome_form');
            onUpdated();
          }}
          onClose={() => setOutcomeOpen(false)}
        />
      )}
    </div>
  );
}
