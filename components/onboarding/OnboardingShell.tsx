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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Header / TopNavBar */}
      <header className="w-full border-b border-solid border-gray-200 dark:border-white/10 bg-white dark:bg-background-dark/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-black">
              <Image
                src="/zavn-icon.png"
                alt="ZAVN logo"
                width={32}
                height={32}
                className="object-contain p-1"
              />
            </div>
            <h2 className="text-gray-900 dark:text-white text-xl font-bold tracking-tight">ZAVN</h2>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Step {step} of {totalSteps}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[800px] flex flex-col gap-8">
          {/* Progress Indicator */}
          <div className="flex flex-col gap-3 w-full px-2">
            <div className="flex justify-between items-end">
              <h3 className="text-gray-900 dark:text-white text-sm font-semibold uppercase tracking-wider">Onboarding Progress</h3>
              <p className="text-primary text-sm font-bold">{progress}% Complete</p>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{stepLabel}</p>
          </div>

          {/* Headline */}
          <div className="text-center space-y-2">
            <h1 className="text-gray-900 dark:text-white text-4xl font-extrabold tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {subtitle}
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none">
            {children}
          </div>
        </div>
      </main>

      {/* Background Decor */}
      <div className="fixed top-0 right-0 -z-10 opacity-20 dark:opacity-10 pointer-events-none">
        <div className="w-[500px] h-[500px] bg-primary rounded-full blur-[120px] -mr-48 -mt-48"></div>
      </div>
      <div className="fixed bottom-0 left-0 -z-10 opacity-20 dark:opacity-10 pointer-events-none">
        <div className="w-[400px] h-[400px] bg-primary rounded-full blur-[100px] -ml-48 -mb-48"></div>
      </div>
    </div>
  );
}
