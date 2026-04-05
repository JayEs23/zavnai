'use client';

/**
 * Echo - Voice-First Interface
 * Uses the same Gemini Live experience as onboarding for goal creation.
 */

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import VoiceOnboardingSession from '@/components/onboarding/VoiceOnboardingSession';
import { api } from '@/lib/api';
import { trackProductEvent } from '@/lib/productAnalytics';
import { FullScreenGradientLoadingSkeleton } from '@/components/skeletons/PageSkeletons';

function EchoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const isReflection = searchParams.get('mode') === 'reflection';
  const commitmentId = searchParams.get('commitmentId') || '';
  const [reflectionTask, setReflectionTask] = useState<string>('');
  const [reflectionTaskLoading, setReflectionTaskLoading] = useState(false);
  const [reflectionLoadError, setReflectionLoadError] = useState<string | null>(null);
  const reflectionEnterTrackedFor = useRef<string | null>(null);

  useEffect(() => {
    const loadReflectionContext = async () => {
      if (!isReflection || !commitmentId) return;
      setReflectionLoadError(null);
      setReflectionTaskLoading(true);
      const response = await api.get<{ task_detail?: string }>(`/api/v1/goals/commitments/${commitmentId}`);
      if (response.error) {
        setReflectionLoadError(
          response.error.message || 'Could not load this commitment. It may have been completed or removed.'
        );
        setReflectionTask('');
      } else if (response.data?.task_detail) {
        setReflectionTask(response.data.task_detail);
      }
      setReflectionTaskLoading(false);
    };
    void loadReflectionContext();
  }, [isReflection, commitmentId]);

  useEffect(() => {
    if (!isReflection || !commitmentId || reflectionTaskLoading || reflectionLoadError) return;
    if (reflectionEnterTrackedFor.current === commitmentId) return;
    reflectionEnterTrackedFor.current = commitmentId;
    trackProductEvent('echo_voice_reflection_enter', { commitmentId });
  }, [isReflection, commitmentId, reflectionTaskLoading, reflectionLoadError]);

  if (isReflection && commitmentId && reflectionTaskLoading) {
    return <FullScreenGradientLoadingSkeleton />;
  }

  if (isReflection && commitmentId && reflectionLoadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 px-4">
        <div className="max-w-md rounded-2xl border border-border bg-white dark:bg-card p-6 text-center shadow-lg">
          <p className="text-foreground font-semibold mb-2">Cannot start voice reflection</p>
          <p className="text-sm text-muted-foreground mb-4">{reflectionLoadError}</p>
          <button
            type="button"
            onClick={() => router.replace('/dashboard/commitments')}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            Go to commitments
          </button>
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
    return <FullScreenGradientLoadingSkeleton />;
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
    <Suspense fallback={<FullScreenGradientLoadingSkeleton />}>
      <EchoContent />
    </Suspense>
  );
}
