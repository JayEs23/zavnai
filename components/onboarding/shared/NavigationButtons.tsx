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
    <div className="flex justify-between items-center border-t border-slate-800 pt-8">
      <button
        onClick={onPrev}
        className="text-slate-500 font-bold hover:text-slate-300 transition-colors"
      >
        {prevLabel}
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={`bg-primary px-12 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed ${nextClassName}`}
      >
        {nextLabel}
      </button>
    </div>
  );
}

