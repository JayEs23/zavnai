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
