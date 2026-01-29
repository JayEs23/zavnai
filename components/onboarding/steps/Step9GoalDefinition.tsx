import React, { useState } from 'react';
import { MdGpsFixed, MdVerified, MdCalendarToday, MdAutoAwesome } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { FormTextarea } from '../shared/FormTextarea';
import { FormInput } from '../shared/FormInput';
import { NavigationButtons } from '../shared/NavigationButtons';
import { agentApi } from '@/services/agentApi';

export function Step9GoalDefinition({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  const [isRefining, setIsRefining] = useState(false);

  const refineGoalWithAI = async () => {
    if (!profile.goal.trim()) return;

    setIsRefining(true);
    try {
      // Call Doyn's goal refinement endpoint
      const response = await agentApi.refineGoal({
        goal: profile.goal,
        successCriteria: profile.successCriteria,
        targetDate: profile.targetDate,
      });

      // Update the goal with the refined version
      setProfile(p => ({
        ...p,
        goal: response.refined_goal,
        // Optionally update success criteria if provided
        successCriteria: response.refined_success_criteria || p.successCriteria,
      }));

    } catch (error) {
      console.error("Failed to refine goal:", error);
      // Could show an error toast here
      alert("Failed to refine goal. Please try again.");
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
      <div className="lg:col-span-8 space-y-10">
        <header className="space-y-4">
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">Let&apos;s make it official.</h1>
          <p className="text-[var(--muted-foreground)] text-xl leading-relaxed max-w-2xl">Turn your vague intention into a concrete, measurable goal.</p>
        </header>

        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] p-8 rounded-[2.5rem] border border-[var(--border-subtle)] space-y-5 shadow-sm">
            <label className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)] flex items-center gap-2">
              <MdGpsFixed className="text-[var(--primary)] text-lg" /> <span>Specific Goal</span>
            </label>
            <FormTextarea
              className="min-h-[140px] text-lg"
              placeholder="e.g. Increase daily activity levels..."
              value={profile.goal}
              onChange={e => setProfile({ ...profile, goal: e.target.value })}
            />
          </div>

          <div className="bg-[var(--card-bg)] p-8 rounded-[2.5rem] border border-[var(--border-subtle)] space-y-5 shadow-sm">
            <label className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)] flex items-center gap-2">
              <MdVerified className="text-[var(--primary)] text-lg" /> <span>Success Criteria</span>
            </label>
            <FormInput
              className="h-14 text-lg"
              placeholder="How will we measure success?"
              value={profile.successCriteria}
              onChange={e => setProfile({ ...profile, successCriteria: e.target.value })}
            />
          </div>

          <div className="bg-[var(--card-bg)] p-8 rounded-[2.5rem] border border-[var(--border-subtle)] space-y-5 shadow-sm">
            <label className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)] flex items-center gap-2">
              <MdCalendarToday className="text-[var(--primary)] text-lg" /> <span>Target Date</span>
            </label>
            <input
              type="date"
              className="input-field h-14"
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

      <aside className="lg:col-span-4 bg-[var(--primary)]/5 border border-[var(--primary)]/10 p-10 rounded-[3rem] flex flex-col justify-between min-h-[520px] shadow-sm">
        <div className="space-y-8">
          <div className="flex gap-4 items-center">
            <div className="size-14 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20">
              <MdAutoAwesome size={28} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[var(--foreground)]">Doyn AI</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">Goal Architect</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Quick Suggestions</p>
            <div className="p-6 bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl italic text-sm leading-relaxed text-[var(--muted-foreground)]">
              &quot;Instead of &apos;be healthier&apos;, try: &apos;Reduce sugar intake to 25g/day for 30 days.&apos;&quot;
            </div>
          </div>
        </div>

        <button
          onClick={refineGoalWithAI}
          disabled={isRefining || !profile.goal.trim()}
          className="w-full py-4.5 bg-[var(--card-bg)] border border-[var(--primary)]/20 text-[var(--primary)] rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <MdAutoAwesome className={isRefining ? 'animate-spin' : ''} />
          {isRefining ? 'Architecting...' : 'Refine with Doyn AI'}
        </button>
      </aside>
    </div>
  );
}

