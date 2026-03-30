'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import { CommitmentSummary } from '@/services/goalsApi';
import { DashboardCommitmentCard } from '@/components/dashboard/DashboardCommitmentCard';

interface CommitmentOffCanvasProps {
  open: boolean;
  commitment: CommitmentSummary | null;
  onClose: () => void;
  onUpdated: () => void;
  /** Called after the slide-out animation finishes (clear local commitment state here). */
  onExitComplete?: () => void;
}

/**
 * Wide right-side panel (max ~56rem) for full commitment actions.
 * Sits above app chrome (z-[100]).
 */
export function CommitmentOffCanvas({
  open,
  commitment,
  onClose,
  onUpdated,
  onExitComplete,
}: CommitmentOffCanvasProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && commitment ? (
        <motion.div
          key={commitment.id}
          className="fixed inset-0 z-[100] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close panel"
            className="absolute inset-0 bg-black/35 dark:bg-black/55 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            className="relative flex h-full w-full max-w-[min(100vw,56rem)] flex-col border-l border-border bg-background shadow-2xl dark:bg-card"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Commitment
                </p>
                <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                  {commitment.goal_title || 'Goal'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-xl p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <MdClose size={22} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6">
              <DashboardCommitmentCard commitment={commitment} onUpdated={onUpdated} embedInPanel />
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
