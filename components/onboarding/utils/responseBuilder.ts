/**
 * Utility functions to build structured onboarding responses
 * with full context for AI models
 */

import { StructuredOnboardingResponse } from '../types';

export interface StepConfig {
  step: number;
  stepName: string;
  stepTitle: string;
  question: string;
  questionContext?: string;
}

const STEP_CONFIGS: Record<number, StepConfig> = {
  1: {
    step: 1,
    stepName: 'personal_details',
    stepTitle: "Let's start with you",
    question: 'How should Echo and Doyn address you?',
    questionContext: 'Collecting personal identification information including name, pronouns, and username for personalized interactions.',
  },
  2: {
    step: 2,
    stepName: 'voice_intro',
    stepTitle: 'Welcome to your journey',
    question: 'Listen to your Echo welcome',
    questionContext: 'Introduction to Echo and Doyn, the voice-first reflection partner and action facilitator.',
  },
  3: {
    step: 3,
    stepName: 'initial_goal',
    stepTitle: "Let's make it official",
    question: 'What is your specific goal?',
    questionContext: 'Initial goal setting to understand the user\'s primary intention and direction.',
  },
  4: {
    step: 4,
    stepName: 'patterns',
    stepTitle: 'What looks familiar?',
    question: 'Select patterns that have shaped your work life.',
    questionContext: 'Identifying behavioral patterns and obstacles that may impact goal achievement.',
  },
  5: {
    step: 5,
    stepName: 'capacity',
    stepTitle: 'Reality Check',
    question: 'Paint your weekly rhythm of energy and focus.',
    questionContext: 'Mapping weekly capacity and energy levels across different times and days to understand availability patterns.',
  },
  6: {
    step: 6,
    stepName: 'tribe',
    stepTitle: 'Assemble Your Tribe',
    question: 'Nominate your Social Mirrors for an honest look at your journey.',
    questionContext: 'Identifying accountability partners who will provide social verification and support.',
  },
  7: {
    step: 7,
    stepName: 'voice_calibration',
    stepTitle: 'Sync Your Voice',
    question: 'Read the text below so Echo can learn your unique tone.',
    questionContext: 'Voice calibration to personalize Echo\'s interaction style and communication approach.',
  },
  8: {
    step: 8,
    stepName: 'verification',
    stepTitle: 'Choose Your Verification',
    question: 'How do you want to verify your progress?',
    questionContext: 'Selecting verification methods for tracking goal progress: self-reflection, behavioral data, or social accountability.',
  },
  9: {
    step: 9,
    stepName: 'goal_refinement',
    stepTitle: "Let's make it official",
    question: 'Turn your vague intention into a concrete, measurable goal.',
    questionContext: 'Refining the initial goal into a SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goal with success criteria and target date.',
  },
  11: {
    step: 11,
    stepName: 'subscription',
    stepTitle: 'Your 18-Month Journey Starts Here',
    question: 'Start your 7-day free trial?',
    questionContext: 'Optional subscription selection for extended access to ZAVN features.',
  },
};

export function buildStructuredResponse(
  step: number,
  response: any,
  responseType: StructuredOnboardingResponse['responseType'],
  responseMetadata?: StructuredOnboardingResponse['responseMetadata'],
  additionalContext?: Record<string, any>
): StructuredOnboardingResponse | null {
  const config = STEP_CONFIGS[step];
  if (!config) {
    console.warn(`No step config found for step ${step}`);
    return null;
  }

  return {
    step: config.step,
    stepName: config.stepName,
    stepTitle: config.stepTitle,
    question: config.question,
    questionContext: config.questionContext,
    responseType,
    response,
    responseMetadata,
    timestamp: new Date().toISOString(),
    additionalContext,
  };
}

// Specific builders for each step type
export const responseBuilders = {
  patterns: (selectedPatterns: string[]) => {
    const patternLabels: Record<string, string> = {
      proc: 'Procrastination',
      over: 'Over-committing',
      pres: 'External Pressure',
      shiny: 'Shiny Object Syndrome',
      scope: 'Scope Creep',
    };

    return buildStructuredResponse(
      4,
      selectedPatterns,
      'multiple_choice',
      {
        options: Object.keys(patternLabels),
        labels: patternLabels,
      },
      {
        category: 'obstacles',
        description: 'Behavioral patterns that may interfere with goal achievement',
      }
    );
  },

  capacity: (capacityGrid: Record<string, string>) => {
    return buildStructuredResponse(
      5,
      capacityGrid,
      'grid',
      {
        labels: {
          high: 'High Capacity - Peak focus time',
          moderate: 'Moderate Capacity - Medium tasks',
          restricted: 'Restricted Capacity - Small tasks',
          none: 'No Capacity - Rest time',
        },
        format: 'day-time_slot',
      },
      {
        description: 'Weekly capacity mapping showing energy and focus levels',
        gridStructure: {
          days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
          timeSlots: ['06:00', '10:00', '14:00', '18:00', '22:00'],
        },
      }
    );
  },

  tribe: (tribeMembers: Array<{ name: string; relationship: string; contact: string }>) => {
    return buildStructuredResponse(
      6,
      tribeMembers,
      'list',
      {
        labels: {
          Friend: 'Friend - Personal relationship',
          Colleague: 'Colleague - Professional relationship',
          Partner: 'Partner - Close personal or professional partner',
        },
      },
      {
        description: 'Social mirrors for accountability and verification',
        purpose: 'These individuals will receive growth pulses and provide social verification',
      }
    );
  },

  verification: (selectedMethods: string[]) => {
    const methodLabels: Record<string, string> = {
      echo: 'Self-Reflection - Daily check-ins with Echo',
      data: 'Behavioral Data - Sync health & productivity apps',
      tribe: 'Tribe Verification - Social accountability via Mirror',
    };

    return buildStructuredResponse(
      8,
      selectedMethods,
      'multiple_choice',
      {
        options: Object.keys(methodLabels),
        labels: methodLabels,
      },
      {
        description: 'Verification methods for tracking goal progress',
        purpose: 'Combines internal reflection, objective data, and social accountability',
      }
    );
  },

  goalRefinement: (goal: string, successCriteria: string, targetDate: string) => {
    return buildStructuredResponse(
      9,
      {
        goal,
        successCriteria,
        targetDate,
      },
      'text',
      {
        format: 'SMART',
        units: {
          targetDate: 'ISO 8601 date format',
        },
      },
      {
        description: 'Refined SMART goal with success criteria and target date',
        goalFramework: 'SMART (Specific, Measurable, Achievable, Relevant, Time-bound)',
      }
    );
  },

  subscription: (selected: boolean) => {
    return buildStructuredResponse(
      11,
      selected,
      'boolean',
      undefined,
      {
        description: 'Subscription selection for extended access',
        trialPeriod: '7 days',
        pricing: '$99/year after trial',
      }
    );
  },
};

