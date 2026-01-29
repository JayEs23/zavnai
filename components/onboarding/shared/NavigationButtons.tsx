import React from 'react';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

interface NavigationButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  nextLabel?: string;
  prevLabel?: string;
  nextDisabled?: boolean;
  nextClassName?: string;
}

export function NavigationButtons({
  onPrev,
  onNext,
  nextLabel = 'Continue',
  prevLabel = 'Back',
  nextDisabled = false,
  nextClassName = '',
}: NavigationButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border-subtle)]">
      <button
        onClick={onPrev}
        className="w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-[var(--border-subtle)] text-[var(--muted-foreground)] font-semibold hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-all flex items-center justify-center gap-2"
      >
        <MdArrowBack className="text-xl" />
        {prevLabel}
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={`w-full sm:w-auto px-12 py-3 rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-bold hover:shadow-lg hover:shadow-[var(--primary)]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${nextClassName}`}
      >
        {nextLabel}
        <MdArrowForward className="text-xl" />
      </button>
    </div>
  );
}
