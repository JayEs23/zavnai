'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { thriveApi, type ThriveScore } from '@/services/thriveApi';
import { toast } from 'react-hot-toast';
import AppNavbar from '@/components/AppNavbar';

// --------------------------------------------------------------------------
// THRIVE PAGE
// --------------------------------------------------------------------------

export default function ThrivePage() {
  const [score, setScore] = useState<ThriveScore | null>(null);
  const [loading, setLoading] = useState(true);

  const loadScore = useCallback(async () => {
    try {
      setLoading(true);
      const data = await thriveApi.getScore();
      setScore(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load Thrive score';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScore();
  }, [loadScore]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto" />
            <p className="text-muted-foreground mt-4">Calculating your wellbeing score…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-foreground mb-2">No Data Yet</h2>
            <p className="text-muted-foreground">
              Thrive needs a few days of activity before it can calculate your
              wellbeing score. Keep using ZAVN and check back soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      {/* Header */}
      <div className="border-b border-border-subtle bg-card-bg">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-foreground">Thrive</h1>
          <p className="text-muted-foreground mt-1">
            Your AI-powered wellbeing guardian
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Score Ring */}
        <div className="flex flex-col items-center">
          <ScoreRing value={score.thrive_score} riskLevel={score.risk_level} />
          <p className="mt-4 text-lg font-semibold text-foreground">
            {score.risk_label}
          </p>
          <RiskBadge level={score.risk_level} />
        </div>

        {/* Component Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ComponentCard
            label="Vocal Biomarkers"
            description="Stress & fatigue from voice patterns"
            value={score.components.vocal_biomarkers}
            weight={30}
          />
          <ComponentCard
            label="Commitment Elasticity"
            description="Renegotiation frequency"
            value={score.components.commitment_elasticity}
            weight={30}
          />
          <ComponentCard
            label="Sentiment Drift"
            description="Mood trend from reflections"
            value={score.components.sentiment_drift}
            weight={20}
          />
          <ComponentCard
            label="Completion Rate"
            description="Commitments verified on time"
            value={score.components.completion_rate}
            weight={20}
          />
        </div>

        {/* Recommendations */}
        {score.recommendations.length > 0 && (
          <div className="bg-card-bg border border-border-subtle rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Recommendations
            </h2>
            <ul className="space-y-3">
              {score.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-foreground"
                >
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Science section */}
        <div className="bg-card-bg border border-border-subtle rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-3">
            How the Thrive Score Works
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The Thrive score is a composite wellbeing metric calculated by the
            Thrive AI agent every 30 minutes. It combines four data streams —
            <strong> vocal biomarkers</strong> (stress & fatigue detected from
            voice patterns), <strong>commitment elasticity</strong> (how often
            commitments are renegotiated), <strong>sentiment drift</strong>
            (mood trends extracted from reflections), and{' '}
            <strong>completion rate</strong> (on-time verification ratio). When
            the score drops below 60, ZAVN blocks new goal creation and alerts
            your tribe. Below 40, the burnout protocol activates.
          </p>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// SCORE RING
// --------------------------------------------------------------------------

function ScoreRing({
  value,
  riskLevel,
}: {
  value: number;
  riskLevel: string;
}) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  const colorMap: Record<string, string> = {
    excellent: '#22c55e',
    green: '#22c55e',
    yellow: '#eab308',
    red: '#ef4444',
  };
  const strokeColor = colorMap[riskLevel] || '#6366f1';

  return (
    <div className="relative w-48 h-48">
      <svg className="w-48 h-48 -rotate-90" viewBox="0 0 200 200">
        {/* Background ring */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-border-subtle"
          strokeWidth="12"
        />
        {/* Progress ring */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// RISK BADGE
// --------------------------------------------------------------------------

function RiskBadge({ level }: { level: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    excellent: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Thriving' },
    green: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Stable' },
    yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Caution' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Burnout Risk' },
  };
  const c = config[level] || config.green;

  return (
    <span
      className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

// --------------------------------------------------------------------------
// COMPONENT CARD
// --------------------------------------------------------------------------

function ComponentCard({
  label,
  description,
  value,
  weight,
}: {
  label: string;
  description: string;
  value: number;
  weight: number;
}) {
  const getColor = (v: number) => {
    if (v >= 75) return 'text-green-500';
    if (v >= 60) return 'text-blue-500';
    if (v >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBarColor = (v: number) => {
    if (v >= 75) return 'bg-green-500';
    if (v >= 60) return 'bg-blue-500';
    if (v >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-card-bg border border-border-subtle rounded-lg p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <span className={`text-xl font-bold ${getColor(value)}`}>
          {Math.round(value)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-background rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-700 ${getBarColor(value)}`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground">{description}</p>
      <p className="text-[10px] text-muted-foreground mt-1">
        Weight: {weight}%
      </p>
    </div>
  );
}

