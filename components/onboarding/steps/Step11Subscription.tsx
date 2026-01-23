import React from 'react';
import { MdCheckCircle, MdPayments, MdLock } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step11Subscription({ onNext }: OnboardingStepProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-10 py-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold">Your 18-Month Journey Starts Here.</h1>
        <p className="text-slate-400">Experience full access to ZAVN free for 7 days.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
        <div className="relative pl-10 space-y-10">
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-primary/30" />
          <div className="relative">
            <div className="absolute -left-[31px] bg-primary rounded-full p-1">
              <MdCheckCircle className="text-white" />
            </div>
            <h4 className="font-bold">Today: Start your 7-day free trial</h4>
            <p className="text-primary text-sm font-bold">$0.00 Due Now</p>
          </div>
          <div className="relative">
            <div className="absolute -left-[31px] bg-slate-800 rounded-full p-1 border border-slate-700">
              <MdPayments className="text-slate-400" />
            </div>
            <h4 className="font-bold">Day 7: Subscription begins</h4>
            <p className="text-slate-500 text-sm">$99/year starts automatically</p>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-primary py-4 rounded-2xl font-bold text-xl shadow-lg shadow-primary/20"
        >
          Start My Journey
        </button>
        <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
          <MdLock size={14} /> Cancel anytime before Day 7.
        </p>
      </div>
    </div>
  );
}

