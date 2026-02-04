'use client';

import React, { ReactNode } from "react";
import Image from "next/image";

interface OnboardingShellProps {
  step: number;
  totalSteps: number;
  stepLabel: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function OnboardingShell({
  step,
  totalSteps,
  stepLabel,
  title,
  children,
}: OnboardingShellProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#09090b] text-zinc-100 mono">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="grain-overlay opacity-[0.05]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.02)_0%,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="w-full border-b border-zinc-900 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="size-10 bg-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all">
              <span className="text-[#09090b] font-black text-xl">Z</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-zinc-100 text-lg font-black tracking-tighter uppercase leading-none">
                ZAVN <span className="text-amber-500 text-[10px] ml-1 tracking-widest">[ONBOARDING_V1]</span>
              </h2>
              <span className="mono text-[8px] text-zinc-700 uppercase font-black tracking-widest">
                DISCOVERY_PROTOCOL_ACTIVE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="mono text-[8px] text-zinc-600 uppercase font-black tracking-widest">Status</span>
              <div className="flex items-center gap-2">
                <div className="size-1 bg-amber-500 animate-pulse" />
                <span className="mono text-[9px] text-amber-500 uppercase font-black">PRIVATE_SESSION</span>
              </div>
            </div>
            <div className="h-8 w-px bg-zinc-900" />
            <div className="border border-zinc-800 px-3 py-1 bg-zinc-950 flex flex-col gap-0.5">
              <span className="mono text-[7px] text-zinc-600 font-black uppercase tracking-widest">ENCRYPTION_LAYER</span>
              <span className="mono text-[8px] text-amber-500 font-black uppercase tracking-widest">E2EE_SECURE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 relative z-10 flex flex-col">
        {/* Progress: Buffer Map */}
        <div className="w-full border-b border-zinc-900 bg-zinc-950/50 px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="mono text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em]">
              [BUFFER_MAP]:
            </span>
            <div className="flex gap-1.5">
              {[...Array(totalSteps)].map((_, i) => (
                <div 
                  key={i}
                  className={`size-3 transition-all duration-700 ${
                    i < step 
                      ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                      : 'bg-zinc-900 border border-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="mono text-[10px] text-amber-500/50 font-black uppercase tracking-widest">
            PHASE_{stepLabel}: {step}/{totalSteps}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 px-8 py-4 bg-[#09090b] relative z-20">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6 opacity-30 mono text-[9px] font-black uppercase tracking-[0.4em]">
            <span>SYSTEM: ALIGNED</span>
            <span>NODE_ID: {Math.random().toString(16).substring(2, 8).toUpperCase()}</span>
          </div>
          <div className="opacity-30 mono text-[9px] font-black uppercase tracking-[0.4em]">
            OBSERVED_INTEGRITY: HIGH
          </div>
        </div>
      </footer>
    </div>
  );
}
