/**
 * Agent Monitoring Client for Frontend
 * 
 * Provides client-side utilities for:
 * - Fetching agent performance metrics
 * - Submitting user feedback
 * - Validating agent outputs
 */

export interface AgentMetrics {
  agent_name: string;
  time_period_hours: number;
  total_interactions: number;
  avg_latency: number;
  latency_p50: number;
  latency_p95: number;
  latency_p99: number;
  error_rate: number;
  token_usage: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
  user_satisfaction: number;
  timestamp: string;
}

export interface DailyReport {
  timestamp: string;
  period: string;
  agents: Record<string, AgentMetrics>;
  summary: {
    total_interactions: number;
    average_error_rate: number;
    agents_monitored: number;
  };
}

export interface ValidationResult {
  is_valid: boolean;
  extracted_data: Record<string, any> | null;
  validation_errors: string[];
  completeness_score: number;
  field_scores: Record<string, number>;
}

export class AgentMonitor {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get performance metrics for a specific agent
   */
  async getAgentMetrics(
    agentName: string,
    hours: number = 24
  ): Promise<AgentMetrics> {
    try {
      const response = await fetch(
        `${this.baseUrl}/monitoring/agents/${agentName}/metrics?hours=${hours}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching metrics for ${agentName}:`, error);
      throw error;
    }
  }

  /**
   * Get daily performance report for all agents
   */
  async getDailyReport(): Promise<DailyReport> {
    try {
      const response = await fetch(`${this.baseUrl}/monitoring/daily-report`);

      if (!response.ok) {
        throw new Error(`Failed to fetch daily report: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching daily report:', error);
      throw error;
    }
  }

  /**
   * Submit user feedback for a trace
   */
  async submitFeedback(
    traceId: string,
    satisfaction: number,
    comments?: string,
    agentName?: string
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/monitoring/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trace_id: traceId,
          satisfaction,
          comments,
          agent_name: agentName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit feedback: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  /**
   * Validate agent output against schema
   */
  async validateOutput(
    agentName: string,
    output: string
  ): Promise<ValidationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/monitoring/validate-output`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_name: agentName,
          output,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to validate output: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error validating output:', error);
      throw error;
    }
  }

  /**
   * Get monitoring system status
   */
  async getStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/monitoring/status`);

      if (!response.ok) {
        throw new Error(`Failed to fetch status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching monitoring status:', error);
      throw error;
    }
  }

  /**
   * Get agent execution history
   */
  async getAgentHistory(
    agentName: string,
    limit: number = 100
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/monitoring/agents/${agentName}/history?limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching history for ${agentName}:`, error);
      throw error;
    }
  }
}

// Global instance for convenience
let globalMonitor: AgentMonitor | null = null;

export function getAgentMonitor(baseUrl?: string): AgentMonitor {
  if (!globalMonitor) {
    globalMonitor = new AgentMonitor(baseUrl);
  }
  return globalMonitor;
}

