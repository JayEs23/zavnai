import React from 'react';
import { MdPlayArrow, MdPause } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { useTTS } from '../hooks/useTTS';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step2VoiceIntro({ profile, onNext, onPrev }: OnboardingStepProps) {
  const fullName = [profile.firstName, profile.middleName, profile.lastName]
    .filter(Boolean)
    .join(' ');

  const welcomeSpeech = fullName
    ? `Welcome to ZAVN, ${fullName}. I'm Echo, your voice-first reflection partner. Together with Doyn, we'll help you align your intentions with your actions. Echo listens to your mental models and helps you notice patterns, while Doyn turns your complex plans into immediate, friction-free movement. Let's begin your journey of alignment.`
    : `Welcome to ZAVN. I'm Echo, your voice-first reflection partner. Together with Doyn, we'll help you align your intentions with your actions. Echo listens to your mental models and helps you notice patterns, while Doyn turns your complex plans into immediate, friction-free movement. Let's begin your journey of alignment.`;

  const { isPlaying, currentTime, duration, handlePlayPause, formatTime, isSupported } = useTTS(welcomeSpeech);

  return (
    <div className="text-center space-y-8 py-10">
      <div className="relative mx-auto max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col items-center gap-6 md:flex-row">
          <button
            onClick={handlePlayPause}
            disabled={!isSupported}
            className="group relative flex size-20 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPlaying ? (
              <MdPause className="text-3xl" />
            ) : (
              <MdPlayArrow className="text-3xl" />
            )}
            <div className={`absolute inset-0 rounded-full border-2 border-primary opacity-20 ${isPlaying ? 'animate-ping' : 'group-hover:animate-ping'}`} />
          </button>
          <div className="flex-1 text-center md:text-left">
            <h3 className="mb-1 text-lg font-bold">
              Listen to your Echo welcome
            </h3>
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
              A short intro on how Echo and Doyn will work with you to align
              intention and action.
            </p>
            <p className="text-xs font-mono text-primary/70">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>
        </div>
      </div>
      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

