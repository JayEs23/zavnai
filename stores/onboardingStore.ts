/**
 * Zustand store for onboarding state
 */

import { create } from 'zustand';
import { onboardingApi } from '@/services/onboardingApi';

interface OnboardingState {
  currentStep: number;
  completedSteps: number[];
  isCompleted: boolean;
  stepData: Record<string, any>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setStep: (step: number) => void;
  setStepData: (step: number, data: any) => void;
  markStepComplete: (step: number) => void;
  loadStatus: () => Promise<void>;
  reset: () => void;
}

const initialState: Pick<
  OnboardingState,
  'currentStep' | 'completedSteps' | 'isCompleted' | 'stepData' | 'isLoading' | 'error'
> = {
  currentStep: 1,
  completedSteps: [],
  isCompleted: false,
  stepData: {},
  isLoading: false,
  error: null,
};

type SetState = (
  partial:
    | Partial<OnboardingState>
    | ((state: OnboardingState) => Partial<OnboardingState>),
  replace?: boolean
) => void;
type GetState = () => OnboardingState;

export const useOnboardingStore = create<OnboardingState>((set: SetState, get: GetState) => ({
  ...initialState,

  setStep: (step: number) => {
    set({ currentStep: step });
  },

  setStepData: (step: number, data: any) => {
    const { stepData } = get();
    set({
      stepData: {
        ...stepData,
        [`step_${step}`]: data,
      },
    });
  },

  markStepComplete: (step: number) => {
    const { completedSteps } = get();
    if (!completedSteps.includes(step)) {
      set({
        completedSteps: [...completedSteps, step],
        currentStep: step + 1,
      });
    }
  },

  loadStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const status = await onboardingApi.getStatus();
      set({
        currentStep: status.current_step,
        completedSteps: status.completed_steps,
        isCompleted: status.is_completed,
        stepData: status.step_data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to load onboarding status',
        isLoading: false,
      });
    }
  },

  reset: () => {
    set(initialState);
  },
}));


