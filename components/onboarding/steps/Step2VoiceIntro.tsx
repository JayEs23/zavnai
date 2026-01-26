import React from 'react';
import { MdPlayArrow, MdPause, MdChat, MdMic } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { useTTS } from '../hooks/useTTS';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step2VoiceIntro({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  const fullName = [profile.firstName, profile.middleName, profile.lastName]
    .filter(Boolean)
    .join(' ');

  const welcomeSpeech = fullName
    ? `Welcome to ZAVN, ${fullName}. I'm Echo, your voice-first reflection partner. Together with Doyn, we'll help you align your intentions with your actions. Echo listens to your mental models and helps you notice patterns, while Doyn turns your complex plans into immediate, friction-free movement. Let's begin your journey of alignment.`
    : `Welcome to ZAVN. I'm Echo, your voice-first reflection partner. Together with Doyn, we'll help you align your intentions with your actions. Echo listens to your mental models and helps you notice patterns, while Doyn turns your complex plans into immediate, friction-free movement. Let's begin your journey of alignment.`;

  const { isPlaying, currentTime, duration, handlePlayPause, formatTime, isSupported } = useTTS(welcomeSpeech);

  return (
    <div className="space-y-12 py-6">
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-slate-200/60 bg-slate-50 p-8 shadow-sm dark:border-white/5 dark:bg-white/5">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />
        <div className="relative flex flex-col items-center gap-8 md:flex-row">
          <button
            onClick={handlePlayPause}
            disabled={!isSupported}
            className="group relative flex size-24 items-center justify-center rounded-3xl bg-primary text-white shadow-xl shadow-primary/20 transition-all hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPlaying ? (
              <MdPause className="text-4xl" />
            ) : (
              <MdPlayArrow className="text-4xl" />
            )}
            <div className={`absolute inset-0 rounded-3xl border-2 border-primary opacity-20 ${isPlaying ? 'animate-ping' : 'group-hover:animate-ping'}`} />
          </button>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h3 className="text-xl font-bold tracking-tight">
              Listen to your Echo welcome
            </h3>
            <p className="text-base text-slate-500 dark:text-slate-400">
              Echo is your voice-first reflection partner, assisting with mental models and behavioral alignment.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-1 flex-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(currentTime / duration) * 100 || 0}%` }} />
              </div>
              <span className="text-xs font-mono font-bold text-primary">
                {formatTime(currentTime)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {[
          { id: 'voice', icon: MdMic, title: 'Voice First', description: 'Real-time calibration via natural dialogue. Echo as a living mirror.' },
          { id: 'text', icon: MdChat, title: 'Text Focused', description: 'Traditional chat-based reflection. Precise, quiet, and deliberate.' }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setProfile(prev => ({ ...prev, interactionMode: mode.id as any }))}
            className={`flex flex-col items-center p-8 rounded-[2rem] border-2 transition-all group ${profile.interactionMode === mode.id
              ? 'bg-primary/5 border-primary shadow-xl shadow-primary/10'
              : 'bg-white border-slate-200 hover:border-primary/40'
              }`}
          >
            <div className={`size-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${profile.interactionMode === mode.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
              }`}>
              <mode.icon size={32} />
            </div>
            <h4 className={`font-bold mb-2 ${profile.interactionMode === mode.id ? 'text-primary' : 'text-slate-800'}`}>{mode.title}</h4>
            <p className="text-xs text-slate-500 text-center leading-relaxed">{mode.description}</p>
          </button>
        ))}
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

