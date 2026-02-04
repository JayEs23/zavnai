"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdPeopleAlt, MdCheckCircle } from "react-icons/md";

export const TribeSection = () => {
  const [activeNodes, setActiveNodes] = useState(1245);
  const [integrityIndex, setIntegrityIndex] = useState(92.7);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNodes(prev => prev + Math.floor(Math.random() * 3));
      setIntegrityIndex(prev => parseFloat((prev + (Math.random() * 0.2 - 0.1)).toFixed(1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { x: 10, y: 20, size: 4, delay: 0.2 },
    { x: 30, y: 15, size: 6, delay: 0.4 },
    { x: 50, y: 35, size: 8, delay: 0.6 },
    { x: 70, y: 25, size: 5, delay: 0.8 },
    { x: 90, y: 45, size: 7, delay: 1.0 },
    { x: 20, y: 55, size: 7, delay: 1.2 },
    { x: 40, y: 65, size: 5, delay: 1.4 },
    { x: 60, y: 85, size: 6, delay: 1.6 },
    { x: 80, y: 75, size: 8, delay: 1.8 },
  ];

  return (
    <section className="py-40 px-4 bg-[#09090b] border-b border-zinc-900 relative">
      {/* Structural Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 right-1/4 w-px h-full bg-zinc-800" />
        <div className="absolute top-0 right-2/4 w-px h-full bg-zinc-800" />
        <div className="absolute top-0 right-3/4 w-px h-full bg-zinc-800" />
      </div>

      <div className="max-w-7xl mx-auto space-y-32 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 text-left">
          <div className="space-y-8 max-w-2xl">
            <div className="flex items-center gap-3 mono text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="size-1.5 bg-amber-500" />
              [MODULE_04: SOCIAL_ENFORCEMENT]
            </div>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-zinc-100 uppercase leading-[0.75]">
              The Tribe <br />
              <span className="text-zinc-800">of Verifiers.</span>
            </h2>
          </div>
          <p className="text-xl text-zinc-500 font-bold uppercase tracking-widest leading-relaxed max-w-md mono text-right">
            Join a global network of high-performance humans who act as the final judge of visual and social proof.
          </p>
        </div>

        <div className="relative w-full h-[700px] bg-[#09090b] border border-zinc-900 overflow-hidden flex items-center justify-center group shadow-2xl">
          {/* Grayscale Map Background Overlay */}
          <div className="absolute inset-0 opacity-[0.02] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-center bg-no-repeat bg-contain grayscale invert" />
          
          {/* Industrial Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* Animated Network Lines */}
          <div className="absolute inset-0 opacity-60">
            {nodes.map((node, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-amber-500 shadow-[0_0_20px_#f59e0b]"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  width: `${node.size}px`,
                  height: `${node.size}px`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: node.delay }}
              />
            ))}
            <svg className="absolute inset-0 w-full h-full">
              <motion.path
                d="M 10 20 L 30 15 L 50 35 L 70 25 L 90 45"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.2 }}
                viewport={{ once: true }}
                transition={{ duration: 3, delay: 1 }}
              />
              <motion.path
                d="M 20 55 L 40 65 L 60 85 L 80 75"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.2 }}
                viewport={{ once: true }}
                transition={{ duration: 3, delay: 1.5 }}
              />
              <motion.path
                d="M 30 15 L 20 55"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.15 }}
                viewport={{ once: true }}
                transition={{ duration: 3, delay: 2 }}
              />
            </svg>
          </div>

          {/* Stats Readout Overlay */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-800 max-w-2xl w-full mx-4 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <div className="bg-[#09090b]/90 backdrop-blur-3xl p-12 space-y-6">
              <div className="flex items-center space-x-4 text-amber-500">
                <MdPeopleAlt size={20} />
                <span className="mono text-[10px] font-black uppercase tracking-[0.4em]">Active_Nodes</span>
              </div>
              <p className="text-6xl font-black text-zinc-100 mono tracking-tighter glow-amber">
                {activeNodes.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#09090b]/90 backdrop-blur-3xl p-12 space-y-6">
              <div className="flex items-center space-x-4 text-amber-500">
                <MdCheckCircle size={20} />
                <span className="mono text-[10px] font-black uppercase tracking-[0.4em]">Network_Integrity</span>
              </div>
              <p className="text-6xl font-black text-zinc-100 mono tracking-tighter glow-amber">
                {integrityIndex}%
              </p>
            </div>
            <div className="col-span-full bg-zinc-950/90 p-8 border-t border-zinc-900">
              <div className="flex items-center justify-center gap-4 mono text-[10px] text-zinc-600 uppercase tracking-[0.5em] font-black">
                <div className="size-2 bg-amber-500 animate-pulse" />
                [STATUS: OPTIMAL_ALIGNMENT_REACHED_BY_TRIBE]
              </div>
            </div>
          </div>
          
          {/* Industrial Scanning Line */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <motion.div 
              className="w-full h-px bg-amber-500 shadow-[0_0_30px_#f59e0b]"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Corner Decors */}
          <div className="absolute top-8 left-8 mono text-[8px] text-zinc-800 uppercase font-black tracking-widest leading-relaxed">
            <p>[X_COORD]: 48.8566</p>
            <p>[Y_COORD]: 2.3522</p>
            <p>[NODE_SIGNAL]: ENCRYPTED</p>
          </div>
          <div className="absolute bottom-8 right-8 mono text-[8px] text-zinc-800 uppercase font-black tracking-widest text-right leading-relaxed">
            <p>[PACKET_STREAM]: ACTIVE</p>
            <p>[SYNC_AUTH]: VERIFIED</p>
            <p>[GLOBAL_LATENCY]: LOW</p>
          </div>
        </div>
      </div>
    </section>
  );
};
