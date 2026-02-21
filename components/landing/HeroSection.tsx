"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 lg:px-12 overflow-hidden hero-gradient">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center py-20">
        {/* Left Column - Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-primary">
              AI-Powered Behavioral Alignment
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
            Close the Gap Between{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Intention and Action
            </span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
            ZAVN helps you bridge the divide between who you say you are and what you actually do.
            A voice-led accountability system powered by behavioral science and AI.
          </p>

          <div className="space-y-4">
            {[
              "Voice-first natural conversations",
              "Real accountability with stakes",
              "Supportive tribe community",
            ].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-3 text-foreground"
              >
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/signup" className="btn-gradient group">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#how-it-works" className="btn-secondary">
              Learn More
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-4 text-sm text-muted-foreground justify-center lg:justify-start">
            <div>
              <div className="text-2xl font-bold text-foreground">14,802+</div>
              <div>Active Users</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-2xl font-bold text-foreground">$1.2M+</div>
              <div>In Stakes</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-2xl font-bold text-foreground">94%</div>
              <div>Success Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative">
            {/* Main card with shadow */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-border max-w-md">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Your Goals</h3>
                    <p className="text-sm text-muted-foreground">Track your progress</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Morning Routine", progress: 85, color: "primary" },
                    { label: "Reading Goal", progress: 70, color: "secondary" },
                    { label: "Exercise", progress: 92, color: "accent" },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-muted-foreground">{item.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ delay: 0.5, duration: 1 }}
                          className={`h-full bg-gradient-to-r ${
                            item.color === "primary"
                              ? "from-primary to-primary/80"
                              : item.color === "secondary"
                              ? "from-secondary to-secondary/80"
                              : "from-accent to-accent/80"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-xl p-4 border border-border"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-semibold">On Track!</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl p-4 border border-border"
            >
              <div className="text-sm">
                <div className="font-semibold">7-day streak 🔥</div>
                <div className="text-muted-foreground">Keep it up!</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
