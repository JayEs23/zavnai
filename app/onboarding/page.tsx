/**
 * Main onboarding wizard page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/onboarding/StepIndicator';
import NameStep from '@/components/onboarding/NameStep';
import UsernameStep from '@/components/onboarding/UsernameStep';
import PreferencesStep from '@/components/onboarding/PreferencesStep';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { onboardingApi } from '@/services/onboardingApi';
import { NameStepData, UsernameStepData, PreferencesStepData } from '@/services/onboardingApi';

export default function OnboardingPage() {
  const router = useRouter();
  const {
    currentStep,
    completedSteps,
    isCompleted,
    stepData,
    isLoading,
    error,
    setStep,
    markStepComplete,
    loadStatus,
  } = useOnboardingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Get user ID from localStorage (should come from auth context in production)
  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

  useEffect(() => {
    if (userId) {
      // Status is fetched from JWT on the backend; userId is only used here
      // to decide whether the user has logged in locally.
      loadStatus();
    }
  }, [userId, loadStatus]);

  const handleStep1 = async (data: NameStepData) => {
    if (!userId) {
      setSubmitError('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onboardingApi.completeStep1(data);
      markStepComplete(1);
      setStep(2);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to save name');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2 = async (data: UsernameStepData) => {
    if (!userId) {
      setSubmitError('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onboardingApi.completeStep2(data);
      markStepComplete(2);
      setStep(3);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to save username');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep3 = async (data: PreferencesStepData) => {
    if (!userId) {
      setSubmitError('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await onboardingApi.completeStep3(data);
      if (response.onboarding_completed) {
        // Redirect to dashboard or next page
        router.push('/dashboard');
      }
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to complete onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please log in to continue onboarding</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={3}
          completedSteps={completedSteps}
        />

        {/* Error Display */}
        {(error || submitError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error || submitError}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {currentStep === 1 && (
            <NameStep
              onNext={handleStep1}
              initialData={stepData.step_1}
              isLoading={isSubmitting}
            />
          )}

          {currentStep === 2 && (
            <UsernameStep
              onNext={handleStep2}
              initialData={stepData.step_2}
              isLoading={isSubmitting}
            />
          )}

          {currentStep === 3 && (
            <PreferencesStep
              onNext={handleStep3}
              initialData={stepData.step_3}
              isLoading={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}

