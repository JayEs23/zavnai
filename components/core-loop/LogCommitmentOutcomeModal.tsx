'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { coreLoopApi } from '@/services/coreLoopApi';
import { MdClose, MdOutlineChat, MdSmartToy } from 'react-icons/md';

type OutcomeOption = 'failed' | 'missed' | 'negotiated';

const OUTCOMES: { value: OutcomeOption; label: string; hint: string }[] = [
  { value: 'failed', label: "Didn't complete", hint: 'You tried or chose not to finish—no shame, just clarity.' },
  { value: 'missed', label: 'Missed / no-show', hint: 'Forgot, ran out of time, or life got in the way.' },
  { value: 'negotiated', label: 'Renegotiated', hint: 'Scope or deadline changed; follow up with Doyn if needed.' },
];

interface LogCommitmentOutcomeModalProps {
  commitmentId: string;
  goalId: string;
  taskDetail: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function LogCommitmentOutcomeModal({
  commitmentId,
  goalId,
  taskDetail,
  onSuccess,
  onClose,
}: LogCommitmentOutcomeModalProps) {
  const [outcome, setOutcome] = useState<OutcomeOption>('failed');
  const [reflection, setReflection] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await coreLoopApi.handleCommitmentOutcome(
        commitmentId,
        outcome,
        reflection.trim() || undefined
      );
      if (!res.success) {
        toast.error(res.error || 'Could not log outcome');
        return;
      }
      toast.success(
        outcome === 'negotiated'
          ? 'Logged. Tweak the plan with Doyn when you are ready.'
          : 'Outcome logged. Reflection helps the next week land better.'
      );
      onSuccess();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-labelledby="outcome-modal-title"
        className="bg-background border border-border rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-background border-b border-border p-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="outcome-modal-title" className="text-lg font-bold text-foreground">
              Log outcome
            </h2>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{taskDetail}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
            aria-label="Close"
          >
            <MdClose size={22} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              What happened?
            </legend>
            {OUTCOMES.map((o) => (
              <label
                key={o.value}
                className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  outcome === o.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                }`}
              >
                <input
                  type="radio"
                  name="outcome"
                  value={o.value}
                  checked={outcome === o.value}
                  onChange={() => setOutcome(o.value)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{o.label}</p>
                  <p className="text-xs text-muted-foreground">{o.hint}</p>
                </div>
              </label>
            ))}
          </fieldset>

          <div>
            <label htmlFor="outcome-reflection" className="text-sm font-medium text-foreground">
              Short note (optional)
            </label>
            <textarea
              id="outcome-reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What do you want your future self to remember about this moment?"
              rows={4}
              className="mt-2 w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href={`/echo/reflect/${commitmentId}`}
              className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
            >
              <MdOutlineChat size={16} aria-hidden />
              Deeper reflection
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              href={`/doyn/${goalId}`}
              className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
            >
              <MdSmartToy size={16} aria-hidden />
              Chat with Doyn
            </Link>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background border-t border-border p-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={submit}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting ? 'Saving…' : 'Save outcome'}
          </button>
        </div>
      </div>
    </div>
  );
}
