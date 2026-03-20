'use client';

import React, { useState, useEffect } from 'react';
import { goalsApi, CommitmentSummary } from '@/services/goalsApi';
import { DashboardCommitmentCard } from '@/components/dashboard/DashboardCommitmentCard';
import { MdRefresh } from 'react-icons/md';

interface CommitmentsSidebarProps {
  refreshTrigger?: number;
}

export function CommitmentsSidebar({ refreshTrigger }: CommitmentsSidebarProps) {
  const [commitments, setCommitments] = useState<CommitmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue'>('all');

  useEffect(() => {
    loadCommitments();
  }, [refreshTrigger]);

  const loadCommitments = async () => {
    try {
      setLoading(true);
      const data = await goalsApi.getPendingCommitments();
      setCommitments(data);
    } catch (error) {
      console.error('Error loading commitments:', error);
    } finally {
      setLoading(false);
    }
  };

  const isOverdue = (commitment: CommitmentSummary) => {
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
      <div className="border-b border-border-subtle p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Commitments</h2>
          <button
            type="button"
            onClick={loadCommitments}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Refresh"
          >
            <MdRefresh className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
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
            type="button"
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
            type="button"
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

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredCommitments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              {filter === 'all' && 'No active commitments'}
              {filter === 'pending' && 'No pending commitments'}
              {filter === 'overdue' && 'No overdue commitments'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Chat with Doyn on a goal to add one.</p>
          </div>
        ) : (
          filteredCommitments.map((c) => (
            <DashboardCommitmentCard key={c.id} commitment={c} onUpdated={loadCommitments} />
          ))
        )}
      </div>
    </div>
  );
}
