"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [randomHeights, setRandomHeights] = useState<number[]>([]);

  useEffect(() => {
    // We use requestAnimationFrame to avoid the "cascading renders" linter warning
    // while still ensuring the random values are only generated on the client.
    requestAnimationFrame(() => {
      const heights = [...Array(40)].map(() => Math.random() * 100);
      setRandomHeights(heights);
    });
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-[#09090b]">
      {/* Kinetic Amber Dust Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-40"
        animate={{
          background: `radial-gradient(circle at ${50 + mousePos.x/2}% ${50 + mousePos.y/2}%, rgba(245, 158, 11, 0.12) 0%, transparent 70%)`,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.2 }}
      />
      <div className="absolute inset-0 pointer-events-none grain-overlay opacity-[0.04]" />

      <div className="relative z-10 text-center space-y-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-center gap-3 mono text-[10px] text-amber-500 font-black uppercase tracking-[0.5em] mb-4">
            <span className="opacity-30 border-t border-amber-500/30 w-12" />
            <span className="bg-amber-500/5 px-3 py-1 border border-amber-500/20">
              [SYSTEM_STATUS: ACTIVE_MIRROR]
            </span>
            <span className="opacity-30 border-t border-amber-500/30 w-12" />
          </div>
          <h1 className="text-6xl md:text-[150px] font-black tracking-tighter text-zinc-100 leading-[0.75] uppercase">
            INTENTION IS A <br />
            <span className="text-amber-500 glow-amber">LIABILITY.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-[0.2em] mono"
        >
          Bridge the gap between who you say you are and what you actually do. 
          A voice-led, high-stakes alignment network powered by Gemini Live.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col items-center space-y-24"
        >
          <Link href="/signup" className="group relative px-24 py-8 bg-transparent overflow-hidden border border-zinc-800 hover:border-amber-500 transition-all duration-700">
            <div className="scan-line opacity-50" />
            <span className="relative z-10 mono text-amber-500 font-black tracking-[0.5em] uppercase text-xl group-hover:text-zinc-950 transition-colors duration-500">
              INITIALIZE INTEGRITY
            </span>
            <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          </Link>

          {/* Real-time Echo Waveform */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-end space-x-1.5 h-24">
              {randomHeights.map((height, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-amber-500"
                  animate={{
                    height: [`${height}%`, `${Math.random() * 100}%`, `${height}%`],
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    opacity: 0.2 + (height / 100) * 0.8,
                    boxShadow: "0 0 15px rgba(245, 158, 11, 0.2)",
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 mono text-[9px] text-amber-500/40 uppercase tracking-[0.4em] font-black">
              <div className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              Listening_for_behavioral_drift...
            </div>
          </div>
        </motion.div>
      </div>

      {/* Industrial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none border-x border-zinc-800/10 opacity-50 mx-auto max-w-7xl" />
      <div className="absolute inset-0 pointer-events-none border-y border-zinc-800/10 opacity-50 my-auto max-h-[60vh]" />
      
      {/* Background Micro-readouts */}
      <div className="absolute bottom-12 left-12 hidden lg:block mono text-[8px] text-zinc-800 space-y-2 uppercase tracking-widest font-black">
        <p>[CONNECT_ID]: 0x8294-ZVN</p>
        <p>[LATENCY]: 12MS</p>
        <p>[PACKET_LOSS]: 0.00%</p>
        <p>[MODEL]: GEMINI_2.0_LIVE_PROD</p>
      </div>
      <div className="absolute bottom-12 right-12 hidden lg:block mono text-[8px] text-zinc-800 space-y-2 text-right uppercase tracking-widest font-black">
        <p>[ALIGNED_NODES]: 14,802</p>
        <p>[TOTAL_STAKED]: $1,248,402</p>
        <p>[STATUS]: OPERATIONAL</p>
        <p>[LOCATION]: GLOBAL_EDGE</p>
      </div>
    </section>
  );
};
