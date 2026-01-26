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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
      <div className="lg:col-span-8 space-y-10">
        <header className="space-y-4">
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">Let&apos;s make it official.</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl leading-relaxed max-w-2xl">Turn your vague intention into a concrete, measurable goal.</p>
        </header>

        <div className="space-y-6">
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200/60 dark:bg-white/5 dark:border-white/5 space-y-5 shadow-sm">
            <label className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <MdGpsFixed className="text-primary text-lg" /> <span>Specific Goal</span>
            </label>
            <FormTextarea
              className="min-h-[140px] text-lg"
              placeholder="e.g. Increase daily activity levels..."
              value={profile.goal}
              onChange={e => setProfile({ ...profile, goal: e.target.value })}
            />
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200/60 dark:bg-white/5 dark:border-white/5 space-y-5 shadow-sm">
            <label className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <MdVerified className="text-primary text-lg" /> <span>Success Criteria</span>
            </label>
            <FormInput
              className="h-14 text-lg"
              placeholder="How will we measure success?"
              value={profile.successCriteria}
              onChange={e => setProfile({ ...profile, successCriteria: e.target.value })}
            />
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200/60 dark:bg-white/5 dark:border-white/5 space-y-5 shadow-sm">
            <label className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <MdCalendarToday className="text-primary text-lg" /> <span>Target Date</span>
            </label>
            <input
              type="date"
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 h-14 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:bg-transparent dark:border-white/10 dark:text-white dark:focus:ring-primary/20"
              value={profile.targetDate}
              onChange={e => setProfile({ ...profile, targetDate: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pt-6">
          <NavigationButtons
            onPrev={onPrev}
            onNext={onNext}
            nextLabel="Lock in Goal"
            nextDisabled={!profile.goal.trim()}
            nextClassName="flex-1 w-full sm:w-auto"
          />
        </div>
      </div>

      <aside className="lg:col-span-4 bg-primary/5 border border-primary/10 p-10 rounded-[3rem] flex flex-col justify-between min-h-[520px] shadow-sm">
        <div className="space-y-8">
          <div className="flex gap-4 items-center">
            <div className="size-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <MdAutoAwesome size={28} />
            </div>
            <div>
              <h3 className="font-bold text-lg dark:text-white">Doyn AI</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Goal Architect</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick Suggestions</p>
            <div className="p-6 bg-white border border-slate-100 dark:bg-white/5 dark:border-white/10 rounded-2xl italic text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              &quot;Instead of &apos;be healthier&apos;, try: &apos;Reduce sugar intake to 25g/day for 30 days.&apos;&quot;
            </div>
          </div>
        </div>

        <button
          onClick={refineGoalWithAI}
          disabled={isRefining || !profile.goal.trim()}
          className="w-full py-4.5 bg-white border border-primary/20 text-primary rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:bg-white/5 dark:text-white dark:hover:bg-primary"
        >
          <MdAutoAwesome className={isRefining ? 'animate-spin' : ''} />
          {isRefining ? 'Architecting...' : 'Refine with Doyn AI'}
        </button>
      </aside>
    </div>
  );
}

