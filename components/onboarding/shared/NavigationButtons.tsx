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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <button
        onClick={onPrev}
        className="w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-xl">arrow_back</span>
        {prevLabel}
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={`w-full sm:w-auto px-12 py-3 rounded-xl bg-primary text-black font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${nextClassName}`}
      >
        {nextLabel}
        <span className="material-symbols-outlined text-xl">arrow_forward</span>
      </button>
    </div>
  );
}
