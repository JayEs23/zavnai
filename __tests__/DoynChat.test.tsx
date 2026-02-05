/**
 * Tests for DoynChat Component
 * 
 * Tests the chat interface for the Doyn agent.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DoynChat from '@/components/doyn/DoynChat';

// Mock the API
jest.mock('@/services/goalsApi', () => ({
  goalsApi: {
    fetchCommitments: jest.fn().mockResolvedValue([]),
  },
}));

describe('DoynChat Component', () => {
  const mockCommitments = [
    {
      id: 'c1',
      task_detail: 'Complete first draft',
      due_at: '2026-03-01T10:00:00Z',
      status: 'pending',
    },
    {
      id: 'c2',
      task_detail: 'Review and edit',
      due_at: '2026-03-05T10:00:00Z',
      status: 'pending',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render chat interface', () => {
    render(<DoynChat commitments={mockCommitments} />);
    
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('should display welcome message', () => {
    render(<DoynChat commitments={[]} />);
    
    expect(screen.getByText(/hey there/i)).toBeInTheDocument();
  });

  it('should allow user to type message', () => {
    render(<DoynChat commitments={mockCommitments} />);
    
    const input = screen.getByPlaceholderText(/type your message/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello Doyn' } });
    
    expect(input.value).toBe('Hello Doyn');
  });

  it('should send message on button click', async () => {
    render(<DoynChat commitments={mockCommitments} />);
    
    const input = screen.getByPlaceholderText(/type your message/i) as HTMLInputElement;
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Can we reschedule?' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(input.value).toBe(''); // Input should be cleared
    });
    
    // Check if message appears in chat
    expect(screen.getByText('Can we reschedule?')).toBeInTheDocument();
  });

  it('should send message on Enter key', async () => {
    render(<DoynChat commitments={mockCommitments} />);
    
    const input = screen.getByPlaceholderText(/type your message/i);
    
    fireEvent.change(input, { target: { value: 'Hello!' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText('Hello!')).toBeInTheDocument();
    });
  });

  it('should not send empty message', () => {
    render(<DoynChat commitments={mockCommitments} />);
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    const initialMessageCount = screen.queryAllByRole('article').length;
    
    fireEvent.click(sendButton);
    
    const finalMessageCount = screen.queryAllByRole('article').length;
    expect(finalMessageCount).toBe(initialMessageCount);
  });

  it('should display commitments count', () => {
    render(<DoynChat commitments={mockCommitments} />);
    
    expect(screen.getByText(/2 pending commitments/i)).toBeInTheDocument();
  });

  it('should handle empty commitments', () => {
    render(<DoynChat commitments={[]} />);
    
    expect(screen.getByText(/no commitments yet/i)).toBeInTheDocument();
  });
});

