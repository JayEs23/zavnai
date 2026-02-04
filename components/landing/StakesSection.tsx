"use client";

import React from "react";
import { motion } from "framer-motion";

export const StakesSection = () => {
  return (
    <section className="py-40 px-4 bg-[#09090b] border-b border-zinc-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center relative z-10">
        <div className="space-y-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3 mono text-red-500 text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="size-1.5 bg-red-500 animate-pulse" />
              [CRITICAL_MODULE: FORFEITURE_AS_A_FEATURE]
            </div>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-zinc-100 uppercase leading-[0.75]">
              FORFEITURE <br />
              <span className="text-red-500 glow-red">IS THE EDGE.</span>
            </h2>
          </div>
          
          <p className="text-xl text-zinc-500 font-bold uppercase tracking-widest leading-relaxed max-w-xl mono">
            ZAVN does not track habits. It enforces integrity. Your money is 
            escrowed to a restricted member of your choice. Achievement is 
            the only way to get it back.
          </p>

          <div className="pt-16 border-t border-zinc-900 space-y-12">
            <div className="flex flex-col space-y-4">
              <span className="mono text-[10px] text-zinc-700 uppercase tracking-[0.4em] font-black">
                NETWORK_TOTAL_FORFEITED
              </span>
              <div className="flex items-baseline space-x-4">
                <span className="text-7xl md:text-9xl font-black text-red-500 mono tracking-tighter glow-red">
                  $1,248,402
                </span>
              </div>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 p-4 w-fit">
              <p className="mono text-[9px] text-red-500/70 uppercase tracking-[0.3em] font-black">
                [SYSTEM_DATA]: Integrity Reallocation in Progress // No Appeals Detected
              </p>
            </div>
          </div>
        </div>

        {/* The Vault Mockup */}
        <div className="relative aspect-square bg-zinc-950 border border-zinc-900 p-1 rounded-none group shadow-[0_0_100px_rgba(239,68,68,0.05)]">
          <div className="absolute -inset-1 border border-red-500/10 pointer-events-none" />
          <div className="h-full w-full border border-zinc-900 flex flex-col relative z-10 bg-[#09090b]">
            <div className="p-8 border-b border-zinc-900 flex justify-between items-center mono text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em]">
              <div className="flex items-center gap-2">
                <div className="size-1.5 bg-zinc-800" />
                <span>VAULT_ID: ZVN-9942</span>
              </div>
              <span className="text-red-500 animate-pulse">[LOCKED_BY_INTEGRITY]</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center space-y-12 p-12">
              <div className="relative size-64">
                {/* Visual Radar Effect */}
                <div className="absolute inset-0 rounded-full border border-zinc-900" />
                <div className="absolute inset-0 rounded-full border-t-2 border-red-500 animate-spin [animation-duration:3s]" />
                <div className="absolute inset-[10%] rounded-full border border-zinc-900/50" />
                <div className="absolute inset-[20%] rounded-full border border-zinc-900/30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="mono text-6xl text-zinc-100 font-black tracking-tighter glow-red">$500</span>
                  <span className="mono text-[8px] text-zinc-700 uppercase tracking-widest mt-2">Escrow_Balance</span>
                </div>
              </div>
              <div className="text-center space-y-3">
                <div className="mono text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-black border border-zinc-900 px-4 py-1">
                  ACTIVE_STAKE: "COMPLETE_Q1_STRATEGY"
                </div>
              </div>
            </div>
            <div className="p-10 bg-zinc-950 border-t border-zinc-900">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-3">
                  <span className="mono text-[8px] text-zinc-700 uppercase tracking-widest font-black">Beneficiary</span>
                  <p className="text-zinc-100 font-black uppercase text-xs tracking-tighter mono">Tribe_Node: Alex_K</p>
                </div>
                <div className="space-y-3 text-right">
                  <span className="mono text-[8px] text-zinc-700 uppercase tracking-widest font-black">Release_Window</span>
                  <p className="text-red-500 font-black uppercase text-xs tracking-tighter animate-pulse mono">14:02:55_REMAINING</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
