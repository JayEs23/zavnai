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
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-4xl font-black">Choose Your Verification</h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          ZAVN combines internal reflection, objective data, and social accountability.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VERIFICATION_OPTIONS.map(v => (
          <button
            key={v.id}
            onClick={() => toggleVerification(v.id)}
            className={`relative p-8 rounded-2xl border-2 text-left transition-all ${
              profile.verification.includes(v.id)
                ? 'border-primary bg-primary/5'
                : 'border-slate-800 bg-slate-900'
            }`}
          >
            <div className="text-primary text-5xl mb-4">
              {VERIFICATION_ICONS[v.id as keyof typeof VERIFICATION_ICONS]}
            </div>
            <h3 className="font-bold text-lg mb-2">{v.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
            {profile.verification.includes(v.id) && (
              <MdCheckCircle className="absolute top-4 right-4 text-primary text-xl" />
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

