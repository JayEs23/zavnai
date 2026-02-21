"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CtaSection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-primary to-accent text-white">
      <div className="max-w-container text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Close the Gap?
        </h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
          Join thousands of people who are transforming their intentions into actions.
          Start your journey today—no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:shadow-lg transition-all">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border-2 border-white/20 hover:bg-white/20 transition-all">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};
