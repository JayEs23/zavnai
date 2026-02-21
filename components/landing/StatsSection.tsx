"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Waitlist Signups",
    description: "Early adopters ready to transform their habits",
    gradient: "from-primary to-teal-600",
  },
  {
    icon: Clock,
    value: "Q2 2024",
    label: "Launch Target",
    description: "We're building something special for you",
    gradient: "from-secondary to-emerald-600",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Beta Success Rate",
    description: "Based on our internal testing and validation",
    gradient: "from-accent to-purple-600",
  },
  {
    icon: DollarSign,
    value: "$50K+",
    label: "In Pre-Commitments",
    description: "Early users ready to stake their goals",
    gradient: "from-success to-green-600",
  },
];

export const StatsSection = () => {
  return (
    <section className="w-full bg-gradient-to-br from-slate-50 to-white py-16 lg:py-20 border-y border-border/50">
      <div className="w-full max-w-[1920px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center p-6 rounded-2xl bg-white border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-4 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

