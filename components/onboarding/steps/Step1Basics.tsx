import React from 'react';
import { OnboardingStepProps } from '../types';
import { FormInput } from '../shared/FormInput';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step1Basics({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  const isValid =
    profile.firstName.trim() !== '' &&
    profile.lastName.trim() !== '' &&
    profile.username.trim() !== '' &&
    profile.username.length >= 3;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          placeholder="First Name"
          value={profile.firstName}
          onChange={e => setProfile({ ...profile, firstName: e.target.value })}
        />
        <FormInput
          placeholder="Last Name"
          value={profile.lastName}
          onChange={e => setProfile({ ...profile, lastName: e.target.value })}
        />
      </div>
      <FormInput
        placeholder="Middle Name (optional)"
        value={profile.middleName}
        onChange={e => setProfile({ ...profile, middleName: e.target.value })}
      />
      <FormInput
        placeholder="Pronouns (optional)"
        value={profile.pronouns}
        onChange={e => setProfile({ ...profile, pronouns: e.target.value })}
      />
      <FormInput
        placeholder="Username"
        value={profile.username}
        onChange={e => setProfile({
          ...profile,
          username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
        })}
      />
      <NavigationButtons
        onNext={onNext}
        onPrev={onPrev}
        nextDisabled={!isValid}
      />
    </div>
  );
}

