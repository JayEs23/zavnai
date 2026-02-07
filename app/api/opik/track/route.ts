/**
 * Opik Tracking API Endpoint
 * 
 * Server-side endpoint for tracking interactions to Opik.
 * This keeps the Opik SDK on the server and away from browser bundles.
 */

import { NextRequest, NextResponse } from 'next/server';

interface TrackingRequest {
  name: string;
  input: any;
  output: any;
  metadata?: Record<string, any>;
}

export async function POST(req: NextRequest) {
  try {
    const body: TrackingRequest = await req.json();
    const { name, input, output, metadata } = body;

    // Validate required fields
    if (!name || !input || !output) {
      return NextResponse.json(
        { error: 'Missing required fields: name, input, output' },
        { status: 400 }
      );
    }

    // Check if Opik is enabled
    const opikEnabled = process.env.OPIK_ENABLED === 'true';
    
    if (!opikEnabled) {
      // Return success but indicate tracking was skipped
      return NextResponse.json({
        traceId: 'opik-disabled',
        status: 'skipped',
        message: 'Opik tracking is disabled',
      });
    }

    // Import Opik only on server side
    try {
      const { default: Opik } = await import('opik');
      
      const client = new Opik({
        apiKey: process.env.OPIK_API_KEY,
        projectName: process.env.OPIK_PROJECT_NAME || 'zavn-ai',
        workspaceName: process.env.OPIK_WORKSPACE || 'default',
      });

      // Create trace
      const trace = client.trace({
        name,
        input,
        output,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
          source: 'web_client',
        },
      });

      // End trace and flush
      trace.end();
      await client.flush();

      return NextResponse.json({
        traceId: trace.id || 'trace-created',
        status: 'success',
      });

    } catch (opikError: any) {
      console.error('Opik SDK error:', opikError);
      
      // Return success but log the error
      // Don't break the user experience if Opik fails
      return NextResponse.json({
        traceId: 'opik-error',
        status: 'error',
        message: opikError.message || 'Opik tracking failed',
      });
    }

  } catch (error: any) {
    console.error('Tracking endpoint error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const opikEnabled = process.env.OPIK_ENABLED === 'true';
  
  return NextResponse.json({
    status: 'ok',
    opik_enabled: opikEnabled,
    has_api_key: !!process.env.OPIK_API_KEY,
    project_name: process.env.OPIK_PROJECT_NAME || 'zavn-ai',
  });
}

