import React, { useState } from 'react';
import { OnboardingStepProps, CapacityLevel } from '../types';
import { TIME_SLOTS, DAYS } from '../constants';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step5Capacity({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  const [activeBrush, setActiveBrush] = useState<CapacityLevel>('high');

  const paintCell = (day: string, slot: string) => {
    const key = `${day}-${slot}`;
    setProfile(p => ({
      ...p,
      capacity: {
        ...p.capacity,
        [key]: p.capacity[key] === activeBrush ? 'none' : activeBrush
      }
    }));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          {(['high', 'moderate', 'restricted'] as const).map(level => (
            <button
              key={level}
              onClick={() => setActiveBrush(level)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                activeBrush === level
                  ? 'border-primary bg-primary/10'
                  : 'border-transparent bg-slate-800'
              }`}
            >
              <div className="font-bold capitalize">{level} Capacity</div>
              <div className="text-xs text-slate-500">
                {level === 'high' ? 'Peak focus' : level === 'moderate' ? 'Medium tasks' : 'Small tasks'}
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="grid grid-cols-8 bg-slate-800/50">
            <div className="p-2" />
            {DAYS.map(d => (
              <div key={d} className="p-2 text-center text-[10px] font-bold text-slate-500">
                {d}
              </div>
            ))}
          </div>
          {TIME_SLOTS.map(slot => (
            <div key={slot.id} className="grid grid-cols-8 border-t border-slate-800">
              <div className="p-2 text-[10px] font-bold text-slate-500 flex flex-col justify-center">
                {slot.id}
                <span className="opacity-50">{slot.label}</span>
              </div>
              {DAYS.map(day => {
                const val = profile.capacity[`${day}-${slot.id}`];
                return (
                  <div
                    key={day}
                    onClick={() => paintCell(day, slot.id)}
                    className={`h-12 border-l border-slate-800 cursor-pointer transition-colors ${
                      val === 'high' ? 'bg-primary' :
                      val === 'moderate' ? 'bg-primary/50' :
                      val === 'restricted' ? 'bg-slate-700' : 'bg-transparent'
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

