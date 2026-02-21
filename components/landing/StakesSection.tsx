"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Target, Trophy, Zap, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Real Accountability",
    description: "Put something meaningful on the line. Stakes create the motivation you need to follow through.",
    gradient: "from-primary to-teal-600",
  },
  {
    icon: Shield,
    title: "Behavioral Science",
    description: "Built on proven principles of commitment contracts and implementation intentions.",
    gradient: "from-secondary to-emerald-600",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get real-time insights and adjustments based on your behavior patterns.",
    gradient: "from-accent to-purple-600",
  },
  {
    icon: Trophy,
    title: "Celebrate Progress",
    description: "Track your wins, build momentum, and see how far you've come.",
    gradient: "from-success to-green-600",
  },
];

export const StakesSection = () => {
  return (
    <section id="features" className="section-padding bg-gradient-to-b from-white to-slate-50/50 py-24 lg:py-32">
      <div className="w-full max-w-[1920px] mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Proven Methodology</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              More Than Just Tracking
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              ZAVN uses behavioral science and real stakes to create genuine accountability.
              It&apos;s not about willpower—it&apos;s about creating systems that work.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex gap-4 group"
                  >
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-border/50">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                <h3 className="text-xl font-bold text-foreground">Your Commitments</h3>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  3 Active
                </div>
              </div>

              {/* Commitments List */}
              <div className="space-y-4 mb-6">
                {[
                  { name: "Morning Meditation", streak: 14, status: "active", color: "primary", progress: 85 },
                  { name: "Exercise 3x/week", streak: 8, status: "active", color: "secondary", progress: 70 },
                  { name: "Read 30min daily", streak: 21, status: "active", color: "accent", progress: 92 },
                ].map((commitment, i) => (
                  <motion.div
                    key={commitment.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full bg-${commitment.color}`} />
                        <div>
                          <div className="font-semibold text-foreground">{commitment.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {commitment.streak} day streak 🔥
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                        {commitment.status}
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${commitment.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                        className={`h-full bg-gradient-to-r from-${commitment.color} to-${commitment.color}/80 rounded-full`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total Stake */}
              <div className="pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Total Stake</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">
                    $150
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-gradient-to-br from-primary to-teal-600 rounded-2xl shadow-xl p-4 text-white z-10"
            >
              <div className="text-sm font-bold">100% Success</div>
              <div className="text-xs opacity-90">This Week</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
