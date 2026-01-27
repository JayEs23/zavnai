import React from 'react';

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
    <div className="flex justify-between items-center border-t border-[var(--border-subtle)] mt-8 pt-10">
      <button
        onClick={onPrev}
        className="text-[var(--muted-foreground)] font-bold hover:text-[var(--foreground)] transition-colors px-4 py-2"
      >
        {prevLabel}
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={`btn-primary px-12 py-4.5 text-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none ${nextClassName}`}
      >
        {nextLabel}
      </button>
    </div>
  );
}

