import React from 'react';
import { MdCheckCircle, MdPayments, MdLock } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step11Subscription({ onNext }: OnboardingStepProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-12 py-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">Your 18-Month Journey Starts Here.</h1>
        <p className="text-body text-lg font-medium">Experience full access to ZAVN free for 7 days.</p>
      </div>

      <div className="card border-[var(--border-subtle)] p-10 space-y-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MdPayments size={120} className="text-primary" />
        </div>

        <div className="relative pl-12 space-y-12">
          <div className="absolute left-[23px] top-3 bottom-3 w-1 bg-gradient-to-b from-[var(--primary)] to-[var(--muted)] rounded-full" />

          <div className="relative group">
            <div className="absolute -left-[35px] bg-primary rounded-full p-1.5 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <MdCheckCircle className="text-white text-xl" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-xl text-[var(--foreground)]">Today: Start your 7-day free trial</h4>
              <p className="text-[var(--primary)] font-black uppercase tracking-widest text-sm">$0.00 Due Now</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -left-[35px] bg-[var(--card-bg)] rounded-full p-1.5 border-2 border-[var(--border-subtle)] transition-transform group-hover:scale-110">
              <MdPayments className="text-[var(--muted-foreground)] text-xl" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-xl text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--foreground)]">Day 7: Subscription begins</h4>
              <p className="text-[var(--muted-foreground)]/60 text-sm font-medium">$99/year starts automatically</p>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-6">
          <button
            onClick={onNext}
            className="w-full btn-primary py-5 rounded-2xl font-bold text-xl active:scale-95 transition-all"
          >
            Activate My Journey
          </button>
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center justify-center gap-2">
            <MdLock size={14} className="text-primary" /> <span>Secure Checkout • Cancel Anytime</span>
          </p>
        </div>
      </div>
    </div>
  );
}

