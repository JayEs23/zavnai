import React from 'react';
import { MdEvent } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { FormTextarea } from '../shared/FormTextarea';
import { FormInput } from '../shared/FormInput';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step3SmartGoal({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4">
          <label className="block font-bold flex items-center gap-2">
            <MdEvent className="text-primary"/> Specific Goal
          </label>
          <FormTextarea
            className="h-32"
            placeholder="e.g. Walk 10,000 steps daily for 3 months..."
            value={profile.goal}
            onChange={e => setProfile({...profile, goal: e.target.value})}
          />
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4">
          <label className="block font-bold">Success Criteria</label>
          <FormInput
            placeholder="How will we measure this?"
            value={profile.successCriteria}
            onChange={e => setProfile({...profile, successCriteria: e.target.value})}
          />
        </div>
        <NavigationButtons
          onPrev={onPrev}
          onNext={onNext}
          nextLabel="Confirm Goal"
          nextDisabled={!profile.goal.trim()}
        />
      </div>
      <aside className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800 h-fit">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-primary/20" />
          <h3 className="font-bold">Doyn&apos;s Advice</h3>
        </div>
        <p className="text-sm text-slate-400 italic">
          &quot;Instead of &apos;be healthier&apos;, try: &apos;Reduce sugar intake to 25g/day for 30 days.&apos;&quot;
        </p>
      </aside>
    </div>
  );
}

