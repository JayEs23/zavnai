import React from 'react';
import { MdCheck } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { PATTERNS } from '../constants';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step4Patterns({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 justify-center py-4">
        {PATTERNS.obstacles.map(p => (
          <button
            key={p.id}
            onClick={() => setProfile(prev => ({
              ...prev,
              patterns: prev.patterns.includes(p.id)
                ? prev.patterns.filter(x => x !== p.id)
                : [...prev.patterns, p.id]
            }))}
            className={`flex items-center gap-3 px-8 py-4 rounded-full border-2 font-bold transition-all duration-300 ${profile.patterns.includes(p.id)
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-primary/30 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
              }`}
          >
            {profile.patterns.includes(p.id) ? <MdCheck className="text-xl" /> : <div className="w-5" />}
            {p.label}
          </button>
        ))}
      </div>
      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

