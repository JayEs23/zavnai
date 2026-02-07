'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MdMic, MdMicOff, MdSend, MdSmartToy, MdPerson } from 'react-icons/md';

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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function TestAIPage() {
  const [selectedAgent, setSelectedAgent] = useState<'echo' | 'doyn'>('echo');
  const [sessionMode, setSessionMode] = useState<'onboarding' | 'reflection'>('onboarding');
  const [isTextMode, setIsTextMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [goalTitle, setGoalTitle] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const [dueAt, setDueAt] = useState('');

  const wsRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isTextModeRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');
  const wsUrl = API_URL.replace(/^http/, 'ws');

  useEffect(() => {
    if (isTextMode) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTextMode]);

  useEffect(() => {
    isTextModeRef.current = isTextMode;
  }, [isTextMode]);

  const closeConnections = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    recognitionRef.current?.stop?.();
  }, []);

  const connectEcho = useCallback(() => {
    closeConnections();
    setIsConnected(false);
    setStatusNote(null);

    if (selectedAgent !== 'echo') return;

    const query =
      sessionMode === 'reflection'
        ? `goal_title=${encodeURIComponent(goalTitle)}&task_detail=${encodeURIComponent(taskDetail)}&due_at=${encodeURIComponent(dueAt)}`
        : '';
    const wsPath = sessionMode === 'reflection' ? `/api/test/ws/echo/reflection?${query}` : `/api/test/ws/echo/onboarding`;
    const ws = new WebSocket(`${wsUrl}${wsPath}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { type?: string; data?: string };
        if (payload.type === 'text' && payload.data) {
          const aiText = payload.data;
          setIsSpeaking(true);
          const utterance = new SpeechSynthesisUtterance(aiText);
          utterance.onend = () => setIsSpeaking(false);
          speechSynthesis.speak(utterance);

          if (isTextModeRef.current) {
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: aiText, id: `${Date.now()}-assistant`, timestamp: new Date() }
            ]);
          }
        } else if (payload.type === 'error') {
          setStatusNote(payload.data || 'Echo connection issue.');
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

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'text', data: text }));
        }

        if (isTextModeRef.current) {
          setMessages((prev) => [
            ...prev,
            { role: 'user', content: text, id: `${Date.now()}-voice-user`, timestamp: new Date() }
          ]);
        }
      };
      recognition.onerror = () => {
        setStatusNote('Speech recognition is unavailable or blocked.');
      };
      recognitionRef.current = recognition;
    }
  }, [closeConnections, selectedAgent, sessionMode, goalTitle, taskDetail, dueAt, wsUrl]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      connectEcho();
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
      closeConnections();
    };
  }, [connectEcho, closeConnections]);

  useEffect(() => {
    if (!recognitionRef.current) return;
    if (isMuted || isTextMode || selectedAgent !== 'echo') {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  }, [isMuted, isTextMode, selectedAgent]);

  const sendEchoText = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      setStatusNote('Echo connection is not ready.');
      return;
    }

    wsRef.current.send(JSON.stringify({ type: 'text', data: text }));
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: text, id: `${Date.now()}-user`, timestamp: new Date() }
    ]);
    setInputText('');
  }, [inputText]);

  const sendDoynText = useCallback(async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const response = await fetch(`${API_URL}/api/test/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history,
        agent: 'doyn',
        mode: 'onboarding'
      })
    });

    if (!response.ok) {
      setStatusNote(`HTTP ${response.status}`);
      return;
    }

    const data = await response.json();
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: text, id: `${Date.now()}-user`, timestamp: new Date() },
      { role: 'assistant', content: data.response, id: `${Date.now()}-assistant`, timestamp: new Date(data.timestamp) }
    ]);
  }, [API_URL, inputText, messages]);

  const sendMessage = useCallback(() => {
    if (selectedAgent === 'echo') {
      sendEchoText();
    } else {
      sendDoynText();
    }
  }, [selectedAgent, sendEchoText, sendDoynText]);

  const clearChat = () => setMessages([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🧪 AI Test Page</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Echo onboarding/reflection with voice+text, Doyn text-only
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedAgent('echo');
                setIsTextMode(false);
                setIsMuted(false);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedAgent === 'echo' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Echo
            </button>
            <button
              onClick={() => {
                setSelectedAgent('doyn');
                setIsTextMode(true);
                setIsMuted(true);
                setSessionMode('onboarding');
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedAgent === 'doyn' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Doyn
            </button>
            {selectedAgent === 'echo' && (
              <>
                <button
                  onClick={() => setSessionMode('onboarding')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    sessionMode === 'onboarding' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Onboarding
                </button>
                <button
                  onClick={() => setSessionMode('reflection')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    sessionMode === 'reflection' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Reflection
                </button>
                <button
                  onClick={() => {
                    setIsTextMode(false);
                    setIsMuted(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    !isTextMode ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Voice
                </button>
                <button
                  onClick={() => {
                    setIsTextMode(true);
                    setIsMuted(true);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isTextMode ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Text
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {selectedAgent === 'echo' && sessionMode === 'reflection' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 grid gap-3 md:grid-cols-3">
            <input
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="Goal title"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              value={taskDetail}
              onChange={(e) => setTaskDetail(e.target.value)}
              placeholder="Commitment detail"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              placeholder="Due date/time"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <MdSmartToy size={18} className={selectedAgent === 'echo' ? 'text-blue-500' : 'text-purple-500'} />
              <span>
                {selectedAgent === 'echo'
                  ? `Echo (${sessionMode})`
                  : 'Doyn (text-only)'}
              </span>
            </div>
            <span>
              {statusNote
                ? statusNote
                : isSpeaking
                ? 'Speaking'
                : isConnected
                ? 'Connected'
                : 'Connecting...'}
            </span>
          </div>

          {selectedAgent === 'echo' && !isTextMode && (
            <div className="mt-6 flex flex-col items-center gap-4 text-gray-600">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                {isMuted ? <MdMicOff size={32} /> : <MdMic size={32} />}
              </div>
              <p className="text-sm text-center">
                Voice mode active. No transcript displayed. Switch to Text to view chat.
              </p>
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm"
              >
                {isMuted ? 'Unmute Mic' : 'Mute Mic'}
              </button>
            </div>
          )}

          {(isTextMode || selectedAgent === 'doyn') && (
            <div className="mt-6 space-y-4">
              <div className="max-h-64 overflow-y-auto space-y-3">
                {messages.length === 0 && (
                  <p className="text-sm text-gray-500">Start a text conversation.</p>
                )}
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.role === 'user' ? (
                          <MdPerson size={14} className="mt-0.5" />
                        ) : (
                          <MdSmartToy size={14} className="mt-0.5" />
                        )}
                        <span>{message.content}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2">
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendMessage();
                  }}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium"
                >
                  <MdSend size={18} />
                </button>
                <button
                  onClick={clearChat}
                  className="px-3 py-2 rounded-xl bg-gray-200 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <strong>Test Page:</strong> Uses unguarded test endpoints. Voice mode hides transcript UI. Text mode is opt-in.
        </div>
      </div>
    </div>
  );
}

