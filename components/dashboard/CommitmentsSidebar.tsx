'use client';

import React, { useState, useEffect } from 'react';
import { doynApi, Commitment } from '@/services/doynApi';
import {
  MdCheckCircle,
  MdPending,
  MdWarning,
  MdClose,
  MdSchedule,
  MdRefresh,
  MdDone,
} from 'react-icons/md';

interface CommitmentsSidebarProps {
  refreshTrigger?: number;
}

export function CommitmentsSidebar({ refreshTrigger }: CommitmentsSidebarProps) {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue'>('all');

  useEffect(() => {
    loadCommitments();
  }, [refreshTrigger]);

  const loadCommitments = async () => {
    try {
      setLoading(true);
      const data = await doynApi.getCommitments();
      setCommitments(data);
    } catch (error) {
      console.error('Error loading commitments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (commitment: Commitment) => {
    if (commitment.status === 'verified') {
      return <MdCheckCircle className="text-success" />;
    }
    if (commitment.status === 'escalated' || commitment.status === 'missed') {
      return <MdWarning className="text-destructive" />;
    }
    if (commitment.status === 'failed') {
      return <MdClose className="text-destructive" />;
    }
    return <MdPending className="text-muted-foreground" />;
  };

  const getStatusColor = (commitment: Commitment) => {
    if (commitment.status === 'verified') return 'border-success/20 bg-success/5';
    if (commitment.status === 'escalated' || commitment.status === 'missed')
      return 'border-destructive/20 bg-destructive/5';
    if (commitment.status === 'failed') return 'border-destructive/20 bg-destructive/10';
    return 'border-border-subtle bg-card-bg';
  };

  const isOverdue = (commitment: Commitment) => {
    return new Date(commitment.due_at) < new Date() && commitment.status === 'pending';
  };

  const filteredCommitments = commitments.filter((c) => {
    if (filter === 'pending') return c.status === 'pending';
    if (filter === 'overdue') return isOverdue(c);
    return true;
  });

  const pendingCount = commitments.filter((c) => c.status === 'pending').length;
  const overdueCount = commitments.filter((c) => isOverdue(c)).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-xs text-muted-foreground">Loading commitments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border-subtle p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Commitments</h2>
          <button
            onClick={loadCommitments}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <MdRefresh className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All ({commitments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'overdue'
                ? 'bg-destructive text-white'
                : overdueCount > 0
                ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Overdue ({overdueCount})
          </button>
        </div>
      </div>

      {/* Commitments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredCommitments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              {filter === 'all' && 'No commitments yet'}
              {filter === 'pending' && 'No pending commitments'}
              {filter === 'overdue' && 'No overdue commitments 🎉'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Chat with Doyn to create new ones
            </p>
          </div>
        ) : (
          filteredCommitments.map((commitment) => (
            <CommitmentCard
              key={commitment.id}
              commitment={commitment}
              isOverdue={isOverdue(commitment)}
              onCompleted={loadCommitments}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Commitment Card with Mark Done ─── */

function CommitmentCard({
  commitment,
  isOverdue: overdue,
  onCompleted,
}: {
  commitment: Commitment;
  isOverdue: boolean;
  onCompleted: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [proofText, setProofText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getStatusIcon = () => {
    if (commitment.status === 'verified') return <MdCheckCircle className="text-success" />;
    if (commitment.status === 'escalated' || commitment.status === 'missed')
      return <MdWarning className="text-destructive" />;
    if (commitment.status === 'failed') return <MdClose className="text-destructive" />;
    return <MdPending className="text-muted-foreground" />;
  };

  const getStatusColor = () => {
    if (commitment.status === 'verified') return 'border-success/20 bg-success/5';
    if (commitment.status === 'escalated' || commitment.status === 'missed')
      return 'border-destructive/20 bg-destructive/5';
    if (commitment.status === 'failed') return 'border-destructive/20 bg-destructive/10';
    return 'border-border-subtle bg-card-bg';
  };

  const handleMarkDone = async () => {
    try {
      setSubmitting(true);
      await doynApi.completeCommitment(commitment.id, proofText || undefined);
      setConfirming(false);
      setProofText('');
      onCompleted();
    } catch (err) {
      console.error('Failed to complete commitment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`border rounded-2xl p-4 transition-all hover:shadow-md ${getStatusColor()}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getStatusIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
            {commitment.task_detail}
          </p>

          {/* Due date */}
          <div className="flex items-center gap-2 mt-2">
            <MdSchedule className="text-muted-foreground text-xs" />
            <p className={`text-xs ${overdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
              {overdue && 'Overdue: '}
              {new Date(commitment.due_at).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Verification score */}
          {commitment.verification_score !== undefined && commitment.verification_score > 0 && (
            <div className="mt-2">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success transition-all" style={{ width: `${commitment.verification_score}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{commitment.verification_score}% verified</p>
            </div>
          )}

          {/* Escalation level indicator */}
          {commitment.escalation_level > 0 && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive rounded-lg text-xs font-medium">
              <MdWarning className="text-xs" />
              Escalation Level {commitment.escalation_level}
            </div>
          )}

          {/* Mark Done button */}
          {commitment.status === 'pending' && !confirming && (
            <button
              onClick={() => setConfirming(true)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-success/10 text-success hover:bg-success/20 rounded-xl text-xs font-semibold transition-colors"
            >
              <MdDone size={16} />
              Mark Done
            </button>
          )}

          {/* Inline proof + confirm */}
          {confirming && (
            <div className="mt-3 space-y-2">
              <input
                type="text"
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                placeholder="Quick proof (optional)..."
                className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-success"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleMarkDone}
                  disabled={submitting}
                  className="flex-1 px-3 py-2 bg-success text-white rounded-lg text-xs font-semibold hover:bg-success/90 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Saving...' : 'Confirm Done'}
                </button>
                <button
                  onClick={() => { setConfirming(false); setProofText(''); }}
                  className="px-3 py-2 bg-muted text-muted-foreground rounded-lg text-xs font-medium hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

