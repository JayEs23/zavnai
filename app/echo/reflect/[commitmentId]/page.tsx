'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { MdArrowBack, MdCheckCircle, MdCancel } from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';

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
  const [proofMethod, setProofMethod] = useState<'text' | 'photo' | 'link'>('text');
  const [proofText, setProofText] = useState('');
  const [proofUrl, setProofUrl] = useState('');

  useEffect(() => {
    loadCommitment();
  }, [commitmentId]);

  const loadCommitment = async () => {
    try {
      setLoading(true);
      const response = await api.get<Commitment>(`/api/v1/goals/commitments/${commitmentId}`);
      setCommitment(response);
    } catch (error) {
      console.error('Error loading commitment:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReflection = async () => {
    if (!commitment || completed === null) return;

    setReflecting(true);

    try {
      const payload: any = {
        commitment_id: commitmentId,
        completed,
        reflection_notes: reflection,
        verification_method: proofMethod,
      };

      if (proofMethod === 'text' && proofText) {
        payload.proof_text = proofText;
      } else if ((proofMethod === 'link' || proofMethod === 'photo') && proofUrl) {
        payload.proof_url = proofUrl;
      }

      await api.post('/api/echo/chat', payload);

      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting reflection:', error);
      alert('Failed to submit reflection. Please try again.');
    } finally {
      setReflecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
          <p className="text-lg font-semibold text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!commitment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <MdArrowBack size={24} />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground">Commitment Reflection</h1>
              <p className="text-sm text-muted-foreground">{commitment.goal_title}</p>
            </div>
          </div>
          
          <Link href="/" className="flex items-center gap-3">
            <Image src="/zavn-icon.png" alt="ZAVN Logo" width={32} height={32} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-border shadow-lg p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Talk to Echo</h2>
              <p className="text-sm text-muted-foreground">
                Use voice or text to reflect on this commitment.
              </p>
            </div>
            <Link
              href={`/echo?mode=reflection&commitmentId=${commitmentId}`}
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium"
            >
              Start Echo Reflection
            </Link>
          </div>
          {/* Commitment Details */}
          <div className="border-b border-border pb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Your Commitment</h2>
            <p className="text-lg text-muted-foreground mb-4">{commitment.task_detail}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Due: {new Date(commitment.due_at).toLocaleString()}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                commitment.status === 'verified' ? 'bg-green-50 text-green-600' :
                commitment.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                commitment.status === 'escalated' ? 'bg-orange-50 text-orange-600' :
                'bg-red-50 text-red-600'
              }`}>
                {commitment.status}
              </span>
            </div>
          </div>

          {/* Completion Question */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Did you complete this commitment?</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCompleted(true)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  completed === true
                    ? 'border-green-500 bg-green-50'
                    : 'border-border hover:border-green-200'
                }`}
              >
                <MdCheckCircle className={`mx-auto mb-2 ${completed === true ? 'text-green-500' : 'text-muted-foreground'}`} size={48} />
                <p className="font-semibold text-foreground">Yes, I completed it</p>
              </button>

              <button
                onClick={() => setCompleted(false)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  completed === false
                    ? 'border-red-500 bg-red-50'
                    : 'border-border hover:border-red-200'
                }`}
              >
                <MdCancel className={`mx-auto mb-2 ${completed === false ? 'text-red-500' : 'text-muted-foreground'}`} size={48} />
                <p className="font-semibold text-foreground">No, I didn&apos;t complete it</p>
              </button>
            </div>
          </div>

          {/* Reflection */}
          {completed !== null && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">
                {completed ? 'How did it go?' : 'What got in the way?'}
              </h3>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder={completed ? "Share your experience..." : "Tell me what happened..."}
                className="w-full min-h-[150px] px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          )}

          {/* Proof (only if completed) */}
          {completed === true && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Provide proof (optional)</h3>
              
              <div className="flex gap-3">
                {(['text', 'link', 'photo'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setProofMethod(method)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all capitalize ${
                      proofMethod === method
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {proofMethod === 'text' && (
                <textarea
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  placeholder="Describe what you did..."
                  className="w-full min-h-[100px] px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              )}

              {(proofMethod === 'link' || proofMethod === 'photo') && (
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder={proofMethod === 'link' ? 'https://...' : 'Photo URL...'}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              )}
            </div>
          )}

          {/* Submit Button */}
          {completed !== null && (
            <button
              onClick={handleSubmitReflection}
              disabled={reflecting || !reflection.trim()}
              className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reflecting ? 'Submitting...' : 'Submit Reflection'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

