'use client';

/**
 * Tribe AI chat (public link) — vetting, verification, and other session contexts.
 * Uses GET /api/tribe-chat/session/{token} + WebSocket /api/tribe-chat/ws/{token}.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSend, MdClose, MdPerson, MdShield, MdCheckCircle } from 'react-icons/md';
import { Loader2 } from 'lucide-react';
import { FullScreenGradientLoadingSkeleton } from '@/components/skeletons/PageSkeletons';

interface ChatMessage {
  role: 'tribe_member' | 'tribe_ai';
  content: string;
  timestamp: string;
}

interface SessionMetadata {
  session_id: string;
  context: string;
  status: string;
  user_display_name: string;
  tribe_member_name: string | null;
  relationship: string | null;
  goal_title: string | null;
  commitment_summary: string | null;
  commitment_due_at: string | null;
}

interface VettingCompletePayload {
  vetting_status: string;
  trust_score: number;
  decision: string;
}

function labelsForContext(context: string | undefined) {
  switch (context) {
    case 'vetting':
      return {
        pageTitle: 'ZAVN Tribe Vetting',
        pageSubtitle: 'Chat with ZAVN AI to complete your vetting',
        errorTitle: 'Vetting session unavailable',
        footerHint:
          'Press Enter to send • This chat verifies your readiness and preferences.',
      };
    case 'verification':
      return {
        pageTitle: 'ZAVN — Commitment check-in',
        pageSubtitle: 'Chat with Tribe AI about this task and proof',
        errorTitle: 'Chat unavailable',
        footerHint:
          'Press Enter to send • Your replies help assess this commitment.',
      };
    default:
      return {
        pageTitle: 'ZAVN Tribe',
        pageSubtitle: 'Chat with ZAVN Tribe AI',
        errorTitle: 'Chat unavailable',
        footerHint: 'Press Enter to send',
      };
  }
}

export default function TribeChatPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [sessionMetadata, setSessionMetadata] = useState<SessionMetadata | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'closed'
  >('disconnected');
  const [vettingOutcome, setVettingOutcome] = useState<VettingCompletePayload | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const labels = useMemo(
    () => labelsForContext(sessionMetadata?.context),
    [sessionMetadata?.context]
  );

  useEffect(() => {
    loadSessionMetadata();
    // token is the only intentional dependency; load connects WebSocket after metadata fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSessionMetadata = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/tribe-chat/session/${token}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('This session was not found or has expired.');
        } else if (response.status === 400) {
          setError('Invalid or expired link');
        } else {
          setError('Failed to load chat session');
        }
        return;
      }

      const data = await response.json();
      setSessionMetadata(data);
      connectWebSocket();
    } catch (err) {
      console.error('[Tribe Chat] Error loading session metadata:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionStatus('connecting');

      const wsUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const wsProtocol = wsUrl.startsWith('https') ? 'wss' : 'ws';
      const wsBaseUrl = wsUrl.replace(/^https?:\/\//, '');
      const ws = new WebSocket(`${wsProtocol}://${wsBaseUrl}/api/tribe-chat/ws/${token}`);

      ws.onopen = () => {
        setConnectionStatus('connected');
        setIsConnecting(false);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'ai_message') {
            const aiMessage: ChatMessage = {
              role: 'tribe_ai',
              content: message.data,
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsSending(false);
          } else if (message.type === 'vetting_complete') {
            setVettingOutcome(message.data as VettingCompletePayload);
            setIsSending(false);
          } else if (message.type === 'error') {
            setError(message.data);
            setIsSending(false);
          } else if (message.type === 'session_end') {
            setConnectionStatus('closed');
            ws.close();
          }
        } catch (err) {
          console.error('[Tribe Chat] Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = () => {
        setError('Connection error. Please try refreshing the page.');
        setConnectionStatus('disconnected');
        setIsConnecting(false);
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        setIsConnecting(false);
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('[Tribe Chat] Error connecting WebSocket:', err);
      setError('Failed to connect. Please try refreshing the page.');
      setConnectionStatus('disconnected');
      setIsConnecting(false);
    }
  };

  const sendMessage = () => {
    if (vettingOutcome || !inputText.trim() || isSending || connectionStatus !== 'connected')
      return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsSending(true);

    const userMsg: ChatMessage = {
      role: 'tribe_member',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(
          JSON.stringify({
            type: 'user_message',
            data: userMessage,
          })
        );
      } catch (err) {
        console.error('[Tribe Chat] Error sending message:', err);
        setError('Failed to send message. Please try again.');
        setIsSending(false);
      }
    } else {
      setError('Not connected. Please refresh the page.');
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading) {
    return <FullScreenGradientLoadingSkeleton />;
  }

  if (error && !sessionMetadata) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-border rounded-2xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdShield className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{labels.errorTitle}</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!sessionMetadata) return null;

  const isVetting = sessionMetadata.context === 'vetting';
  const isVerification = sessionMetadata.context === 'verification';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex flex-col">
      <div className="bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <MdShield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">{labels.pageTitle}</h1>
                <p className="text-xs text-muted-foreground">{labels.pageSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected'
                      ? 'bg-green-500 animate-pulse'
                      : connectionStatus === 'connecting'
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-gray-400'
                  }`}
                />
                <span className="text-muted-foreground">
                  {connectionStatus === 'connected'
                    ? 'Connected'
                    : connectionStatus === 'connecting'
                      ? 'Connecting...'
                      : 'Disconnected'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-6">
        <div className="bg-white dark:bg-gray-900 border border-border rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <MdPerson className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              {isVetting && (
                <>
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{sessionMetadata.user_display_name}</span> has
                    added you as an accountability partner
                    {sessionMetadata.relationship && (
                      <span className="text-muted-foreground">
                        {' '}
                        ({sessionMetadata.relationship})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Let&apos;s verify you&apos;re ready for this role and set your preferences.
                  </p>
                </>
              )}
              {isVerification && (
                <>
                  <p className="text-sm text-foreground">
                    Help verify a commitment for{' '}
                    <span className="font-semibold">{sessionMetadata.user_display_name}</span>.
                  </p>
                  {sessionMetadata.goal_title && (
                    <p className="text-xs text-muted-foreground">
                      Goal: <span className="text-foreground">{sessionMetadata.goal_title}</span>
                    </p>
                  )}
                  {sessionMetadata.commitment_summary && (
                    <p className="text-xs text-muted-foreground">
                      Task:{' '}
                      <span className="text-foreground">{sessionMetadata.commitment_summary}</span>
                    </p>
                  )}
                  {sessionMetadata.commitment_due_at && (
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(sessionMetadata.commitment_due_at).toLocaleString()}
                    </p>
                  )}
                </>
              )}
              {!isVetting && !isVerification && (
                <p className="text-sm text-foreground">
                  Conversation with Tribe AI for{' '}
                  <span className="font-semibold">{sessionMetadata.user_display_name}</span>.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {vettingOutcome && (
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-2">
          <div
            className={`rounded-xl border p-4 flex gap-3 items-start ${
              vettingOutcome.decision === 'VERIFIED'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-100'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100'
            }`}
          >
            {vettingOutcome.decision === 'VERIFIED' ? (
              <MdCheckCircle className="w-6 h-6 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <MdShield className="w-6 h-6 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            )}
            <div>
              <p className="font-semibold text-sm">
                {vettingOutcome.decision === 'VERIFIED'
                  ? "You're verified — thank you"
                  : 'Vetting complete'}
              </p>
              <p className="text-sm mt-1 opacity-90">
                {vettingOutcome.decision === 'VERIFIED'
                  ? `${sessionMetadata.user_display_name} can reach you for accountability check-ins. You can close this tab whenever you're ready.`
                  : `Thanks for your honesty. ${sessionMetadata.user_display_name} will see this update in ZAVN. You can close this tab.`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pb-4 flex flex-col">
        <div className="flex-1 bg-white dark:bg-gray-900 border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 && !isConnecting && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdShield className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  Waiting for ZAVN AI to start the conversation...
                </p>
              </div>
            )}

            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === 'tribe_member' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === 'tribe_member'
                        ? 'bg-gradient-to-br from-primary to-accent text-white'
                        : 'bg-muted text-foreground border border-border/50'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isSending && (
              <div className="flex justify-end">
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            {isConnecting && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Connecting...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="px-4 sm:px-6 pb-2">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          <div className="p-4 sm:p-6 border-t border-border bg-muted/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  vettingOutcome
                    ? 'Vetting finished — you can close this page'
                    : connectionStatus === 'connected'
                      ? 'Type your message...'
                      : connectionStatus === 'connecting'
                        ? 'Connecting...'
                        : 'Not connected. Please refresh.'
                }
                disabled={
                  connectionStatus !== 'connected' || isSending || !!vettingOutcome
                }
                className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={
                  !inputText.trim() ||
                  isSending ||
                  connectionStatus !== 'connected' ||
                  !!vettingOutcome
                }
                className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <MdSend className="w-5 h-5" />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">{labels.footerHint}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
