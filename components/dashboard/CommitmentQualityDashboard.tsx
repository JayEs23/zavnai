'use client';

/**
 * Commitment quality summary — backed by GET /api/evaluation/metrics/summary
 * (real user commitment data; no mock charts).
 */

import React, { useState, useEffect } from 'react';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { api } from '@/lib/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface EvaluationMetricsSummary {
  total_commitments: number;
  verified: number;
  pending: number;
  escalated: number;
  failed: number;
  completion_rate: number;
  average_quality_score: number;
  quality_distribution: Record<string, number>;
  dimension_averages: {
    specificity: number;
    measurability: number;
    time_boundedness: number;
    achievability: number;
  };
  recent_commitments: Array<{
    id: string;
    task_detail: string;
    created_at: string;
    status: string;
  }>;
}

export function CommitmentQualityDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<EvaluationMetricsSummary | null>(null);

  useEffect(() => {
    void loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<EvaluationMetricsSummary>('/api/evaluation/metrics/summary');
      if (res.error || res.data == null) {
        setError(res.error?.message || 'Could not load evaluation metrics.');
        setSummary(null);
        return;
      }
      setSummary(res.data);
    } catch (e) {
      console.error(e);
      setError('Could not load evaluation metrics.');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading commitment quality…</p>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">{error || 'No data.'}</p>
        <button
          type="button"
          onClick={() => void loadSummary()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  const total = summary.total_commitments;
  if (total === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-bold text-foreground mb-2">Commitment quality</h2>
        <p className="text-sm text-muted-foreground">
          No commitments yet. Create a goal and add commitments with Doyn to see completion and quality signals here.
        </p>
      </div>
    );
  }

  const dist = summary.quality_distribution;
  const grades = ['A', 'B', 'C', 'D', 'F'] as const;
  const distLabels = grades.map((g) => `Grade ${g}`);
  const distValues = grades.map((g) => dist[g] ?? 0);
  const distColors = [
    'rgba(34, 197, 94, 0.85)',
    'rgba(59, 130, 246, 0.85)',
    'rgba(234, 179, 8, 0.85)',
    'rgba(249, 115, 22, 0.85)',
    'rgba(239, 68, 68, 0.85)',
  ];

  const dim = summary.dimension_averages;
  const dimEntries = [
    ['Specificity', dim.specificity],
    ['Measurability', dim.measurability],
    ['Time-boundedness', dim.time_boundedness],
    ['Achievability', dim.achievability],
  ] as const;
  const lowest = dimEntries.reduce((a, b) => (a[1] <= b[1] ? a : b));

  const distributionChartData = {
    labels: distLabels,
    datasets: [
      {
        data: distValues,
        backgroundColor: distColors,
      },
    ],
  };

  const dimensionChartData = {
    labels: dimEntries.map(([name]) => name),
    datasets: [
      {
        label: 'Score (0–100)',
        data: dimEntries.map(([, v]) => v),
        backgroundColor: 'rgba(59, 130, 246, 0.75)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Commitment quality</h2>
        <p className="text-sm text-muted-foreground">
          Based on your commitments (verified, pending, escalated, and outcomes). Heuristic scores from{' '}
          <code className="text-xs bg-muted px-1 rounded">GET /api/evaluation/metrics/summary</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Average quality score"
          value={`${summary.average_quality_score}/100`}
          sub="Weighted by outcome grades (A–F)"
          positive={summary.average_quality_score >= 50}
        />
        <MetricCard
          label="Completion rate"
          value={`${summary.completion_rate}%`}
          sub="Verified vs terminal outcomes"
          positive={summary.completion_rate >= 50}
        />
        <MetricCard
          label="Pipeline"
          value={`${summary.verified} done · ${summary.pending} pending`}
          sub={`${summary.escalated} escalated · ${summary.failed} failed/missed`}
          positive={summary.pending <= summary.verified}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Outcome distribution</h3>
          <div className="h-64 flex justify-center">
            <Doughnut
              data={distributionChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Dimension signals (0–100)</h3>
          <div className="h-64">
            <Bar
              data={dimensionChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { min: 0, max: 100 },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Focus area</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Lowest signal: <span className="font-medium text-foreground">{lowest[0]}</span> ({Math.round(lowest[1])}/100).
          Tighten commitments in that dimension on your next Doyn negotiation.
        </p>
        <ul className="text-sm text-muted-foreground space-y-2">
          {summary.recent_commitments.slice(0, 5).map((c) => (
            <li key={c.id} className="border-b border-border/60 pb-2 last:border-0">
              <span className="text-foreground font-medium">{c.status}</span> — {c.task_detail.slice(0, 120)}
              {c.task_detail.length > 120 ? '…' : ''}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  sub: string;
  positive: boolean;
}

function MetricCard({ label, value, sub, positive }: MetricCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-2">{sub}</p>
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            positive ? 'text-green-600' : 'text-amber-600'
          }`}
        >
          {positive ? <MdTrendingUp size={22} /> : <MdTrendingDown size={22} />}
        </div>
      </div>
    </div>
  );
}
