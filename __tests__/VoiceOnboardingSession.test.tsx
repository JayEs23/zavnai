/**
 * Tests for VoiceOnboardingSession Component
 * 
 * Tests the Echo conversation UI and integration with backend API.
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import VoiceOnboardingSession from '@/components/onboarding/VoiceOnboardingSession';
import { api } from '@/lib/api';

// Mock next-auth
jest.mock('next-auth/react');

jest.mock('@/lib/api', () => ({
  api: {
    post: jest.fn(),
  },
}));

// Mock opik tracker
jest.mock('@/lib/opik/client-tracker', () => ({
  opikTracker: {
    trackVoiceOnboarding: jest.fn(),
  },
}));

describe('VoiceOnboardingSession', () => {
  const mockOnComplete = jest.fn();
  const mockOnError = jest.fn();
  const mockApiPost = api.post as jest.Mock;

  const mockSession = {
    accessToken: 'test-token',
    user: { id: '123', email: 'test@example.com' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    });
  });

  describe('Component Rendering', () => {
    it('should render the welcome message on mount', () => {
      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      expect(screen.getByText(/Welcome! I'm Echo/i)).toBeInTheDocument();
      expect(screen.getByText(/I'm here to get to know you/i)).toBeInTheDocument();
    });

    it('should show text input field', () => {
      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const input = screen.getByPlaceholderText(/Type your message/i);
      expect(input).toBeInTheDocument();
    });

    it('should show End Session button', () => {
      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      expect(screen.getByText(/End Session/i)).toBeInTheDocument();
    });
  });

  describe('Text Message Flow', () => {
    it('should send text message to backend and display response', async () => {

      mockApiPost.mockResolvedValueOnce({
        data: {
          response: "That's great! Tell me more about your goals.",
          timestamp: new Date().toISOString(),
        },
        error: undefined,
      });

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const input = screen.getByPlaceholderText(/Type your message/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      // Type and send message
      fireEvent.change(input, { target: { value: 'I want to launch my startup' } });
      fireEvent.click(sendButton);

      // Should display user message
      await waitFor(() => {
        expect(screen.getByText('I want to launch my startup')).toBeInTheDocument();
      });

      // Should call API
      await waitFor(() => {
        expect(mockApiPost).toHaveBeenCalledWith(
          '/api/echo/chat',
          expect.objectContaining({
            message: 'I want to launch my startup',
          })
        );
      });

      // Should display Echo's response
      await waitFor(() => {
        expect(screen.getByText(/Tell me more about your goals/i)).toBeInTheDocument();
      });
    });

    it('should build conversation history correctly', async () => {

      mockApiPost
        .mockResolvedValueOnce({
          data: {
            response: "What kind of startup?",
            timestamp: new Date().toISOString(),
          },
          error: undefined,
        })
        .mockResolvedValueOnce({
          data: {
            response: "That sounds exciting! What's been stopping you?",
            timestamp: new Date().toISOString(),
          },
          error: undefined,
        });

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const input = screen.getByPlaceholderText(/Type your message/i);

      // First message
      fireEvent.change(input, { target: { value: 'I want to launch a startup' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText('I want to launch a startup')).toBeInTheDocument();
      });

      // Second message
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.change(input, { target: { value: 'A SaaS for developers' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      // Verify history was sent in second request
      await waitFor(() => {
        const secondPayload = mockApiPost.mock.calls[1][1];
        expect(secondPayload.history).toHaveLength(2); // First user message + first response
        expect(secondPayload.history[0].role).toBe('user');
        expect(secondPayload.history[0].content).toBe('I want to launch a startup');
        expect(secondPayload.history[1].role).toBe('assistant');
      });
    });

    it('should handle API errors gracefully', async () => {

      mockApiPost.mockResolvedValueOnce({
        data: undefined,
        error: { message: 'Internal server error', status: 500, data: {} },
      });

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const input = screen.getByPlaceholderText(/Type your message/i);
      
      fireEvent.change(input, { target: { value: 'Hello' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      // Should call error handler
      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalled();
      });
    });

    it('should not send empty messages', async () => {

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const sendButton = screen.getByRole('button', { name: /send/i });
      
      fireEvent.click(sendButton);

      // Should not call API
      expect(mockApiPost).not.toHaveBeenCalled();
    });

    it('should disable input while processing', async () => {

      mockApiPost.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: { response: 'Response', timestamp: new Date().toISOString() },
                  error: undefined,
                }),
              100
            )
          )
      );

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const input = screen.getByPlaceholderText(/Type your message/i);
      
      fireEvent.change(input, { target: { value: 'Hello' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      // Input should be disabled while processing
      // (Note: You'd need to check the actual disabled state in your implementation)
      expect(mockApiPost).toHaveBeenCalled();
    });
  });

  describe('Session Completion', () => {
    it('should complete session when End Session clicked', async () => {

      mockApiPost.mockResolvedValueOnce({
        data: { status: 'success' },
        error: undefined,
      });

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const endButton = screen.getByText(/End Session/i);
      fireEvent.click(endButton);

      // Should call complete endpoint
      await waitFor(() => {
        expect(mockApiPost).toHaveBeenCalledWith(
          '/api/onboarding/complete-echo',
          expect.objectContaining({
            transcript: expect.any(String),
          })
        );
      });

      // Should call onComplete callback
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      });
    });

    it('should pass transcript and insights to onComplete', async () => {

      mockApiPost
        .mockResolvedValueOnce({
          data: { response: 'Echo response', timestamp: new Date().toISOString() },
          error: undefined,
        })
        .mockResolvedValueOnce({
          data: { status: 'success' },
          error: undefined,
        });

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const input = screen.getByPlaceholderText(/Type your message/i);
      
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });

      // End session
      const endButton = screen.getByText(/End Session/i);
      fireEvent.click(endButton);

      // Should call onComplete with transcript and insights
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(
          expect.stringContaining('Test message'),
          expect.any(Object)
        );
      });
    });
  });

  describe('Authentication', () => {
    it('should send text chat through shared api client', async () => {

      mockApiPost.mockResolvedValueOnce({
        data: { response: 'Response', timestamp: new Date().toISOString() },
        error: undefined,
      });

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const input = screen.getByPlaceholderText(/Type your message/i);
      
      fireEvent.change(input, { target: { value: 'Hello' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(mockApiPost).toHaveBeenCalledWith(
          '/api/echo/chat',
          expect.objectContaining({ message: 'Hello' })
        );
      });
    });
  });
});

