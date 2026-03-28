'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { goalsApi, GoalSummary, CommitmentSummary } from '@/services/goalsApi';
import { coreLoopApi, DoynInsights } from '@/services/coreLoopApi';
import { api } from '@/lib/api';
import { MdSend, MdSmartToy, MdPerson, MdArrowBack, MdHandshake } from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';
import FormattedMessageText from '@/components/common/FormattedMessageText';

/** First testable step: align with docs (small, verifiable) and goal category / Echo insights. */
function getFirstProactiveStep(goal: GoalSummary): string {
  const cat = (goal.category || '').toLowerCase();
  const blob = `${goal.title} ${goal.description ?? ''}`.toLowerCase();

  if (cat === 'health' || /health|fitness|workout|run|gym|walk|sleep|nutrition/.test(blob)) {
    return `This week: put one 20–30 minute block on your calendar for the smallest movement that counts toward this goal. Success = the session happened, not a perfect workout.`;
  }
  if (cat === 'work' || /resume|cv|job|ship|code|app|build|product|launch|saas|feature/.test(blob)) {
    return `Ship one user-visible slice this week—one screen, one flow, or one merged change—with something you can point at (screenshot, link, or PR). Not the whole project: one ugly-but-real checkpoint.`;
  }
  if (cat === 'social' || /relationship|family|friend|partner|community/.test(blob)) {
    return `One concrete touchpoint this week (message, call, or scheduled time). Minimum: ~10 minutes, sent or happened—no perfection bar.`;
  }
  if (cat === 'surprise' || /learn|study|course|read|language|skill/.test(blob)) {
    return `One focused 25-minute session with a single named output (e.g. one lesson done, one page of notes). Stop when that output exists.`;
  }
  if (/money|budget|debt|save|finance|invest/.test(blob)) {
    return `One 30-minute session: gather three real numbers you need (balances, dates, or targets). End with one written next action—no new tools until that's done.`;
  }
  return `Pick one concrete, testable action for this week with a clear definition of done—small enough to finish in one sitting.`;
}

function formatDueShort(iso: string): string {
  if (!iso) return 'soon';
  try {
    return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch {
    return iso;
  }
}

interface DoynMessage {
  id: string;
  role: 'user' | 'doyn';
  content: string;
  timestamp: string;
  action?: string;
  thread_id?: string;
}

interface GoalExecutionContext {
  goal_id: string;
  commitment_counts: {
    total: number;
    pending: number;
    escalated: number;
    verified: number;
    failed: number;
    missed: number;
  };
  recent_commitments: Array<{
    id: string;
    task: string;
    status: string;
    due_at?: string | null;
    created_at?: string | null;
    verified_at?: string | null;
    escalation_level: number;
  }>;
  thrive_feedback: {
    thrive_score: number;
    risk_level: string;
    risk_factors: string[];
    recommendations: string[];
    intervention_needed: boolean;
    intensity: string;
    commitment_size: string;
  };
  completion_rate: number;
}

export default function DoynGoalPage() {
  const params = useParams();
  const goalId = params.goalId as string;

  const [goal, setGoal] = useState<GoalSummary | null>(null);
  const [messages, setMessages] = useState<DoynMessage[]>([]);
  const [screenError, setScreenError] = useState<string | null>(null);
  const [doynInsights, setDoynInsights] = useState<DoynInsights | null>(null);
  const [executionContext, setExecutionContext] = useState<GoalExecutionContext | null>(null);
  const [pendingCommitments, setPendingCommitments] = useState<CommitmentSummary[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [selectedCommitmentId, setSelectedCommitmentId] = useState('');
  const [negotiationReason, setNegotiationReason] = useState('');
  const [proposedTask, setProposedTask] = useState('');
  const [proposedDeadline, setProposedDeadline] = useState('');
  const [negotiating, setNegotiating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void loadGoalAndChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setScreenError(null);
      const [goalData, history, insightsData, commitments] = await Promise.all([
        goalsApi.get(goalId),
        loadChatHistory(goalId),
        coreLoopApi.getInsightsForDoyn(goalId),
        goalsApi.getCommitments(goalId),
      ]);
      const contextResponse = await api.get<GoalExecutionContext>(`/api/agents/doyn/context/${goalId}`);

      setGoal(goalData);
      setDoynInsights(insightsData);
      if (contextResponse.data) setExecutionContext(contextResponse.data);
      setPendingCommitments(
        commitments.filter((c) => c.status === 'pending' || c.status === 'escalated')
      );

      if (history.length === 0) {
        const welcomeMessage = buildWelcomeMessage(goalData, {
          pending: commitments.filter((c) => c.status === 'pending' || c.status === 'escalated'),
          insights: insightsData,
          executionContext: contextResponse.data ?? null,
        });
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
      setScreenError('Could not load Doyn right now. Please retry.');
    } finally {
      setInitializing(false);
    }
  };

  const loadChatHistory = async (goalId: string): Promise<DoynMessage[]> => {
    try {
      const response = await api.get<DoynMessage[]>(`/api/agents/doyn/history/${goalId}?limit=20`);
      if (response.error || !response.data) {
        return [];
      }
      return response.data;
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  };

  const buildWelcomeMessage = (
    goal: GoalSummary,
    ctx: {
      pending: CommitmentSummary[];
      insights: DoynInsights | null;
      executionContext: GoalExecutionContext | null;
    }
  ): string => {
    let message = `Hey! I'm Doyn, your execution agent for "${goal.title}".`;

    if (goal.insights?.implementation_style) {
      message += `\n\nEcho noted how you operate: ${goal.insights.implementation_style}. I'll size commitments to match—not generic hustle.`;
    }

    if (goal.insights) {
      if (goal.insights.motivation) {
        message += `\n\nI know you're driven by: ${goal.insights.motivation}`;
      }

      if (goal.insights.common_excuses && goal.insights.common_excuses.length > 0) {
        const firstExcuse = goal.insights.common_excuses[0];
        message += `\n\nYou told Echo "${firstExcuse}" can get in the way—I'll plan smaller steps so that pattern doesn't win by default.`;
      }

      if (goal.insights.blockers && goal.insights.blockers.length > 0) {
        message += `\n\nKnown constraints: ${goal.insights.blockers.join(', ')}. We'll keep this focused and doable.`;
      }
    }

    if (ctx.insights?.recommendations) {
      const { intensity, commitment_size, tone } = ctx.insights.recommendations;
      message += `\n\nThrive-aware plan for this chat: ${intensity} intensity, ${commitment_size} commitment size, ${tone} tone.`;
    }

    if (ctx.pending.length > 0) {
      const first = ctx.pending[0];
      message += `\n\nYou already have a commitment in flight:\n"${first.task_detail}"\nDue: ${formatDueShort(first.due_at)}.`;
      message += `\n\nLet's execute that slice or negotiate—tell me what's blocking (time, fear, scope) and we'll adjust without shame-stacking.`;
      message += `\n\nReply with what's true today, or say "negotiate" if you need a smaller scope or new deadline.`;
      return message;
    }

    const proactiveStep = getFirstProactiveStep(goal);
    message += `\n\nYour first step this week (testable, sized to win):\n${proactiveStep}`;
    message += `\n\nReply with "lock it in" to commit, or your real constraint (time, energy, tools) and I'll renegotiate immediately.`;

    return message;
  };

  const loadPendingForGoal = async () => {
    try {
      const commitments = await goalsApi.getCommitments(goalId);
      setPendingCommitments(
        commitments.filter((c) => c.status === 'pending' || c.status === 'escalated')
      );
    } catch (error) {
      console.error('Error reloading commitments:', error);
    }
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
      const response = await api.post<DoynMessage>('/api/agents/doyn/chat', {
        message: input,
        context: {
          goal_id: goalId,
          goal_title: goal.title,
          goal_category: goal.category,
          deadline: goal.deadline,
          insights: goal.insights,
          doyn_insights: doynInsights,
        },
        thread_id: threadId,
      });

      if (response.error || !response.data) {
        const errorMessage: DoynMessage = {
          id: (Date.now() + 1).toString(),
          role: 'doyn',
          content: response.error?.message || "Sorry, I had trouble processing that. Can you try rephrasing?",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      const doynMessage = response.data;
      if (!threadId && doynMessage.thread_id) {
        setThreadId(doynMessage.thread_id);
      }
      setMessages((prev) => [...prev, doynMessage]);
      if (doynMessage.action === 'commitment_created' || doynMessage.action === 'commitment_updated') {
        await loadPendingForGoal();
      }
    } catch (error: unknown) {
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

  const negotiateCommitment = async () => {
    if (!selectedCommitmentId || negotiationReason.trim().length < 10 || negotiating) return;

    setNegotiating(true);
    try {
      const response = await api.post<{
        doyn_response?: string;
        new_commitment?: CommitmentSummary;
      }>('/api/agents/doyn/negotiate', {
        commitment_id: selectedCommitmentId,
        reason: negotiationReason.trim(),
        proposed_task: proposedTask.trim() || undefined,
        proposed_deadline: proposedDeadline
          ? new Date(proposedDeadline).toISOString()
          : undefined,
      });

      if (response.error || !response.data) {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-neg-error`,
            role: 'doyn',
            content:
              response.error?.message ||
              'I could not process that negotiation. Please refine your reason and try again.',
            timestamp: new Date().toISOString(),
          },
        ]);
        return;
      }

      const negotiationData = response.data;
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-neg`,
          role: 'doyn',
          content:
            negotiationData.doyn_response ||
            'Got it. I updated your commitment to something more realistic.',
          timestamp: new Date().toISOString(),
          action: 'commitment_updated',
        },
      ]);
      setNegotiationReason('');
      setProposedTask('');
      setProposedDeadline('');
      await loadPendingForGoal();
    } catch (error) {
      console.error('Error negotiating commitment:', error);
    } finally {
      setNegotiating(false);
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

  if (screenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-4 bg-white border border-border rounded-2xl p-6 shadow-sm max-w-md">
          <p className="text-base font-semibold text-foreground">{screenError}</p>
          <p className="text-sm text-muted-foreground">
            Retry now, or return to your dashboard and try again.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => void loadGoalAndChat()}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-all"
            >
              Retry
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-all"
            >
              Dashboard
            </Link>
          </div>
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
              <p className="text-sm text-muted-foreground">Execution manager: commitment by commitment</p>
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
            <div className="rounded-xl border border-border bg-white p-3">
              <p className="text-xs font-semibold text-foreground mb-1">Doyn Framework</p>
              <p className="text-xs text-muted-foreground">
                Clarify outcome {'->'} scope smallest testable step {'->'} define done {'->'} set repair path {'->'} lock in.
              </p>
              {doynInsights?.recommendations && (
                <p className="text-xs text-muted-foreground mt-1">
                  Current recommendation: intensity <span className="font-medium">{doynInsights.recommendations.intensity}</span>, size{' '}
                  <span className="font-medium">{doynInsights.recommendations.commitment_size}</span>, tone{' '}
                  <span className="font-medium">{doynInsights.recommendations.tone}</span>.
                </p>
              )}
              {executionContext && (
                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                  <p>
                    Goal history: {executionContext.commitment_counts.total} total · {executionContext.commitment_counts.verified} verified ·{' '}
                    {executionContext.commitment_counts.missed} missed · {executionContext.commitment_counts.failed} failed ·{' '}
                    {executionContext.commitment_counts.escalated} escalated
                  </p>
                  <p>
                    Goal completion rate: <span className="font-medium">{executionContext.completion_rate}%</span> · Thrive:{' '}
                    <span className="font-medium">{executionContext.thrive_feedback.thrive_score}</span> ({executionContext.thrive_feedback.risk_level})
                  </p>
                  {executionContext.thrive_feedback.recommendations?.length > 0 && (
                    <p className="line-clamp-2">
                      Thrive guidance: {executionContext.thrive_feedback.recommendations.slice(0, 2).join(' | ')}
                    </p>
                  )}
                </div>
              )}
            </div>

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
                  <FormattedMessageText
                    text={message.content}
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                  />
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
            <div className="mb-4 rounded-xl border border-border p-3 bg-muted/20">
              <div className="flex items-center gap-2 mb-2">
                <MdHandshake className="text-primary" />
                <p className="text-sm font-semibold text-foreground">Negotiate commitment scope/timing</p>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Use this when delivery risk is real. Give a concrete reason (10+ chars), then propose a smaller scope or later deadline.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <select
                  value={selectedCommitmentId}
                  onChange={(e) => setSelectedCommitmentId(e.target.value)}
                  className="border border-border rounded-lg px-3 py-2 text-sm bg-background"
                >
                  <option value="">Select active commitment</option>
                  {pendingCommitments.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.task_detail}
                    </option>
                  ))}
                </select>
                <input
                  type="datetime-local"
                  value={proposedDeadline}
                  onChange={(e) => setProposedDeadline(e.target.value)}
                  className="border border-border rounded-lg px-3 py-2 text-sm bg-background"
                />
                <input
                  type="text"
                  value={proposedTask}
                  onChange={(e) => setProposedTask(e.target.value)}
                  placeholder="Optional: smaller, testable task"
                  className="border border-border rounded-lg px-3 py-2 text-sm bg-background"
                />
                <button
                  onClick={() => void negotiateCommitment()}
                  disabled={
                    negotiating ||
                    !selectedCommitmentId ||
                    negotiationReason.trim().length < 10
                  }
                  className="px-3 py-2 rounded-lg bg-primary text-white text-sm disabled:opacity-50"
                >
                  {negotiating ? 'Negotiating...' : 'Apply negotiation'}
                </button>
              </div>
              <textarea
                value={negotiationReason}
                onChange={(e) => setNegotiationReason(e.target.value)}
                placeholder="Why is this at risk, and what is the realistic adjustment?"
                rows={2}
                className="mt-2 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background resize-none"
              />
            </div>

            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe the next step, constraint, or risk for this goal..."
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
              Press Enter to send. Doyn will help you define done, lock in, or negotiate repair.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

