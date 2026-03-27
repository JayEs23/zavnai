'use client';

/**
 * Echo - Voice-First Interface
 * Uses the same Gemini Live experience as onboarding for goal creation.
 */

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import VoiceOnboardingSession from '@/components/onboarding/VoiceOnboardingSession';
import { api } from '@/lib/api';

function EchoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const isReflection = searchParams.get('mode') === 'reflection';
  const commitmentId = searchParams.get('commitmentId') || '';
  const [reflectionTask, setReflectionTask] = useState<string>('');
  const [reflectionTaskLoading, setReflectionTaskLoading] = useState(false);

  useEffect(() => {
    const loadReflectionContext = async () => {
      if (!isReflection || !commitmentId) return;
      setReflectionTaskLoading(true);
      const response = await api.get<{ task_detail?: string }>(`/api/v1/goals/commitments/${commitmentId}`);
      if (response.data?.task_detail) {
        setReflectionTask(response.data.task_detail);
      }
      setReflectionTaskLoading(false);
    };
    void loadReflectionContext();
  }, [isReflection, commitmentId]);
  if (isReflection && commitmentId && reflectionTaskLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
          <p className="text-lg font-semibold text-foreground">Loading reflection context...</p>
        </div>
      </div>
    );
  }


  // Default / goal creation: use same Echo experience as onboarding
  const handleComplete = (_transcript: string, _insights: Record<string, unknown>) => {
    void _transcript;
    void _insights;
    router.replace(isReflection ? `/echo/reflect/${commitmentId}` : '/dashboard');
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
        sessionPurpose={isReflection ? 'reflection' : 'onboarding'}
        commitmentId={isReflection ? commitmentId : undefined}
        reflectionTask={isReflection ? reflectionTask : undefined}
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
