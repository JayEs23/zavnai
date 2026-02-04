"use client";

import React from "react";
import { motion } from "framer-motion";

const pillars = [
  {
    title: "Echo",
    tag: "Voice API",
    desc: "A behavioral mirror that detects hesitation in your vocal cords before you even realize you're failing.",
    size: "md:col-span-2 md:row-span-2",
  },
  {
    title: "The Vault",
    tag: "Financial Stakes",
    desc: "Capitalize your commitment. Fail a task, lose the stake. No appeals.",
    size: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Vision Proof",
    tag: "Camera API",
    desc: "Don't just tell the network you're at the gym. Show it. Verified by Multimodal Vision.",
    size: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Future Self Manifest",
    tag: "Image API",
    desc: "A hyper-realistic visual proxy of your success—or your decay—updated in real-time.",
    size: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Micro-win Negotiator",
    tag: "Gemini Core",
    desc: "When the trough hits, Echo negotiates tasks so small they are impossible to fail.",
    size: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Tribe Protocol",
    tag: "Social Network",
    desc: "A social safety net of vetted humans who receive the forfeited capital of your failures.",
    size: "md:col-span-2 md:row-span-1",
  },
  {
    title: "Geolocation Integrity",
    tag: "Action Zone",
    desc: "Action zone verification. If you aren't in the zone, you aren't in alignment.",
    size: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Thrive Analytics",
    tag: "Human Reliability",
    desc: "A brutal, data-driven score of your human reliability.",
    size: "md:col-span-1 md:row-span-1",
  },
];

export const EcosystemSection = () => {
  return (
    <section className="py-40 px-4 bg-[#09090b] border-y border-zinc-900 relative">
      {/* Structural Decor */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-zinc-900/50" />
      <div className="absolute top-0 left-2/4 w-px h-full bg-zinc-900/50" />
      <div className="absolute top-0 left-3/4 w-px h-full bg-zinc-900/50" />

      <div className="max-w-7xl mx-auto space-y-32 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="space-y-8 max-w-2xl">
            <div className="flex items-center gap-3 mono text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="size-1.5 bg-amber-500" />
              [MODULE_02: THE_EIGHT_PILLARS_OF_ZERO_GAP]
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-100 uppercase leading-[0.8]">
              INDUSTRIAL <br />
              <span className="text-zinc-800">INFRASTRUCTURE.</span>
            </h2>
          </div>
          <div className="mono text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold text-right hidden md:block">
            <p>[PROTOCOLS_LOADED]: 08/08</p>
            <p>[GATEWAY_STATUS]: SECURE</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className={`${pillar.size} bg-[#09090b] p-12 flex flex-col justify-between group relative overflow-hidden transition-all duration-700`}
            >
              {/* Scan Line Effect on Hover */}
              <div className="absolute inset-0 bg-amber-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="scan-line opacity-0 group-hover:opacity-20 transition-opacity" />
              
              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-start">
                  <span className="mono text-[9px] text-zinc-700 uppercase tracking-[0.3em] font-black group-hover:text-amber-500/50 transition-colors">
                    {pillar.tag}
                  </span>
                  <div className="size-1 bg-zinc-800 group-hover:bg-amber-500 group-hover:animate-pulse transition-colors" />
                </div>
                <h3 className="text-3xl font-black text-zinc-300 uppercase tracking-tighter leading-none group-hover:text-zinc-100 transition-colors">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest leading-relaxed relative z-10 pt-16 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100 mono">
                {pillar.desc}
              </p>

              {/* Corner Accents */}
              <div className="absolute top-0 right-0 size-4 border-t border-r border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 size-4 border-b border-l border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
