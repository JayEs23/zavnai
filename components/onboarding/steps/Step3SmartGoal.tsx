import React from 'react';
import { OnboardingStepProps } from '../types';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step3SmartGoal({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-2 space-y-8">
        {/* Goal Textarea */}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col">
            <div className="flex items-center gap-2 pb-2">
              <span className="material-symbols-outlined text-primary text-xl">flag</span>
              <p className="text-[#111813] dark:text-white text-lg font-semibold leading-normal">What is your main goal?</p>
            </div>
            <textarea
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111813] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-background-dark placeholder:text-gray-400 p-4 text-base font-normal leading-normal h-[128px]"
              placeholder="e.g., Increase monthly active users by 20% through targeted organic marketing and product improvements by the end of Q3..."
              value={profile.goal}
              onChange={e => setProfile({ ...profile, goal: e.target.value })}
            />
          </label>
        </div>

        {/* Success Criteria Input */}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col">
            <div className="flex items-center gap-2 pb-2">
              <span className="material-symbols-outlined text-primary text-xl">query_stats</span>
              <p className="text-[#111813] dark:text-white text-lg font-semibold leading-normal">How will you measure success?</p>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 rounded-xl text-[#111813] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-background-dark h-14 placeholder:text-gray-400 px-4 text-base font-normal leading-normal"
              placeholder="e.g., Reach 10,000 MAU by the end of Q4"
              type="text"
              value={profile.successCriteria}
              onChange={e => setProfile({ ...profile, successCriteria: e.target.value })}
            />
          </label>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <NavigationButtons
            onPrev={onPrev}
            onNext={onNext}
            nextLabel="Confirm Goal"
            nextDisabled={!profile.goal.trim()}
          />
        </div>
      </div>

      {/* Right Column: Sidebar Advice */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 sticky top-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <h3 className="text-[#111813] dark:text-white font-bold text-xl">Doyn&apos;s Advice</h3>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            <p>Setting a <span className="text-primary font-bold">SMART</span> goal is the first step toward high performance. Here&apos;s how to refine yours:</p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary font-bold">S</span>
                <p><strong>Specific:</strong> Avoid vague language. Use clear action verbs.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">M</span>
                <p><strong>Measurable:</strong> Include a concrete metric to track your progress.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">T</span>
                <p><strong>Time-bound:</strong> Define a clear deadline or milestone date.</p>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-background-light dark:bg-background-dark rounded-lg border-l-4 border-primary italic">
              &quot;A goal without a timeline is just a dream. Let&apos;s turn your vision into a roadmap.&quot;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
