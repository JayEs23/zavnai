import React from 'react';
import { OnboardingStepProps } from '../types';
import { PATTERNS } from '../constants';
import { NavigationButtons } from '../shared/NavigationButtons';
import { 
  MdTimerOff, 
  MdPriorityHigh, 
  MdGroups, 
  MdBolt, 
  MdTrendingUp,
  MdCheckCircle,
  MdRadioButtonUnchecked
} from 'react-icons/md';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'timer_off': MdTimerOff,
  'priority_high': MdPriorityHigh,
  'groups': MdGroups,
  'bolt': MdBolt,
  'trending_up': MdTrendingUp,
};

export function Step4Patterns({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  return (
    <div className="space-y-8">
      {/* Chips / Behavioral Patterns Section */}
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {PATTERNS.obstacles.map(p => {
          const isSelected = profile.patterns.includes(p.id);
          const Icon = iconMap[p.icon] || MdBolt;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setProfile(prev => ({
                ...prev,
                patterns: prev.patterns.includes(p.id)
                  ? prev.patterns.filter(x => x !== p.id)
                  : [...prev.patterns, p.id]
              }))}
              className={`pattern-pill ${
                isSelected
                  ? 'pattern-pill-selected'
                  : 'pattern-pill-unselected'
              }`}
            >
              {isSelected ? (
                <MdCheckCircle className="text-lg" />
              ) : (
                <Icon className="text-lg opacity-60" />
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
