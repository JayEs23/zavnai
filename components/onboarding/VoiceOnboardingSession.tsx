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
import { trackGemini } from 'opik-gemini';

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

  // Send text message
  const sendTextMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    addMessage('user', text, 'text');
    setInputText('');
    setIsProcessing(true);

    try {
      // Use Opik-tracked Gemini for text responses
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
      const trackedGenAI = trackGemini(genAI, {
        projectName: process.env.NEXT_PUBLIC_OPIK_PROJECT_NAME || 'Zavn',
      });

      const model = trackedGenAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        systemInstruction: ECHO_SYSTEM_INSTRUCTION
      });

      // Build conversation history for context
      const conversationHistory = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const chat = model.startChat({
        history: conversationHistory,
      });

      const result = await chat.sendMessage(text);
      const response = await result.response;
      const responseText = response.text();

      addMessage('assistant', responseText, 'text');
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
    <div className="flex h-full w-full flex-col bg-[#09090b] text-zinc-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-black tracking-tight mono">
            Echo Onboarding
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className={`size-2 rounded-full ${isVoiceActive && isConnected ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`} />
            <span>{isVoiceActive && isConnected ? 'Voice Active' : 'Text Only'}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs mono text-zinc-500">
            {formatTime(timeRemaining)} remaining
          </span>
          <button
            onClick={handleEndConversation}
            className="px-4 py-2 rounded-2xl border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-all text-xs font-medium"
          >
            End Session
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-md">
              <div className="size-16 rounded-full bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center mx-auto">
                <MdVolumeUp className="text-amber-500" size={32} />
              </div>
              <h3 className="text-xl font-black text-zinc-100 uppercase tracking-tighter mono">
                Welcome to Echo
              </h3>
              <p className="text-sm text-zinc-400">
                I&apos;m here to get to know you and understand your goals. You can chat with me or use voice - whatever feels natural!
              </p>
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
                className={`max-w-[75%] rounded-3xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-amber-500 text-[#09090b]'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-100'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === 'voice' && (
                    <MdVolumeUp className={`mt-1 ${message.role === 'user' ? 'text-[#09090b]/60' : 'text-amber-500'}`} size={16} />
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <p className={`text-[10px] mt-2 ${message.role === 'user' ? 'text-[#09090b]/60' : 'text-zinc-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-zinc-900 p-4">
        <div className="flex items-center gap-3">
          {/* Voice Toggle Button */}
          <button
            onClick={toggleVoice}
            disabled={isProcessing}
            className={`size-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
              isVoiceActive && isConnected
                ? 'bg-green-500 text-white'
                : isVoiceActive
                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100'
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
            className="flex-1 px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-all"
          />

          {/* Send Button */}
          <button
            onClick={() => sendTextMessage(inputText)}
            disabled={!inputText.trim() || isProcessing}
            className="size-12 rounded-full bg-amber-500 text-[#09090b] flex items-center justify-center hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <MdSend size={20} />
          </button>
        </div>

        {micError && (
          <p className="text-xs text-red-500 mt-2 px-2">{micError}</p>
        )}
      </div>
    </div>
  );
}
