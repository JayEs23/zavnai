import React from 'react';
import { MdCheckCircle, MdArrowForward, MdGpsFixed, MdAnalytics, MdUpcoming } from 'react-icons/md';
import { OnboardingStepProps } from '../types';

interface Step12SuccessProps extends Omit<OnboardingStepProps, 'onNext'> {
  onNext: () => void;
  loading?: boolean;
}

export function Step12Success({ profile, onNext, loading }: Step12SuccessProps) {
  return (
    <div className="text-center space-y-12 py-10 relative">
      <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full" />
      
      <div className="relative space-y-6">
        <div className="size-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
          <MdCheckCircle size={48} />
        </div>
        <h1 className="text-5xl font-black">Alignment Achieved.</h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Your profile baseline is set. We&apos;ve tailored your ZAVN experience to match your current state.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-2xl text-left space-y-4">
          <MdGpsFixed className="text-primary text-2xl" />
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Primary Intention</p>
            <p className="text-xl font-bold truncate">{profile.goal || 'Focus & Clarity'}</p>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-2xl text-left space-y-4">
          <MdAnalytics className="text-primary text-2xl" />
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Thrive Score</p>
            <p className="text-4xl font-black text-primary">78</p>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[78%]" />
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-2xl text-left space-y-4">
          <MdUpcoming className="text-primary text-2xl" />
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">First Session</p>
            <p className="text-xl font-bold">Tomorrow, 8:00 AM</p>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={loading}
        className="relative w-full max-w-md bg-primary py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Launching...' : 'Begin Journey'} <MdArrowForward size={24} />
      </button>
    </div>
  );
}

