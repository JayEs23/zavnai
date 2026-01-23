import React from 'react';
import { motion } from 'framer-motion';
import { MdMic, MdLock } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step7VoiceCalibration({ onNext, onPrev }: OnboardingStepProps) {
  return (
    <div className="text-center space-y-8">
      <div className="bg-slate-800/50 p-10 rounded-3xl border border-slate-700 space-y-6">
        <div className="flex justify-center gap-1 h-12 items-end">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [10, 40, 15, 30, 10] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
              className="w-1.5 bg-primary rounded-full"
            />
          ))}
        </div>
        <p className="text-2xl font-medium italic text-slate-200">
          &quot;I&apos;m looking forward to working with Echo to reach my goals. This calibration helps ensure our communication is clear and personalized.&quot;
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button className="h-20 w-20 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
          <MdMic size={40} />
        </button>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <MdLock size={12} /> Encrypted Voice Processing
        </div>
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

