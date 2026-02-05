'use client';

import React, { useState, useEffect } from 'react';
import { goalsApi, type Goal, type Commitment } from '@/services/goalsApi';
import { MdAdd, MdCheckCircle, MdError, MdPending, MdArchive, MdEdit, MdDelete, MdAttachMoney, MdCalendarToday } from 'react-icons/md';
import { toast } from 'react-hot-toast';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await goalsApi.getGoals();
      setGoals(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const handleArchiveGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to archive this goal?')) return;
    
    try {
      await goalsApi.archiveGoal(goalId);
      toast.success('Goal archived successfully');
      loadGoals();
    } catch (error: any) {
      toast.error(error.message || 'Failed to archive goal');
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    if (!confirm('Mark this goal as completed? Your stake will be returned.')) return;
    
    try {
      await goalsApi.completeGoal(goalId);
      toast.success('🎉 Goal completed! Stake returned.');
      loadGoals();
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete goal');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border-subtle bg-card-bg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Goals</h1>
              <p className="text-muted-foreground mt-1">
                Track your goals and commitments
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors"
            >
              <MdAdd size={20} />
              Create Goal
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-6">
            {(['all', 'active', 'completed', 'archived'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-brand-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted-hover'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 text-sm">
                  ({goals.filter((g) => status === 'all' || g.status === status).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <MdPending size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No {filter !== 'all' && filter} goals yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first goal to get started with ZAVN
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onArchive={handleArchiveGoal}
                onComplete={handleCompleteGoal}
                onRefresh={loadGoals}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      {showCreateModal && (
        <CreateGoalModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadGoals();
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// GOAL CARD COMPONENT
// ============================================================================

interface GoalCardProps {
  goal: Goal;
  onArchive: (goalId: string) => void;
  onComplete: (goalId: string) => void;
  onRefresh: () => void;
}

function GoalCard({ goal, onArchive, onComplete, onRefresh }: GoalCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loadingCommitments, setLoadingCommitments] = useState(false);

  const loadCommitments = async () => {
    try {
      setLoadingCommitments(true);
      const data = await goalsApi.getGoalCommitments(goal.id);
      setCommitments(data);
    } catch (error) {
      console.error('Failed to load commitments:', error);
    } finally {
      setLoadingCommitments(false);
    }
  };

  useEffect(() => {
    if (showDetails && commitments.length === 0) {
      loadCommitments();
    }
  }, [showDetails]);

  const daysRemaining = Math.ceil(
    (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const statusConfig = {
    active: { icon: MdPending, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    completed: { icon: MdCheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    failed: { icon: MdError, color: 'text-red-500', bg: 'bg-red-500/10' },
    paused: { icon: MdPending, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    archived: { icon: MdArchive, color: 'text-gray-500', bg: 'bg-gray-500/10' },
  };

  const status = statusConfig[goal.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-card-bg border border-border-subtle rounded-lg p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${status.bg}`}>
          <StatusIcon className={`${status.color}`} size={24} />
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${status.bg} ${status.color}`}>
          {goal.status.toUpperCase()}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
        {goal.title}
      </h3>

      {/* Description */}
      {goal.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {goal.description}
        </p>
      )}

      {/* Stats */}
      <div className="space-y-2 mb-4">
        {/* Stake */}
        {goal.is_staked && goal.stake_amount > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <MdAttachMoney className="text-green-500" />
            <span className="text-foreground font-medium">
              ${goal.stake_amount.toFixed(2)} {goal.stake_currency}
            </span>
            <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${
              goal.vault_status === 'escrow' ? 'bg-yellow-500/10 text-yellow-500' :
              goal.vault_status === 'returned' ? 'bg-green-500/10 text-green-500' :
              goal.vault_status === 'forfeited' ? 'bg-red-500/10 text-red-500' :
              'bg-gray-500/10 text-gray-500'
            }`}>
              {goal.vault_status}
            </span>
          </div>
        )}

        {/* Deadline */}
        <div className="flex items-center gap-2 text-sm">
          <MdCalendarToday className="text-muted-foreground" />
          <span className="text-foreground">
            {new Date(goal.deadline).toLocaleDateString()}
          </span>
          {goal.status === 'active' && (
            <span className={`ml-auto text-xs font-medium ${
              daysRemaining < 0 ? 'text-red-500' :
              daysRemaining < 7 ? 'text-orange-500' :
              'text-muted-foreground'
            }`}>
              {daysRemaining < 0 ? 'Overdue' : `${daysRemaining}d left`}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-border-subtle">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex-1 px-3 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 rounded transition-colors"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
        
        {goal.status === 'active' && (
          <>
            <button
              onClick={() => onComplete(goal.id)}
              className="px-3 py-2 text-sm font-medium text-green-500 hover:bg-green-500/10 rounded transition-colors"
              title="Mark as completed"
            >
              <MdCheckCircle size={20} />
            </button>
            <button
              onClick={() => onArchive(goal.id)}
              className="px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-500/10 rounded transition-colors"
              title="Archive goal"
            >
              <MdArchive size={20} />
            </button>
          </>
        )}
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <h4 className="font-semibold text-foreground mb-3">Commitments</h4>
          {loadingCommitments ? (
            <div className="text-center py-4 text-muted-foreground text-sm">Loading...</div>
          ) : commitments.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No commitments yet. Chat with Doyn to create one.
            </div>
          ) : (
            <div className="space-y-2">
              {commitments.map((commitment) => (
                <div
                  key={commitment.id}
                  className="p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-foreground flex-1">
                      {commitment.task_detail}
                    </p>
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                      commitment.status === 'verified' ? 'bg-green-500/10 text-green-500' :
                      commitment.status === 'pending' ? 'bg-blue-500/10 text-blue-500' :
                      commitment.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                      commitment.status === 'escalated' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      {commitment.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {new Date(commitment.due_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CREATE GOAL MODAL
// ============================================================================

interface CreateGoalModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function CreateGoalModal({ onClose, onSuccess }: CreateGoalModalProps) {
  const [formData, setFormData] = useState({
    goal: '',
    deadline: '',
    financial_stake: 0,
    common_excuses: ['', ''],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.goal.trim()) {
      toast.error('Please enter a goal');
      return;
    }
    if (!formData.deadline) {
      toast.error('Please select a deadline');
      return;
    }
    const validExcuses = formData.common_excuses.filter((e) => e.trim());
    if (validExcuses.length < 2) {
      toast.error('Please provide at least 2 common excuses');
      return;
    }

    try {
      setLoading(true);
      await goalsApi.createGoal({
        goal: formData.goal,
        deadline: new Date(formData.deadline).toISOString(),
        financial_stake: formData.financial_stake,
        common_excuses: validExcuses,
      });
      toast.success('Goal created successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const addExcuse = () => {
    setFormData({
      ...formData,
      common_excuses: [...formData.common_excuses, ''],
    });
  };

  const removeExcuse = (index: number) => {
    setFormData({
      ...formData,
      common_excuses: formData.common_excuses.filter((_, i) => i !== index),
    });
  };

  const updateExcuse = (index: number, value: string) => {
    const newExcuses = [...formData.common_excuses];
    newExcuses[index] = value;
    setFormData({ ...formData, common_excuses: newExcuses });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border-subtle">
          <h2 className="text-2xl font-bold text-foreground">Create New Goal</h2>
          <p className="text-muted-foreground mt-1">
            Define your goal and add a financial stake for accountability
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Goal */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Goal *
            </label>
            <textarea
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              placeholder="e.g., Launch my SaaS product by Q2"
              className="w-full px-4 py-3 bg-background border border-border-subtle rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
              rows={3}
              required
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Deadline *
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-background border border-border-subtle rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          {/* Financial Stake */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Financial Stake (USD)
            </label>
            <input
              type="number"
              value={formData.financial_stake}
              onChange={(e) => setFormData({ ...formData, financial_stake: parseFloat(e.target.value) || 0 })}
              min="0"
              max="10000"
              step="5"
              placeholder="0.00"
              className="w-full px-4 py-3 bg-background border border-border-subtle rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional. Add a financial stake ($5-$10,000) to increase accountability.
            </p>
          </div>

          {/* Common Excuses */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Common Excuses * (min 2)
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              What excuses do you typically make when avoiding this goal?
            </p>
            <div className="space-y-2">
              {formData.common_excuses.map((excuse, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={excuse}
                    onChange={(e) => updateExcuse(index, e.target.value)}
                    placeholder={`Excuse ${index + 1}`}
                    className="flex-1 px-4 py-2 bg-background border border-border-subtle rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  {formData.common_excuses.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeExcuse(index)}
                      className="px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <MdDelete size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {formData.common_excuses.length < 20 && (
              <button
                type="button"
                onClick={addExcuse}
                className="mt-2 text-sm text-brand-primary hover:underline"
              >
                + Add another excuse
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-muted text-foreground rounded-lg hover:bg-muted-hover transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <MdAdd size={20} />
                  Create Goal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

