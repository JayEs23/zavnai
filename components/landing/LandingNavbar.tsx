"use client";

import Link from "next/link";
import { ThemeToggle } from "../ThemeToggle";

export const LandingNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-[#09090b]/90 backdrop-blur-3xl">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="size-12 bg-amber-500 flex items-center justify-center transition-all duration-500 group-hover:bg-amber-400 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
            <span className="mono text-[#09090b] font-black text-2xl">Z</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tighter text-zinc-100 leading-none">
              ZAVN
            </h2>
            <span className="mono text-[9px] text-amber-500/60 uppercase tracking-[0.3em] font-black">
              [V1.0.4_PROD]
            </span>
          </div>
        </Link>
        
        <nav className="hidden items-center gap-12 lg:flex">
          {["Echo", "Vault", "Tribe", "Thrive"].map((item) => (
            <a
              key={item}
              className="mono text-[10px] uppercase tracking-[0.4em] font-black text-zinc-600 hover:text-amber-500 transition-all duration-300 relative group/nav"
              href={`#${item.toLowerCase()}`}
            >
              <span className="opacity-0 group-hover/nav:opacity-100 transition-all absolute -left-5 text-amber-500/30 transform -translate-x-2 group-hover/nav:translate-x-0">/</span>
              {item}
              <span className="opacity-0 group-hover/nav:opacity-100 transition-all absolute -right-5 text-amber-500/30 transform translate-x-2 group-hover/nav:translate-x-0">/</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-10">
          <div className="hidden sm:flex flex-col items-end">
            <span className="mono text-[8px] text-zinc-700 uppercase font-black tracking-widest">System_Status</span>
            <div className="flex items-center gap-2">
              <div className="size-1.5 bg-amber-500 animate-pulse" />
              <span className="mono text-[9px] text-amber-500 uppercase font-black">ALIGNED</span>
            </div>
          </div>
          <div className="hidden h-10 w-px bg-zinc-900 lg:block" />
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="mono text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600 hover:text-zinc-100 transition-colors"
            >
              Authenticate
            </Link>
            <Link
              href="/signup"
              className="group relative px-10 py-4 bg-zinc-950 border border-zinc-800 overflow-hidden"
            >
              <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              <span className="relative z-10 mono text-[10px] uppercase tracking-[0.4em] font-black text-amber-500 group-hover:text-zinc-950 transition-colors">
                Initialize
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
