"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Heart, MessageCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Entrepreneur",
    content: "ZAVN helped me finally stick to my morning routine. The accountability from my tribe makes all the difference.",
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    content: "I've tried every productivity app. This is different. The stakes are real, and the community actually cares.",
    avatar: "MJ",
  },
  {
    name: "Emily Rodriguez",
    role: "Fitness Coach",
    content: "The voice interface is game-changing. It feels like talking to a friend who genuinely wants you to succeed.",
    avatar: "ER",
  },
];

export const TribeSection = () => {
  return (
    <section id="community" className="section-padding bg-white">
      <div className="max-w-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Join a Community That Cares
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            You're not alone on this journey. Connect with others who are committed to closing
            the gap between who they say they are and what they do.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: Users,
              title: "Accountability Partners",
              description: "Find people with similar goals and support each other.",
            },
            {
              icon: MessageCircle,
              title: "Daily Check-ins",
              description: "Share progress, struggles, and wins with your tribe.",
            },
            {
              icon: Heart,
              title: "Genuine Support",
              description: "Get encouragement from people who understand.",
            },
            {
              icon: TrendingUp,
              title: "Collective Growth",
              description: "See how the community is progressing together.",
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-muted-foreground">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link href="/signup" className="btn-gradient inline-flex items-center gap-2">
            Start Your Journey Today
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Free to start
          </p>
        </motion.div>
      </div>
    </section>
  );
};
