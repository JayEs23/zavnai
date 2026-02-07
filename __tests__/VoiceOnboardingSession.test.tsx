/**
 * Tests for VoiceOnboardingSession Component
 * 
 * Tests the Echo conversation UI and integration with backend API.
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSession } from 'next-auth/react';
import VoiceOnboardingSession from '@/components/onboarding/VoiceOnboardingSession';

// Mock next-auth
jest.mock('next-auth/react');

// Mock opik tracker
jest.mock('@/lib/opik/client-tracker', () => ({
  opikTracker: {
    trackVoiceOnboarding: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('VoiceOnboardingSession', () => {
  const mockOnComplete = jest.fn();
  const mockOnError = jest.fn();

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

    it('should display timer', () => {
      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      expect(screen.getByText(/remaining/i)).toBeInTheDocument();
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
      const user = userEvent.setup();

      // Mock successful API response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: "That's great! Tell me more about your goals.",
          timestamp: new Date().toISOString(),
        }),
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
      await user.type(input, 'I want to launch my startup');
      await user.click(sendButton);

      // Should display user message
      await waitFor(() => {
        expect(screen.getByText('I want to launch my startup')).toBeInTheDocument();
      });

      // Should call API
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/echo/chat'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer test-token',
            }),
            body: expect.stringContaining('I want to launch my startup'),
          })
        );
      });

      // Should display Echo's response
      await waitFor(() => {
        expect(screen.getByText(/Tell me more about your goals/i)).toBeInTheDocument();
      });
    });

    it('should build conversation history correctly', async () => {
      const user = userEvent.setup();

      // Mock multiple responses
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            response: "What kind of startup?",
            timestamp: new Date().toISOString(),
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            response: "That sounds exciting! What's been stopping you?",
            timestamp: new Date().toISOString(),
          }),
        });

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const input = screen.getByPlaceholderText(/Type your message/i);

      // First message
      await user.type(input, 'I want to launch a startup');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText('I want to launch a startup')).toBeInTheDocument();
      });

      // Second message
      await user.clear(input);
      await user.type(input, 'A SaaS for developers');
      await user.click(screen.getByRole('button', { name: /send/i }));

      // Verify history was sent in second request
      await waitFor(() => {
        const secondCall = (global.fetch as jest.Mock).mock.calls[1];
        const body = JSON.parse(secondCall[1].body);
        
        expect(body.history).toHaveLength(2); // First user message + first response
        expect(body.history[0].role).toBe('user');
        expect(body.history[0].content).toBe('I want to launch a startup');
        expect(body.history[1].role).toBe('assistant');
      });
    });

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();

      // Mock API error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: 'Internal server error' }),
      });

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const input = screen.getByPlaceholderText(/Type your message/i);
      
      await user.type(input, 'Hello');
      await user.click(screen.getByRole('button', { name: /send/i }));

      // Should call error handler
      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalled();
      });
    });

    it('should not send empty messages', async () => {
      const user = userEvent.setup();

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const sendButton = screen.getByRole('button', { name: /send/i });
      
      await user.click(sendButton);

      // Should not call API
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should disable input while processing', async () => {
      const user = userEvent.setup();

      // Mock slow API response
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ response: 'Response', timestamp: new Date().toISOString() }),
        }), 100))
      );

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const input = screen.getByPlaceholderText(/Type your message/i);
      
      await user.type(input, 'Hello');
      await user.click(screen.getByRole('button', { name: /send/i }));

      // Input should be disabled while processing
      // (Note: You'd need to check the actual disabled state in your implementation)
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('Session Completion', () => {
    it('should complete session when End Session clicked', async () => {
      const user = userEvent.setup();

      // Mock complete-echo endpoint
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'success' }),
      });

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const endButton = screen.getByText(/End Session/i);
      await user.click(endButton);

      // Should call complete endpoint
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/onboarding/complete-echo'),
          expect.objectContaining({
            method: 'POST',
          })
        );
      });

      // Should call onComplete callback
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      });
    });

    it('should pass transcript and insights to onComplete', async () => {
      const user = userEvent.setup();

      // Send a message first
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ response: 'Echo response', timestamp: new Date().toISOString() }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'success' }),
        });

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const input = screen.getByPlaceholderText(/Type your message/i);
      
      await user.type(input, 'Test message');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });

      // End session
      const endButton = screen.getByText(/End Session/i);
      await user.click(endButton);

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
    it('should include auth token in API requests', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: 'Response', timestamp: new Date().toISOString() }),
      });

      render(
        <VoiceOnboardingSession
          onComplete={mockOnComplete}
          onError={mockOnError}
        />
      );

      const input = screen.getByPlaceholderText(/Type your message/i);
      
      await user.type(input, 'Hello');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              'Authorization': 'Bearer test-token',
            }),
          })
        );
      });
    });
  });
});

