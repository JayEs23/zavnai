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
    <div className="min-h-screen bg-background-light text-slate-900 dark:bg-background-dark dark:text-white">
      <div className="flex min-h-screen flex-col">
        {/* Top Nav */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-background-light px-6 py-4 dark:border-slate-800 dark:bg-background-dark md:px-20">
          <div className="flex items-center gap-3">
            <div className="relative h-6 w-6 text-primary">
              <span className="inline-block h-full w-full rounded-md bg-primary/10" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">ZAVN</h2>
          </div>
        </header>

        {/* Content */}
        <main className="flex flex-1 justify-center px-4 py-10 md:px-10 lg:px-40">
          <div className="flex w-full max-w-[800px] flex-col gap-8">
            {/* Progress */}
            <div className="flex flex-col gap-3">
              <div className="flex items-end justify-between gap-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Step {step} of {totalSteps}
                </p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {progress}% Complete
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-primary transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                {stepLabel}
              </p>
            </div>

            {/* Heading */}
            <div className="text-center">
              <h1 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">
                {title}
              </h1>
              <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-400 md:text-lg">
                {subtitle}
              </p>
            </div>

            {/* Body */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


