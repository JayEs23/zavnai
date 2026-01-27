'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { MdMic, MdMicOff, MdHistory, MdArrowBack, MdAnalytics, MdTerminal, MdPsychology, MdSend } from 'react-icons/md';
import Link from 'next/link';

interface Message {
    role: 'model' | 'user';
    text: string;
    timestamp: string;
}

export default function EchoPage() {
    const [interactionMode, setInteractionMode] = useState<'voice' | 'text'>('voice');
    const [entries, setEntries] = useState<Message[]>([
        { role: 'model', text: "I'm Echo. I'm here to mirror your behavioral patterns. What's on your mind?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [truthScore, setTruthScore] = useState(82);
    const [accuracy, setAccuracy] = useState(90);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState('00:00');
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasContradiction, setHasContradiction] = useState(false);
    const [startTime] = useState(new Date());
    const [textInput, setTextInput] = useState('');
    const [isTextLoading, setIsTextLoading] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextInputRef = useRef<AudioContext | null>(null);
    const audioContextOutputRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const nextStartTimeRef = useRef(0);
    const sessionRef = useRef<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const currentInputTranscriptionRef = useRef('');
    const currentOutputTranscriptionRef = useRef('');

    // Mock user context as in original web app
    const userContext = {
        primary_goal: "Exercise 3x per week",
        top_patterns: ["Over-committing", "Mid-week drop-off"]
    };

    const floatingChips = useMemo(() => [
        { text: 'Time Underestimation', top: '25%', left: '20%', delay: '0s' },
        { text: 'Ambiguous Deadlines', top: '15%', right: '25%', delay: '1s' },
        { text: 'Task Fragmentation', bottom: '20%', left: '15%', delay: '2s' },
        { text: 'Context Switching', bottom: '30%', right: '10%', delay: '3s' },
    ], []);

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
            const mins = Math.floor(diff / 60).toString().padStart(2, '0');
            const secs = (diff % 60).toString().padStart(2, '0');
            setDuration(`${mins}:${secs}`);
        }, 1000);
        return () => clearInterval(timer);
    }, [startTime]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [entries]);

    // Audio Visualizer Animation (Mirrored from Claire)
    useEffect(() => {
        if (interactionMode !== 'voice' || !canvasRef.current || !analyserRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (interactionMode !== 'voice') return;
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 80;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(33, 237, 125, 0.05)';
            ctx.stroke();

            const bars = 100;
            for (let i = 0; i < bars; i++) {
                const barHeight = dataArray[i] / 2;
                const angle = (i * Math.PI * 2) / bars;
                const x1 = centerX + Math.cos(angle) * radius;
                const y1 = centerY + Math.sin(angle) * radius;
                const x2 = centerX + Math.cos(angle) * (radius + barHeight);
                const y2 = centerY + Math.sin(angle) * (radius + barHeight);

                ctx.strokeStyle = hasContradiction ? '#ff4d4d' : '#21ed7d';
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        };
        draw();
    }, [hasContradiction, interactionMode]);

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

    useEffect(() => {
        if (interactionMode !== 'voice') {
            if (sessionRef.current) {
                sessionRef.current.close();
                sessionRef.current = null;
            }
            return;
        }

        const connect = async () => {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

            audioContextInputRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextOutputRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            analyserRef.current = audioContextInputRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                const sessionPromise = ai.live.connect({
                    model: 'gemini-1.5-flash-8b',
                    callbacks: {
                        onopen: () => {
                            const source = audioContextInputRef.current!.createMediaStreamSource(stream);
                            source.connect(analyserRef.current!);
                            const scriptProcessor = audioContextInputRef.current!.createScriptProcessor(4096, 1, 1);
                            scriptProcessor.onaudioprocess = (e) => {
                                if (isMuted) return;
                                const inputData = e.inputBuffer.getChannelData(0);
                                const int16 = new Int16Array(inputData.length);
                                for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
                                const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
                                sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
                            };
                            scriptProcessor.connect(audioContextInputRef.current!.destination);
                        },
                        onmessage: async (message: LiveServerMessage) => {
                            if (message.serverContent?.outputTranscription) currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                            else if (message.serverContent?.inputTranscription) currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;

                            if (message.serverContent?.turnComplete) {
                                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                setEntries(prev => [
                                    ...prev,
                                    ...(currentInputTranscriptionRef.current ? [{ role: 'user', text: currentInputTranscriptionRef.current, timestamp: time }] as any : []),
                                    ...(currentOutputTranscriptionRef.current ? [{ role: 'model', text: currentOutputTranscriptionRef.current, timestamp: time }] as any : [])
                                ]);
                                currentInputTranscriptionRef.current = '';
                                currentOutputTranscriptionRef.current = '';

                                if (Math.random() > 0.7) {
                                    setHasContradiction(true);
                                    setTimeout(() => setHasContradiction(false), 4000);
                                    setTruthScore(s => Math.max(30, s - 5));
                                }
                            }

                            const base64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                            if (base64 && audioContextOutputRef.current) {
                                const ctx = audioContextOutputRef.current;
                                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                                const buffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
                                const src = ctx.createBufferSource();
                                src.buffer = buffer; src.connect(ctx.destination);
                                src.start(nextStartTimeRef.current);
                                nextStartTimeRef.current += buffer.duration;
                            }
                        },
                    },
                    config: {
                        responseModalities: [Modality.AUDIO],
                        inputAudioTranscription: {},
                        outputAudioTranscription: {},
                        systemInstruction: `You are Echo, the Reflection Agent for ZAVN. Your goal is to mirror the user's behavioral patterns for "${userContext.primary_goal}". Be Socratic, direct, and slightly challenging. Find contradictions in their logic. Use their known patterns: ${userContext.top_patterns.join(", ")} as evidence.`
                    }
                });
                sessionRef.current = await sessionPromise;
            } catch (err) {
                console.error("Connection failed", err);
            }
        };
        connect();
        return () => sessionRef.current?.close();
    }, [isMuted, interactionMode]);

    const handleSendText = async () => {
        if (!textInput.trim() || isTextLoading) return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMessage: Message = { role: 'user', text: textInput, timestamp: time };
        setEntries(prev => [...prev, userMessage]);
        setTextInput('');
        setIsTextLoading(true);

        try {
            const response = await fetch('/api/echo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: entries.map(e => ({ role: e.role, content: e.text })).concat({ role: 'user', content: textInput }),
                    userContext
                })
            });

            const data = await response.json();
            if (data.success) {
                setEntries(prev => [...prev, { role: 'model', text: data.content, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);

                // Random pattern feedback for text mode 
                if (Math.random() > 0.6) {
                    setHasContradiction(true);
                    setTimeout(() => setHasContradiction(false), 3000);
                    setTruthScore(s => Math.max(30, s - 3));
                }
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Failed to get reflection:", error);
            setEntries(prev => [...prev, { role: 'model', text: "I'm having trouble reflecting right now. Please try again.", timestamp: time }]);
        } finally {
            setIsTextLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0a0a0a] text-white font-sans transition-all duration-1000">
            {/* Header Mirroring Claire */}
            <header className="flex items-center justify-between border-b border-white/5 bg-black/80 backdrop-blur-md px-8 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors shrink-0">
                        <MdArrowBack size={20} />
                    </Link>
                    <h2 className="text-lg font-bold tracking-tight">ZAVN <span className="text-primary/80 uppercase tracking-widest text-[10px] ml-1">ECHO MIRROR</span></h2>
                </div>

                <div className="flex flex-1 justify-center max-w-xl">
                    <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
                        <button
                            onClick={() => setInteractionMode('voice')}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${interactionMode === 'voice' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
                        >
                            Voice
                        </button>
                        <button
                            onClick={() => setInteractionMode('text')}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${interactionMode === 'text' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
                        >
                            Text
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <p className="text-[10px] font-mono text-white/30 uppercase">T: {duration}</p>
                    <button onClick={() => setIsProcessing(true)} className="bg-primary text-black hover:scale-105 px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-primary/20">
                        Finalize
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Calibration Sidebar */}
                <aside className="w-72 border-r border-white/5 bg-[#0a0a0a] flex flex-col p-6 shrink-0 gap-8">
                    <div>
                        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <MdAnalytics className="text-primary" />
                            Mirror Calibration
                        </h3>
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col items-center gap-4 relative overflow-hidden group">
                            <div className="relative size-32 flex items-center justify-center">
                                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                                    <circle className="text-white/5" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                                    <circle className="text-primary transition-all duration-1000" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * accuracy) / 100} strokeLinecap="round" strokeWidth="8"></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-white">{accuracy}%</span>
                                    <span className="text-[9px] uppercase tracking-widest text-primary font-bold">Accuracy</span>
                                </div>
                            </div>
                            <p className="text-center text-[10px] text-white/60 px-2 leading-relaxed uppercase font-bold">Linguistic pattern alignment level.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-2 text-center">Truth Markers</h3>
                        <div className="space-y-4 text-center">
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest font-mono">Truth Score</p>
                                <p className="text-2xl font-black text-white">{truthScore}/100</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Visualizer */}
                <main className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #21ed7d 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                    <div className="p-8 relative z-10 text-center">
                        <h2 className="text-3xl font-black tracking-tight mb-1 text-white">Linguistic Mirroring</h2>
                        <p className="text-primary/60 text-[10px] font-bold uppercase tracking-widest">{interactionMode === 'voice' ? 'Identifying behavioral loops through audio frames...' : 'Mapping behavioral intent via text analysis...'}</p>
                    </div>

                    <div className="flex-1 relative flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {interactionMode === 'voice' ? (
                                <motion.div
                                    key="voice-viz"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <canvas ref={canvasRef} width={600} height={600} className="absolute z-0" />
                                    <div className="relative z-20 flex flex-col items-center">
                                        <div className={`bg-primary text-black font-black px-8 py-4 rounded-xl text-2xl uppercase tracking-tighter shadow-[0_0_40px_rgba(33,237,125,0.3)] border-4 border-white/20 transition-all duration-500 ${hasContradiction ? 'bg-red-500 scale-110 rotate-2' : 'rotate-[-2deg]'}`}>
                                            {hasContradiction ? 'CONTRADICTION' : 'Echo Core'}
                                        </div>
                                        <div className="h-12 w-px bg-gradient-to-b from-primary to-transparent mt-2"></div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="text-viz"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="size-full flex flex-col p-8 pt-0"
                                >
                                    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pb-8">
                                        {entries.map((e, i) => (
                                            <div key={i} className={`flex gap-3 ${e.role === 'user' ? 'justify-end' : ''}`}>
                                                {e.role === 'model' && (
                                                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-black shrink-0 shadow-lg shadow-primary/20">
                                                        <MdPsychology size={18} />
                                                    </div>
                                                )}
                                                <div className={`max-w-[85%] flex flex-col gap-1 ${e.role === 'user' ? 'items-end' : ''}`}>
                                                    <div className={`p-4 rounded-xl text-xs leading-relaxed border transition-all duration-300 ${e.role === 'model' ? 'bg-white/5 border-white/10 text-white/90 rounded-tl-none italic' : 'bg-primary/10 border-primary/20 text-primary rounded-tr-none'}`}>
                                                        {e.text}
                                                    </div>
                                                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest px-1">{e.role} • {e.timestamp}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {isTextLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-white/5 p-4 rounded-xl rounded-tl-none border border-white/10 flex gap-1">
                                                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                                                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                                                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {interactionMode === 'voice' && floatingChips.map((chip, i) => (
                            <div key={i} className="absolute z-10" style={{ top: chip.top, left: chip.left, right: chip.right, bottom: chip.bottom }}>
                                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/90 shadow-xl">
                                    {chip.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Logic Terminal */}
                    <div className="h-48 border-t border-white/5 bg-white/[0.02] p-6 flex gap-8 shrink-0">
                        <div className="flex flex-col gap-3 min-w-[280px]">
                            <div className="flex items-center gap-2 text-primary">
                                <MdTerminal size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Logic Snippets</span>
                            </div>
                            <div className="flex-1 bg-black/80 rounded-lg p-4 font-mono text-[9px] text-primary/50 border border-white/5 shadow-inner overflow-hidden uppercase">
                                <p className="mb-1">{`> detect_drift("Motivation") = ${truthScore < 85 ? 'TRUE' : 'FALSE'}`}</p>
                                <p className="mb-1">{`> variance_score: ${(accuracy / 100).toFixed(4)}`}</p>
                                <p className="animate-pulse">{`> ${interactionMode === 'voice' ? 'analyzing stress patterns...' : 'searching for linguistic hedging...'}`}</p>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-white/40">
                                <MdAnalytics size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Goal Alignment Summary</span>
                            </div>
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg flex-1 overflow-y-auto">
                                <p className="text-[11px] text-white/60 leading-relaxed font-medium uppercase tracking-tighter">
                                    Current session focusing on <span className="text-primary font-bold">{userContext.primary_goal}</span>.
                                    Correlation between <span className="text-primary font-bold">{userContext.top_patterns[0]}</span> and current markers.
                                    Mirror calibration suggesting logic adjustment for mid-week capacity.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Perspective Sidebar (Voice mode only) */}
                <AnimatePresence>
                    {interactionMode === 'voice' && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 384, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="border-l border-white/5 bg-black/40 flex flex-col shrink-0 overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center whitespace-nowrap">
                                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Reflection History</h3>
                                <span className="text-[9px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded tracking-tighter">VOICE_LIVE</span>
                            </div>

                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                {entries.map((e, i) => (
                                    <div key={i} className={`flex gap-3 ${e.role === 'user' ? 'justify-end' : ''}`}>
                                        {e.role === 'model' && (
                                            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-black shrink-0 shadow-lg shadow-primary/20">
                                                <MdPsychology size={18} />
                                            </div>
                                        )}
                                        <div className={`max-w-[85%] flex flex-col gap-1 ${e.role === 'user' ? 'items-end' : ''}`}>
                                            <div className={`p-4 rounded-xl text-xs leading-relaxed border transition-all duration-300 ${e.role === 'model' ? 'bg-white/5 border-white/10 text-white/90 rounded-tl-none' : 'bg-primary/10 border-primary/20 text-primary rounded-tr-none'}`}>
                                                {e.text}
                                            </div>
                                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest px-1">{e.role} • {e.timestamp}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-black border-t border-white/5">
                                <div className="relative group">
                                    <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-8 text-white text-[10px] text-center italic text-white/40 uppercase tracking-[0.2em] font-bold border-dashed animate-pulse">
                                        Echo is listening...
                                    </div>
                                    <button onClick={() => setIsMuted(!isMuted)} className={`absolute top-1/2 -translate-y-1/2 right-4 p-3 rounded-xl transition-all flex items-center justify-center ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-primary text-black shadow-lg shadow-primary/20 hover:scale-110'}`}>
                                        {isMuted ? <MdMicOff size={24} /> : <MdMic size={24} />}
                                    </button>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Input (Text mode only) */}
            <AnimatePresence>
                {interactionMode === 'text' && (
                    <motion.footer
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="p-6 bg-black border-t border-white/5 relative z-50"
                    >
                        <div className="max-w-3xl mx-auto w-full relative">
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendText();
                                    }
                                }}
                                placeholder="Type your reflection to mirror..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pr-16 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none min-h-[80px] text-xs uppercase font-bold tracking-wider placeholder:text-white/20"
                                rows={1}
                            />
                            <button
                                onClick={handleSendText}
                                disabled={!textInput.trim() || isTextLoading}
                                className="absolute right-4 bottom-4 p-3 bg-primary text-black rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary/20"
                            >
                                <MdSend size={20} />
                            </button>
                        </div>
                    </motion.footer>
                )}
            </AnimatePresence>

            {/* Finalizing Overlay */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
                    >
                        <div className="relative size-48">
                            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse"></div>
                            <div className="absolute inset-0 rounded-full border border-primary animate-spin border-t-transparent"></div>
                            <div className="absolute inset-4 rounded-full bg-primary/5 flex items-center justify-center">
                                <MdPsychology className="text-6xl text-primary animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Compiling Behavioral Map</h3>
                            <p className="text-primary/60 font-mono text-[10px] uppercase tracking-[0.3em]">Mapping linguistic markers to identified goals...</p>
                            <button onClick={() => setIsProcessing(false)} className="mt-8 text-white/40 hover:text-white text-[10px] border border-white/10 px-4 py-2 rounded-lg transition-all uppercase tracking-widest font-bold">Cancel</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; } 
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #21ed7d; }
            `}</style>
        </div>
    );
}
