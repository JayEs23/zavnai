'use client';

/**
 * Echo Onboarding — Voice-First Bidirectional Session
 *
 * Based on the Google AI Studio reference implementation for Gemini Live.
 * Fused with ZAVN's backend config, text fallback, and onboarding flow.
 *
 * Key patterns from reference:
 *  - Transcript accumulation (chunks, not per-message)
 *  - turnComplete resets for proper message boundaries
 *  - Audio source tracking with onended for accurate speaking state
 *  - Interruption handling (stop audio when user speaks over Echo)
 *  - Tool declarations for profile extraction + session completion
 *  - Proactive greeting via sendClientContent on connect
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { MdMic, MdMicOff, MdSend, MdVolumeUp, MdKeyboard } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import { onboardingApi, EchoVoiceConfig } from '@/services/onboardingApi';
import { createBlob, decode, decodeAudioData } from '@/services/audio-helpers';
import type { Message, UserProfile, EchoAgentConfig } from './types';
import { ConnectionStatus } from './types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface VoiceOnboardingSessionProps {
  onComplete: (transcript: string, insights: Record<string, unknown>) => void;
  onError: (error: string) => void;
}

// ─── Tool declarations for Echo profile extraction ───────────────────────────

const ECHO_TOOLS = [
  {
    name: 'update_session_data',
    description:
      'Call this to silently store profile data you have inferred from the conversation. Call whenever you discover new information. Do NOT tell the user you are calling this.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        gap: { type: Type.STRING, description: 'The specific action the user is avoiding' },
        friction: { type: Type.STRING, description: 'Why they are avoiding it (time, fear, energy)' },
        rhythm: { type: Type.STRING, description: 'Inferred energy pattern (e.g. "morning fatigue", "night owl")' },
        persona: { type: Type.STRING, description: 'Professional context (developer, executive, student, etc.)' },
        supportSystem: { type: Type.STRING, description: 'Their accountability person or system' },
      },
    },
  },
  {
    name: 'complete_session',
    description:
      'Call this when you have gathered enough information and the conversation is wrapping up naturally. This ends the onboarding session.',
    parameters: { type: Type.OBJECT, properties: {} },
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_DURATION_MS = 5 * 60 * 1000;
const STORAGE_KEY = 'zavn_echo_onboarding_conversation';

type SessionMode = 'loading' | 'voice' | 'text-fallback';

// ─── Component ───────────────────────────────────────────────────────────────

export default function VoiceOnboardingSession({ onComplete, onError }: VoiceOnboardingSessionProps) {
  const { data: session } = useSession();

  // Derive user's display name from session (OAuth name > email prefix)
  const userName = session?.user?.name
    || session?.user?.email?.split('@')[0]
    || 'there';

  // State
  const [mode, setMode] = useState<SessionMode>('loading');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [isAssistantTalking, setIsAssistantTalking] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(MAX_DURATION_MS);
  const [startTime] = useState(new Date());
  const [statusText, setStatusText] = useState('Connecting to Echo...');
  const [showTextInput, setShowTextInput] = useState(false);
  const [extractedProfile, setExtractedProfile] = useState<UserProfile>({});

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const voiceConfigRef = useRef<EchoVoiceConfig | null>(null);
  const hasEndedRef = useRef(false);

  // Audio refs (following reference pattern)
  const audioRefs = useRef<{
    input: AudioContext | null;
    output: AudioContext | null;
    node: GainNode | null;
    sources: Set<AudioBufferSourceNode>;
    nextTime: number;
    stream: MediaStream | null; // Store stream to keep it alive
    processor: ScriptProcessorNode | null; // Store processor to keep it alive
  }>({ input: null, output: null, node: null, sources: new Set(), nextTime: 0, stream: null, processor: null });

  // Transcript accumulation refs (the critical fix for bidirectional conversation)
  const transcriptRef = useRef<{ user: string; assistant: string }>({ user: '', assistant: '' });

  // Live session ref
  const liveSessionRef = useRef<ReturnType<typeof Promise.resolve> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  // ─── Audio helpers ────────────────────────────────────────────────────────

  const stopAudio = useCallback(() => {
    audioRefs.current.sources.forEach(s => { try { s.stop(); } catch { /* ignore */ } });
    audioRefs.current.sources.clear();
    audioRefs.current.nextTime = 0;
    setIsAssistantTalking(false);
  }, []);

  // Cleanup audio resources
  const cleanupAudio = useCallback(() => {
    // Stop all audio playback
    stopAudio();
    
    // Stop microphone stream tracks
    if (audioRefs.current.stream) {
      audioRefs.current.stream.getTracks().forEach(track => {
        track.stop();
        console.log('[Echo] Stopped microphone track');
      });
      audioRefs.current.stream = null;
    }
    
    // Disconnect processor
    if (audioRefs.current.processor) {
      try {
        audioRefs.current.processor.disconnect();
      } catch (e) {
        // Ignore if already disconnected
      }
      audioRefs.current.processor = null;
    }
    
    // Close audio contexts
    try { 
      audioRefs.current.input?.close(); 
      audioRefs.current.input = null;
    } catch { /* ignore */ }
    try { 
      audioRefs.current.output?.close(); 
      audioRefs.current.output = null;
    } catch { /* ignore */ }
  }, [stopAudio]);

  // ─── Message helpers ──────────────────────────────────────────────────────

  /** Add or append to the last message of the same role (accumulation pattern) */
  const addMsg = useCallback((role: 'user' | 'assistant', content: string) => {
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last?.role === role) {
        return [...prev.slice(0, -1), { ...last, content }];
      }
      return [...prev, { id: Math.random(), role, content }];
    });
  }, []);

  // ─── End conversation ─────────────────────────────────────────────────────

  const handleEndConversation = useCallback(async () => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    // Cleanup all audio resources
    cleanupAudio();

    const transcript = messages.map(m => `${m.role === 'user' ? 'User' : 'Echo'}: ${m.content}`).join('\n');

    // Send to backend (non-blocking)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      const token = (session as { accessToken?: string } | null)?.accessToken;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`${apiUrl}/api/onboarding/complete-echo`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          transcript,
          conversation: { messages, startedAt: startTime.toISOString(), endedAt: new Date().toISOString() },
          insights: extractedProfile,
        }),
      });
    } catch {
      // non-critical
    }

    localStorage.removeItem(STORAGE_KEY);
    onComplete(transcript, extractedProfile as Record<string, unknown>);
  }, [messages, onComplete, session, startTime, extractedProfile, cleanupAudio]);

  // ─── Timer ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime.getTime();
      const remaining = Math.max(0, MAX_DURATION_MS - elapsed);
      setTimeRemaining(remaining);
      if (remaining === 0) handleEndConversation();
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, handleEndConversation]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Voice connection (Gemini Live — reference pattern) ───────────────────

  const connectVoice = useCallback(async (config: EchoVoiceConfig) => {
    if (connectionStatus === ConnectionStatus.CONNECTING || connectionStatus === ConnectionStatus.CONNECTED) return;
    setConnectionStatus(ConnectionStatus.CONNECTING);
    setStatusText('Requesting microphone access...');

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      setStatusText('Gemini API key not configured — switching to text chat');
      setConnectionStatus(ConnectionStatus.ERROR);
      setMode('text-fallback');
      autoGreetText();
      return;
    }

    try {
      // Set up audio contexts (following reference)
      const iCtx = new AudioContext({ sampleRate: 16000 });
      const oCtx = new AudioContext({ sampleRate: 24000 });
      const oNode = oCtx.createGain();
      oNode.connect(oCtx.destination);
      audioRefs.current = { 
        input: iCtx, 
        output: oCtx, 
        node: oNode, 
        sources: new Set(), 
        nextTime: 0,
        stream: null,
        processor: null
      };

      const ai = new GoogleGenAI({
        apiKey,
        apiVersion: config.onboarding.api_version || 'v1alpha',
      });

      const agentConfig = config.onboarding;

      setStatusText('Connecting to Echo voice...');

      // Create session promise (reference pattern — session available via promise)
      const sessPromise = ai.live.connect({
        model: agentConfig.model,
        callbacks: {
          onopen: () => {
            console.log('[Echo] WebSocket opened');
            setConnectionStatus(ConnectionStatus.CONNECTED);
            setMode('voice');
            setStatusText('Echo is listening...');

            // Wire up mic → Gemini (reference pattern)
            // Store stream and processor in refs to keep them alive
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
              // Store stream reference to prevent garbage collection
              audioRefs.current.stream = stream;
              
              const source = iCtx.createMediaStreamSource(stream);
              const proc = iCtx.createScriptProcessor(4096, 1, 1);
              
              // Store processor reference
              audioRefs.current.processor = proc;
              
              proc.onaudioprocess = (e) => {
                // Continue sending audio chunks - this should persist across turns
                sessPromise.then(s => {
                  try {
                    // Always send audio chunks - the session will handle if it's ready
                    s.sendRealtimeInput({ media: createBlob(e.inputBuffer.getChannelData(0)) });
                  } catch (err) {
                    // Log errors instead of silently ignoring - helps debug
                    console.warn('[Echo] Error sending audio chunk:', err);
                  }
                }).catch(err => {
                  console.warn('[Echo] Session promise error:', err);
                });
              };
              
              source.connect(proc);
              proc.connect(iCtx.destination);
              
              console.log('[Echo] Microphone stream connected and streaming');
            }).catch(err => {
              console.error('[Echo] Mic access failed after connect:', err);
              setStatusText('Microphone access failed — switching to text');
              setMode('text-fallback');
              autoGreetText();
            });

            // ── PROACTIVE GREETING ──
            // Send text turn to make Echo speak first (bidirectional initiation)
            sessPromise.then(s => {
              try {
                s.sendClientContent({
                  turns: [
                    {
                      role: 'user',
                      parts: [{ text: `The user's name is "${userName}". This is the start of their ZAVN onboarding session. Greet them warmly by name, introduce yourself as Echo — their personal growth coach at ZAVN. Be genuinely excited to meet them. Then ask a warm, open-ended question to start getting to know them. Keep it natural and brief.` }],
                    },
                  ],
                  turnComplete: true,
                });
                console.log('[Echo] Proactive greeting sent — Echo will speak first');
              } catch (err) {
                console.warn('[Echo] Failed to send greeting:', err);
              }
            });
          },

          onmessage: async (msg) => {
            // ── Tool calls (profile extraction + session completion) ──
            if (msg.toolCall) {
              const functionCalls = msg.toolCall.functionCalls;
              if (functionCalls) {
                for (const fc of functionCalls) {
                  if (fc.name === 'update_session_data' && fc.args) {
                    console.log('[Echo] Profile update:', fc.args);
                    setExtractedProfile(prev => ({ ...prev, ...fc.args }));
                  }
                  if (fc.name === 'complete_session') {
                    console.log('[Echo] Session completed by agent');
                    // Small delay to let final audio play
                    setTimeout(() => handleEndConversation(), 2000);
                  }
                  // Send tool response back to Gemini
                  sessPromise.then(s => {
                    try {
                      s.sendToolResponse({
                        functionResponses: [{
                          id: fc.id || '',
                          name: fc.name || '',
                          response: { ok: true },
                        }],
                      });
                    } catch (err) {
                      console.warn('[Echo] Failed to send tool response:', err);
                    }
                  });
                }
              }
            }

            // ── Transcript accumulation (THE key fix for bidirectional) ──
            // Output transcription = what Echo said
            if (msg.serverContent?.outputTranscription?.text) {
              transcriptRef.current.assistant += msg.serverContent.outputTranscription.text;
              addMsg('assistant', transcriptRef.current.assistant);
            }
            // Input transcription = what the user said
            if (msg.serverContent?.inputTranscription?.text) {
              const t = msg.serverContent.inputTranscription.text;
              // Filter out internal protocol messages (the greeting trigger sent via sendClientContent)
              const isInternalPrompt = t.includes('INTERNAL_PROTOCOL')
                || t.includes('ZAVN onboarding session')
                || t.includes('personal growth coach at ZAVN');
              if (!isInternalPrompt) {
                transcriptRef.current.user += t;
                addMsg('user', transcriptRef.current.user);
              }
            }

            // ── Turn complete → reset accumulators ──
            if (msg.serverContent?.turnComplete) {
              console.log('[Echo] Turn complete - resetting transcript accumulators, continuing to listen...');
              transcriptRef.current = { user: '', assistant: '' };
              // Ensure we're still listening after turn completes
              setStatusText('Echo is listening...');
            }

            // ── Audio playback (reference pattern with source tracking) ──
            const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio && audioRefs.current.output && audioRefs.current.node) {
              setIsAssistantTalking(true);
              const oCtxCurrent = audioRefs.current.output;
              audioRefs.current.nextTime = Math.max(audioRefs.current.nextTime, oCtxCurrent.currentTime);
              const buf = await decodeAudioData(decode(audio), oCtxCurrent, 24000, 1);
              const src = oCtxCurrent.createBufferSource();
              src.buffer = buf;
              src.connect(audioRefs.current.node);
              // Track source — know exactly when Echo finishes speaking
              src.onended = () => {
                audioRefs.current.sources.delete(src);
                if (audioRefs.current.sources.size === 0) {
                  setIsAssistantTalking(false);
                }
              };
              src.start(audioRefs.current.nextTime);
              audioRefs.current.nextTime += buf.duration;
              audioRefs.current.sources.add(src);
            }

            // ── Interruption handling ──
            if (msg.serverContent?.interrupted) {
              stopAudio();
            }
          },

          onerror: (error: unknown) => {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error('[Echo] Connection error:', errMsg);
            setConnectionStatus(ConnectionStatus.ERROR);
            setStatusText(`Voice connection error — switching to text (${errMsg})`);
            setMode('text-fallback');
            autoGreetText();
          },

          onclose: () => {
            console.log('[Echo] WebSocket closed');
            setConnectionStatus(ConnectionStatus.DISCONNECTED);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: ECHO_TOOLS }],
          systemInstruction: agentConfig.system_instruction,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      });

      sessionPromiseRef.current = sessPromise;
      const resolvedSession = await sessPromise;
      liveSessionRef.current = resolvedSession;
    } catch (err: unknown) {
      console.error('[Echo] Voice setup failed:', err);
      const error = err as { name?: string; message?: string };
      setConnectionStatus(ConnectionStatus.ERROR);

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setStatusText('Microphone access denied — switching to text');
      } else {
        setStatusText(`Voice unavailable — switching to text (${error.message || 'unknown error'})`);
      }

      setMode('text-fallback');
      autoGreetText();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus, addMsg, stopAudio]);

  // ─── Auto-greet in text fallback ─────────────────────────────────────────

  const autoGreetText = useCallback(() => {
    setTimeout(() => {
      addMsg(
        'assistant',
        `Hey ${userName}! I'm Echo, your personal growth coach here at ZAVN. Voice had a hiccup, so let's chat here instead — no worries at all! I'm really excited to get to know you. So tell me, what brought you to ZAVN? What's the big thing you're hoping to work on?`
      );
    }, 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addMsg, userName]);

  // ─── Bootstrap ────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const config = await onboardingApi.getEchoVoiceConfig();
        voiceConfigRef.current = config;
        if (!cancelled) connectVoice(config);
      } catch (err) {
        console.warn('[Echo] Failed to fetch config from backend, using defaults:', err);
        const fallbackConfig: EchoVoiceConfig = {
          onboarding: {
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            api_version: 'v1alpha',
            system_instruction:
              'You are Echo, ZAVN\'s personal growth coach. This is your first conversation with a new user during onboarding. Your goal is to genuinely get to know them — their aspirations, what drives them, how they work, and what has held them back. Be warm, curious, and encouraging. Ask one question at a time. Let them talk. Do NOT assign tasks or push commitments — that is not your job right now. Sound like a trusted friend who is an incredible coach. Keep responses concise for voice (2-3 sentences). After gathering enough info, wrap up warmly.',
          },
          reflection: {
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            api_version: 'v1alpha',
            system_instruction: 'You are Echo, the reflection agent.',
          },
        };
        voiceConfigRef.current = fallbackConfig;
        if (!cancelled) connectVoice(fallbackConfig);
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
      // Cleanup audio on unmount
      stopAudio();
      try { audioRefs.current.input?.close(); } catch { /* ignore */ }
      try { audioRefs.current.output?.close(); } catch { /* ignore */ }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Text fallback: send message via backend ─────────────────────────────

  const sendTextMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    addMsg('user', text);
    setInputText('');
    setIsProcessing(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = (session as { accessToken?: string } | null)?.accessToken;
      const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(`${apiUrl}/api/echo/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: text, history: conversationHistory, user_name: userName }),
      });

      if (!response.ok) throw new Error(`Backend error: ${response.status}`);
      const data = await response.json();
      addMsg('assistant', data.response);
    } catch (error) {
      console.error('[Echo] Text message failed:', error);
      onError('Failed to send message. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Derived ──────────────────────────────────────────────────────────────

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────

  // === Loading state ===
  if (mode === 'loading') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-8">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl mb-8"
        >
          <MdVolumeUp className="text-white" size={48} />
        </motion.div>
        <p className="text-lg font-semibold text-foreground mb-2">{statusText}</p>
        <p className="text-sm text-muted-foreground max-w-sm text-center">
          Echo uses your microphone for a real-time voice conversation. Please allow access when prompted.
        </p>
      </div>
    );
  }

  // === Voice-first mode ===
  if (mode === 'voice') {
    return (
      <div className="flex h-full w-full flex-col bg-gradient-to-br from-primary/5 to-accent/5">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur border-b border-border px-6 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isAssistantTalking ? 'bg-accent animate-pulse' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-sm font-medium text-foreground">
                {isAssistantTalking ? 'Echo is speaking' : 'Listening'} &middot; {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTextInput(prev => !prev)}
                className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground text-xs font-medium transition-colors flex items-center gap-1.5"
                title="Toggle text input"
              >
                <MdKeyboard size={16} />
                Text
              </button>
              <button
                onClick={handleEndConversation}
                className="px-4 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-medium transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
        </div>

        {/* Voice Visualisation */}
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative w-48 h-48 mb-10">
            <motion.div
              animate={{
                scale: isAssistantTalking ? [1, 1.4, 1] : [1, 1.1, 1],
                opacity: isAssistantTalking ? [0.15, 0.35, 0.15] : [0.08, 0.15, 0.08],
              }}
              transition={{ duration: isAssistantTalking ? 0.8 : 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent blur-2xl"
            />
            <motion.div
              animate={{ scale: isAssistantTalking ? [1, 1.25, 1] : [1, 1.06, 1] }}
              transition={{ duration: isAssistantTalking ? 0.6 : 3, repeat: Infinity }}
              className="absolute inset-4 rounded-full border-2 border-primary/30"
            />
            <motion.div
              animate={{ scale: isAssistantTalking ? [1, 1.15, 1] : [1, 1.03, 1] }}
              transition={{ duration: isAssistantTalking ? 0.5 : 3.5, repeat: Infinity }}
              className="absolute inset-8 rounded-full border-2 border-accent/20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
                <MdMic className="text-white" size={40} />
              </div>
            </div>
          </div>

          <p className="text-lg font-semibold text-foreground mb-1">
            {isAssistantTalking ? 'Echo is speaking...' : 'Listening...'}
          </p>
          <p className="text-sm text-muted-foreground max-w-sm text-center">
            Just talk naturally — Echo will guide you.
          </p>

          {/* Transcript bubbles */}
          {messages.length > 0 && (
            <div className="absolute bottom-4 left-0 right-0 max-h-48 overflow-y-auto px-6">
              <div className="max-w-2xl mx-auto space-y-2">
                {messages.slice(-6).map(m => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs px-3 py-1.5 rounded-lg w-fit max-w-[80%] ${
                      m.role === 'user'
                        ? 'ml-auto bg-primary/10 text-primary'
                        : 'bg-white/80 text-foreground border border-border/50'
                    }`}
                  >
                    {m.content}
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Optional text input (toggled) */}
        <AnimatePresence>
          {showTextInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white border-t border-border px-6 py-3 overflow-hidden"
            >
              <div className="max-w-4xl mx-auto flex items-center gap-3">
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
                  placeholder="Type a message instead..."
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  onClick={() => sendTextMessage(inputText)}
                  disabled={!inputText.trim() || isProcessing}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <MdSend size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // === Text-fallback mode ===
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
              <h2 className="text-lg font-bold text-foreground">Chat with Echo</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Text Mode (voice unavailable)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{formatTime(timeRemaining)} remaining</span>
            <button
              onClick={handleEndConversation}
              className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors text-sm font-medium"
            >
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg">
                  <MdVolumeUp className="text-white" size={36} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Welcome, {userName}! I&apos;m Echo</h3>
                <p className="text-muted-foreground">
                  Voice wasn&apos;t available, but no worries — we can chat here instead. I&apos;m your personal growth coach and I&apos;m excited to get to know you!
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
                  className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-accent text-white'
                      : 'bg-white border border-border text-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => {
              if (voiceConfigRef.current) {
                setConnectionStatus(ConnectionStatus.DISCONNECTED);
                setMode('loading');
                setStatusText('Retrying voice connection...');
                connectVoice(voiceConfigRef.current);
              }
            }}
            className="w-12 h-12 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 flex items-center justify-center flex-shrink-0 transition-all"
            title="Retry voice"
          >
            <MdMicOff size={24} />
          </button>
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
            placeholder="Type your message..."
            disabled={isProcessing}
            className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
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
  );
}
