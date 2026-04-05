'use client';

import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import AppNavbar from '@/components/AppNavbar';

/** Matches ZAVN light theme `--border` / muted surfaces */
const BASE = '#e2e8f0';
const HIGHLIGHT = '#f8fafc';

export function ZavnSkeletonTheme({ children }: { children: React.ReactNode }) {
  return (
    <SkeletonTheme baseColor={BASE} highlightColor={HIGHLIGHT} borderRadius={12} duration={1.1}>
      {children}
    </SkeletonTheme>
  );
}

/** Echo session load, reflection context, Suspense fallbacks, onboarding session fetch */
export function FullScreenGradientLoadingSkeleton({ showTextLines = true }: { showTextLines?: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 px-6">
      <div className="w-full max-w-md space-y-4">
        <ZavnSkeletonTheme>
          <Skeleton height={32} width="65%" />
          {showTextLines ? <Skeleton height={14} count={2} /> : null}
        </ZavnSkeletonTheme>
      </div>
    </div>
  );
}

/** Dashboard + commitments initial load (shared layout) */
export function DashboardLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      <AppNavbar />
      <main className="w-full max-w-[min(100%,96rem)] mx-auto px-2 sm:px-3 lg:px-4 py-4 sm:py-6 space-y-5">
        <ZavnSkeletonTheme>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton height={40} width={280} />
              <Skeleton height={22} width={360} />
            </div>
            <Skeleton height={48} width={160} borderRadius={12} />
          </div>
          <Skeleton height={88} borderRadius={16} className="w-full" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} height={100} borderRadius={16} className="w-full" />
            ))}
          </div>
          <Skeleton height={120} borderRadius={16} className="w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton height={180} borderRadius={16} />
            <Skeleton height={180} borderRadius={16} />
          </div>
        </ZavnSkeletonTheme>
      </main>
    </div>
  );
}

export function InsightsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      <AppNavbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <ZavnSkeletonTheme>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton height={44} width={320} />
              <Skeleton height={20} width={400} />
            </div>
            <Skeleton height={44} width={140} borderRadius={12} />
          </div>
          <Skeleton height={200} borderRadius={16} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} height={96} borderRadius={12} />
            ))}
          </div>
          <Skeleton height={160} borderRadius={16} />
        </ZavnSkeletonTheme>
      </main>
    </div>
  );
}

export function ThriveLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <ZavnSkeletonTheme>
          <Skeleton height={36} width={220} className="mb-8" />
          <div className="flex justify-center mb-10">
            <Skeleton circle height={160} width={160} />
          </div>
          <Skeleton height={24} width="50%" className="mb-4" />
          <Skeleton height={120} borderRadius={16} />
        </ZavnSkeletonTheme>
      </div>
    </div>
  );
}

export function SettingsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AppNavbar />
      <div className="p-8 max-w-4xl mx-auto">
        <ZavnSkeletonTheme>
          <Skeleton height={40} width={200} className="mb-2" />
          <Skeleton height={20} width={360} className="mb-10" />
          <div className="flex gap-2 mb-8">
            <Skeleton height={40} width={120} borderRadius={8} />
            <Skeleton height={40} width={120} borderRadius={8} />
            <Skeleton height={40} width={120} borderRadius={8} />
          </div>
          <Skeleton height={200} borderRadius={16} className="mb-6" />
          <Skeleton height={200} borderRadius={16} />
        </ZavnSkeletonTheme>
      </div>
    </div>
  );
}

/** Goals / tribe member card grids */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ZavnSkeletonTheme>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} height={200} borderRadius={16} className="w-full" />
        ))}
      </ZavnSkeletonTheme>
    </div>
  );
}

/** Doyn dashboard chat panel initial load */
export function DoynChatInitializingSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border-subtle p-6">
        <ZavnSkeletonTheme>
          <div className="flex items-center gap-3">
            <Skeleton circle width={40} height={40} />
            <div className="space-y-2">
              <Skeleton height={18} width={120} />
              <Skeleton height={14} width={180} />
            </div>
          </div>
        </ZavnSkeletonTheme>
      </div>
      <div className="flex-1 p-6 space-y-4">
        <ZavnSkeletonTheme>
          <Skeleton height={64} borderRadius={18} width="75%" />
          <div className="flex justify-end">
            <Skeleton height={56} borderRadius={18} width="65%" />
          </div>
          <Skeleton height={64} borderRadius={18} width="70%" />
        </ZavnSkeletonTheme>
      </div>
    </div>
  );
}

/** Full-screen goal + Doyn chat route (matches custom header, not AppNavbar) */
export function DoynGoalPageLoadingSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-primary/5 to-accent/5">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <ZavnSkeletonTheme>
            <div className="flex items-center gap-4">
              <Skeleton circle width={28} height={28} />
              <div className="space-y-2">
                <Skeleton height={20} width={220} />
                <Skeleton height={14} width={280} />
              </div>
            </div>
            <Skeleton height={32} width={96} />
          </ZavnSkeletonTheme>
        </div>
      </header>
      <main className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full p-6">
        <ZavnSkeletonTheme>
          <Skeleton height={80} borderRadius={12} className="mb-4 w-full" />
          <Skeleton height={64} borderRadius={18} width="75%" className="mb-4" />
          <div className="flex justify-end mb-4">
            <Skeleton height={56} borderRadius={18} width="65%" />
          </div>
          <Skeleton height={64} borderRadius={18} width="70%" />
        </ZavnSkeletonTheme>
      </main>
    </div>
  );
}

/** Commitments page: goal-scoped list loading */
export function CommitmentsListPanelSkeleton() {
  return (
    <div className="flex items-center justify-center py-16 bg-white rounded-xl border border-dashed border-border w-full">
      <div className="w-full max-w-2xl px-4 space-y-3">
        <ZavnSkeletonTheme>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={88} borderRadius={12} />
          ))}
        </ZavnSkeletonTheme>
      </div>
    </div>
  );
}

/** Sidebar commitment list (matches CommitmentsSidebar layout) */
export function CommitmentsSidebarSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border-subtle p-6">
        <ZavnSkeletonTheme>
          <div className="flex items-center justify-between mb-4">
            <Skeleton height={22} width={140} />
            <Skeleton circle width={32} height={32} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Skeleton height={32} width={56} borderRadius={8} />
            <Skeleton height={32} width={72} borderRadius={8} />
            <Skeleton height={32} width={64} borderRadius={8} />
          </div>
        </ZavnSkeletonTheme>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <ZavnSkeletonTheme>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={72} borderRadius={12} />
          ))}
        </ZavnSkeletonTheme>
      </div>
    </div>
  );
}

/** Evaluation metrics charts area */
export function CommitmentQualityChartsSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-64 py-4">
      <div className="w-full max-w-4xl space-y-6">
        <ZavnSkeletonTheme>
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton height={240} borderRadius={16} />
            <Skeleton height={240} borderRadius={16} />
          </div>
          <Skeleton height={100} borderRadius={12} />
        </ZavnSkeletonTheme>
      </div>
    </div>
  );
}

/** Integrations list */
export function IntegrationsListSkeleton() {
  return (
    <div className="space-y-6">
      <ZavnSkeletonTheme>
        <Skeleton height={28} width={180} className="mb-4" />
        <Skeleton height={140} borderRadius={16} className="mb-4" />
        <Skeleton height={140} borderRadius={16} />
      </ZavnSkeletonTheme>
    </div>
  );
}
