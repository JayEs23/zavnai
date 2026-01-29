import { NextResponse } from "next/server";

/**
 * Test endpoint to verify environment variables are being read
 * Access at: /api/test-env
 * 
 * This endpoint shows which env vars are set (without exposing sensitive values)
 */
export async function GET() {
    const envVars = [
        'OPIK_API_KEY',
        'OPIK_PROJECT_NAME',
        'OPIK_WORKSPACE_NAME',
        'OPIK_URL_OVERRIDE',
        'GEMINI_API_KEY',
        'NEXT_PUBLIC_API_URL',
    ];

    const results: Record<string, { set: boolean; preview?: string }> = {};

    envVars.forEach(varName => {
        const value = process.env[varName];
        const isSet = value !== undefined && value !== '';
        results[varName] = {
            set: isSet,
            preview: isSet && varName.includes('KEY') 
                ? `${value!.substring(0, 8)}...` 
                : value || undefined
        };
    });

    return NextResponse.json({
        message: "Environment Variable Test",
        timestamp: new Date().toISOString(),
        results,
        summary: {
            total: envVars.length,
            set: Object.values(results).filter(r => r.set).length,
            missing: Object.values(results).filter(r => !r.set).length
        }
    });
}

