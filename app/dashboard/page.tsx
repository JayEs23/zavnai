'use client';

import React, { useState, useEffect } from 'react';
import { goalsApi, GoalSummary, CommitmentSummary } from '@/services/goalsApi';
import { MdCheckCircle, MdAccessTime, MdTrendingUp, MdPeople, MdSettings } from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<GoalSummary[]>([]);
  const [todaysCommitments, setTodaysCommitments] = useState<CommitmentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [goalsData, commitmentsData] = await Promise.all([
        goalsApi.list(),
        goalsApi.getTodaysCommitments(),
      ]);
      setGoals(goalsData);
      setTodaysCommitments(commitmentsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCommitmentStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'escalated':
        return 'text-orange-600 bg-orange-50';
      case 'failed':
      case 'missed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
          <p className="text-lg font-semibold text-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/zavn-icon.png" alt="ZAVN Logo" width={36} height={36} />
            <span className="text-xl font-bold text-foreground">ZAVN</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/tribe" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <MdPeople size={20} />
              <span className="hidden sm:inline">Tribe</span>
            </Link>
            <Link href="/settings" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <MdSettings size={20} />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Dashboard</h1>
          <p className="text-lg text-muted-foreground">Track your goals, manage commitments, and stay accountable.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MdTrendingUp className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-3xl font-bold text-foreground">{goals.filter(g => g.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <MdCheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today&apos;s Tasks</p>
                <p className="text-3xl font-bold text-foreground">{todaysCommitments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <MdAccessTime className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-foreground">{goals.filter(g => g.status === 'completed').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Commitments */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Today&apos;s Commitments</h2>
          </div>

          {todaysCommitments.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-border p-12 text-center">
              <MdCheckCircle className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-lg font-semibold text-foreground mb-2">No commitments due today</h3>
              <p className="text-muted-foreground">Check your goals to create new commitments.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todaysCommitments.map((commitment) => (
                <Link
                  key={commitment.id}
                  href={`/echo/reflect/${commitment.id}`}
                  className="block bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCommitmentStatusColor(commitment.status)}`}>
                          {commitment.status}
                        </span>
                        <span className="text-sm text-muted-foreground">{commitment.goal_title}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{commitment.task_detail}</h3>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(commitment.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-primary font-medium">Reflect →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Your Goals */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Goals</h2>
            <Link
              href="/echo"
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              Create New Goal
            </Link>
          </div>

          {goals.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-border p-12 text-center">
              <MdTrendingUp className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-lg font-semibold text-foreground mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-6">Start your journey by creating your first goal with Echo.</p>
              <Link
                href="/echo"
                className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all font-medium"
              >
                Talk to Echo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                          {goal.status}
                        </span>
                        {goal.stake_amount > 0 && (
                          <span className="text-xs font-semibold text-amber-600">
                            ${goal.stake_amount} staked
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Link
                      href={`/doyn/${goal.id}`}
                      className="flex-1 py-2 px-4 bg-primary text-white rounded-xl hover:opacity-90 transition-all text-center font-medium"
                    >
                      Chat with Doyn
                    </Link>
                    <Link
                      href={`/goals/${goal.id}`}
                      className="py-2 px-4 border border-border rounded-xl hover:bg-muted transition-all text-center font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
