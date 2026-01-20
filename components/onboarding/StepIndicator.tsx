/**
 * Step indicator component for onboarding progress
 */

import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  completedSteps,
}: StepIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;
          const isPast = step < currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-6 h-6"
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
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCurrent ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  Step {step}
                </span>
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    isPast || isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

