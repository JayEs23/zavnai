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
    <div className="flex justify-between items-center border-t border-slate-100 mt-8 pt-10 dark:border-white/5">
      <button
        onClick={onPrev}
        className="text-slate-500 font-bold hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors px-4 py-2"
      >
        {prevLabel}
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={`bg-primary text-white border-none px-12 py-4.5 rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none ${nextClassName}`}
      >
        {nextLabel}
      </button>
    </div>
  );
}

