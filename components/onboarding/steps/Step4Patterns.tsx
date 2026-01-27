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
              ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20 scale-105'
              : 'border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/30 hover:bg-[var(--muted)]'
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

