"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, X, Loader2 } from "lucide-react";

import { FocusAreaId } from "@/constants/focusAreas";

interface WaitlistEchoChatProps {
  onClose: () => void;
  userGoals?: string;
  userInterests?: string;
  focusAreas?: FocusAreaId[];
}

export const WaitlistEchoChat: React.FC<WaitlistEchoChatProps> = ({ 
  onClose, 
  userGoals, 
  userInterests,
  focusAreas = []
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with Echo's greeting
  useEffect(() => {
    const focusAreasText = focusAreas.length > 0 
      ? ` I see you're interested in ${focusAreas.length === 1 ? 'this area' : 'these areas'}.`
      : '';
    
    const greeting = userGoals || userInterests || focusAreas.length > 0
      ? `Hi! I'm Echo, ZAVN's reflection agent.${focusAreasText}${userGoals ? ` I understand you want to achieve: ${userGoals}` : ''}${userGoals && userInterests ? ' and' : ''}${userInterests ? ` you're exploring: ${userInterests}` : ''}. How can I help you understand what ZAVN can do for you?`
      : "Hi! I'm Echo, ZAVN's reflection agent. I'm here to help you understand how ZAVN can help you close the gap between your intentions and actions across five key areas: Productivity & Work Habits, Health & Wellness, Financial Health, Personal Growth & Learning, and Relationships & Community Impact. What would you like to know?";
    
    setMessages([{ role: 'assistant', content: greeting }]);
  }, [userGoals, userInterests, focusAreas]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText("");
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));
      
      // Add context about waitlist user
      const focusAreasContext = focusAreas.length > 0 
        ? ` Focus areas: ${focusAreas.join(', ')}.`
        : '';
      const systemContext = userGoals || userInterests || focusAreas.length > 0
        ? `The user is on the waitlist and interested in:${focusAreasContext}${userGoals ? ` Goals: ${userGoals}` : ''}${userGoals && userInterests ? '.' : ''}${userInterests ? ` Interests: ${userInterests}` : ''}. Help them understand how ZAVN can help with these specific areas.`
        : "The user is on the waitlist. Help them understand how ZAVN can help them close the gap between intention and action across all five focus areas.";

      const response = await fetch(`${apiUrl}/api/waitlist/echo-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Secret': process.env.NEXT_PUBLIC_APP_SECRET_KEY || '',
        },
        body: JSON.stringify({
          message: userMessage,
          history: conversationHistory,
          user_goals: userGoals,
          user_interests: userInterests,
          focus_areas: focusAreas,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('[Echo] Message failed:', error);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again or feel free to join the waitlist and we'll be in touch!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute inset-0 bg-white rounded-2xl flex flex-col z-10"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-teal-600">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Chat with Echo</h3>
            <p className="text-xs text-muted-foreground">Ask me about ZAVN</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Close chat"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-primary to-teal-600 text-white'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Echo about ZAVN..."
            className="flex-1 px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputText.trim()}
            className="p-2 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

