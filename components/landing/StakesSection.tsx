"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Target, Trophy, Zap } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Real Accountability",
    description: "Put something meaningful on the line. Stakes create the motivation you need to follow through.",
  },
  {
    icon: Shield,
    title: "Behavioral Science",
    description: "Built on proven principles of commitment contracts and implementation intentions.",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get real-time insights and adjustments based on your behavior patterns.",
  },
  {
    icon: Trophy,
    title: "Celebrate Progress",
    description: "Track your wins, build momentum, and see how far you've come.",
  },
];

export const StakesSection = () => {
  return (
    <section id="features" className="section-padding bg-muted">
      <div className="max-w-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              More Than Just Tracking
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              ZAVN uses behavioral science and real stakes to create genuine accountability.
              It's not about willpower—it's about creating systems that work.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
              </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-border">
              <h3 className="text-xl font-bold mb-6">Your Commitments</h3>
              <div className="space-y-4">
                {[
                  { name: "Morning Meditation", streak: 14, status: "active", color: "primary" },
                  { name: "Exercise 3x/week", streak: 8, status: "active", color: "secondary" },
                  { name: "Read 30min daily", streak: 21, status: "active", color: "accent" },
                ].map((commitment, i) => (
                  <motion.div
                    key={commitment.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${commitment.color}`} />
                      <div>
                        <div className="font-semibold">{commitment.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {commitment.streak} day streak 🔥
            </div>
          </div>
        </div>
                    <div className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-semibold">
                      {commitment.status}
              </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Stake</span>
                  <span className="text-2xl font-bold text-foreground">$150</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-gradient-to-r from-primary to-accent rounded-2xl shadow-xl p-4 text-white"
            >
              <div className="text-sm font-semibold">100% Success Rate</div>
              <div className="text-xs opacity-90">This Week</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
