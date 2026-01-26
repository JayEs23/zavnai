'use client';

import React, { ReactNode } from "react";

interface OnboardingShellProps {
  step: number;
  totalSteps: number;
  stepLabel: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

import { ThemeToggle } from "../ThemeToggle";
import Image from "next/image";

export function OnboardingShell({
  step,
  totalSteps,
  stepLabel,
  title,
  subtitle,
  children,
}: OnboardingShellProps) {
  const progress = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-background-dark text-slate-900 dark:text-white">
      <div className="flex min-h-screen flex-col">
        {/* Top Nav */}
        <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 dark:border-white/5 dark:bg-background-dark/80 backdrop-blur-md transition-colors duration-300">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Image
                  src="/zavn-icon.png"
                  alt="ZAVN logo"
                  fill
                  className="object-contain p-1.5"
                />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/70">
                ZAVN
              </h2>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <main className="flex flex-1 justify-center px-4 py-12 md:px-10 lg:px-20">
          <div className="flex w-full max-w-[720px] flex-col gap-10">
            {/* Progress */}
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    Step {step} of {totalSteps}
                  </p>
                  <p className="text-sm font-medium text-slate-500 dark:text-white/40">
                    {stepLabel}
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {progress}% <span className="text-slate-400 font-medium">Complete</span>
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                {title}
              </h1>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            </div>

            {/* Body */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


