/**
 * Step 1: Name collection component
 */

'use client';

import React, { useState } from 'react';
import { NameStepData } from '@/services/onboardingApi';

interface NameStepProps {
  onNext: (data: NameStepData) => void;
  initialData?: Partial<NameStepData>;
  isLoading?: boolean;
}

export default function NameStep({
  onNext,
  initialData = {},
  isLoading = false,
}: NameStepProps) {
  const [formData, setFormData] = useState<NameStepData>({
    first_name: initialData.first_name || '',
    last_name: initialData.last_name || '',
    middle_name: initialData.middle_name || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Let's start with your name
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          We'd like to know what to call you
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="first_name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              errors.first_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John"
            disabled={isLoading}
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="middle_name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Middle Name <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            id="middle_name"
            value={formData.middle_name || ''}
            onChange={(e) =>
              setFormData({ ...formData, middle_name: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Michael"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="last_name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              errors.last_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Doe"
            disabled={isLoading}
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </form>
  );
}

