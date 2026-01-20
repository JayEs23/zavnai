/**
 * Step 3: Preferences and Echo starting points
 */

'use client';

import React, { useState } from 'react';
import { PreferencesStepData } from '@/services/onboardingApi';

interface PreferencesStepProps {
  onNext: (data: PreferencesStepData) => void;
  initialData?: Partial<PreferencesStepData>;
  isLoading?: boolean;
}

const COMMUNICATION_STYLES = [
  { value: 'direct', label: 'Direct', description: 'Straightforward and to the point' },
  { value: 'gentle', label: 'Gentle', description: 'Soft and supportive' },
  { value: 'conversational', label: 'Conversational', description: 'Friendly and engaging' },
] as const;

const TIME_COMMITMENTS = [
  { value: 'low', label: 'Low', description: '15-30 minutes per week' },
  { value: 'medium', label: 'Medium', description: '1-2 hours per week' },
  { value: 'high', label: 'High', description: '3+ hours per week' },
] as const;

const GROWTH_AREAS = [
  'Productivity',
  'Health & Wellness',
  'Finance',
  'Learning',
  'Relationships',
  'Career',
  'Creativity',
  'Mindfulness',
  'Fitness',
  'Personal Development',
];

export default function PreferencesStep({
  onNext,
  initialData = {},
  isLoading = false,
}: PreferencesStepProps) {
  const [formData, setFormData] = useState<PreferencesStepData>({
    communication_style: initialData.communication_style || 'conversational',
    time_commitment: initialData.time_commitment || 'medium',
    growth_areas: initialData.growth_areas || [],
    additional_responses: initialData.additional_responses || {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleGrowthArea = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      growth_areas: prev.growth_areas.includes(area)
        ? prev.growth_areas.filter((a) => a !== area)
        : [...prev.growth_areas, area],
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.growth_areas.length === 0) {
      newErrors.growth_areas = 'Please select at least one growth area';
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tell us about your preferences
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Help Echo understand how to best support you
        </p>
      </div>

      {/* Communication Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Communication Style <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMMUNICATION_STYLES.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() =>
                setFormData({ ...formData, communication_style: style.value })
              }
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                formData.communication_style === style.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
              }`}
            >
              <div className="font-semibold text-gray-900 dark:text-white">
                {style.label}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {style.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Commitment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Time Commitment <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIME_COMMITMENTS.map((commitment) => (
            <button
              key={commitment.value}
              type="button"
              onClick={() =>
                setFormData({ ...formData, time_commitment: commitment.value })
              }
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                formData.time_commitment === commitment.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
              }`}
            >
              <div className="font-semibold text-gray-900 dark:text-white">
                {commitment.label}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {commitment.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Growth Areas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Growth Areas <span className="text-red-500">*</span>
          <span className="text-gray-500 font-normal ml-2">
            (Select all that apply)
          </span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GROWTH_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => toggleGrowthArea(area)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                formData.growth_areas.includes(area)
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
        {errors.growth_areas && (
          <p className="mt-2 text-sm text-red-500">{errors.growth_areas}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Completing...' : 'Complete Onboarding'}
        </button>
      </div>
    </form>
  );
}

