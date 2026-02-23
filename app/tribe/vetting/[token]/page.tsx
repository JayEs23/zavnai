'use client';

/**
 * Tribe Vetting Chat Page
 * 
 * When a tribe member receives a vetting invitation via SMS/WhatsApp/Email,
 * they click a link that brings them here to chat with ZAVN AI for vetting.
 * 
 * This chat:
 * 1. Verifies they're up for the accountability role
 * 2. Collects communication preferences
 * 3. Explains ZAVN and encourages signup
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSend, MdClose, MdPerson, MdShield, MdCheckCircle, MdError } from 'react-icons/md';
import { Loader2 } from 'lucide-react';

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

export default function TribeVettingPage() {
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
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'closed'>('disconnected');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const hasReceivedGreeting = useRef(false);

  // Load session metadata
  useEffect(() => {
    loadSessionMetadata();
  }, [token]);

  // Auto-scroll to bottom when messages change
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
          setError('Vetting session not found or has expired');
        } else if (response.status === 400) {
          setError('Invalid or expired vetting link');
        } else {
          setError('Failed to load vetting session');
        }
        return;
      }
      
      const data = await response.json();
      setSessionMetadata(data);
      
      // Connect to WebSocket after metadata is loaded
      connectWebSocket();
    } catch (err) {
      console.error('Error loading session metadata:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      setIsConnecting(true);
      setConnectionStatus('connecting');
      
      const wsUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const wsProtocol = wsUrl.startsWith('https') ? 'wss' : 'ws';
      const wsBaseUrl = wsUrl.replace(/^https?:\/\//, '');
      const ws = new WebSocket(`${wsProtocol}://${wsBaseUrl}/api/tribe-chat/ws/${token}`);
      
      ws.onopen = () => {
        console.log('[Tribe Vetting] WebSocket connected');
        setConnectionStatus('connected');
        setIsConnecting(false);
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'ai_message') {
            // Add AI message
            const aiMessage: ChatMessage = {
              role: 'tribe_ai',
              content: message.data,
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            hasReceivedGreeting.current = true;
          } else if (message.type === 'error') {
            setError(message.data);
            console.error('[Tribe Vetting] WebSocket error:', message.data);
          } else if (message.type === 'session_end') {
            setConnectionStatus('closed');
            ws.close();
          }
        } catch (err) {
          console.error('[Tribe Vetting] Error parsing WebSocket message:', err);
        }
      };
      
      ws.onerror = (error) => {
        console.error('[Tribe Vetting] WebSocket error:', error);
        setError('Connection error. Please try refreshing the page.');
        setConnectionStatus('disconnected');
        setIsConnecting(false);
      };
      
      ws.onclose = () => {
        console.log('[Tribe Vetting] WebSocket closed');
        setConnectionStatus('disconnected');
        setIsConnecting(false);
      };
      
      wsRef.current = ws;
    } catch (err) {
      console.error('[Tribe Vetting] Error connecting WebSocket:', err);
      setError('Failed to connect. Please try refreshing the page.');
      setConnectionStatus('disconnected');
      setIsConnecting(false);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim() || isSending || connectionStatus !== 'connected') return;
    
    const userMessage = inputText.trim();
    setInputText('');
    setIsSending(true);
    
    // Add user message to UI immediately
    const userMsg: ChatMessage = {
      role: 'tribe_member',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    
    // Send via WebSocket
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({
          type: 'user_message',
          data: userMessage,
        }));
        setIsSending(false);
      } catch (err) {
        console.error('[Tribe Vetting] Error sending message:', err);
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading vetting session...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !sessionMetadata) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-border rounded-2xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdError className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Vetting Session Unavailable</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <MdShield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">ZAVN Tribe Vetting</h1>
                <p className="text-xs text-muted-foreground">
                  Chat with ZAVN AI to complete your vetting
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Connection Status */}
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
                onClick={() => router.push('/')}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Context Banner */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-6">
        <div className="bg-white dark:bg-gray-900 border border-border rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <MdPerson className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-foreground">
                <span className="font-semibold">{sessionMetadata.user_display_name}</span> has added you as an accountability partner
                {sessionMetadata.relationship && (
                  <span className="text-muted-foreground"> ({sessionMetadata.relationship})</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Let&apos;s verify you&apos;re ready for this role and set your preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pb-4 flex flex-col">
        <div className="flex-1 bg-white dark:bg-gray-900 border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col">
          {/* Messages */}
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

          {/* Error Message */}
          {error && (
            <div className="px-4 sm:px-6 pb-2">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 sm:p-6 border-t border-border bg-muted/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  connectionStatus === 'connected'
                    ? "Type your message..."
                    : connectionStatus === 'connecting'
                    ? "Connecting..."
                    : "Not connected. Please refresh."
                }
                disabled={connectionStatus !== 'connected' || isSending}
                className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isSending || connectionStatus !== 'connected'}
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
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send • This chat helps verify your readiness and collect preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

