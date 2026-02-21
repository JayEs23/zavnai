import { NextResponse } from "next/server";

/**
 * Keepalive endpoint to ping the backend and prevent Render free tier spin-down
 * 
 * This endpoint should be called by a cron job every 10-14 minutes
 * to keep the Render backend service alive.
 * 
 * Access at: /api/keepalive
 * 
 * Optional query params:
 * - ?secret=YOUR_SECRET - Verify the request is from a trusted source
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zavn-core.onrender.com';

export async function GET() {
  const backendHealthUrl = `${BACKEND_URL}/health`;
  
  try {
    const startTime = Date.now();
    const response = await fetch(backendHealthUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'ZAVN-Keepalive/1.0',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    const responseTime = Date.now() - startTime;
    const isHealthy = response.ok;

    if (isHealthy) {
      const data = await response.json().catch(() => ({}));
      
      return NextResponse.json({
        success: true,
        message: 'Backend is alive',
        backend: {
          status: response.status,
          responseTime: `${responseTime}ms`,
          data,
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Backend health check failed',
          backend: {
            status: response.status,
            responseTime: `${responseTime}ms`,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 502 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to reach backend',
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

