'use client';

/**
 * Echo Interview - Premium Voice Interface
 * Fixed for Gemini 2.0 Flash Live API
 */

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdMic, MdMicOff, MdClose } from 'react-icons/md';
import { VoicePulse } from '@/components/VoicePulse';
import Image from 'next/image';
import Link from 'next/link';

type SpeechRecognitionInstance = {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEventLike) => void) | null;
    onerror: ((event: unknown) => void) | null;
    start: () => void;
    stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechRecognitionEventLike = {
    results: ArrayLike<{
        0: { transcript: string };
        length: number;
    }>;
};

type SpeechRecognitionWindow = Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
};
// --- Types & Constants ---

// Make a wrapper component to use useSearchParams inside Suspense
function EchoApp() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    // UI States
    const [isMuted, setIsMuted] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [showGreeting, setShowGreeting] = useState(true);
    const [duration, setDuration] = useState('00:00');
    const [statusNote, setStatusNote] = useState<string | null>(null);
    const [isTextMode, setIsTextMode] = useState(false);
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; id: string }>>([]);
    const [inputText, setInputText] = useState('');

    // WebSocket & Speech Refs
    const wsRef = useRef<WebSocket | null>(null);
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const transcriptRef = useRef<string>('');
    const startTimeRef = useRef(new Date());
    const isTextModeRef = useRef(false);

    // --- Core Connection Logic ---

    const connectService = useCallback(async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const wsUrl = apiUrl.replace(/^http/, 'ws');
            const userId = (session?.user as { id?: string })?.id || '';
            const token = session?.accessToken || '';
            const mode = searchParams.get('mode') === 'reflection' ? 'reflection' : 'onboarding';
            const commitmentId = searchParams.get('commitmentId') || '';

            const wsPath = mode === 'reflection'
                ? `/ws/echo/reflection?token=${token}&user_id=${userId}&commitment_id=${commitmentId}`
                : `/ws/echo/onboarding?token=${token}&user_id=${userId}`;
            const ws = new WebSocket(`${wsUrl}${wsPath}`);
            wsRef.current = ws;

            ws.onopen = () => {
                setIsConnected(true);
                setShowGreeting(false);
            };

            ws.onmessage = (event) => {
                try {
                    const payload = JSON.parse(event.data) as { type?: string; data?: string };
                    if (payload.type === 'text' && payload.data) {
                        const aiText = payload.data;
                        transcriptRef.current += ` Echo: ${aiText}`;
                        setIsSpeaking(true);

                        const utterance = new SpeechSynthesisUtterance(aiText);
                        utterance.onend = () => setIsSpeaking(false);
                        speechSynthesis.speak(utterance);

                        if (isTextModeRef.current) {
                            setMessages((prev) => [
                                ...prev,
                                { role: 'assistant', content: aiText, id: `${Date.now()}-assistant` }
                            ]);
                        }
                    } else if (payload.type === 'error') {
                        setStatusNote(payload.data || 'Echo connection issue. Retrying...');
                    } else if (payload.type === 'session_end') {
                        // Placeholder for future transcript handling
                    }
                } catch (err) {
                    console.warn('WebSocket message error:', err);
                }
            };

            ws.onerror = () => {
                setStatusNote('Could not connect to Echo backend.');
            };

            ws.onclose = () => {
                setIsConnected(false);
            };

            // Setup Speech Recognition (browser-based)
            const speechWindow = window as SpeechRecognitionWindow;
            const SpeechRecognitionCtor = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
            if (SpeechRecognitionCtor) {
                const recognition = new SpeechRecognitionCtor();
                recognition.continuous = true;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onresult = (e) => {
                    const lastResult = e.results[e.results.length - 1];
                    const text = lastResult[0]?.transcript?.trim();
                    if (!text) return;

                    transcriptRef.current += ` User: ${text}`;
                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                        wsRef.current.send(JSON.stringify({ type: 'text', data: text }));
                    }
                };

                recognition.onerror = (e) => {
                    console.warn('Speech recognition error:', e);
                    setStatusNote('Speech recognition is unavailable or blocked.');
                };

                recognitionRef.current = recognition;
            }
        } catch (err: unknown) {
            console.warn('Connection Error:', err);
            setStatusNote(err instanceof Error ? err.message : 'Could not connect to Echo backend.');
        }
    }, [session, searchParams]);

    // --- Effects ---

    useEffect(() => {
        if (!session) return;
        const timeoutId = window.setTimeout(() => {
            connectService();
        }, 0);
        return () => {
            window.clearTimeout(timeoutId);
            wsRef.current?.close();
            recognitionRef.current?.stop?.();
        };
    }, [connectService, session]);

    useEffect(() => {
        if (!recognitionRef.current) return;
        if (isMuted || isTextMode) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    }, [isMuted, isTextMode]);

    useEffect(() => {
        isTextModeRef.current = isTextMode;
    }, [isTextMode]);

    const sendTextMessage = useCallback(() => {
        if (!inputText.trim()) return;
        if (wsRef.current?.readyState !== WebSocket.OPEN) {
            setStatusNote('Echo connection is not ready.');
            return;
        }

        const text = inputText.trim();
        setMessages((prev) => [
            ...prev,
            { role: 'user', content: text, id: `${Date.now()}-user` }
        ]);
        setInputText('');

        wsRef.current.send(JSON.stringify({ type: 'text', data: text }));
    }, [inputText]);

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
        <div className="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
            {/* Header */}
            <header className="bg-white border-b border-border shadow-sm px-6 py-4 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/zavn-icon.png"
                            alt="ZAVN Logo"
                            width={36}
                            height={36}
                        />
                        <div>
                            <span className="text-xl font-bold text-foreground">ZAVN</span>
                            <span className="text-xs text-muted-foreground ml-2">Echo Interview</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-6">
                        <p className="text-sm text-muted-foreground">{duration}</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setIsTextMode(false);
                                    setIsMuted(false);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    !isTextMode ? 'bg-primary text-white' : 'bg-muted text-foreground'
                                }`}
                            >
                                Voice
                            </button>
                            <button
                                onClick={() => {
                                    setIsTextMode(true);
                                    setIsMuted(true);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    isTextMode ? 'bg-primary text-white' : 'bg-muted text-foreground'
                                }`}
                            >
                                Text
                            </button>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <MdClose size={18} />
                            End Session
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Scene */}
            <main className="flex-1 relative flex items-center justify-center">
                {/* Status HUD */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-border rounded-full px-6 py-3 shadow-lg">
                        <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-primary animate-pulse' : isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-sm font-medium text-foreground">
                            {statusNote ? statusNote : isSpeaking ? 'Echo is speaking' : isConnected ? 'Echo is listening' : 'Connecting...'}
                        </span>
                    </div>
                </div>

                {/* Orb & Pulse */}
                <div className="relative z-10 flex flex-col items-center">
                    <VoicePulse 
                        isActive={isConnected && !isMuted} 
                    />
                </div>

                {/* Controls */}
                {!isTextMode && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                                isMuted 
                                ? 'bg-red-500 text-white border-4 border-red-200' 
                                : 'bg-gradient-to-br from-primary to-accent text-white hover:shadow-xl'
                            }`}
                        >
                            {isMuted ? <MdMicOff size={32} /> : <MdMic size={32} />}
                        </button>
                    </div>
                )}

                {isTextMode && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-2xl">
                        <div className="bg-white/90 backdrop-blur-md border border-border rounded-2xl shadow-lg overflow-hidden">
                            <div className="max-h-64 overflow-y-auto px-4 py-4 space-y-3">
                                {messages.length === 0 && (
                                    <p className="text-sm text-muted-foreground">Start a text conversation with Echo.</p>
                                )}
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                                                message.role === 'user'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-muted text-foreground'
                                            }`}
                                        >
                                            {message.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-border px-4 py-3 flex gap-2">
                                <input
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') sendTextMessage();
                                    }}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                <button
                                    onClick={sendTextMessage}
                                    className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Greeting Overlay */}
            <AnimatePresence>
                {showGreeting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8"
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl absolute"
                        />
                        <h1 className="text-5xl font-bold mb-4 text-foreground">Connecting to Echo</h1>
                        <p className="text-primary font-medium text-lg animate-pulse">
                            Please wait while we establish the connection...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default function EchoPage() {
    // Wrap the main EchoApp in Suspense to allow useSearchParams to work correctly
    return (
        <Suspense>
            <EchoApp />
        </Suspense>
    );
}
