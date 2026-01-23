import React, { useState } from 'react';
import { MdGpsFixed, MdVerified, MdCalendarToday, MdAutoAwesome } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { FormTextarea } from '../shared/FormTextarea';
import { FormInput } from '../shared/FormInput';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step9GoalDefinition({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  const [isRefining, setIsRefining] = useState(false);

  const refineGoalWithAI = async () => {
    setIsRefining(true);
    // Mocking AI response - in production, this would call a backend API
    setTimeout(() => {
      setProfile(p => ({
        ...p,
        goal: "I will establish a high-performance cognitive routine by completing 15 minutes of deep reflection every morning before 9 AM for the next 90 days."
      }));
      setIsRefining(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
      <div className="lg:col-span-8 space-y-6">
        <header className="space-y-3">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight">Let&apos;s make it official.</h1>
          <p className="text-slate-400 text-lg">Turn your vague intention into a concrete, measurable goal.</p>
        </header>

        <div className="space-y-4">
          <div className="bg-[#1c2127] p-6 rounded-2xl border border-slate-800 space-y-4">
            <label className="text-lg font-semibold flex items-center gap-2">
              <MdGpsFixed className="text-primary" /> What is your specific goal?
            </label>
            <FormTextarea
              className="min-h-[120px] bg-[#111418] border-slate-700"
              placeholder="e.g. Increase daily activity levels..."
              value={profile.goal}
              onChange={e => setProfile({...profile, goal: e.target.value})}
            />
          </div>

          <div className="bg-[#1c2127] p-6 rounded-2xl border border-slate-800 space-y-4">
            <label className="text-lg font-semibold flex items-center gap-2">
              <MdVerified className="text-primary" /> Success Criteria
            </label>
            <FormInput
              className="h-12 bg-[#111418] border-slate-700"
              placeholder="How will we measure success?"
              value={profile.successCriteria}
              onChange={e => setProfile({...profile, successCriteria: e.target.value})}
            />
          </div>

          <div className="bg-[#1c2127] p-6 rounded-2xl border border-slate-800 space-y-4">
            <label className="text-lg font-semibold flex items-center gap-2">
              <MdCalendarToday className="text-primary" /> Target Date
            </label>
            <input
              type="date"
              className="w-full bg-[#111418] border border-slate-700 rounded-xl p-4 h-12 focus:ring-1 focus:ring-primary outline-none text-white"
              value={profile.targetDate}
              onChange={e => setProfile({...profile, targetDate: e.target.value})}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={onNext}
            disabled={!profile.goal.trim()}
            className="flex-1 bg-primary py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Goal
          </button>
          <button onClick={onPrev} className="px-8 border border-slate-700 rounded-xl">
            Back
          </button>
        </div>
      </div>

      <aside className="lg:col-span-4 bg-[#1c2127] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between min-h-[500px]">
        <div className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="size-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
              <MdAutoAwesome size={24} />
            </div>
            <div>
              <h3 className="font-bold">Doyn&apos;s Advice</h3>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">AI Goal Assistant</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-slate-400">Quick Suggestions:</p>
            <div className="p-3 bg-[#111418] border border-slate-800 rounded-lg italic text-sm">
              &quot;Instead of &apos;be healthier&apos;, try: &apos;Reduce sugar intake to 25g/day for 30 days.&apos;&quot;
            </div>
          </div>
        </div>

        <button
          onClick={refineGoalWithAI}
          disabled={isRefining || !profile.goal.trim()}
          className="w-full py-3 bg-primary/10 border border-primary/30 text-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdAutoAwesome className={isRefining ? 'animate-spin' : ''} />
          {isRefining ? 'Refining...' : 'Refine with Doyn AI'}
        </button>
      </aside>
    </div>
  );
}

