import React from 'react';
import { MdPsychology, MdDataset, MdGroups, MdCheckCircle } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { VERIFICATION_OPTIONS } from '../constants';
import { NavigationButtons } from '../shared/NavigationButtons';

const VERIFICATION_ICONS = {
  echo: <MdPsychology />,
  data: <MdDataset />,
  tribe: <MdGroups />,
};

export function Step8Verification({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  const toggleVerification = (id: string) => {
    setProfile(prev => ({
      ...prev,
      verification: prev.verification.includes(id)
        ? prev.verification.filter(x => x !== id)
        : [...prev.verification, id]
    }));
  };

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Choose Your Verification</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
          ZAVN combines internal reflection, objective data, and social accountability to keep you aligned.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {VERIFICATION_OPTIONS.map(v => (
          <button
            key={v.id}
            onClick={() => toggleVerification(v.id)}
            className={`relative p-10 rounded-[2.5rem] border-2 text-left transition-all duration-500 hover:-translate-y-2 ${profile.verification.includes(v.id)
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5'
                : 'border-slate-100 bg-slate-50 dark:border-white/5 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10'
              }`}
          >
            <div className={`size-16 rounded-2xl flex items-center justify-center text-3xl mb-8 transition-colors duration-500 ${profile.verification.includes(v.id) ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
              }`}>
              {VERIFICATION_ICONS[v.id as keyof typeof VERIFICATION_ICONS]}
            </div>
            <h3 className="font-extrabold text-xl mb-3 tracking-tight">{v.title}</h3>
            <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{v.desc}</p>
            {profile.verification.includes(v.id) && (
              <div className="absolute top-6 right-6">
                <MdCheckCircle className="text-primary text-2xl animate-in zoom-in duration-300" />
              </div>
            )}
          </button>
        ))}
      </div>

      <NavigationButtons
        onPrev={onPrev}
        onNext={onNext}
        nextLabel="Finalize Setup"
      />
    </div>
  );
}

