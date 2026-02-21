"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Bell } from "lucide-react";
import { WaitlistModal } from "./WaitlistModal";

export const WaitlistSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="w-full bg-gradient-to-br from-primary via-teal-600 to-accent text-white py-20 lg:py-28">
        <div className="w-full max-w-[1920px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Join the Waitlist
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Be among the first to experience ZAVN. We&apos;re building something special, 
              and we&apos;d love to have you on board when we launch.
            </p>

            {/* Benefits */}
            <div className="grid md:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
              <div className="flex items-start gap-3 text-left">
                <Users className="w-6 h-6 text-white/90 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold mb-1">Early Access</div>
                  <div className="text-sm text-white/80">Get priority access when we launch</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <Bell className="w-6 h-6 text-white/90 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold mb-1">Launch Notifications</div>
                  <div className="text-sm text-white/80">Be the first to know when we go live</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              Join Waitlist
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <p className="text-sm text-white/70 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

