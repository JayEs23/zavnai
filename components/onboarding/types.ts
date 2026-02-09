import type { Dispatch, SetStateAction } from 'react';

export interface EchoAgentConfig {
  model: string;
  api_version: string;
  system_instruction: string;
}

export interface EchoAPIResponse {
  onboarding: EchoAgentConfig;
  reflection: EchoAgentConfig;
}

export interface UserProfile {
  gap?: string;
  friction?: string;
  rhythm?: string;
  persona?: string;
  supportSystem?: string;
  completed?: boolean;
  whatWorked?: string;
  blocker?: string;
  nextStep?: string;
}

export type InteractionMode = 'voice' | 'text';

export type CapacityLevel = 'high' | 'moderate' | 'restricted' | 'none';

export interface OnboardingTribeMember {
  name: string;
  relationship: string;
  contact: string;
}

export interface OnboardingProfile {
  firstName: string;
  lastName: string;
  middleName: string;
  pronouns: string;
  username: string;
  interactionMode: InteractionMode;
  goal: string;
  successCriteria: string;
  targetDate: string;
  patterns: string[];
  capacity: Record<string, CapacityLevel>;
  tribe: OnboardingTribeMember[];
  verification: string[];
}

export type StructuredResponseType = 'text' | 'multiple_choice' | 'grid' | 'list' | 'boolean';

export interface StructuredOnboardingResponse {
  step: number;
  stepName: string;
  stepTitle: string;
  question: string;
  questionContext?: string;
  responseType: StructuredResponseType;
  response: unknown;
  responseMetadata?: Record<string, unknown>;
  timestamp: string;
  additionalContext?: Record<string, unknown>;
}

export interface OnboardingStepProps {
  profile: OnboardingProfile;
  setProfile: Dispatch<SetStateAction<OnboardingProfile>>;
  onNext: () => void;
  onPrev: () => void;
}

export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export enum SessionState {
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}
