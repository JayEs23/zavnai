import React from 'react';
import { OnboardingStepProps } from '../types';

export function Step1Basics({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  const isValid =
    profile.firstName.trim() !== '' &&
    profile.lastName.trim() !== '' &&
    profile.username.trim() !== '' &&
    profile.username.length >= 3;

  return (
    <form 
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid) onNext();
      }}
    >
      {/* Row 1: First and Last Name (Side by side) */}
      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex flex-col flex-1">
          <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">First Name *</p>
          <input
            className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
            placeholder="e.g. John"
            required
            type="text"
            value={profile.firstName}
            onChange={e => setProfile({ ...profile, firstName: e.target.value })}
          />
        </label>
        <label className="flex flex-col flex-1">
          <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">Last Name *</p>
          <input
            className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
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
        <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
          Middle Name <span className="text-gray-400 font-normal">(Optional)</span>
        </p>
        <input
          className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
          placeholder="Optional middle name"
          type="text"
          value={profile.middleName}
          onChange={e => setProfile({ ...profile, middleName: e.target.value })}
        />
      </label>

      {/* Row 3: Pronouns (Optional) */}
      <label className="flex flex-col w-full">
        <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
          Pronouns <span className="text-gray-400 font-normal">(Optional)</span>
        </p>
        <input
          className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
          placeholder="e.g. they/them"
          type="text"
          value={profile.pronouns}
          onChange={e => setProfile({ ...profile, pronouns: e.target.value })}
        />
      </label>

      {/* Row 4: Username (Required) */}
      <div className="flex flex-col w-full">
        <label className="flex flex-col w-full">
          <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">Username *</p>
          <div className="relative">
            <input
              className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
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
          </div>
        </label>
        <div className="flex items-center gap-1.5 mt-2 text-gray-500 dark:text-gray-400">
          <span className="material-symbols-outlined text-sm">info</span>
          <p className="text-xs font-normal">Minimum 3 characters</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-8 pb-4">
        <button
          type="submit"
          disabled={!isValid}
          className="w-full h-14 bg-primary  transition-colors text-black font-bold text-lg rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
