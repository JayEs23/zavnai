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
import type { FunctionDeclaration, Schema, Session } from '@google/genai';
import { MdMic, MdMicOff, MdSend, MdVolumeUp, MdKeyboard } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api';
import { onboardingApi, EchoVoiceConfig } from '@/services/onboardingApi';
import { coreLoopApi } from '@/services/coreLoopApi';
import { createBlob, decode, decodeAudioData } from '@/services/audio-helpers';
import FormattedMessageText from '@/components/common/FormattedMessageText';
import { sanitizeAssistantText } from '@/lib/assistantText';
import type { Message, UserProfile } from './types';
import { ConnectionStatus } from './types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface VoiceOnboardingSessionProps {
  onComplete: (transcript: string, insights: Record<string, unknown>) => void;
  onError: (error: string) => void;
  /** onboarding = goal discovery, reflection = commitment reflection */
  sessionPurpose?: 'onboarding' | 'reflection';
  /** Required for reflection sessions */
  commitmentId?: string;
  /** Optional commitment text for reflection greeting */
  reflectionTask?: string;
  /**
   * `voice` — try Gemini Live, fall back to text (default).
   * `text` — skip mic/Live; full onboarding via `POST /api/echo/chat` (`mode=onboarding`). See zavnexample ch.3.
   */
  entryMode?: 'voice' | 'text';
  /**
   * Canonical focus key for `GET /api/echo/voice-config?focus_area=` (see backend `app.prompts.focus`).
   * When omitted, backend uses `profile_data.primary_focus_area` if Bearer token sent.
   */
  focusArea?: string | null;
}

// ─── Tool declarations for Echo profile extraction ───────────────────────────

const ECHO_TOOLS: FunctionDeclaration[] = [
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
      } as Record<string, Schema>,
    },
  },
  {
    name: 'complete_session',
    description:
      'Call this when you have gathered enough information and the conversation is wrapping up naturally. This ends the onboarding session.',
    parameters: { type: Type.OBJECT, properties: {} as Record<string, Schema> },
  },
];

const ECHO_REFLECTION_TOOLS: FunctionDeclaration[] = [
  {
    name: 'finalize_reflection_outcome',
    description:
      'Call this near the end of reflection when outcome is clear. This persists commitment outcome and reflection summary.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        outcome: {
          type: Type.STRING,
          description: "One of: completed, failed, missed, negotiated",
          enum: ['completed', 'failed', 'missed', 'negotiated'] as unknown as string[],
        },
        reflection_summary: {
          type: Type.STRING,
          description: 'Short user-centric summary of what happened and what they learned',
        },
        proof_text: {
          type: Type.STRING,
          description: 'Optional proof text when completed',
        },
      } as Record<string, Schema>,
      required: ['outcome', 'reflection_summary'],
    },
  },
  {
    name: 'complete_reflection_session',
    description:
      'Call this after finalize_reflection_outcome has been handled and user is ready to close the reflection session.',
    parameters: {
      type: Type.OBJECT,
      properties: {} as Record<string, Schema>,
    },
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'zavn_echo_onboarding_conversation';

/** Used by onboarding page to detect resume without importing private state */
export const ECHO_ONBOARDING_STORAGE_KEY = STORAGE_KEY;

type SessionMode = 'loading' | 'voice' | 'text-fallback';
type ReflectionSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// ─── Component ───────────────────────────────────────────────────────────────

export default function VoiceOnboardingSession({
  onComplete,
  onError,
  sessionPurpose = 'onboarding',
  commitmentId,
  reflectionTask,
  entryMode = 'voice',
  focusArea = null,
}: VoiceOnboardingSessionProps) {
  const { data: session } = useSession();

  // Derive user's display name from session (OAuth name > email prefix)
  const userName = (session?.user?.name?.trim().split(/\s+/)[0])
    || session?.user?.email?.split('@')[0]
    || 'there';

  // State
  const [mode, setMode] = useState<SessionMode>('loading');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [isAssistantTalking, setIsAssistantTalking] = useState(false);
  const [startTime, setStartTime] = useState(() => new Date());
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
  
  // Connection health tracking
  const connectionHealthRef = useRef<{
    lastMessageTime: number;
    reconnectAttempts: number;
    isHealthy: boolean;
  }>({
    lastMessageTime: Date.now(),
    reconnectAttempts: 0,
    isHealthy: true,
  });
  
  // State for UI display
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  /** Mic input to Gemini Live: off = no audio sent, Live session stays open */
  const [micCaptureEnabled, setMicCaptureEnabled] = useState(true);
  const micCaptureEnabledRef = useRef(true);
  const [reflectionSaveStatus, setReflectionSaveStatus] = useState<ReflectionSaveStatus>('idle');

  // Live session ref
  const liveSessionRef = useRef<Session | null>(null);
  const sessionPromiseRef = useRef<Promise<Session> | null>(null);
  const reflectionOutcomeSavedRef = useRef(false);

  // Skip auto-greet when we have restored or existing messages (connection recovery)
  const hasMessagesRef = useRef(false);
  const messagesRef = useRef<Message[]>([]);
  const extractedProfileRef = useRef<UserProfile>({});
  const startTimeRef = useRef<Date>(new Date());

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
      } catch {
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

  const applyMicCaptureEnabled = useCallback((enabled: boolean) => {
    micCaptureEnabledRef.current = enabled;
    setMicCaptureEnabled(enabled);
    if (!enabled) setIsListening(false);
    audioRefs.current.stream?.getAudioTracks().forEach((t) => {
      t.enabled = enabled;
    });
  }, []);

  // ─── Message helpers ──────────────────────────────────────────────────────

  /** Add or append to the last message of the same role (accumulation pattern) */
  const addMsg = useCallback((role: 'user' | 'assistant', content: string) => {
    hasMessagesRef.current = true;
    setMessages(prev => {
      const last = prev[prev.length - 1];
      const nextContent = role === 'assistant' ? sanitizeAssistantText(content) : content;
      if (last?.role === role) {
        return [...prev.slice(0, -1), { ...last, content: nextContent }];
      }
      return [...prev, { id: Math.random(), role, content: nextContent }];
    });
  }, []);

  /** Persist conversation for resume (localStorage + backend) */
  const saveDraft = useCallback((msgs: Message[], profile: UserProfile, started: Date) => {
    if (msgs.length === 0) return;
    const payload = {
      messages: msgs.map(m => ({ role: m.role, content: m.content, id: m.id })),
      extractedProfile: profile,
      startedAt: started.toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
    onboardingApi.saveEchoDraft({
      messages: payload.messages,
      extracted_profile: profile as Record<string, unknown>,
      started_at: payload.startedAt,
    }).catch(() => {});
  }, []);

  // ─── End conversation ─────────────────────────────────────────────────────

  const handleEndConversation = useCallback(async () => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    // Cleanup all audio resources
    cleanupAudio();

    const transcript = messages.map(m => `${m.role === 'user' ? 'User' : 'Echo'}: ${m.content}`).join('\n');

    // Send to backend (non-blocking)
    try {
      if (sessionPurpose === 'onboarding') {
        await api.post('/api/onboarding/complete-echo', {
          transcript,
          conversation: { messages, startedAt: startTime.toISOString(), endedAt: new Date().toISOString() },
          insights: extractedProfile,
        });
      } else if (sessionPurpose === 'reflection' && commitmentId) {
        if (!reflectionOutcomeSavedRef.current) {
          const userOnlyTranscript = messages
          .filter((m) => m.role === 'user')
          .map((m) => m.content)
          .join('\n')
          .trim();
          await coreLoopApi.reflectOnCommitment(
            commitmentId,
            userOnlyTranscript || transcript || 'Voice reflection completed'
          );
        }
      }
    } catch {
      // non-critical
    }

    localStorage.removeItem(STORAGE_KEY);
    onComplete(transcript, extractedProfile as Record<string, unknown>);
  }, [messages, onComplete, startTime, extractedProfile, cleanupAudio, sessionPurpose, commitmentId]);

  // Keep refs in sync for use in callbacks
  useEffect(() => {
    messagesRef.current = messages;
    extractedProfileRef.current = extractedProfile;
    startTimeRef.current = startTime;
  }, [messages, extractedProfile, startTime]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Persist conversation when messages or profile change (debounced)
  useEffect(() => {
    if (messages.length === 0 || hasEndedRef.current) return;
    const t = setTimeout(() => saveDraft(messages, extractedProfile, startTime), 500);
    return () => clearTimeout(t);
  }, [messages, extractedProfile, startTime, saveDraft]);

  // ─── Auto-greet in text fallback (only when no existing messages) ────────

  const autoGreetText = useCallback(() => {
    setTimeout(() => {
      if (sessionPurpose === 'reflection') {
        addMsg(
          'assistant',
          `Hey ${userName}, I'm Echo. Let's reflect on this commitment: "${reflectionTask || 'your recent commitment'}". Did you complete it, and what helped or got in the way?`
        );
      } else {
        addMsg(
          'assistant',
          `Hey ${userName}! I'm Echo, your personal growth coach here at ZAVN (pronounced "Zahvin"). Voice had a hiccup, so let's chat here instead — no worries at all! I'm really excited to get to know you. So tell me, what brought you to ZAVN? What's the big thing you're hoping to work on?`
        );
      }
    }, 300);
  }, [addMsg, userName, sessionPurpose, reflectionTask]);

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
      if (!hasMessagesRef.current) autoGreetText();
      return;
    }

    // Validate config structure
    if (!config || !config.onboarding) {
      console.error('[Echo] Invalid config structure:', config);
      setStatusText('Invalid configuration — switching to text chat');
      setConnectionStatus(ConnectionStatus.ERROR);
      setMode('text-fallback');
      if (!hasMessagesRef.current) autoGreetText();
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

      const agentConfig =
        sessionPurpose === 'reflection' ? config.reflection : config.onboarding;

      let effectiveSystemInstruction = agentConfig.system_instruction;
      if (sessionPurpose === 'reflection') {
        effectiveSystemInstruction = [
          agentConfig.system_instruction,
          "",
          "REFLECTION SESSION CONTEXT:",
          `- Commitment task: ${reflectionTask || "not provided"}`,
          "",
          "END-OF-SESSION TOOLING:",
          "- Before ending, call finalize_reflection_outcome with:",
          "  - outcome: completed | failed | missed | negotiated",
          "  - reflection_summary: concise summary of what happened + next learning",
          "  - proof_text (optional when completed)",
          "- After that, call complete_reflection_session.",
          "",
          "RULES:",
          "- Treat this as an active commitment reflection session with available context.",
          "- Never say you do not have access to prior commitments or context.",
          "- Do NOT ask which commitment is being reflected on.",
          "- If one detail is missing, ask exactly one concise clarifying question and continue.",
        ].join("\n");
      }
      
      const ai = new GoogleGenAI({
        apiKey,
        apiVersion: agentConfig.api_version || 'v1alpha',
      });

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
              stream.getAudioTracks().forEach((t) => {
                t.enabled = micCaptureEnabledRef.current;
              });

              const source = iCtx.createMediaStreamSource(stream);
              const proc = iCtx.createScriptProcessor(4096, 1, 1);
              
              // Store processor reference
              audioRefs.current.processor = proc;
              
              proc.onaudioprocess = (e) => {
                if (!micCaptureEnabledRef.current) return;
                // Continue sending audio chunks - this should persist across turns
                sessPromise.then(s => {
                  try {
                    // Always send audio chunks - the session will handle if it's ready
                    if (s && connectionHealthRef.current.isHealthy) {
                      s.sendRealtimeInput({ media: createBlob(e.inputBuffer.getChannelData(0)) });
                      // Update listening state when we're actively sending audio
                      if (!isAssistantTalking) {
                        setIsListening(true);
                      }
                    }
                  } catch (err) {
                    // Log errors instead of silently ignoring - helps debug
                    console.warn('[Echo] Error sending audio chunk:', err);
                    // Check if connection is dead
                    const timeSinceLastMessage = Date.now() - connectionHealthRef.current.lastMessageTime;
                    if (timeSinceLastMessage > 30000) { // 30 seconds without response
                      connectionHealthRef.current.isHealthy = false;
                      console.error('[Echo] Connection appears dead, attempting recovery...');
                    }
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
              if (!hasMessagesRef.current) autoGreetText();
            });

            // ── PROACTIVE GREETING or CONTINUE ──
            sessPromise.then(s => {
              try {
                const isResume = hasMessagesRef.current && messagesRef.current.length > 0;
                const prompt = isResume
                  ? `The user "${userName}" has returned. Acknowledge their return briefly and continue the conversation naturally.`
                  : sessionPurpose === 'reflection'
                    ? `The user's name is "${userName}". This is a reflection session for commitment "${reflectionTask || 'their recent commitment'}". Start by acknowledging this exact commitment and ask about what happened. Do NOT ask the user which commitment they are reflecting on. Ask one reflective question at a time, stay non-judgmental, and end by asking for one concrete next step.`
                      : `The user's name is "${userName}". This is the start of their ZAVN onboarding session. Greet them warmly by name, introduce yourself as Echo — their personal growth coach at ZAVN. Remember: when SPEAKING, pronounce "ZAVN" as "Zahvin", but always SPELL it as "ZAVN" in any text or transcriptions. Be genuinely excited to meet them. Then ask a warm, open-ended question to start getting to know them. Keep it natural and brief.`;
                s.sendClientContent({
                  turns: [{ role: 'user', parts: [{ text: prompt }] }],
                  turnComplete: true,
                });
                console.log('[Echo]', isResume ? 'Continue prompt sent' : 'Proactive greeting sent');
                setIsListening(true);
                setStatusText('Echo is listening...');
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
                  if (
                    fc.name === 'finalize_reflection_outcome'
                    && sessionPurpose === 'reflection'
                    && commitmentId
                    && fc.args
                  ) {
                    const rawOutcome = String((fc.args as Record<string, unknown>).outcome || '').toLowerCase();
                    const outcome = (
                      rawOutcome === 'completed'
                      || rawOutcome === 'failed'
                      || rawOutcome === 'missed'
                      || rawOutcome === 'negotiated'
                    ) ? rawOutcome : 'missed';
                    const reflectionSummary = String(
                      (fc.args as Record<string, unknown>).reflection_summary || 'Voice reflection completed'
                    );
                    const proofText = String((fc.args as Record<string, unknown>).proof_text || '').trim();

                    try {
                      setReflectionSaveStatus('saving');
                      if (outcome === 'completed') {
                        await api.post(`/api/v1/goals/commitments/${commitmentId}/complete`, {
                          proof_text: proofText || undefined,
                        });
                      }
                      const saveResult = await coreLoopApi.handleCommitmentOutcome(
                        commitmentId,
                        outcome as 'completed' | 'failed' | 'missed' | 'negotiated',
                        reflectionSummary
                      );
                      if (saveResult.success) {
                        reflectionOutcomeSavedRef.current = true;
                        setStatusText('Reflection saved.');
                        setReflectionSaveStatus('saved');
                      } else {
                        setReflectionSaveStatus('error');
                      }
                    } catch (toolErr) {
                      console.error('[Echo] Failed to persist reflection outcome tool:', toolErr);
                      setReflectionSaveStatus('error');
                    }
                  }
                  if (fc.name === 'complete_reflection_session' && sessionPurpose === 'reflection') {
                    console.log('[Echo] Reflection session completed by agent');
                    setTimeout(() => handleEndConversation(), 1200);
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

            // Update connection health
            connectionHealthRef.current.lastMessageTime = Date.now();
            connectionHealthRef.current.isHealthy = true;
            connectionHealthRef.current.reconnectAttempts = 0;

            // ── Transcript accumulation (THE key fix for bidirectional) ──
            // Output transcription = what Echo said
            if (msg.serverContent?.outputTranscription?.text) {
              const newText = msg.serverContent.outputTranscription.text;
              transcriptRef.current.assistant += newText;
              addMsg('assistant', transcriptRef.current.assistant);
              setIsTranscribing(false);
              setIsListening(false);
            }
            
            // Input transcription = what the user said (but don't display it)
            if (msg.serverContent?.inputTranscription?.text) {
              const t = msg.serverContent.inputTranscription.text;
              // Filter out internal protocol messages
              const isInternalPrompt = t.includes('INTERNAL_PROTOCOL')
                || t.includes('ZAVN onboarding session')
                || t.includes('personal growth coach at ZAVN');
              if (!isInternalPrompt) {
                transcriptRef.current.user += t;
                // Don't add user message to display - just track it internally
                setIsTranscribing(true);
                setIsListening(false);
              }
            }

            // ── Turn complete → reset accumulators but keep listening ──
            if (msg.serverContent?.turnComplete) {
              console.log('[Echo] Turn complete - resetting transcript accumulators, continuing to listen...');
              transcriptRef.current = { user: '', assistant: '' };
              setIsTranscribing(false);
              setIsListening(true);
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
            connectionHealthRef.current.isHealthy = false;
            
            // Attempt reconnection if we haven't exceeded max attempts
            if (connectionHealthRef.current.reconnectAttempts < 3) {
              connectionHealthRef.current.reconnectAttempts++;
              console.log(`[Echo] Attempting reconnection ${connectionHealthRef.current.reconnectAttempts}/3...`);
              setTimeout(() => {
                if (voiceConfigRef.current) {
                  setConnectionStatus(ConnectionStatus.DISCONNECTED);
                  connectVoice(voiceConfigRef.current);
                }
              }, 2000);
            } else {
              setConnectionStatus(ConnectionStatus.ERROR);
              if (hasMessagesRef.current && messagesRef.current.length > 0) {
                saveDraft(messagesRef.current, extractedProfileRef.current, startTimeRef.current);
                setStatusText('Connection lost. Your conversation is saved — continue below.');
              } else {
                setStatusText(`Voice connection error — switching to text (${errMsg})`);
              }
              setMode('text-fallback');
              if (!hasMessagesRef.current) autoGreetText();
            }
          },

          onclose: () => {
            console.log('[Echo] WebSocket closed');
            connectionHealthRef.current.isHealthy = false;
            setConnectionStatus(ConnectionStatus.DISCONNECTED);

            // Persist immediately on disconnect so user can resume
            if (hasMessagesRef.current && messagesRef.current.length > 0) {
              saveDraft(messagesRef.current, extractedProfileRef.current, startTimeRef.current);
            }

            // Attempt reconnection if session was active
            if (mode === 'voice' && connectionHealthRef.current.reconnectAttempts < 3) {
              connectionHealthRef.current.reconnectAttempts++;
              console.log(`[Echo] WebSocket closed, attempting reconnection ${connectionHealthRef.current.reconnectAttempts}/3...`);
              setTimeout(() => {
                if (voiceConfigRef.current) {
                  setConnectionStatus(ConnectionStatus.DISCONNECTED);
                  setStatusText('Reconnecting to Echo...');
                  connectVoice(voiceConfigRef.current);
                }
              }, 2000);
            }
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          ...(sessionPurpose === 'onboarding'
            ? { tools: [{ functionDeclarations: ECHO_TOOLS }] }
            : { tools: [{ functionDeclarations: ECHO_REFLECTION_TOOLS }] }),
          systemInstruction: effectiveSystemInstruction,
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

      if (hasMessagesRef.current && messagesRef.current.length > 0) {
        saveDraft(messagesRef.current, extractedProfileRef.current, startTimeRef.current);
        setStatusText('Connection lost. Your conversation is saved — continue below.');
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setStatusText('Microphone access denied — switching to text');
      } else {
        setStatusText(`Voice unavailable — switching to text (${error.message || 'unknown error'})`);
      }

      setMode('text-fallback');
      if (!hasMessagesRef.current) autoGreetText();
    }
  }, [connectionStatus, addMsg, stopAudio, isAssistantTalking, userName, autoGreetText, handleEndConversation, mode, saveDraft, sessionPurpose, reflectionTask, commitmentId]);

  // ─── Bootstrap ────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        // Restore draft from localStorage (fast) or backend (cross-device)
        const localRaw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        type DraftShape = { messages: Message[]; extractedProfile?: UserProfile; startedAt?: string };
        let draft: DraftShape | null = null;
        if (localRaw) {
          try {
            const parsed = JSON.parse(localRaw) as DraftShape;
            if (parsed?.messages?.length) draft = parsed;
          } catch {
            /* ignore */
          }
        }
        if (!draft) {
          const backendDraft = await onboardingApi.getEchoDraft();
          if (backendDraft && Array.isArray(backendDraft.messages) && backendDraft.messages.length > 0) {
            draft = {
              messages: backendDraft.messages as Message[],
              extractedProfile: (backendDraft.extracted_profile || {}) as UserProfile,
              startedAt: backendDraft.started_at,
            };
          }
        }
        if (!cancelled && draft?.messages?.length) {
          setMessages(draft.messages);
          if (draft.extractedProfile) setExtractedProfile(draft.extractedProfile);
          if (draft.startedAt) setStartTime(new Date(draft.startedAt));
          hasMessagesRef.current = true;
          setStatusText('Restoring your conversation...');
        }

        // Text-first path: no mic / no Gemini Live — aligns with UC-1 (zavndocs §12)
        if (!cancelled && entryMode === 'text') {
          setConnectionStatus(ConnectionStatus.DISCONNECTED);
          setMode('text-fallback');
          if (!hasMessagesRef.current) autoGreetText();
          return;
        }

        const config = await onboardingApi.getEchoVoiceConfig(focusArea ?? undefined);
        
        // Log the received config for debugging
        console.log('[Echo] Received config from backend:', config);
        
        // Validate config structure before using it
        if (!config) {
          throw new Error('Config is null or undefined');
        }
        
        if (!config.onboarding) {
          console.error('[Echo] Config missing onboarding property:', config);
          throw new Error('Invalid config structure: missing onboarding property');
        }
        
        if (!config.onboarding.model || !config.onboarding.api_version) {
          console.error('[Echo] Config missing required properties:', config.onboarding);
          throw new Error('Invalid config structure: missing required properties');
        }
        
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one bootstrap per entryMode/focusArea; avoid re-running when chat callbacks are recreated
  }, [entryMode, focusArea]);

  // ─── Text fallback: send message via backend ─────────────────────────────

  const sendTextMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    addMsg('user', text);
    setInputText('');
    setIsProcessing(true);

    try {
      const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));

      const res = await api.post<{ response: string }>('/api/echo/chat', {
        message: text,
        history: conversationHistory,
        user_name: userName,
        mode: sessionPurpose === 'reflection' ? 'reflection' : 'onboarding',
        ...(sessionPurpose === 'reflection' && commitmentId ? { commitment_id: commitmentId } : {}),
        ...(focusArea ? { focus_area: focusArea } : {}),
      });

      if (res.error) {
        console.error('[Echo] Text message failed:', res.error);
        onError(
          res.error.status === 0
            ? 'Could not reach the API. If you are on the deployed site, set NEXT_PUBLIC_API_URL to your backend (https) and ensure CORS allows this origin.'
            : res.error.message || 'Failed to send message. Please try again.'
        );
        return;
      }
      if (!res.data?.response) {
        onError('Empty response from Echo. Please try again.');
        return;
      }
      addMsg('assistant', res.data.response);
    } catch (error) {
      console.error('[Echo] Text message failed:', error);
      onError('Failed to send message. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────

  // === Loading state ===
  if (mode === 'loading') {
    return (
      <div className="flex flex-1 min-h-0 w-full flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-8">
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
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    const hasMessages = assistantMessages.length > 0;
    const micOff = !micCaptureEnabled;
    const statusDotClass =
      isAssistantTalking
        ? 'bg-accent animate-pulse'
        : isTranscribing
          ? 'bg-blue-500 animate-pulse'
          : micOff
            ? 'bg-amber-500'
            : isListening
              ? 'bg-green-500 animate-pulse'
              : 'bg-gray-400';
    const headerStatusText =
      isAssistantTalking
        ? 'Echo is speaking...'
        : isTranscribing
          ? 'Transcribing...'
          : micOff
            ? 'Microphone off — still connected'
            : isListening
              ? 'Listening...'
              : 'Connecting...';

    return (
      <div className="flex flex-1 min-h-0 w-full flex-col bg-gradient-to-br from-primary/5 to-accent/5">
        {/* Compact header */}
        <div className="flex-shrink-0 bg-white/95 backdrop-blur-md border-b border-border/50 px-4 sm:px-6 py-3 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDotClass}`} />
              <span className="truncate text-sm font-medium text-foreground">{headerStatusText}</span>
              {sessionPurpose === 'reflection' && reflectionSaveStatus !== 'idle' && (
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    reflectionSaveStatus === 'saved'
                      ? 'bg-green-100 text-green-700'
                      : reflectionSaveStatus === 'saving'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {reflectionSaveStatus === 'saved'
                    ? 'Outcome saved'
                    : reflectionSaveStatus === 'saving'
                      ? 'Saving outcome...'
                      : 'Outcome save failed'}
                </span>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => applyMicCaptureEnabled(!micCaptureEnabled)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  micOff
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                title={micCaptureEnabled ? 'Mute microphone (session stays connected)' : 'Unmute microphone'}
                aria-pressed={micOff}
                aria-label={micCaptureEnabled ? 'Mute microphone' : 'Unmute microphone'}
              >
                {micCaptureEnabled ? <MdMic size={16} /> : <MdMicOff size={16} />}
                {micCaptureEnabled ? 'Mute' : 'Unmute'}
              </button>
              <button
                type="button"
                onClick={() => setShowTextInput(prev => !prev)}
                className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80"
                title="Toggle text input"
              >
                <MdKeyboard size={16} />
                Text
              </button>
              <button
                type="button"
                onClick={handleEndConversation}
                className="rounded-lg bg-muted px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/80"
              >
                End Session
              </button>
            </div>
          </div>
        </div>

        {/* Main content: two-panel layout */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(280px,380px)_1fr] gap-0 overflow-hidden">
          {/* Left: Voice visualization panel */}
          <div className="flex flex-col items-center justify-center p-6 lg:p-8 bg-white/50 border-b lg:border-b-0 lg:border-r border-border/50">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
              <motion.div
                animate={{
                  scale: isAssistantTalking ? [1, 1.4, 1] : isTranscribing ? [1, 1.25, 1] : isListening ? [1, 1.15, 1] : [1, 1.08, 1],
                  opacity: isAssistantTalking ? [0.2, 0.4, 0.2] : isTranscribing ? [0.15, 0.3, 0.15] : isListening ? [0.1, 0.2, 0.1] : [0.05, 0.1, 0.05],
                }}
                transition={{ duration: isAssistantTalking ? 0.8 : isTranscribing ? 1.2 : isListening ? 2 : 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent blur-2xl"
              />
              <motion.div
                animate={{ scale: isAssistantTalking ? [1, 1.2, 1] : isTranscribing ? [1, 1.15, 1] : isListening ? [1, 1.08, 1] : 1 }}
                transition={{ duration: isAssistantTalking ? 0.6 : isTranscribing ? 1 : isListening ? 2.5 : 3, repeat: Infinity }}
                className="absolute inset-4 rounded-full border-2 border-primary/20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{ 
                    scale: isAssistantTalking ? [1, 1.08, 1] : isTranscribing ? [1, 1.04, 1] : isListening ? [1, 1.02, 1] : 1,
                  }}
                  transition={{ duration: isAssistantTalking ? 0.6 : isTranscribing ? 0.8 : isListening ? 2 : 0, repeat: Infinity }}
                  className={`flex h-24 w-24 items-center justify-center rounded-full border-4 shadow-xl sm:h-28 sm:w-28 ${
                    micOff
                      ? 'border-amber-200/80 bg-gradient-to-br from-muted to-muted-foreground/30'
                      : 'border-white/50 bg-gradient-to-br from-primary to-accent'
                  }`}
                >
                  {micOff ? (
                    <MdMicOff className="text-foreground" size={36} aria-hidden />
                  ) : (
                    <MdMic className="text-white" size={36} aria-hidden />
                  )}
                </motion.div>
              </div>
            </div>
            <div className="mt-4 text-center space-y-1">
              <motion.p 
                key={isAssistantTalking ? 'speaking' : isTranscribing ? 'transcribing' : micOff ? 'muted' : 'listening'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-base font-semibold text-foreground"
              >
                {isAssistantTalking 
                  ? 'Echo is speaking...' 
                  : isTranscribing 
                    ? 'Transcribing...' 
                    : micOff
                      ? 'Mic muted'
                      : isListening 
                        ? 'Listening...' 
                        : 'Connecting...'}
              </motion.p>
              <p className="max-w-[240px] text-xs text-muted-foreground">
                {micOff
                  ? 'Echo can still talk. Unmute when you want to reply — the live session stays open.'
                  : isListening 
                    ? 'Speak naturally — Echo hears you' 
                    : isTranscribing 
                      ? 'Processing your words' 
                      : isAssistantTalking 
                        ? 'Wait for Echo to finish' 
                        : 'Setting up...'}
              </p>
            </div>
          </div>

          {/* Right: Transcript / conversation panel */}
          <div className="flex flex-col min-h-0 bg-gradient-to-b from-white/80 to-primary/5">
            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-6">
              <div className="max-w-2xl mx-auto">
                {!hasMessages ? (
                  <div className="flex flex-col items-center justify-center py-12 lg:py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <MdVolumeUp className="text-primary" size={28} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Your conversation will appear here</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Echo&apos;s responses and your transcript will show up as you talk. This usually takes 2–3 minutes.
                    </p>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md w-full">
                      <div className="bg-white/80 rounded-xl p-4 border border-border/50 shadow-sm">
                        <p className="text-xs font-medium text-primary mb-1">What Echo learns</p>
                        <p className="text-xs text-muted-foreground">Your goals, energy patterns, and what&apos;s holding you back</p>
                      </div>
                      <div className="bg-white/80 rounded-xl p-4 border border-border/50 shadow-sm">
                        <p className="text-xs font-medium text-primary mb-1">Tip</p>
                        <p className="text-xs text-muted-foreground">Speak clearly and take your time — there&apos;s no rush</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {assistantMessages.map(m => (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex justify-start"
                        >
                          <div className="max-w-[90%] bg-white rounded-2xl px-4 py-3 shadow-sm border border-border/50">
                            <p className="text-xs font-medium text-primary/80 mb-1">Echo</p>
                            <FormattedMessageText
                              text={m.content}
                              className="text-sm leading-relaxed text-foreground"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Tips bar - always visible at bottom of transcript panel */}
            <div className="flex-shrink-0 border-t border-border/50 bg-white/80 px-4 sm:px-6 py-3">
              <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${micOff ? 'bg-amber-500' : 'bg-green-500'}`}
                  />
                  {micOff ? 'Mute only stops your mic — session stays connected' : 'Allow microphone access'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  2–3 min conversation
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Click Text to type instead
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Optional text input (toggled) */}
        <AnimatePresence>
          {showTextInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex-shrink-0 bg-white border-t border-border px-4 sm:px-6 py-3 overflow-hidden"
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
    <div className="flex flex-1 min-h-0 w-full flex-col bg-gradient-to-b from-white via-primary/3 to-accent/3">
      {/* Header - Clean and Modern */}
      <div className="bg-white/95 backdrop-blur-md border-b border-border/50 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                <MdVolumeUp className="text-white" size={22} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Chat with Echo</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">Text Mode</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleEndConversation}
              className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors text-sm font-medium border border-border/50"
            >
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Messages - Modern Chat Interface */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center space-y-6 max-w-lg">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl border-4 border-white">
                    <MdVolumeUp className="text-white" size={40} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">Welcome, {userName}!</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    I&apos;m Echo, your personal growth coach. Voice isn&apos;t available right now, but we can chat here instead. I&apos;m excited to get to know you!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-accent text-white'
                      : 'bg-white border border-border/50 text-foreground shadow-sm'
                  }`}
                >
                  <FormattedMessageText
                    text={message.content}
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white border border-border/50 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - Modern and Clean */}
      <div className="bg-white/95 backdrop-blur-md border-t border-border/50 px-4 sm:px-6 py-4 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3">
            <button
              onClick={() => {
                if (voiceConfigRef.current) {
                  setConnectionStatus(ConnectionStatus.DISCONNECTED);
                  setMode('loading');
                  setStatusText('Retrying voice connection...');
                  connectVoice(voiceConfigRef.current);
                }
              }}
              className="w-11 h-11 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground flex items-center justify-center flex-shrink-0 transition-all border border-border/50"
              title="Retry voice connection"
            >
              <MdMicOff size={20} />
            </button>
            <div className="flex-1 relative">
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
                className="w-full px-4 py-3 pr-12 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-sm"
              />
            </div>
            <button
              onClick={() => sendTextMessage(inputText)}
              disabled={!inputText.trim() || isProcessing}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <MdSend size={20} />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
