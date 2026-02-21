/**
 * Client-Side Opik Tracker
 * 
 * Browser-safe wrapper for Opik tracking.
 * All actual Opik operations happen on the server via API calls.
 */

interface TrackingData {
  name: string;
  input: any;
  output: any;
  metadata?: Record<string, any>;
}

interface TrackingResponse {
  traceId: string;
  status: string;
}

export class ClientOpikTracker {
  private baseUrl: string;
  private enabled: boolean;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
    this.enabled = typeof window !== 'undefined'; // Only track in browser
  }

  /**
   * Track a generic interaction
   */
  async trackInteraction(data: TrackingData): Promise<string> {
    if (!this.enabled) return 'tracking-disabled';

    try {
      const response = await fetch(`${this.baseUrl}/opik/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.warn(`Opik tracking failed: ${response.statusText}`);
        return 'tracking-failed';
      }

      const result: TrackingResponse = await response.json();
      return result.traceId;
    } catch (error) {
      console.error('Opik tracking error:', error);
      // Don't break the app if tracking fails
      return 'tracking-error';
    }
  }

  /**
   * Track an agent interaction (chat, voice, etc.)
   */
  async trackAgentInteraction(
    agentName: string,
    userInput: string,
    agentResponse: string,
    sessionId?: string,
    additionalMetadata?: Record<string, any>
  ): Promise<string> {
    return this.trackInteraction({
      name: `${agentName}_interaction`,
      input: { 
        user_input: userInput, 
        session_id: sessionId 
      },
      output: { 
        agent_response: agentResponse 
      },
      metadata: {
        agent_name: agentName,
        session_id: sessionId,
        interaction_type: 'chat',
        timestamp: new Date().toISOString(),
        ...additionalMetadata,
      },
    });
  }

  /**
   * Track voice onboarding session
   */
  async trackVoiceOnboarding(
    sessionId: string,
    transcript: string,
    extractedProfile: any,
    validationScores?: any
  ): Promise<string> {
    return this.trackInteraction({
      name: 'echo_voice_onboarding',
      input: {
        session_id: sessionId,
        transcript_length: transcript.length,
      },
      output: {
        extracted_profile: extractedProfile,
        validation: validationScores,
      },
      metadata: {
        agent_name: 'echo_agent',
        session_id: sessionId,
        interaction_type: 'voice_onboarding',
        completeness_score: validationScores?.completeness_score || 0,
        is_valid: validationScores?.is_valid || false,
      },
    });
  }

  /**
   * Track commitment creation
   */
  async trackCommitmentCreation(
    commitmentId: string,
    taskDetail: string,
    qualityEvaluation: any,
    sessionId?: string
  ): Promise<string> {
    return this.trackInteraction({
      name: 'commitment_created',
      input: {
        commitment_id: commitmentId,
        session_id: sessionId,
      },
      output: {
        task_detail: taskDetail,
        quality_evaluation: qualityEvaluation,
      },
      metadata: {
        commitment_id: commitmentId,
        session_id: sessionId,
        quality_score: qualityEvaluation?.overall_score || 0,
        quality_grade: qualityEvaluation?.quality_grade || 'N/A',
        action: 'commitment_created',
      },
    });
  }

  /**
   * Track feedback submission
   */
  async trackFeedback(
    traceId: string,
    feedbackType: 'positive' | 'negative' | 'neutral',
    score?: number,
    comments?: string
  ): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/opik/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trace_id: traceId,
          feedback_type: feedbackType,
          score,
          comments,
        }),
      });
    } catch (error) {
      console.error('Feedback submission error:', error);
    }
  }
}

// Export singleton instance
export const opikTracker = new ClientOpikTracker();

// Export for custom instantiation
export default ClientOpikTracker;

