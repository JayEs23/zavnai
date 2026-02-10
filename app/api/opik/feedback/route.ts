/**
 * Opik Feedback API Endpoint
 * 
 * Server-side endpoint for submitting feedback to Opik traces.
 */

import { NextRequest, NextResponse } from 'next/server';

interface FeedbackRequest {
  trace_id: string;
  feedback_type: 'positive' | 'negative' | 'neutral';
  score?: number;
  comments?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: FeedbackRequest = await req.json();
    const { trace_id, feedback_type, score, comments } = body;

    // Validate required fields
    if (!trace_id || !feedback_type) {
      return NextResponse.json(
        { error: 'Missing required fields: trace_id, feedback_type' },
        { status: 400 }
      );
    }

    // Check if Opik is enabled
    const opikEnabled = process.env.OPIK_ENABLED === 'true';
    
    if (!opikEnabled) {
      return NextResponse.json({
        status: 'skipped',
        message: 'Opik feedback is disabled',
      });
    }

    // Import Opik only on server side
    try {
      const { Opik } = await import('opik');

      const client = new Opik({
        apiKey: process.env.OPIK_API_KEY,
        projectName: process.env.OPIK_PROJECT_NAME || 'zavn-ai',
        workspaceName: process.env.OPIK_WORKSPACE || 'default',
      });

      // Submit feedback
      // `logFeedbackScore` exists at runtime but is missing from the TypeScript
      // definition of `OpikClient`, so we suppress the type error here.
      // @ts-expect-error - temporary until Opik exposes proper typings
      await client.logFeedbackScore({
        traceId: trace_id,
        name: 'user_feedback',
        value: score || (feedback_type === 'positive' ? 10 : feedback_type === 'negative' ? 0 : 5),
        reason: comments || `User feedback: ${feedback_type}`,
      });

      await client.flush();

      return NextResponse.json({
        status: 'success',
        message: 'Feedback submitted successfully',
      });

    } catch (opikError: any) {
      console.error('Opik feedback error:', opikError);
      
      return NextResponse.json({
        status: 'error',
        message: opikError.message || 'Feedback submission failed',
      });
    }

  } catch (error: any) {
    console.error('Feedback endpoint error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

