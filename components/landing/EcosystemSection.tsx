"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Brain, Users, TrendingUp } from "lucide-react";

const agents = [
  {
    icon: Bot,
    name: "Echo",
    color: "primary",
    description: "Your voice-first accountability partner. Natural conversations that understand context and nuance.",
    features: ["Voice-first interface", "Context aware", "24/7 availability"],
  },
  {
    icon: Brain,
    name: "Doyn",
    color: "secondary",
    description: "Smart commitment tracking that learns your patterns and adapts to your behavior.",
    features: ["Pattern recognition", "Smart reminders", "Progress insights"],
  },
  {
    icon: Users,
    name: "Tribe",
    color: "accent",
    description: "Connect with your accountability partners. Share progress, celebrate wins, stay motivated.",
    features: ["Peer support", "Shared goals", "Community motivation"],
  },
  {
    icon: TrendingUp,
    name: "Thrive",
    color: "success",
    description: "Long-term growth tracking with insights that help you understand and improve your behavior.",
    features: ["Growth analytics", "Behavioral insights", "Long-term trends"],
  },
];

export const EcosystemSection = () => {
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="max-w-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Four AI Agents, One Mission
            </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete ecosystem designed to help you close the gap between intention and action.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            return (
            <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="card group hover:border-primary/30"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-${agent.color}/10 mb-4`}>
                  <Icon className={`w-8 h-8 accent-${agent.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{agent.name}</h3>
                <p className="text-muted-foreground mb-6">{agent.description}</p>
                <ul className="space-y-2">
                  {agent.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${agent.color}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
