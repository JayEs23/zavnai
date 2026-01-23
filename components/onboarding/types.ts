export type CapacityLevel = 'high' | 'moderate' | 'restricted' | 'none';

export interface OnboardingProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  pronouns: string;
  username: string;
  goal: string;
  successCriteria: string;
  targetDate: string;
  patterns: string[];
  tribe: TribeMember[];
  capacity: Record<string, CapacityLevel>;
  verification: string[];
  subscriptionSelected: boolean;
}

export interface TribeMember {
  name: string;
  relationship: 'Friend' | 'Colleague' | 'Partner';
  contact: string;
}

export interface OnboardingStepProps {
  profile: OnboardingProfile;
  setProfile: React.Dispatch<React.SetStateAction<OnboardingProfile>>;
  onNext: () => void;
  onPrev: () => void;
}

/**
 * Structured onboarding response with full context for AI models
 */
export interface StructuredOnboardingResponse {
  step: number;
  stepName: string;
  stepTitle: string;
  question: string;
  questionContext?: string;
  responseType: 'single_choice' | 'multiple_choice' | 'text' | 'date' | 'grid' | 'list' | 'boolean';
  response: any;
  responseMetadata?: {
    options?: string[];
    labels?: Record<string, string>;
    units?: string | Record<string, string>;
    format?: string;
  };
  timestamp: string;
  additionalContext?: Record<string, any>;
}
