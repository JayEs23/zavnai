/**
 * Step 2: Username selection component with real-time validation
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { UsernameStepData } from '@/services/onboardingApi';
import { onboardingApi } from '@/services/onboardingApi';

interface UsernameStepProps {
  onNext: (data: UsernameStepData) => void;
  initialData?: Partial<UsernameStepData>;
  isLoading?: boolean;
}

export default function UsernameStep({
  onNext,
  initialData = {},
  isLoading = false,
}: UsernameStepProps) {
  const [username, setUsername] = useState(initialData.username || '');
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
  }>({ checked: false, available: false, message: '' });

  // Debounced username check
  const checkUsername = useCallback(
    debounce(async (value: string) => {
      if (value.length < 3) {
        setAvailability({
          checked: false,
          available: false,
          message: 'Username must be at least 3 characters',
        });
        return;
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
        setAvailability({
          checked: true,
          available: false,
          message: 'Username can only contain letters, numbers, underscores, and hyphens',
        });
        return;
      }

      setIsChecking(true);
      try {
        const result = await onboardingApi.checkUsername(value);
        setAvailability({
          checked: true,
          available: result.available,
          message: result.message,
        });
      } catch (error: any) {
        setAvailability({
          checked: true,
          available: false,
          message: error.message || 'Error checking username',
        });
      } finally {
        setIsChecking(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (username) {
      checkUsername(username);
    } else {
      setAvailability({ checked: false, available: false, message: '' });
    }

    return () => {
      checkUsername.cancel();
    };
  }, [username, checkUsername]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (availability.checked && availability.available) {
      onNext({ username });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choose your username
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This is how others will identify you on ZAVN
        </p>
      </div>

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Username <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">@</span>
          </div>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              availability.checked
                ? availability.available
                  ? 'border-green-500'
                  : 'border-red-500'
                : 'border-gray-300'
            }`}
            placeholder="johndoe"
            disabled={isLoading}
            pattern="[a-zA-Z0-9_-]+"
            minLength={3}
            maxLength={20}
          />
          {isChecking && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {availability.checked && (
          <div className="mt-2">
            {availability.available ? (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {availability.message}
              </p>
            ) : (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {availability.message}
              </p>
            )}
          </div>
        )}

        <p className="mt-2 text-xs text-gray-500">
          3-20 characters, letters, numbers, underscores, and hyphens only
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !availability.available || isChecking}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </form>
  );
}

