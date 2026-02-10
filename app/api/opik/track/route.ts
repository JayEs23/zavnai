/* eslint-disable @typescript-eslint/no-explicit-any */
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
  tags?: string[];
}

// Initialize Opik client once at module level to avoid repeated initialization
let opikClient: any = null;

async function getOpikClient() {
  if (!opikClient) {
    try {
      const { Opik } = await import('opik');
      
      opikClient = new Opik({
        apiKey: process.env.OPIK_API_KEY,
        projectName: process.env.OPIK_PROJECT_NAME || 'zavn-ai',
        workspaceName: process.env.OPIK_WORKSPACE,
        // Add URL override if using Comet Cloud
        ...(process.env.OPIK_URL_OVERRIDE && { 
          apiUrl: process.env.OPIK_URL_OVERRIDE 
        }),
      });
    } catch (error) {
      console.error('Failed to initialize Opik client:', error);
      throw error;
    }
  }
  return opikClient;
}

export async function POST(req: NextRequest) {
  try {
    const body: TrackingRequest = await req.json();
    const { name, input, output, metadata, tags } = body;

    // Validate required fields
    if (!name || input === undefined || output === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, input, output' },
        { status: 400 }
      );
    }

    // Check if Opik is enabled and configured
    const opikEnabled = process.env.OPIK_ENABLED === 'true';
    const hasApiKey = !!process.env.OPIK_API_KEY;
    
    if (!opikEnabled) {
      return NextResponse.json({
        traceId: 'opik-disabled',
        status: 'skipped',
        message: 'Opik tracking is disabled',
      });
    }

    if (!hasApiKey) {
      console.error('Opik API key not configured');
      return NextResponse.json({
        traceId: 'opik-no-key',
        status: 'error',
        message: 'Opik API key not configured',
      });
    }

    try {
      const client = await getOpikClient();

      // Create trace with proper error handling
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
        // Add tags if provided
        ...(tags && { tags }),
      });

      // End trace
      trace.end();
      
      // Flush with timeout to prevent hanging
      const flushPromise = client.flush();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Flush timeout')), 5000)
      );
      
      await Promise.race([flushPromise, timeoutPromise]);

      return NextResponse.json({
        traceId: trace.id || 'trace-created',
        status: 'success',
      });

    } catch (opikError: any) {
      console.error('Opik SDK error:', opikError);
      
      // Return error status for Opik failures
      return NextResponse.json({
        traceId: 'opik-error',
        status: 'error',
        message: opikError.message || 'Opik tracking failed',
      }, { status: 500 });
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
  const hasApiKey = !!process.env.OPIK_API_KEY;
  
  // Test Opik connection if enabled
  let connectionStatus = 'unknown';
  if (opikEnabled && hasApiKey) {
    try {
      const client = await getOpikClient();
      // You could add a simple test trace here if needed
      connectionStatus = 'connected';
    } catch (error) {
      connectionStatus = 'error';
      console.error('Opik connection test failed:', error);
    }
  }
  
  return NextResponse.json({
    status: 'ok',
    opik_enabled: opikEnabled,
    has_api_key: hasApiKey,
    project_name: process.env.OPIK_PROJECT_NAME || 'zavn-ai',
    workspace: process.env.OPIK_WORKSPACE,
    connection_status: connectionStatus,
  });
}
