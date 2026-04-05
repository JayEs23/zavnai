'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { coreLoopApi } from '@/services/coreLoopApi';
import { MdArrowBack, MdCheckCircle, MdCancel } from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FullScreenGradientLoadingSkeleton } from '@/components/skeletons/PageSkeletons';

interface Commitment {
  id: string;
  goal_id: string;
  goal_title: string;
  task_detail: string;
  due_at: string;
  status: string;
  verification_method?: string;
  proof_url?: string;
  proof_text?: string;
}

export default function EchoReflectPage() {
  const params = useParams();
  const router = useRouter();
  const commitmentId = params.commitmentId as string;

  const [commitment, setCommitment] = useState<Commitment | null>(null);
  const [loading, setLoading] = useState(true);
  const [reflecting, setReflecting] = useState(false);
  const [reflection, setReflection] = useState('');
  const [completed, setCompleted] = useState<boolean | null>(null);
  const [proofMethod, setProofMethod] = useState<'text' | 'link' | 'photo'>('text');
  const [proofText, setProofText] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    loadCommitment();
  }, [commitmentId]);

  const loadCommitment = async () => {
    try {
      setLoading(true);
      const response = await api.get<Commitment>(`/api/v1/goals/commitments/${commitmentId}`);
      if (response.error || !response.data) {
        console.error('Error loading commitment:', response.error);
        router.push('/dashboard');
        return;
      }
      setCommitment(response.data);
    } catch (error) {
      console.error('Error loading commitment:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReflection = async () => {
    if (!commitment || completed === null || !reflection.trim()) return;

    setSubmitError(null);
    setReflecting(true);

    try {
      if (completed) {
        const completeRes = await api.post<{
          success?: boolean;
          message?: string;
        }>(`/api/v1/goals/commitments/${commitmentId}/complete`, {
          proof_text:
            proofMethod === 'text' && proofText.trim()
              ? proofText.trim()
              : undefined,
          proof_url:
            (proofMethod === 'link' || proofMethod === 'photo') && proofUrl.trim()
              ? proofUrl.trim()
              : undefined,
        });
        if (completeRes.error) {
          setSubmitError(
            completeRes.error.message ||
              'Could not record completion. If this commitment is already verified, return to the dashboard.'
          );
          return;
        }
      }

      const loop = await coreLoopApi.handleCommitmentOutcome(
        commitmentId,
        completed ? 'completed' : 'failed',
        reflection.trim()
      );
      if (!loop.success) {
        setSubmitError(
          loop.error ||
            'Reflection could not be fully processed. Your outcome may still be saved—check the dashboard.'
        );
        return;
      }

      const goalId = commitment.goal_id;
      toast.custom(
        (t) => (
          <div className="rounded-xl border border-border bg-background shadow-lg p-4 max-w-sm text-foreground">
            <p className="text-sm font-semibold">Outcome & reflection saved</p>
            <p className="text-xs text-muted-foreground mt-1">
              Continue the loop: size your next step with Doyn, or return to the dashboard.
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link
                href={`/doyn/${goalId}`}
                className="text-primary font-medium hover:underline"
                onClick={() => toast.dismiss(t.id)}
              >
                Open Doyn for this goal
              </Link>
              <Link
                href={`/echo?mode=reflection&commitmentId=${commitmentId}`}
                className="text-primary font-medium hover:underline"
                onClick={() => toast.dismiss(t.id)}
              >
                Voice reflection (Echo)
              </Link>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:underline text-xs"
                onClick={() => toast.dismiss(t.id)}
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        ),
        { duration: 10000 }
      );

      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting reflection:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setReflecting(false);
    }
  };

  if (loading) {
    return <FullScreenGradientLoadingSkeleton />;
  }

  if (!commitment) {
    return null;
  }

  const alreadyDone = commitment.status === 'verified';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <MdArrowBack size={24} />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground">Commitment reflection</h1>
              <p className="text-sm text-muted-foreground">{commitment.goal_title}</p>
            </div>
          </div>

          <Link href="/" className="flex items-center gap-3">
            <Image src="/zavn-icon.png" alt="ZAVN Logo" width={32} height={32} />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-border shadow-lg p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Echo</h2>
              <p className="text-sm text-muted-foreground">
                Log how this commitment went. For a live voice session, use Echo reflection (voice).
              </p>
            </div>
            <Link
              href={`/echo?mode=reflection&commitmentId=${commitmentId}`}
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium text-center"
            >
              Voice reflection
            </Link>
          </div>

          {alreadyDone && (
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              This commitment is already marked complete. You can still journal below for your own notes, or return to{' '}
              <Link href="/dashboard" className="text-primary font-medium underline">
                the dashboard
              </Link>
              .
            </div>
          )}

          <div className="border-b border-border pb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Your commitment</h2>
            <p className="text-lg text-muted-foreground mb-4">{commitment.task_detail}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Due: {new Date(commitment.due_at).toLocaleString()}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  commitment.status === 'verified'
                    ? 'bg-green-50 text-green-600'
                    : commitment.status === 'pending'
                      ? 'bg-yellow-50 text-yellow-600'
                      : commitment.status === 'escalated'
                        ? 'bg-orange-50 text-orange-600'
                        : 'bg-red-50 text-red-600'
                }`}
              >
                {commitment.status}
              </span>
            </div>
          </div>

          {!alreadyDone && (
            <>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">Did you complete this commitment?</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setCompleted(true)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      completed === true
                        ? 'border-green-500 bg-green-50'
                        : 'border-border hover:border-green-200'
                    }`}
                  >
                    <MdCheckCircle
                      className={`mx-auto mb-2 ${completed === true ? 'text-green-500' : 'text-muted-foreground'}`}
                      size={48}
                    />
                    <p className="font-semibold text-foreground">Yes, I completed it</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCompleted(false)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      completed === false
                        ? 'border-red-500 bg-red-50'
                        : 'border-border hover:border-red-200'
                    }`}
                  >
                    <MdCancel
                      className={`mx-auto mb-2 ${completed === false ? 'text-red-500' : 'text-muted-foreground'}`}
                      size={48}
                    />
                    <p className="font-semibold text-foreground">No, I didn&apos;t complete it</p>
                  </button>
                </div>
              </div>

              {completed !== null && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">
                    {completed ? 'How did it go?' : 'What got in the way?'}
                  </h3>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder={
                      completed ? 'Share your experience…' : 'Be honest—no judgment, just clarity…'
                    }
                    className="w-full min-h-[150px] px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
              )}

              {completed === true && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">Proof (optional)</h3>

                  <div className="flex gap-3">
                    {(['text', 'link', 'photo'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setProofMethod(method)}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all capitalize ${
                          proofMethod === method
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        {method === 'photo' ? 'Photo URL' : method}
                      </button>
                    ))}
                  </div>

                  {proofMethod === 'text' && (
                    <textarea
                      value={proofText}
                      onChange={(e) => setProofText(e.target.value)}
                      placeholder="Optional: what you did, in your own words…"
                      className="w-full min-h-[100px] px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  )}

                  {(proofMethod === 'link' || proofMethod === 'photo') && (
                    <input
                      type="url"
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      placeholder={proofMethod === 'link' ? 'https://…' : 'https://… link to your photo or proof'}
                      className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  )}
                </div>
              )}

              {submitError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {submitError}
                </div>
              )}

              {completed !== null && (
                <button
                  type="button"
                  onClick={handleSubmitReflection}
                  disabled={reflecting || !reflection.trim()}
                  className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reflecting ? 'Saving…' : 'Save outcome & reflection'}
                </button>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
