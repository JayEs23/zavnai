import React from 'react';
import { OnboardingStepProps } from '../types';
import { MdInfo } from 'react-icons/md';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step1Basics({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  const isValid =
    profile.firstName.trim() !== '' &&
    profile.lastName.trim() !== '' &&
    profile.username.trim() !== '' &&
    profile.username.length >= 3;

  return (
    <form 
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid) onNext();
      }}
    >
      {/* Row 1: First and Last Name (Side by side) */}
      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex flex-col flex-1">
          <span className="text-[var(--foreground)] text-sm font-semibold mb-2">First Name *</span>
          <input
            className="form-input"
            placeholder="e.g. John"
            required
            type="text"
            value={profile.firstName}
            onChange={e => setProfile({ ...profile, firstName: e.target.value })}
          />
        </label>
        <label className="flex flex-col flex-1">
          <span className="text-[var(--foreground)] text-sm font-semibold mb-2">Last Name *</span>
          <input
            className="form-input"
            placeholder="e.g. Doe"
            required
            type="text"
            value={profile.lastName}
            onChange={e => setProfile({ ...profile, lastName: e.target.value })}
          />
        </label>
      </div>

      {/* Row 2: Middle Name (Optional) */}
      <label className="flex flex-col w-full">
        <span className="text-[var(--foreground)] text-sm font-semibold mb-2">
          Middle Name <span className="text-[var(--muted-foreground)] font-normal">(Optional)</span>
        </span>
        <input
          className="form-input"
          placeholder="Optional middle name"
          type="text"
          value={profile.middleName}
          onChange={e => setProfile({ ...profile, middleName: e.target.value })}
        />
      </label>

      {/* Row 3: Pronouns (Optional) */}
      <label className="flex flex-col w-full">
        <span className="text-[var(--foreground)] text-sm font-semibold mb-2">
          Pronouns <span className="text-[var(--muted-foreground)] font-normal">(Optional)</span>
        </span>
        <input
          className="form-input"
          placeholder="e.g. they/them"
          type="text"
          value={profile.pronouns}
          onChange={e => setProfile({ ...profile, pronouns: e.target.value })}
        />
      </label>

      {/* Row 4: Username (Required) */}
      <div className="flex flex-col w-full">
        <label className="flex flex-col w-full">
          <span className="text-[var(--foreground)] text-sm font-semibold mb-2">Username *</span>
          <input
            className="form-input"
            minLength={3}
            placeholder="Create a unique username"
            required
            type="text"
            value={profile.username}
            onChange={e => setProfile({
              ...profile,
              username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
            })}
          />
        </label>
        <div className="flex items-center gap-2 mt-2 text-[var(--muted-foreground)]">
          <MdInfo className="text-base" />
          <p className="text-xs">Minimum 3 characters</p>
        </div>
      </div>

      {/* Navigation */}
      <NavigationButtons onPrev={onPrev} onNext={onNext} nextDisabled={!isValid} />
    </form>
  );
}
