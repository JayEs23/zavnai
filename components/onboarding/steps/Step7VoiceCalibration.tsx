import React from 'react';
import { motion } from 'framer-motion';
import { MdMic, MdLock } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step7VoiceCalibration({ onNext, onPrev }: OnboardingStepProps) {
  return (
    <div className="space-y-12 py-6">
      <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-200/60 dark:bg-white/5 dark:border-white/5 space-y-8 shadow-sm">
        <div className="flex justify-center gap-1.5 h-16 items-end">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [12, 50, 18, 40, 12] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.08 }}
              className="w-2 bg-primary rounded-full opacity-80"
            />
          ))}
        </div>
        <p className="text-2xl font-bold italic text-slate-800 dark:text-slate-200 leading-relaxed max-w-xl mx-auto">
          &quot;I&apos;m looking forward to working with Echo to reach my goals. This calibration helps ensure our communication is clear and personalized.&quot;
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <button className="size-28 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/30 active:scale-95 transition-all outline-none ring-offset-4 focus:ring-4 focus:ring-primary/20">
          <MdMic size={48} className="animate-pulse" />
        </button>
        <div className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <MdLock size={16} className="text-primary" /> <span>Encrypted Voice Processing</span>
        </div>
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

