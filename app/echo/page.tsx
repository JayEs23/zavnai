'use client';

/**
 * Echo - Voice-First Interface
 * Uses the same Gemini Live experience as onboarding for goal creation.
 */

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import VoiceOnboardingSession from '@/components/onboarding/VoiceOnboardingSession';

function EchoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const isReflection = searchParams.get('mode') === 'reflection';
  const commitmentId = searchParams.get('commitmentId') || '';

  // Reflection mode: redirect to dedicated reflection page
  useEffect(() => {
    if (isReflection && commitmentId) {
      router.replace(`/echo/reflect/${commitmentId}`);
    }
  }, [isReflection, commitmentId, router]);

  if (isReflection && commitmentId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
          <p className="text-lg font-semibold text-foreground">Redirecting to reflection...</p>
        </div>
      </div>
    );
  }

  // Default / goal creation: use same Echo experience as onboarding
  const handleComplete = (_transcript: string, _insights: Record<string, unknown>) => {
    router.replace('/dashboard');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
          <p className="text-lg font-semibold text-foreground">Loading Echo...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.replace('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-accent/5">
      <VoiceOnboardingSession
        onComplete={handleComplete}
        onError={(msg) => console.error('[Echo]', msg)}
      />
    </div>
  );
}

export default function EchoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="text-lg font-semibold text-foreground">Loading Echo...</p>
          </div>
        </div>
      }
    >
      <EchoContent />
    </Suspense>
  );
}
