'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { goalsApi, GoalSummary } from '@/services/goalsApi';
import { api } from '@/lib/api';
import { MdSend, MdSmartToy, MdPerson, MdArrowBack } from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';

interface DoynMessage {
  id: string;
  role: 'user' | 'doyn';
  content: string;
  timestamp: string;
  action?: string;
}

export default function DoynGoalPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params.goalId as string;

  const [goal, setGoal] = useState<GoalSummary | null>(null);
  const [messages, setMessages] = useState<DoynMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGoalAndChat();
  }, [goalId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadGoalAndChat = async () => {
    try {
      setInitializing(true);
      
      // Load goal with insights
      const goalData = await goalsApi.get(goalId);
      setGoal(goalData);

      // Load chat history for this goal
      const history = await loadChatHistory(goalId);
      
      if (history.length === 0) {
        // Welcome message with context from insights
        const welcomeMessage = buildWelcomeMessage(goalData);
        setMessages([
          {
            id: '1',
            role: 'doyn',
            content: welcomeMessage,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        setMessages(history);
      }
    } catch (error) {
      console.error('Error loading goal and chat:', error);
      router.push('/dashboard');
    } finally {
      setInitializing(false);
    }
  };

  const loadChatHistory = async (goalId: string): Promise<DoynMessage[]> => {
    try {
      const response = await api.get<DoynMessage[]>(`/api/agents/doyn/history/${goalId}?limit=20`);
      return response;
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  };

  const buildWelcomeMessage = (goal: GoalSummary): string => {
    let message = `Hey! I'm Doyn, your execution agent for "${goal.title}".`;

    // Add context from Echo insights if available
    if (goal.insights) {
      if (goal.insights.motivation) {
        message += `\n\nI know you're driven by: ${goal.insights.motivation}`;
      }

      if (goal.insights.common_excuses && goal.insights.common_excuses.length > 0) {
        const firstExcuse = goal.insights.common_excuses[0];
        message += `\n\nYou told Echo your biggest excuse was "${firstExcuse}". Don't use that on me now.`;
      }

      if (goal.insights.blockers && goal.insights.blockers.length > 0) {
        message += `\n\nI see you've struggled with: ${goal.insights.blockers.join(', ')}. Let's tackle them head-on.`;
      }
    }

    message += `\n\nLet's break this goal down into concrete actions. What's the first thing you need to do?`;

    return message;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !goal) return;

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
      // Send message with goal context and insights
      const response = await api.post<DoynMessage>('/api/agents/doyn/chat', {
        message: input,
        context: {
          goal_id: goalId,
          goal_title: goal.title,
          deadline: goal.deadline,
          insights: goal.insights,
        },
      });

      setMessages((prev) => [...prev, response]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
          <p className="text-lg font-semibold text-foreground">Loading Doyn...</p>
        </div>
      </div>
    );
  }

  if (!goal) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <MdArrowBack size={24} />
            </Link>
            <div className="w-px h-8 bg-border" />
            <div>
              <h1 className="text-lg font-bold text-foreground">{goal.title}</h1>
              <p className="text-sm text-muted-foreground">Working with Doyn</p>
            </div>
          </div>
          
          <Link href="/" className="flex items-center gap-3">
            <Image src="/zavn-icon.png" alt="ZAVN Logo" width={32} height={32} />
            <span className="text-xl font-bold text-foreground hidden sm:inline">ZAVN</span>
          </Link>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'doyn' && (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MdSmartToy className="text-primary text-lg" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-accent text-white'
                      : 'bg-white border border-border text-foreground'
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
                  
                  {message.action && (
                    <div className={`mt-2 pt-2 border-t ${message.role === 'user' ? 'border-white/10' : 'border-border'}`}>
                      <span className="text-xs font-medium">
                        {message.action === 'commitment_created' && '✓ Commitment created'}
                        {message.action === 'commitment_updated' && '✓ Commitment updated'}
                        {message.action === 'deadline_extended' && '⏱ Deadline extended'}
                        {message.action === 'micro_win_suggested' && '🎯 Micro-win suggested'}
                      </span>
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <MdPerson className="text-muted-foreground text-lg" />
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MdSmartToy className="text-primary text-lg" />
                </div>
                <div className="bg-white border border-border rounded-2xl px-5 py-3">
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
          <div className="bg-white border-t border-border p-4">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell Doyn what you need to do..."
                className="flex-1 resize-none border border-border rounded-2xl px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={1}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-primary to-accent text-white rounded-2xl px-6 py-3 font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <MdSend />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 px-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

