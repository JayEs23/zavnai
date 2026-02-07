'use client';

/**
 * Tribe Verification Response Page
 * 
 * When a tribe member receives a verification request via SMS/WhatsApp,
 * they click a link that brings them here to verify a commitment.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MdCheckCircle, MdCancel, MdHelpOutline, MdPerson } from 'react-icons/md';
import { motion } from 'framer-motion';

interface VerificationDetails {
  commitment_id: string;
  task_detail: string;
  user_name: string;
  proof_text?: string;
  proof_url?: string;
  due_at: string;
  tribe_member_id: string;
  tribe_member_name: string;
}

export default function TribeVerifyPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [details, setDetails] = useState<VerificationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<'yes' | 'no' | 'unsure' | null>(null);
  const [comments, setComments] = useState('');

  useEffect(() => {
    loadVerificationDetails();
  }, [token]);

  const loadVerificationDetails = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/tribe/verification/details/${token}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Verification request not found or has expired');
        } else if (response.status === 410) {
          setError('This verification request has already been completed');
        } else {
          setError('Failed to load verification details');
        }
        return;
      }
      
      const data = await response.json();
      setDetails(data);
    } catch (err) {
      console.error('Error loading verification:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const submitVerification = async () => {
    if (!selectedResponse || !details) return;
    
    try {
      setSubmitting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/api/tribe/verification/respond/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response: selectedResponse,
          comments: comments.trim() || undefined,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to submit verification');
        return;
      }
      
      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting verification:', err);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading verification request...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !details) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
          <div className="size-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdCancel className="size-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Verification Not Available</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center"
        >
          <div className="size-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdCheckCircle className="size-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Thank You!
          </h2>
          <p className="text-muted-foreground mb-4">
            Your verification response has been recorded.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting you shortly...
          </p>
        </motion.div>
      </div>
    );
  }

  // Main verification form
  if (!details) return null;

  const dueDate = new Date(details.due_at);
  const isOverdue = dueDate < new Date();

  return (
    <div className="min-h-screen bg-background p-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdPerson className="size-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Verification Request
          </h1>
          <p className="text-muted-foreground">
            Help verify <span className="font-semibold text-foreground">{details.user_name}</span>'s commitment
          </p>
        </div>

        {/* Commitment Details */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <MdCheckCircle className="size-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Task</h3>
              <p className="text-foreground text-lg">{details.task_detail}</p>
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Due: {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString()}
              {isOverdue && <span className="text-destructive ml-2">(Overdue)</span>}
            </p>
          </div>

          {(details.proof_text || details.proof_url) && (
            <div className="border-t border-border pt-4 mt-4">
              <h4 className="font-semibold text-foreground mb-2">Proof Provided:</h4>
              {details.proof_text && (
                <p className="text-muted-foreground mb-2">{details.proof_text}</p>
              )}
              {details.proof_url && (
                <a
                  href={details.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  View attached proof →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Response Options */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">
            Did {details.user_name} complete this task?
          </h3>

          <div className="space-y-3">
            {/* Yes Option */}
            <button
              onClick={() => setSelectedResponse('yes')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                selectedResponse === 'yes'
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-border hover:border-green-500/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-lg flex items-center justify-center ${
                  selectedResponse === 'yes' ? 'bg-green-500' : 'bg-green-500/10'
                }`}>
                  <MdCheckCircle className={`size-6 ${
                    selectedResponse === 'yes' ? 'text-white' : 'text-green-500'
                  }`} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-foreground">✓ YES, Completed</p>
                  <p className="text-sm text-muted-foreground">I can confirm they did this</p>
                </div>
              </div>
            </button>

            {/* No Option */}
            <button
              onClick={() => setSelectedResponse('no')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                selectedResponse === 'no'
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-border hover:border-red-500/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-lg flex items-center justify-center ${
                  selectedResponse === 'no' ? 'bg-red-500' : 'bg-red-500/10'
                }`}>
                  <MdCancel className={`size-6 ${
                    selectedResponse === 'no' ? 'text-white' : 'text-red-500'
                  }`} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-foreground">✗ NO, Not Completed</p>
                  <p className="text-sm text-muted-foreground">This doesn't seem right</p>
                </div>
              </div>
            </button>

            {/* Unsure Option */}
            <button
              onClick={() => setSelectedResponse('unsure')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                selectedResponse === 'unsure'
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-border hover:border-amber-500/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-lg flex items-center justify-center ${
                  selectedResponse === 'unsure' ? 'bg-amber-500' : 'bg-amber-500/10'
                }`}>
                  <MdHelpOutline className={`size-6 ${
                    selectedResponse === 'unsure' ? 'text-white' : 'text-amber-500'
                  }`} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-foreground">? UNSURE</p>
                  <p className="text-sm text-muted-foreground">I need more information</p>
                </div>
              </div>
            </button>
          </div>

          {/* Optional Comments */}
          {selectedResponse && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Additional comments (optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Any additional context or feedback..."
                className="w-full p-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={submitVerification}
          disabled={!selectedResponse || submitting}
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Verification'}
        </button>

        {/* Info Footer */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          Your response will help {details.user_name} track their progress honestly.
          <br />
          This is part of their accountability system with ZAVN.
        </p>
      </div>
    </div>
  );
}

