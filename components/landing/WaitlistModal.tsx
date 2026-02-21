"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, Target, Sparkles, CheckCircle2, Loader2, Bot, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { WaitlistEchoChat } from "./WaitlistEchoChat";
import { FOCUS_AREAS, type FocusAreaId } from "@/constants/focusAreas";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Client-side sanitization function
// Only sanitize dangerous content, preserve spaces and normal characters
const sanitizeInput = (text: string, preserveSpaces: boolean = true): string => {
  if (!text) return "";
  
  // Remove null bytes
  let sanitized = text.replace(/\x00/g, '');
  
  // Remove script tags and event handlers
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '');
  
  // Only escape HTML entities if not preserving spaces (for display)
  // For input fields, we don't need to escape HTML entities on every keystroke
  // The backend will handle proper sanitization
  
  // Limit length
  if (sanitized.length > 1000) {
    sanitized = sanitized.substring(0, 1000);
  }
  
  return preserveSpaces ? sanitized : sanitized.trim();
};

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    goals: "",
    interests: "",
    focusAreas: [] as FocusAreaId[],
    contactOnLaunch: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEchoChat, setShowEchoChat] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    // Don't sanitize during typing - only remove null bytes and limit length
    // Full sanitization will happen on submit
    let sanitized = value.replace(/\x00/g, ''); // Remove null bytes only
    
    // Apply length limits
    if (field === "name" && sanitized.length > 255) {
      sanitized = sanitized.substring(0, 255);
    } else if ((field === "goals" || field === "interests") && sanitized.length > 1000) {
      sanitized = sanitized.substring(0, 1000);
    }
    
    setFormData((prev) => ({ ...prev, [field]: sanitized }));
  };

  const toggleFocusArea = (areaId: FocusAreaId) => {
    setFormData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(areaId)
        ? prev.focusAreas.filter((id) => id !== areaId)
        : [...prev.focusAreas, areaId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize data before sending to backend
      const sanitizedName = formData.name ? sanitizeInput(formData.name.trim(), true) : undefined;
      const sanitizedGoals = formData.goals ? sanitizeInput(formData.goals.trim(), false) : undefined;
      const sanitizedInterests = formData.interests ? sanitizeInput(formData.interests.trim(), false) : undefined;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/waitlist/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Secret": process.env.NEXT_PUBLIC_APP_SECRET_KEY || "",
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          name: sanitizedName,
          goals: sanitizedGoals,
          interests: sanitizedInterests,
          focus_areas: formData.focusAreas.length > 0 ? formData.focusAreas : undefined,
          contact_on_launch: formData.contactOnLaunch,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to join waitlist");
      }

      toast.success(data.message || "Successfully joined the waitlist!");
      
      // Reset form
      setFormData({
        email: "",
        name: "",
        goals: "",
        interests: "",
        focusAreas: [],
        contactOnLaunch: true,
      });
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to join waitlist. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden relative">
              {/* Echo Chat Overlay */}
              {showEchoChat ? (
                <WaitlistEchoChat
                  onClose={() => setShowEchoChat(false)}
                  userGoals={formData.goals}
                  userInterests={formData.interests}
                  focusAreas={formData.focusAreas}
                />
              ) : (
                <div className="flex flex-col h-full min-h-0">
                    {/* Header - Fixed */}
                    <div className="flex-shrink-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-teal-600">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground">Join the Waitlist</h2>
                          <p className="text-sm text-muted-foreground">Be among the first to experience ZAVN</p>
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Form - Scrollable Container */}
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      <form onSubmit={handleSubmit} className="p-6 space-y-6">
                      {/* Email */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                          <Mail className="w-4 h-4 text-primary" />
                          Email Address <span className="text-error">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                          placeholder="you@example.com"
                        />
                      </div>

                      {/* Name */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                          <User className="w-4 h-4 text-primary" />
                          Name (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          maxLength={255}
                          className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                          placeholder="Your name"
                        />
                      </div>

                      {/* Focus Areas */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                          <Target className="w-4 h-4 text-primary" />
                          What areas interest you? (Optional)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {FOCUS_AREAS.map((area) => {
                            const isSelected = formData.focusAreas.includes(area.id);
                            return (
                              <button
                                key={area.id}
                                type="button"
                                onClick={() => toggleFocusArea(area.id)}
                                className={`p-3 rounded-xl border-2 transition-all text-left ${
                                  isSelected
                                    ? `border-primary bg-gradient-to-br ${area.color} bg-opacity-10 text-foreground`
                                    : "border-border hover:border-primary/30 text-foreground"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-lg">{area.icon}</span>
                                  <span className="text-sm font-semibold">{area.name.split(" &")[0]}</span>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-primary mt-1" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Select the areas where you&apos;d like to achieve your goals
                        </p>
                      </div>

                      {/* Goals */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                          <Target className="w-4 h-4 text-primary" />
                          What do you hope to achieve?
                        </label>
                        <textarea
                          value={formData.goals}
                          onChange={(e) => handleInputChange("goals", e.target.value)}
                          rows={3}
                          maxLength={1000}
                          className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
                          placeholder="e.g., Build better habits, stay accountable to my goals, improve my productivity..."
                        />
                        <p className="text-xs text-muted-foreground mt-1">{formData.goals.length}/1000 characters</p>
                      </div>

                      {/* Interests */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          What areas would you like to see in the system?
                        </label>
                        <textarea
                          value={formData.interests}
                          onChange={(e) => handleInputChange("interests", e.target.value)}
                          rows={3}
                          maxLength={1000}
                          className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
                          placeholder="e.g., Fitness tracking, career development, learning new skills..."
                        />
                        <p className="text-xs text-muted-foreground mt-1">{formData.interests.length}/1000 characters</p>
                      </div>

                      {/* Chat with Echo Button */}
                      <button
                        type="button"
                        onClick={() => setShowEchoChat(true)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-primary/10 to-teal-600/10 border-2 border-primary/20 rounded-xl font-semibold text-primary hover:border-primary/40 hover:bg-primary/15 transition-all flex items-center justify-center gap-2"
                      >
                        <Bot className="w-5 h-5" />
                        Chat with Echo for Insights
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      {/* Contact on Launch */}
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                        <input
                          type="checkbox"
                          id="contactOnLaunch"
                          checked={formData.contactOnLaunch}
                          onChange={(e) => setFormData({ ...formData, contactOnLaunch: e.target.checked })}
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-2"
                        />
                        <label htmlFor="contactOnLaunch" className="text-sm text-foreground cursor-pointer">
                          Notify me when ZAVN launches
                        </label>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-6 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Join Waitlist
                          </>
                        )}
                      </button>
                      </form>
                    </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
