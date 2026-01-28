import React from 'react';
import { OnboardingStepProps } from '../types';
import { PATTERNS } from '../constants';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step4Patterns({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  return (
    <div className="space-y-8">
      {/* Chips / Behavioral Patterns Section */}
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {PATTERNS.obstacles.map(p => {
          const isSelected = profile.patterns.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => setProfile(prev => ({
                ...prev,
                patterns: prev.patterns.includes(p.id)
                  ? prev.patterns.filter(x => x !== p.id)
                  : [...prev.patterns, p.id]
              }))}
              className={`flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 font-bold shadow-sm transition-all hover:brightness-105 active:scale-95 ${
                isSelected
                  ? 'bg-primary text-[#102216]'
                  : 'border border-[#111813]/10 dark:border-white/20 bg-white dark:bg-white/5 text-[#111813] dark:text-white font-medium hover:bg-primary/10'
              }`}
            >
              {isSelected ? (
                <span className="material-symbols-outlined text-lg">check_circle</span>
              ) : (
                <span className="material-symbols-outlined text-lg opacity-40">circle</span>
              )}
              <span className="text-sm">{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
}
