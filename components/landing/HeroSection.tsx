"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mic, Shield, TrendingUp } from "lucide-react";
import { ENABLE_WAITLIST_MODE } from "@/constants/featureFlags";
import { WaitlistModal } from "./WaitlistModal";

export const HeroSection = () => {
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-white">
        <div className="w-full max-w-[1920px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20 lg:py-32">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-8 text-center lg:text-left"
            >
              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
              >
                Close the Gap Between{" "}
                <span className="bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">
                  Intention
                </span>{" "}
                and{" "}
                <span className="bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
                  Action
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                Transform your commitments into reality with voice-first accountability, 
                real stakes, and AI-powered insights that understand you.
              </motion.p>

              {/* Key Features - With Descriptions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="grid sm:grid-cols-3 gap-4 pt-2"
              >
                {[
                  { 
                    icon: Mic, 
                    text: "Voice-First",
                    description: "Speak your intentions naturally, stay accountable anywhere"
                  },
                  { 
                    icon: Shield, 
                    text: "Real Stakes",
                    description: "Put money on the line for genuine motivation"
                  },
                  { 
                    icon: TrendingUp, 
                    text: "AI Insights",
                    description: "Personalized feedback that keeps you on track"
                  },
                ].map((feature) => (
                  <div
                    key={feature.text}
                    className="flex flex-col gap-2 p-4 rounded-xl bg-slate-50 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-semibold text-foreground">{feature.text}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start"
              >
                {ENABLE_WAITLIST_MODE ? (
                  <button
                    onClick={() => setWaitlistModalOpen(true)}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
                  >
                    Join Waitlist
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
                    >
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="#how-it-works"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-foreground rounded-xl font-semibold border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md"
                    >
                      See How It Works
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Right Column - Visual - Larger */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="hidden lg:flex items-center justify-center relative"
            >
              <div className="relative w-full max-w-lg">
                {/* Main Dashboard Card - Larger */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="relative bg-white rounded-3xl shadow-2xl p-10 border border-border/50"
                >
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 pb-6 border-b border-border">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-foreground">Your Goals</h3>
                        <p className="text-sm text-muted-foreground">3 active commitments</p>
                      </div>
                    </div>

                    {/* Progress Items */}
                    <div className="space-y-6">
                      {[
                        { label: "Morning Routine", progress: 85, color: "from-primary to-teal-600" },
                        { label: "Reading Goal", progress: 70, color: "from-secondary to-emerald-600" },
                        { label: "Exercise", progress: 92, color: "from-accent to-purple-600" },
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.15, duration: 0.5 }}
                          className="space-y-3"
                        >
                          <div className="flex justify-between text-base">
                            <span className="font-semibold text-foreground">{item.label}</span>
                            <span className="text-muted-foreground font-medium">{item.progress}%</span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                              transition={{ delay: 0.9 + index * 0.15, duration: 1, ease: "easeOut" }}
                              className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Thrive Score */}
                    <div className="pt-6 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-muted-foreground">Thrive Score</span>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-foreground">87</span>
                          <span className="text-sm text-success font-semibold">↑ 12%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Notification Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-border/50 z-10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                    <div>
                      <div className="text-sm font-semibold text-foreground">On Track!</div>
                      <div className="text-xs text-muted-foreground">7-day streak</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Achievement Card */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl shadow-xl p-4 border border-primary/20 z-10"
                >
                  <div className="text-sm">
                    <div className="font-bold text-foreground mb-1">🔥 21 Day Streak</div>
                    <div className="text-xs text-muted-foreground">Keep it up!</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <WaitlistModal isOpen={waitlistModalOpen} onClose={() => setWaitlistModalOpen(false)} />
    </>
  );
};
