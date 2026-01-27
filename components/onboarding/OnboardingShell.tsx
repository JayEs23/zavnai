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
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300 text-[var(--foreground)]">
      <div className="flex min-h-screen flex-col">
        {/* Top Nav */}
        <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--background)]/80 backdrop-blur-md transition-colors duration-300">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 icon-container rounded-xl">
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
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                    Step {step} of {totalSteps}
                  </p>
                  <p className="text-sm font-medium text-[var(--muted-foreground)]">
                    {stepLabel}
                  </p>
                </div>
                <p className="text-sm font-bold text-[var(--foreground)]">
                  {progress}% <span className="text-[var(--muted-foreground)] font-medium">Complete</span>
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                {title}
              </h1>
              <p className="text-lg text-body">
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


