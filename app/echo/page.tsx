'use client';

/**
 * Echo Interview - Premium Voice Interface
 * Fixed for Gemini 2.0 Flash Live API
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MdMic, MdMicOff, MdClose } from 'react-icons/md';
import { VoicePulse } from '@/components/VoicePulse';

// --- Types & Constants ---

interface ExtractedContract {
    goal: string;
    deadline: string; // ISO 8601
    financial_stake: number;
    common_excuses: string[];
    transcript: string;
}

const ECHO_SYSTEM_INSTRUCTION = `You are Echo, a vocal intake agent for ZAVN. 
Your role is to conduct a vocal intake session. Greet the user warmly immediately.
You MUST extract these 4 items:
1. SPECIFIC GOAL: Measurable achievement.
2. HARD DEADLINE: Specific date/time.
3. FINANCIAL STAKE: USD amount "skin in the game".
4. COMMON EXCUSES: At least 2-3 resistance patterns.

When you have ALL FOUR, call the 'finalize_contract' tool with the data.`;

const ECHO_TOOLS = [
    {
        functionDeclarations: [
            {
                name: 'finalize_contract',
                description: 'Call this only when all 4 data points are extracted.',
                parameters: {
                    type: 'OBJECT',
                    properties: {
                        goal: { type: 'STRING' },
                        deadline: { type: 'STRING' },
                        financial_stake: { type: 'NUMBER' },
                        common_excuses: { type: 'ARRAY', items: { type: 'STRING' } }
                    },
                    required: ['goal', 'deadline', 'financial_stake', 'common_excuses']
                }
            }
        ]
    }
];

export default function EchoPage() {
    const { data: session } = useSession();
    const router = useRouter();

    // UI States
    const [isMuted, setIsMuted] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [showGreeting, setShowGreeting] = useState(true);
    const [duration, setDuration] = useState('00:00');
    const [micError, setMicError] = useState<string | null>(null);
    const [extractionStatus, setExtractionStatus] = useState({
        goal: false,
        deadline: false,
        stake: false,
        excuses: false
    });

    // Audio & API Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const sessionRef = useRef<any>(null);
    const transcriptRef = useRef<string>('');
    const startTimeRef = useRef(new Date());
    const nextPlaybackTimeRef = useRef(0);

    // --- Utility: PCM Audio Conversion ---

    const base64ToUint8Array = (base64: string) => {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
    };

    // --- Contract Finalization ---

    const finalizeContract = useCallback(async (data: any) => {
        setIsProcessing(true);
        const contractData: ExtractedContract = {
            ...data,
            transcript: transcriptRef.current
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/v1/goals/ingest-contract`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.accessToken || ''}`
                },
                body: JSON.stringify(contractData)
            });

            if (response.ok) {
                setTimeout(() => router.push('/dashboard'), 2500);
            } else {
                throw new Error('API Error');
            }
        } catch (error) {
            console.error("Finalize Error:", error);
            setMicError("Failed to save contract. Reconnecting...");
            setIsProcessing(false);
        }
    }, [session, router]);

    // --- Core Connection Logic ---

    const connectService = useCallback(async () => {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        
        if (!apiKey) return setMicError("Gemini API Key missing");

        try {
            const genAI = new GoogleGenAI(apiKey);
            
            // 1. Setup Microphone
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // 2. Setup Audio Context (Input: 16k, Output: 24k)
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = audioCtx;

            // 3. Connect to Gemini Live
            // Note: Use 'any' for session because the SDK types for Live are still evolving
            const session = await (genAI as any).live.connect({
                model: 'gemini-2.0-flash-exp',
                config: {
                    systemInstruction: ECHO_SYSTEM_INSTRUCTION,
                    tools: ECHO_TOOLS,
                    generationConfig: { responseModalities: ["audio"] }
                }
            });
            sessionRef.current = session;

            // 4. Handle Outgoing Audio (Mic -> Gemini)
            const source = audioCtx.createMediaStreamSource(stream);
            const processor = audioCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
                if (isMuted || !sessionRef.current) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const pcm = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    pcm[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
                }
                session.sendRealtimeInput([{
                    mimeType: 'audio/pcm;rate=16000',
                    data: btoa(String.fromCharCode(...new Uint8Array(pcm.buffer)))
                }]);
            };

            source.connect(processor);
            processor.connect(audioCtx.destination);

            // 5. Handle Incoming Messages (Gemini -> User)
            session.on('message', async (msg: any) => {
                setIsConnected(true);

                // Handle Audio Output
                const audioPart = msg.serverContent?.modelTurn?.parts?.find((p: any) => p.inlineData);
                if (audioPart && audioContextRef.current) {
                    setIsSpeaking(true);
                    setShowGreeting(false);
                    
                    const rawData = base64ToUint8Array(audioPart.inlineData.data);
                    const int16Data = new Int16Array(rawData.buffer);
                    const float32Data = new Float32Array(int16Data.length);
                    for (let i = 0; i < int16Data.length; i++) float32Data[i] = int16Data[i] / 32768.0;

                    const buffer = audioContextRef.current.createBuffer(1, float32Data.length, 24000);
                    buffer.getChannelData(0).set(float32Data);

                    const source = audioContextRef.current.createBufferSource();
                    source.buffer = buffer;
                    source.connect(audioContextRef.current.destination);
                    
                    const now = audioContextRef.current.currentTime;
                    if (nextPlaybackTimeRef.current < now) nextPlaybackTimeRef.current = now;
                    
                    source.start(nextPlaybackTimeRef.current);
                    nextPlaybackTimeRef.current += buffer.duration;
                    
                    source.onended = () => {
                        if (audioContextRef.current && audioContextRef.current.currentTime >= nextPlaybackTimeRef.current) {
                            setIsSpeaking(false);
                        }
                    };
                }

                // Handle Transcripts
                if (msg.serverContent?.modelTurn?.parts?.find((p: any) => p.text)) {
                    transcriptRef.current += msg.serverContent.modelTurn.parts.map((p: any) => p.text).join(' ');
                }

                // Handle Tool Calls
                const toolCall = msg.serverContent?.modelTurn?.parts?.find((p: any) => p.functionCall);
                if (toolCall) {
                    const fc = toolCall.functionCall;
                    if (fc.name === 'finalize_contract') {
                        finalizeContract(fc.args);
                    }
                }
            });

        } catch (err: any) {
            console.error("Connection Error:", err);
            setMicError(err.message || "Could not connect to Echo.");
        }
    }, [isMuted, finalizeContract]);

    // --- Effects ---

    useEffect(() => {
        connectService();
        return () => {
            sessionRef.current?.close();
            streamRef.current?.getTracks().forEach(t => t.stop());
            audioContextRef.current?.close();
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
            const mins = Math.floor(diff / 60).toString().padStart(2, '0');
            const secs = (diff % 60).toString().padStart(2, '0');
            setDuration(`${mins}:${secs}`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // --- UI Render ---

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-[#09090b] text-zinc-100">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6 border-b border-zinc-900 z-50">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black tracking-tight font-mono">
                        ZAVN <span className="text-amber-500 uppercase tracking-widest text-[10px] ml-1 font-medium">Echo</span>
                    </h2>
                </div>
                <div className="flex items-center gap-6">
                    <p className="text-xs font-mono text-zinc-600">{duration}</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-2 rounded-3xl border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-all text-sm font-medium flex items-center gap-2"
                    >
                        <MdClose size={18} />
                        End Session
                    </button>
                </div>
            </header>

            {/* Main Scene */}
            <main className="flex-1 relative flex items-center justify-center">
                {/* Status HUD */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl px-6 py-3">
                        <div className="flex items-center gap-2">
                            <div className={`size-2 rounded-full ${isSpeaking ? 'bg-amber-500 animate-pulse' : isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                                {micError ? 'Error' : isSpeaking ? 'Echo Speaking' : isConnected ? 'Echo Listening' : 'Connecting'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Orb & Pulse */}
                <div className="relative z-10 flex flex-col items-center">
                    {micError ? (
                        <div className="text-center p-8 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-sm">
                            <MdMicOff className="text-red-500 mx-auto mb-4" size={48} />
                            <p className="text-sm text-zinc-400 font-mono uppercase">{micError}</p>
                        </div>
                    ) : (
                        <VoicePulse 
                            isActive={isConnected && !isMuted} 
                            isSpeaking={isSpeaking}
                        />
                    )}
                </div>

                {/* Controls */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`size-20 rounded-full flex items-center justify-center transition-all ${
                            isMuted 
                            ? 'bg-red-500/20 text-red-500 border border-red-500/30' 
                            : 'bg-amber-500 text-black shadow-[0_0_50px_-12px_rgba(245,158,11,0.5)]'
                        }`}
                    >
                        {isMuted ? <MdMicOff size={32} /> : <MdMic size={32} />}
                    </button>
                </div>
            </main>

            {/* Greeting Overlay */}
            <AnimatePresence>
                {showGreeting && !micError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8"
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="size-40 rounded-full bg-amber-500/20 blur-3xl absolute"
                        />
                        <h1 className="text-5xl font-black mb-4 tracking-tighter">ESTABLISHING LINK</h1>
                        <p className="text-amber-500 font-mono tracking-[0.3em] text-xs uppercase animate-pulse">
                            Initializing Echo Neural Interface...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success/Processing Overlay */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center"
                    >
                        <div className="size-20 border-2 border-amber-500 border-t-transparent animate-spin rounded-full mb-8" />
                        <h2 className="text-2xl font-bold font-mono tracking-widest text-amber-500 uppercase">
                            Contract Finalized
                        </h2>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}