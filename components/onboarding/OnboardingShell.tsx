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
  subtitle,
  children,
}: OnboardingShellProps) {
  const progress = Math.round((step / totalSteps) * 100);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Header / TopNavBar */}
      <header className="w-full border-b border-[var(--border-subtle)] bg-[var(--card-bg)]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center border border-[var(--border-subtle)]">
              <Image
                src="/zavn-icon.png"
                alt="ZAVN logo"
                width={24}
                height={24}
                className="object-contain p-1"
              />
            </div>
            <h2 className="text-[var(--foreground)] text-xl font-bold tracking-tight">ZAVN</h2>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-[var(--muted-foreground)]">Step {step} of {totalSteps}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[800px] flex flex-col gap-8">
          {/* Progress Indicator */}
          <div className="flex flex-col gap-3 w-full px-2">
            <div className="flex justify-between items-end">
              <h3 className="text-[var(--foreground)] text-sm font-semibold uppercase tracking-wider">Onboarding Progress</h3>
              <p className="text-[var(--primary)] text-sm font-bold">{progress}% Complete</p>
            </div>
            <div className="h-2 w-full rounded-full bg-[var(--muted)] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-[var(--muted-foreground)] text-sm">{stepLabel}</p>
          </div>

          {/* Headline */}
          <div className="text-center space-y-3">
            <h1 className="text-[var(--foreground)] text-4xl font-extrabold tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 sm:p-10 shadow-lg">
            {children}
          </div>
        </div>
      </main>

      {/* Background Decor */}
      <div className="fixed top-0 right-0 -z-10 opacity-10 pointer-events-none">
        <div className="w-[500px] h-[500px] bg-[var(--primary)] rounded-full blur-[120px] -mr-48 -mt-48"></div>
      </div>
      <div className="fixed bottom-0 left-0 -z-10 opacity-10 pointer-events-none">
        <div className="w-[400px] h-[400px] bg-[var(--accent)] rounded-full blur-[100px] -ml-48 -mb-48"></div>
      </div>
    </div>
  );
}
