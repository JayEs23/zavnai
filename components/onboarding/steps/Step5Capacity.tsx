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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          {(['high', 'moderate', 'restricted'] as const).map(level => (
            <button
              key={level}
              onClick={() => setActiveBrush(level)}
              className={`w-full p-6 rounded-[1.5rem] border-2 text-left transition-all duration-300 shadow-sm ${activeBrush === level
                  ? 'border-primary bg-primary/10 scale-[1.02]'
                  : 'border-slate-100 bg-slate-50 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10'
                }`}
            >
              <div className="font-extrabold capitalize text-lg tracking-tight mb-1">{level} Capacity</div>
              <div className="text-sm font-medium text-slate-500 dark:text-white/40 leading-tight">
                {level === 'high' ? 'Peak focus & flow' : level === 'moderate' ? 'Balanced energy' : 'Minimal tasks'}
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 bg-white rounded-[2rem] border border-slate-100 dark:border-white/5 dark:bg-white/5 overflow-hidden shadow-sm">
          <div className="grid grid-cols-8 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
            <div className="p-3" />
            {DAYS.map(d => (
              <div key={d} className="p-3 text-center text-xs font-black text-slate-400 dark:text-white/30 uppercase tracking-widest">
                {d}
              </div>
            ))}
          </div>
          {TIME_SLOTS.map(slot => (
            <div key={slot.id} className="grid grid-cols-8 border-b border-slate-100 dark:border-white/5 last:border-0">
              <div className="p-3 text-[10px] font-black text-slate-400 dark:text-white/30 flex flex-col justify-center border-r border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
                {slot.id}
                <span className="opacity-50 text-[8px]">{slot.label}</span>
              </div>
              {DAYS.map(day => {
                const val = profile.capacity[`${day}-${slot.id}`];
                return (
                  <div
                    key={day}
                    onClick={() => paintCell(day, slot.id)}
                    className={`h-14 border-r border-slate-100 dark:border-white/5 cursor-pointer transition-all last:border-0 hover:bg-primary/5 active:scale-95 ${val === 'high' ? 'bg-primary' :
                        val === 'moderate' ? 'bg-primary/50' :
                          val === 'restricted' ? 'bg-slate-200 dark:bg-white/10' : 'bg-transparent'
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

