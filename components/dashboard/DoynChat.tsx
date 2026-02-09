'use client';

import React, { useState, useEffect, useRef } from 'react';
import { doynApi, DoynMessage, Commitment } from '@/services/doynApi';
import { MdSend, MdSmartToy, MdPerson } from 'react-icons/md';

interface DoynChatProps {
  onCommitmentUpdate?: (commitment: Commitment) => void;
}

export function DoynChat({ onCommitmentUpdate }: DoynChatProps) {
  const [messages, setMessages] = useState<DoynMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      setInitializing(true);
      const history = await doynApi.getChatHistory(20);
      
      if (history.length === 0) {
        // Welcome message if no history
        setMessages([
          {
            id: '1',
            role: 'doyn',
            content: "Hey there! I'm Doyn, your execution agent. I'm here to help you turn plans into action. What are you working on?",
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        setMessages(history);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Show welcome message on error too
      setMessages([
        {
          id: '1',
          role: 'doyn',
          content: "Hey! I'm Doyn. Let's get things done. What's on your mind?",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setInitializing(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: DoynMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await doynApi.sendMessage(input);
      setMessages((prev) => [...prev, response]);

      // Check if Doyn created/updated a commitment
      if (response.action === 'commitment_created' || response.action === 'commitment_updated') {
        if (response.metadata?.commitment) {
          onCommitmentUpdate?.(response.metadata.commitment as Commitment);
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Show error message from Doyn
      const errorMessage: DoynMessage = {
        id: (Date.now() + 1).toString(),
        role: 'doyn',
        content: "Sorry, I had trouble processing that. Can you try rephrasing?",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading Doyn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-border-subtle p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <MdSmartToy className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Doyn</h2>
            <p className="text-xs text-muted-foreground">Your Execution Agent</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'doyn' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MdSmartToy className="text-primary text-sm" />
              </div>
            )}
            
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              
              {/* Action indicators */}
              {message.action && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <span className="text-xs font-medium opacity-80">
                    {message.action === 'commitment_created' && '✓ Commitment created'}
                    {message.action === 'commitment_updated' && '✓ Commitment updated'}
                    {message.action === 'deadline_extended' && '⏱ Deadline extended'}
                    {message.action === 'micro_win_suggested' && '🎯 Micro-win suggested'}
                  </span>
                </div>
              )}
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <MdPerson className="text-muted-foreground text-sm" />
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MdSmartToy className="text-primary text-sm" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border-subtle p-4">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Tell Doyn what you need to do..."
            className="flex-1 resize-none border border-border-subtle rounded-2xl px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={1}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="bg-primary text-white rounded-2xl px-6 py-3 font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <MdSend />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 px-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

