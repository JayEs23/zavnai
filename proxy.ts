import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Proxy - Verification Gate
 * Users MUST be verified to access inner pages (dashboard, doyn, goals, etc.)
 * Unverified users are redirected to /onboarding
 */
export async function proxy(request: NextRequest) {
    const token = await getToken({ 
        req: request, 
        secret: process.env.JWT_SECRET_KEY || process.env.NEXTAUTH_SECRET 
    });
    
    // Allow public routes
    const publicRoutes = [
        '/login', 
        '/signup', 
        '/', 
        '/api', 
        '/verify',
        '/privacy', 
        '/terms', 
        '/contact', 
        '/blog', 
        '/science',
        '/agents',
        '/test-ai'  // AI test page (no auth required)
    ];
    const isPublicRoute = publicRoutes.some(route => 
        request.nextUrl.pathname.startsWith(route)
    );
    
    if (isPublicRoute) {
        return NextResponse.next();
    }
    
    // If not authenticated, redirect to login
    if (!token) {
        if (request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/signup') {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }
    
    // User is authenticated
    const user = token.user as { is_verified?: boolean; [key: string]: unknown };
    
    // Allow access to onboarding and echo for authenticated users
    if (request.nextUrl.pathname.startsWith('/onboarding') || 
        request.nextUrl.pathname.startsWith('/echo')) {
        return NextResponse.next();
    }
    
    // For all other protected routes, require phone verification (THE GATE)
    if (!user?.is_verified) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};

