import React from 'react';
import { MdCheck } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { PATTERNS } from '../constants';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step4Patterns({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3 justify-center">
        {PATTERNS.obstacles.map(p => (
          <button
            key={p.id}
            onClick={() => setProfile(prev => ({
              ...prev,
              patterns: prev.patterns.includes(p.id)
                ? prev.patterns.filter(x => x !== p.id)
                : [...prev.patterns, p.id]
            }))}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${
              profile.patterns.includes(p.id)
                ? 'bg-primary border-primary text-white'
                : 'border-slate-700 bg-slate-800 text-slate-300'
            }`}
          >
            {profile.patterns.includes(p.id) && <MdCheck />}
            {p.label}
          </button>
        ))}
      </div>
      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

