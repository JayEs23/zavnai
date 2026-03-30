'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { CommitmentSummary } from '@/services/goalsApi';
import { MdSchedule, MdArrowForward, MdRecordVoiceOver } from 'react-icons/md';
import { echoVoiceReflectionHref } from '@/lib/echoCommitmentLinks';
import { trackProductEvent } from '@/lib/productAnalytics';

function hoursUntil(dueAt: string, nowMs: number): number {
  return (new Date(dueAt).getTime() - nowMs) / (1000 * 60 * 60);
}

function urgencyTier(hours: number): number {
  if (hours <= 0) return 0;
  if (hours < 2) return 1;
  if (hours < 24) return 2;
  if (hours < 72) return 3;
  return 4;
}

function formatDueLine(hours: number, overdue: boolean): string {
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

function badgeFor(hours: number, overdue: boolean): { label: string; className: string } {
  if (overdue) {
    return {
      label: 'Overdue',
      className:
        'bg-rose-50 text-rose-800 ring-1 ring-rose-200/60 dark:bg-rose-950/35 dark:text-rose-200 dark:ring-rose-800/45',
    };
  }
  if (hours < 2) {
    return {
      label: 'Due very soon',
      className:
        'bg-amber-50 text-amber-900 ring-1 ring-amber-200/60 dark:bg-amber-950/35 dark:text-amber-200 dark:ring-amber-800/45',
    };
  }
  if (hours < 24) {
    return {
      label: 'Due today',
      className:
        'bg-orange-50 text-orange-900 ring-1 ring-orange-200/55 dark:bg-orange-950/35 dark:text-orange-200 dark:ring-orange-800/45',
    };
  }
  if (hours < 72) {
    return {
      label: 'This week',
      className:
        'bg-amber-50/90 text-amber-900 ring-1 ring-amber-100/90 dark:bg-amber-950/25 dark:text-amber-200 dark:ring-amber-900/40',
    };
  }
  return {
    label: 'Upcoming',
    className:
      'bg-slate-50 text-slate-700 ring-1 ring-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:ring-slate-700/80',
  };
}

interface DashboardNowStripProps {
  commitments: CommitmentSummary[];
}

/**
 * Surfaces the next 1–3 actionable commitments by urgency (doc 16 Phase 2).
 * Uses the full pending list, not goal-filtered view.
 */
export function DashboardNowStrip({ commitments }: DashboardNowStripProps) {
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const items = useMemo(() => {
    const actionable = commitments.filter(
      (c) => c.status === 'pending' || c.status === 'escalated'
    );
    return [...actionable]
      .sort((a, b) => {
        const ha = hoursUntil(a.due_at, nowMs);
        const hb = hoursUntil(b.due_at, nowMs);
        const ta = urgencyTier(ha);
        const tb = urgencyTier(hb);
        if (ta !== tb) return ta - tb;
        return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
      })
      .slice(0, 3);
  }, [commitments, nowMs]);

  if (items.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-border/80 bg-gradient-to-br from-emerald-50/40 via-white to-white dark:from-emerald-950/20 dark:via-card/95 dark:to-card p-4 sm:p-5 shadow-sm shadow-black/[0.02] dark:shadow-none ring-1 ring-emerald-100/50 dark:ring-emerald-900/20"
      aria-labelledby="dashboard-now-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <div>
          <h2 id="dashboard-now-heading" className="text-base sm:text-lg font-bold text-foreground">
            Now
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Voice check-in uses Echo with this commitment already loaded—no goal picker. Journal is the
            written reflect flow; open panel for verify and Doyn.
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((c) => {
          const h = hoursUntil(c.due_at, nowMs);
          const overdue = h <= 0;
          const rel = formatDueLine(h, overdue);
          const badge = badgeFor(h, overdue);
          const title =
            c.task_detail.charAt(0).toUpperCase() + c.task_detail.slice(1);
          return (
            <li key={c.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/70 bg-white/80 dark:bg-card/80 px-3 py-3 sm:py-2.5">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <MdSchedule
                    className={`shrink-0 mt-0.5 ${
                      overdue
                        ? 'text-rose-500 dark:text-rose-400'
                        : h < 24
                          ? 'text-orange-500 dark:text-orange-400'
                          : 'text-muted-foreground'
                    }`}
                    size={18}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      {c.goal_title && (
                        <span className="text-[11px] text-muted-foreground truncate max-w-[12rem] sm:max-w-xs">
                          {c.goal_title}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                      {title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">{rel}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:min-w-[12.5rem] pl-7 sm:pl-0">
                  <Link
                    href={echoVoiceReflectionHref(c.id)}
                    onClick={() =>
                      trackProductEvent('commitment.now_voice_click', { commitmentId: c.id })
                    }
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/15"
                  >
                    <MdRecordVoiceOver size={16} aria-hidden />
                    Voice check-in
                    <MdArrowForward size={16} aria-hidden />
                  </Link>
                  <div className="flex flex-col sm:flex-row gap-2 md:flex-col">
                    <Link
                      href={`/echo/reflect/${c.id}`}
                      onClick={() =>
                        trackProductEvent('commitment.now_journal_click', { commitmentId: c.id })
                      }
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/80 transition-colors text-center"
                    >
                      Journal
                    </Link>
                    <Link
                      href={`/dashboard/commitments?open=${c.id}`}
                      onClick={() =>
                        trackProductEvent('commitment.now_panel_click', { commitmentId: c.id })
                      }
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/80 transition-colors text-center"
                    >
                      Open panel
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
