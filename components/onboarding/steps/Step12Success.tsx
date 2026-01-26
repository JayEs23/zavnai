import React from 'react';
import { MdCheckCircle, MdArrowForward, MdGpsFixed, MdAnalytics, MdUpcoming } from 'react-icons/md';
import { OnboardingStepProps } from '../types';

interface Step12SuccessProps extends Omit<OnboardingStepProps, 'onNext'> {
  onNext: () => void;
  loading?: boolean;
}

export function Step12Success({ profile, onNext, loading }: Step12SuccessProps) {
  return (
    <div className="text-center space-y-16 py-10 relative">
      <div className="absolute inset-x-0 top-0 h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="relative space-y-6">
        <div className="size-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary shadow-inner">
          <MdCheckCircle size={56} className="animate-in zoom-in duration-500" />
        </div>
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-white/60">
          Alignment Achieved.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-xl leading-relaxed">
          Your profile baseline is set. We&apos;ve tailored your ZAVN experience to match your current state.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-4xl mx-auto">
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 p-10 rounded-[2.5rem] text-left space-y-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <MdGpsFixed size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">Intention</p>
            <p className="text-xl font-extrabold dark:text-white truncate">{profile.goal || 'Focus & Clarity'}</p>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 p-10 rounded-[2.5rem] text-left space-y-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <MdAnalytics size={24} />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">Thrive Potential</p>
            <div className="flex items-baseline gap-1">
              <p className="text-5xl font-black text-primary">78</p>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[78%] transition-all duration-1000 ease-out" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 p-10 rounded-[2.5rem] text-left space-y-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <MdUpcoming size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">First Session</p>
            <p className="text-xl font-extrabold dark:text-white transition-all">Tomorrow, 8:00 AM</p>
          </div>
        </div>
      </div>

      <div className="pt-10">
        <button
          onClick={onNext}
          disabled={loading}
          className="relative w-full max-w-sm bg-slate-900 dark:bg-primary py-6 rounded-2xl font-black text-xl text-white flex items-center justify-center gap-4 shadow-2xl hover:scale-[1.03] active:scale-95 transition-all mx-auto disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? 'Launching Platform...' : 'Begin My Journey'}
          <MdArrowForward size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

