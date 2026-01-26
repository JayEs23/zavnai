import React from 'react';
import { MdCheckCircle, MdPayments, MdLock } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step11Subscription({ onNext }: OnboardingStepProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-12 py-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">Your 18-Month Journey Starts Here.</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Experience full access to ZAVN free for 7 days.</p>
      </div>

      <div className="bg-slate-50 border border-slate-200/60 dark:bg-white/5 dark:border-white/5 rounded-[3rem] p-10 space-y-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MdPayments size={120} className="text-primary" />
        </div>

        <div className="relative pl-12 space-y-12">
          <div className="absolute left-[23px] top-3 bottom-3 w-1 bg-gradient-to-b from-primary to-slate-200 dark:to-white/10 rounded-full" />

          <div className="relative group">
            <div className="absolute -left-[35px] bg-primary rounded-full p-1.5 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <MdCheckCircle className="text-white text-xl" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-xl dark:text-white">Today: Start your 7-day free trial</h4>
              <p className="text-primary font-black uppercase tracking-widest text-sm">$0.00 Due Now</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -left-[35px] bg-white dark:bg-slate-800 rounded-full p-1.5 border-2 border-slate-200 dark:border-white/10 transition-transform group-hover:scale-110">
              <MdPayments className="text-slate-400 text-xl" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-xl text-slate-500 dark:text-slate-400 transition-colors group-hover:text-slate-900 dark:group-hover:text-white">Day 7: Subscription begins</h4>
              <p className="text-slate-400 dark:text-white/30 text-sm font-medium">$99/year starts automatically</p>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-6">
          <button
            onClick={onNext}
            className="w-full bg-primary py-5 rounded-2xl font-bold text-xl text-white shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Activate My Journey
          </button>
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
            <MdLock size={14} className="text-primary" /> <span>Secure Checkout • Cancel Anytime</span>
          </p>
        </div>
      </div>
    </div>
  );
}

