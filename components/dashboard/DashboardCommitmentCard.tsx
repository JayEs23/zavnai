'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CommitmentSummary } from '@/services/goalsApi';
import { CommitmentVerification } from '@/components/core-loop/CommitmentVerification';
import { LogCommitmentOutcomeModal } from '@/components/core-loop/LogCommitmentOutcomeModal';
import { MdSchedule, MdDone, MdEditNote, MdOutlineChat, MdSmartToy } from 'react-icons/md';

function commitmentStatusColor(status: string) {
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
}

interface DashboardCommitmentCardProps {
  commitment: CommitmentSummary;
  onUpdated: () => void;
}

export function DashboardCommitmentCard({ commitment, onUpdated }: DashboardCommitmentCardProps) {
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [outcomeOpen, setOutcomeOpen] = useState(false);

  const dueDate = new Date(commitment.due_at);
  const hoursLeft = (dueDate.getTime() - Date.now()) / (1000 * 60 * 60);
  const isUrgent = hoursLeft > 0 && hoursLeft < 2;
  const isOverdue = hoursLeft <= 0 && commitment.status === 'pending';

  const canAct = commitment.status === 'pending' || commitment.status === 'escalated';

  return (
    <div
      className={`bg-white dark:bg-card rounded-2xl border p-5 transition-all ${
        isOverdue ? 'border-red-300 bg-red-50/30 dark:bg-red-950/20' : isUrgent ? 'border-amber-300 bg-amber-50/30 dark:bg-amber-950/20' : 'border-border'
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-medium ${commitmentStatusColor(commitment.status)}`}
            >
              {commitment.status}
            </span>
            <span className="text-sm text-muted-foreground">{commitment.goal_title}</span>
            {isOverdue && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300">
                OVERDUE
              </span>
            )}
            {isUrgent && !isOverdue && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
                DUE SOON
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">{commitment.task_detail}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <MdSchedule className="shrink-0" size={16} />
            Due: {dueDate.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {canAct && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => setVerifyOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            <MdDone size={18} />
            Verify completion
          </button>
          <button
            type="button"
            onClick={() => setOutcomeOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            <MdEditNote size={18} />
            Log other outcome
          </button>
          <Link
            href={`/echo/reflect/${commitment.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <MdOutlineChat size={18} />
            Reflect
          </Link>
          <Link
            href={`/doyn/${commitment.goal_id}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            <MdSmartToy size={18} />
            Doyn
          </Link>
        </div>
      )}

      {!canAct && (
        <div className="mt-3">
          <Link
            href={`/doyn/${commitment.goal_id}`}
            className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            <MdSmartToy size={16} />
            Open goal in Doyn
          </Link>
        </div>
      )}

      {verifyOpen && (
        <CommitmentVerification
          commitmentId={commitment.id}
          commitmentTask={commitment.task_detail}
          onVerified={() => {
            setVerifyOpen(false);
            onUpdated();
          }}
          onCancel={() => setVerifyOpen(false)}
        />
      )}

      {outcomeOpen && (
        <LogCommitmentOutcomeModal
          commitmentId={commitment.id}
          goalId={commitment.goal_id}
          taskDetail={commitment.task_detail}
          onSuccess={onUpdated}
          onClose={() => setOutcomeOpen(false)}
        />
      )}
    </div>
  );
}
