import React from 'react';
import { MdEvent, MdBolt } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { FormTextarea } from '../shared/FormTextarea';
import { FormInput } from '../shared/FormInput';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step3SmartGoal({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200/60 dark:bg-white/5 dark:border-white/5 space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 flex items-center gap-2">
            <MdEvent className="text-primary text-lg" /> <span>Specific Goal</span>
          </label>
          <FormTextarea
            className="h-40 text-lg"
            placeholder="e.g. Walk 10,000 steps daily for 3 months..."
            value={profile.goal}
            onChange={e => setProfile({ ...profile, goal: e.target.value })}
          />
        </div>
        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200/60 dark:bg-white/5 dark:border-white/5 space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">Success Criteria</label>
          <FormInput
            className="text-lg"
            placeholder="How will we measure this?"
            value={profile.successCriteria}
            onChange={e => setProfile({ ...profile, successCriteria: e.target.value })}
          />
        </div>
        <NavigationButtons
          onPrev={onPrev}
          onNext={onNext}
          nextLabel="Confirm Goal"
          nextDisabled={!profile.goal.trim()}
        />
      </div>
      <aside className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 h-fit space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <MdBolt className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Doyn&apos;s Advice</h3>
            <p className="text-xs font-medium text-primary uppercase tracking-wider">Coach</p>
          </div>
        </div>
        <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 italic">
          &quot;Instead of &apos;be healthier&apos;, try: &apos;Reduce sugar intake to 25g/day for 30 days.&apos;&quot;
        </p>
      </aside>
    </div>
  );
}

