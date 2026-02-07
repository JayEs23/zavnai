'use client';

/**
 * Echo Onboarding Chat - Chat interface with optional voice interaction
 * Conversational onboarding to get to know user's goals, motivation, implementation styles, blockers, and build rapport
 * Stores conversation in localStorage, tracks with Opik, sends to backend after completion
 * Max 5 minutes conversation
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MdMic, MdMicOff, MdSend, MdVolumeUp } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import { opikTracker } from '@/lib/opik/client-tracker';

interface VoiceOnboardingSessionProps {
  onComplete: (transcript: string, insights: Record<string, unknown>) => void;
  onError: (error: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type: 'text' | 'voice';
}

interface ConversationData {
  messages: Message[];
  insights: {
    goals?: string[];
    motivation?: string;
    implementation_style?: string;
    blockers?: string[];
    rapport_notes?: string;
  };
  startedAt: string;
  endedAt?: string;
  duration: number;
}

const MAX_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const STORAGE_KEY = 'zavn_echo_onboarding_conversation';

export default function VoiceOnboardingSession({ onComplete, onError }: VoiceOnboardingSessionProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(MAX_DURATION_MS);
  const [startTime] = useState(new Date());
  const [micError, setMicError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioContextInputRef = useRef<AudioContext | null>(null);
  const audioContextOutputRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<{ sendRealtimeInput: (data: { media: { data: string; mimeType: string } }) => void; close: () => void } | null>(null);
  const conversationRef = useRef<ConversationData>({
    messages: [],
    insights: {},
    startedAt: new Date().toISOString(),
    duration: 0
  });

  // Load conversation from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        conversationRef.current = data;
        setMessages(data.messages || []);
      } catch (e) {
        console.error('Failed to load conversation from localStorage:', e);
      }
    }
  }, []);

  // Save conversation to localStorage whenever it updates
  useEffect(() => {
    conversationRef.current.messages = messages;
    conversationRef.current.duration = Date.now() - new Date(conversationRef.current.startedAt).getTime();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationRef.current));
  }, [messages]);

  // Handle end conversation (defined before useEffect that uses it)
  const handleEndConversation = useCallback(async () => {
    if (sessionRef.current) {
      sessionRef.current.close();
    }

    conversationRef.current.endedAt = new Date().toISOString();
    conversationRef.current.duration = Date.now() - new Date(conversationRef.current.startedAt).getTime();

    // Extract insights from conversation
    const transcript = messages.map(m => `${m.role === 'user' ? 'User' : 'Echo'}: ${m.content}`).join('\n');
    
    // Send to backend (tracked with Opik on backend)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      const response = await fetch(`${apiUrl}/api/onboarding/complete-echo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          conversation: conversationRef.current,
          insights: conversationRef.current.insights
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save conversation');
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
    }

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);

    onComplete(transcript, conversationRef.current.insights);
  }, [messages, onComplete]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime.getTime();
      const remaining = Math.max(0, MAX_DURATION_MS - elapsed);
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        handleEndConversation();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, handleEndConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const addMessage = (role: 'user' | 'assistant', content: string, type: 'text' | 'voice' = 'text') => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  // Send text message (via backend for proper tracking and logging)
  const sendTextMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    addMessage('user', text, 'text');
    setInputText('');
    setIsProcessing(true);

    try {
      // Call backend endpoint for Echo chat (ensures Opik tracking and database logging)
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/echo/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any)?.accessToken}`, // Include auth token
        },
        body: JSON.stringify({
          message: text,
          history: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      addMessage('assistant', data.response, 'text');
    } catch (error) {
      console.error('Error sending text message:', error);
      onError('Failed to send message. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // System instructions for Echo as performance coach (moved outside to avoid dependency issues)
  const ECHO_SYSTEM_INSTRUCTION = `You are Echo, a personal performance coach for ZAVN. Your role is to have a warm, conversational onboarding session (max 5 minutes) to get to know the user.

Your goals in this conversation:
1. Understand their goals - What do they want to achieve? Be specific.
2. Discover their motivation - What drives them? Why is this important?
3. Learn their implementation style - How do they typically approach goals? Are they methodical, spontaneous, etc.?
4. Identify previous blockers - What has stopped them from achieving goals in the past?
5. Build rapport - Make them feel heard, understood, and supported. Be empathetic and encouraging.

Keep the conversation natural and conversational. Ask follow-up questions. Show genuine interest. This is about building trust and understanding, not interrogation.

When you have gathered sufficient information (usually after 3-5 minutes), naturally wrap up the conversation and thank them for sharing.`;

  // Initialize voice connection
  const initializeVoice = useCallback(async () => {
    if (isConnected || !isVoiceActive) return;
    
    // ECHO_SYSTEM_INSTRUCTION is defined above, accessible here

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      setMicError("Gemini API key not configured.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicError(null);

      const ai = new GoogleGenAI({ apiKey });
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextInputRef.current = new AudioContextClass({ sampleRate: 16000 });
      audioContextOutputRef.current = new AudioContextClass({ sampleRate: 24000 });
      analyserRef.current = audioContextInputRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.0-flash-exp',
        callbacks: {
          onopen: () => {
            console.log("Voice connection opened");
            setIsConnected(true);
            const source = audioContextInputRef.current!.createMediaStreamSource(stream);
            source.connect(analyserRef.current!);
            
            const scriptProcessor = audioContextInputRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              if (!isVoiceActive || !sessionRef.current) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              try {
                sessionRef.current.sendRealtimeInput({ media: pcmBlob });
              } catch (err) {
                console.error("Error sending audio:", err);
              }
            };
            scriptProcessor.connect(audioContextInputRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle transcriptions
            if (message.serverContent?.outputTranscription?.text) {
              const text = message.serverContent.outputTranscription.text;
              addMessage('assistant', text, 'voice');
            }
            if (message.serverContent?.inputTranscription?.text) {
              const text = message.serverContent.inputTranscription.text;
              addMessage('user', text, 'voice');
            }

            // Handle audio output
            const base64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64 && audioContextOutputRef.current) {
              const ctx = audioContextOutputRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
              const src = ctx.createBufferSource();
              src.buffer = buffer;
              src.connect(ctx.destination);
              src.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
            }
          },
          onerror: (error) => {
            console.error('Voice connection error:', error);
            setMicError(`Voice error: ${error.message || 'Unknown error'}`);
            setIsConnected(false);
          },
          onclose: () => {
            console.log("Voice connection closed");
            setIsConnected(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: ECHO_SYSTEM_INSTRUCTION
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err: unknown) {
      console.error("Voice connection failed", err);
      const error = err as { name?: string; message?: string };
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setMicError("Microphone access was denied.");
        setIsVoiceActive(false);
      } else {
        setMicError(`Failed to connect: ${error.message || 'Unknown error'}`);
        setIsVoiceActive(false);
      }
    }
  }, [isVoiceActive, isConnected, messages]);

  // Toggle voice
  const toggleVoice = () => {
    if (isVoiceActive) {
      // Disable voice
      setIsVoiceActive(false);
      if (sessionRef.current) {
        sessionRef.current.close();
        sessionRef.current = null;
      }
      setIsConnected(false);
    } else {
      // Enable voice
      setIsVoiceActive(true);
      initializeVoice();
    }
  };


  // Initialize voice when toggled on
  useEffect(() => {
    if (isVoiceActive && !isConnected) {
      initializeVoice();
    }
  }, [isVoiceActive, isConnected, initializeVoice]);

  // Format time remaining
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MdVolumeUp className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Chat with Echo
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className={`w-2 h-2 rounded-full ${isVoiceActive && isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span>{isVoiceActive && isConnected ? 'Voice Active' : 'Text Chat'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {formatTime(timeRemaining)} remaining
            </span>
            <button
              onClick={handleEndConversation}
              className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors text-sm font-medium"
            >
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg">
                  <MdVolumeUp className="text-white" size={36} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Welcome! I'm Echo
                </h3>
                <p className="text-muted-foreground">
                  I'm here to get to know you and understand your goals. You can chat with me using text or voice - whatever feels natural!
                </p>
                <div className="pt-4 text-sm text-muted-foreground">
                  💡 Tip: Click the microphone button below to use voice chat
                </div>
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-accent text-white'
                      : 'bg-white border border-border text-foreground'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'voice' && (
                      <MdVolumeUp className={`mt-1 flex-shrink-0 ${message.role === 'user' ? 'text-white/80' : 'text-primary'}`} size={16} />
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {micError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {micError}
            </div>
          )}
          
          <div className="flex items-center gap-3">
            {/* Voice Toggle Button */}
            <button
              onClick={toggleVoice}
              disabled={isProcessing}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                isVoiceActive && isConnected
                  ? 'bg-green-500 text-white shadow-lg'
                  : isVoiceActive
                  ? 'bg-primary/20 text-primary border-2 border-primary/30'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {isVoiceActive && isConnected ? (
                <MdMic size={24} />
              ) : (
                <MdMicOff size={24} />
              )}
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendTextMessage(inputText);
                }
              }}
              placeholder={isVoiceActive ? "Type a message or speak..." : "Type your message..."}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />

            {/* Send Button */}
            <button
              onClick={() => sendTextMessage(inputText)}
              disabled={!inputText.trim() || isProcessing}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
