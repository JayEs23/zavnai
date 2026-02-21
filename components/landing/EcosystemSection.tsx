"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Brain, Users, TrendingUp, Sparkles } from "lucide-react";

const agents = [
  {
    icon: Bot,
    name: "Echo",
    color: "primary",
    gradient: "from-primary to-teal-600",
    description: "Your voice-first accountability partner. Natural conversations that understand context and nuance.",
    features: ["Voice-first interface", "Context aware", "24/7 availability"],
  },
  {
    icon: Brain,
    name: "Doyn",
    color: "secondary",
    gradient: "from-secondary to-emerald-600",
    description: "Smart commitment tracking that learns your patterns and adapts to your behavior.",
    features: ["Pattern recognition", "Smart reminders", "Progress insights"],
  },
  {
    icon: Users,
    name: "Tribe",
    color: "accent",
    gradient: "from-accent to-purple-600",
    description: "Connect with your accountability partners. Share progress, celebrate wins, stay motivated.",
    features: ["Peer support", "Shared goals", "Community motivation"],
  },
  {
    icon: TrendingUp,
    name: "Thrive",
    color: "success",
    gradient: "from-success to-green-600",
    description: "Long-term growth tracking with insights that help you understand and improve your behavior.",
    features: ["Growth analytics", "Behavioral insights", "Long-term trends"],
  },
];

export const EcosystemSection = () => {
  return (
    <section id="how-it-works" className="section-padding bg-white py-24 lg:py-32">
      <div className="w-full max-w-[1920px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">AI-Powered Ecosystem</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Four AI Agents, One Mission
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A complete ecosystem designed to help you close the gap between intention and action.
            Each agent plays a unique role in your journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative bg-white rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Gradient Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                
                <div className="relative">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${agent.gradient} mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground mb-3">{agent.name}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{agent.description}</p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {agent.features.map((feature, idx) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + idx * 0.05, duration: 0.3 }}
                        className="flex items-center gap-3 text-sm text-foreground"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${agent.gradient}`} />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
