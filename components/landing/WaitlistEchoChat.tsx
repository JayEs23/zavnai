"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>(() => {
    // Initialize with greeting
    const focusAreasText = focusAreas.length > 0 
      ? ` I see you're interested in ${focusAreas.length === 1 ? 'this area' : 'these areas'}.`
      : '';
    
    const greeting = userGoals || userInterests || focusAreas.length > 0
      ? `Hi! I'm ZAVN AI, your personal growth assistant.${focusAreasText}${userGoals ? ` I understand you want to achieve: ${userGoals}` : ''}${userGoals && userInterests ? ' and' : ''}${userInterests ? ` you're exploring: ${userInterests}` : ''}. How can I help you understand what ZAVN can do for you?`
      : "Hi! I'm ZAVN AI, your personal growth assistant. I'm here to help you understand how ZAVN can help you close the gap between your intentions and actions across five key areas: Productivity & Work Habits, Health & Wellness, Financial Health, Personal Growth & Learning, and Relationships & Community Impact. What would you like to know?";
    
    return [{ role: 'assistant' as const, content: greeting }];
  });
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isSendingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading || isSendingRef.current) return;

    const userMessage = inputText.trim();
    setInputText("");
    setIsLoading(true);
    isSendingRef.current = true;
    
    // Add user message to state and get updated messages for API call
    let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    
    setMessages((prev) => {
      const updatedMessages = [...prev, { role: 'user' as const, content: userMessage }];
      conversationHistory = updatedMessages.map(m => ({ role: m.role, content: m.content }));
      return updatedMessages;
    });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
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
      
      // Add assistant response with duplicate prevention
      setMessages((prevMessages) => {
        // Check if this exact response was already added
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage?.role === 'assistant' && lastMessage?.content === data.response) {
          return prevMessages; // Duplicate, skip
        }
        // Check for consecutive duplicate assistant messages
        if (prevMessages.length >= 2) {
          const secondLast = prevMessages[prevMessages.length - 2];
          if (secondLast?.role === 'assistant' && secondLast?.content === data.response) {
            return prevMessages; // Duplicate detected
          }
        }
        return [...prevMessages, { role: 'assistant' as const, content: data.response }];
      });
    } catch (error) {
      console.error('[ZAVN AI] Message failed:', error);
      const errorMsg = "I'm having trouble connecting right now. Please try again or feel free to join the waitlist and we'll be in touch!";
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage?.role === 'assistant' && lastMessage?.content === errorMsg) {
          return prevMessages;
        }
        return [...prevMessages, { role: 'assistant' as const, content: errorMsg }];
      });
    } finally {
      setIsLoading(false);
      isSendingRef.current = false;
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
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full md:w-1/2 bg-white shadow-2xl flex flex-col z-[70] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-teal-600">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Chat with ZAVN AI</h3>
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
            placeholder="Ask ZAVN AI about ZAVN..."
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

