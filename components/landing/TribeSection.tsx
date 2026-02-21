"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Heart, MessageCircle, TrendingUp, Quote } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Entrepreneur",
    content: "ZAVN helped me finally stick to my morning routine. The accountability from my tribe makes all the difference.",
    avatar: "SC",
    gradient: "from-primary to-teal-600",
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    content: "I've tried every productivity app. This is different. The stakes are real, and the community actually cares.",
    avatar: "MJ",
    gradient: "from-secondary to-emerald-600",
  },
  {
    name: "Emily Rodriguez",
    role: "Fitness Coach",
    content: "The voice interface is game-changing. It feels like talking to a friend who genuinely wants you to succeed.",
    avatar: "ER",
    gradient: "from-accent to-purple-600",
  },
];

export const TribeSection = () => {
  return (
    <section id="community" className="section-padding bg-white py-24 lg:py-32">
      <div className="w-full max-w-[1920px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Community Driven</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Join a Community That Cares
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            You're not alone on this journey. Connect with others who are committed to closing
            the gap between who they say they are and what they do.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {[
            {
              icon: Users,
              title: "Accountability Partners",
              description: "Find people with similar goals and support each other.",
              gradient: "from-primary to-teal-600",
            },
            {
              icon: MessageCircle,
              title: "Daily Check-ins",
              description: "Share progress, struggles, and wins with your tribe.",
              gradient: "from-secondary to-emerald-600",
            },
            {
              icon: Heart,
              title: "Genuine Support",
              description: "Get encouragement from people who understand.",
              gradient: "from-accent to-purple-600",
            },
            {
              icon: TrendingUp,
              title: "Collective Growth",
              description: "See how the community is progressing together.",
              gradient: "from-success to-green-600",
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative bg-white rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold shadow-md`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed relative z-10">{testimonial.content}</p>
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
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
          >
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
