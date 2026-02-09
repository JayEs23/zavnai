/**
 * Tests for DoynChat Component
 * 
 * Tests the chat interface for the Doyn agent.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DoynChat } from '@/components/dashboard/DoynChat';

// Mock the API
jest.mock('@/services/doynApi', () => ({
  doynApi: {
    getChatHistory: jest.fn().mockResolvedValue([]),
    sendMessage: jest.fn().mockResolvedValue({
      id: 'd1',
      role: 'doyn',
      content: 'Sure — let’s break that down.',
      timestamp: new Date().toISOString(),
    }),
  },
}));

describe('DoynChat Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render chat interface', () => {
    render(<DoynChat />);
    
    expect(screen.getByPlaceholderText(/tell doyn what you need to do/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('should display welcome message', () => {
    render(<DoynChat />);
    
    expect(screen.getByText(/hey there/i)).toBeInTheDocument();
  });

  it('should allow user to type message', () => {
    render(<DoynChat />);
    
    const input = screen.getByPlaceholderText(/tell doyn what you need to do/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello Doyn' } });
    
    expect(input.value).toBe('Hello Doyn');
  });

  it('should send message on button click', async () => {
    render(<DoynChat />);
    
    const input = screen.getByPlaceholderText(/tell doyn what you need to do/i) as HTMLInputElement;
    const sendButton = screen.getByRole('button', { name: /send message/i });
    
    fireEvent.change(input, { target: { value: 'Can we reschedule?' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(input.value).toBe(''); // Input should be cleared
    });
    
    // Check if message appears in chat
    expect(screen.getByText('Can we reschedule?')).toBeInTheDocument();
  });

  it('should send message on Enter key', async () => {
    render(<DoynChat />);
    
    const input = screen.getByPlaceholderText(/tell doyn what you need to do/i);
    
    fireEvent.change(input, { target: { value: 'Hello!' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText('Hello!')).toBeInTheDocument();
    });
  });

  it('should not send empty message', () => {
    render(<DoynChat />);
    
    const sendButton = screen.getByRole('button', { name: /send message/i });
    const initialMessageCount = screen.queryAllByText(/hey there/i).length;
    
    fireEvent.click(sendButton);
    
    const finalMessageCount = screen.queryAllByText(/hey there/i).length;
    expect(finalMessageCount).toBe(initialMessageCount);
  });
});

