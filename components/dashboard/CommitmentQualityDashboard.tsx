'use client';

/**
 * Commitment Quality Dashboard
 * 
 * Visualizes commitment quality metrics from Opik evaluation system.
 * Shows trends, distributions, and identifies optimization opportunities.
 */

import React, { useState, useEffect } from 'react';
import { MdTrendingUp, MdTrendingDown, MdCheckCircle, MdWarning } from 'react-icons/md';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface QualityMetrics {
  avgQuality: number;
  qualityChange: number;
  highQualityRate: number;
  highQualityChange: number;
  userSuccessRate: number;
  userSuccessChange: number;
}

interface QualityTrend {
  date: string;
  quality: number;
}

interface AgentQuality {
  agent: string;
  score: number;
  count: number;
}

interface DimensionScore {
  dimension: string;
  score: number;
  maxScore: number;
}

interface QualityDistribution {
  grade: string;
  count: number;
  percentage: number;
}

export function CommitmentQualityDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<QualityMetrics>({
    avgQuality: 0,
    qualityChange: 0,
    highQualityRate: 0,
    highQualityChange: 0,
    userSuccessRate: 0,
    userSuccessChange: 0,
  });
  const [trends, setTrends] = useState<QualityTrend[]>([]);
  const [agentScores, setAgentScores] = useState<AgentQuality[]>([]);
  const [dimensions, setDimensions] = useState<DimensionScore[]>([]);
  const [distribution, setDistribution] = useState<QualityDistribution[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // In production, fetch from /api/evaluation/dashboard
      // For now, using mock data
      const mockData = generateMockData();
      
      setMetrics(mockData.metrics);
      setTrends(mockData.trends);
      setAgentScores(mockData.agentScores);
      setDimensions(mockData.dimensions);
      setDistribution(mockData.distribution);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    // Mock data for demonstration
    return {
      metrics: {
        avgQuality: 7.2,
        qualityChange: 0.8,
        highQualityRate: 68,
        highQualityChange: 12,
        userSuccessRate: 73,
        userSuccessChange: 15,
      },
      trends: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        quality: 6.0 + Math.random() * 2 + i * 0.05,
      })),
      agentScores: [
        { agent: 'Echo Agent', score: 8.1, count: 145 },
        { agent: 'Doyn Agent', score: 6.8, count: 287 },
      ],
      dimensions: [
        { dimension: 'Specificity', score: 8.2, maxScore: 10 },
        { dimension: 'Measurability', score: 6.8, maxScore: 10 },
        { dimension: 'Achievability', score: 7.9, maxScore: 10 },
        { dimension: 'Time-bound', score: 5.4, maxScore: 10 },
        { dimension: 'Actionability', score: 7.1, maxScore: 10 },
      ],
      distribution: [
        { grade: 'A', count: 42, percentage: 32 },
        { grade: 'B', count: 58, percentage: 44 },
        { grade: 'C', count: 24, percentage: 18 },
        { grade: 'D', count: 6, percentage: 5 },
        { grade: 'F', count: 2, percentage: 1 },
      ],
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading quality metrics...</p>
        </div>
      </div>
    );
  }

  // Chart configurations
  const trendChartData = {
    labels: trends.map((t) => t.date),
    datasets: [
      {
        label: 'Commitment Quality',
        data: trends.map((t) => t.quality),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const agentChartData = {
    labels: agentScores.map((a) => a.agent),
    datasets: [
      {
        label: 'Average Quality Score',
        data: agentScores.map((a) => a.score),
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(234, 179, 8, 0.8)'],
      },
    ],
  };

  const dimensionChartData = {
    labels: dimensions.map((d) => d.dimension),
    datasets: [
      {
        label: 'Score',
        data: dimensions.map((d) => d.score),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const distributionChartData = {
    labels: distribution.map((d) => `Grade ${d.grade}`),
    datasets: [
      {
        data: distribution.map((d) => d.percentage),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          📊 Commitment Quality Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Real-time quality metrics powered by Opik evaluation system
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Avg Commitment Quality"
          value={`${metrics.avgQuality.toFixed(1)}/10`}
          change={metrics.qualityChange}
          positive={metrics.qualityChange > 0}
        />
        <MetricCard
          label="High-Quality Commitments"
          value={`${metrics.highQualityRate}%`}
          change={metrics.highQualityChange}
          positive={metrics.highQualityChange > 0}
        />
        <MetricCard
          label="User Success Rate"
          value={`${metrics.userSuccessRate}%`}
          change={metrics.userSuccessChange}
          positive={metrics.userSuccessChange > 0}
        />
      </div>

      {/* Quality Trends */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Quality Trends (Last 30 Days)
        </h3>
        <div className="h-64">
          <Line
            data={trendChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 10,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Quality Comparison */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Quality by Agent
          </h3>
          <div className="h-64">
            <Bar
              data={agentChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    min: 0,
                    max: 10,
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 space-y-2">
            {agentScores.map((agent) => (
              <div key={agent.agent} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{agent.agent}</span>
                <span className="text-foreground font-medium">
                  {agent.score.toFixed(1)}/10 ({agent.count} commitments)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Distribution */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Grade Distribution
          </h3>
          <div className="h-64">
            <Doughnut
              data={distributionChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
          <div className="mt-4 space-y-2">
            {distribution.map((grade) => (
              <div key={grade.grade} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Grade {grade.grade}</span>
                <span className="text-foreground font-medium">
                  {grade.count} ({grade.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dimension Breakdown */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Quality Dimensions Breakdown
        </h3>
        <div className="space-y-4">
          {dimensions.map((dim) => (
            <div key={dim.dimension}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{dim.dimension}</span>
                <span className="text-sm text-muted-foreground">
                  {dim.score.toFixed(1)}/{dim.maxScore}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(dim.score / dim.maxScore) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            <strong>Improvement Opportunity:</strong> Time-boundedness scores are low (5.4/10).
            Consider prompting users for more specific deadlines.
          </p>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  change: number;
  positive: boolean;
}

function MetricCard({ label, value, change, positive }: MetricCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            positive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {positive ? <MdTrendingUp size={20} /> : <MdTrendingDown size={20} />}
          <span>{positive ? '+' : ''}{change.toFixed(1)}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {positive ? (
            <MdCheckCircle className="text-green-600" size={16} />
          ) : (
            <MdWarning className="text-amber-600" size={16} />
          )}
          <span>vs. last 30 days</span>
        </div>
      </div>
    </div>
  );
}

