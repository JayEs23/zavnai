import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Proxy – Auth & Onboarding Gate (Next.js 16)
 *
 * 1. Public routes → pass through (no auth needed)
 * 2. Unauthenticated users on protected routes → redirect to /login
 * 3. Authenticated but NOT onboarded → redirect to /onboarding
 * 4. Authenticated + onboarded → allow access
 *
 * The JWT token shape (from NextAuth callbacks):
 *   token.accessToken        – backend JWT
 *   token.onboardingCompleted – boolean from backend login response
 *   token.id / token.sub     – user id
 */
export async function proxy(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.JWT_SECRET_KEY || process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = request.nextUrl;

    // ── 1. Public routes (no auth required) ──────────────────────────
    const publicRoutes = [
        '/login',
        '/signup',
        '/',
        '/api',              // all API routes (NextAuth, echo, opik, etc.)
        '/verify',
        '/privacy',
        '/terms',
        '/contact',
        '/blog',
        '/science',
        '/agents',
        '/test-ai',
        '/how-it-works',
        '/features',
        '/community',
        '/pricing',
        '/tribe/verify',     // external tribe-member verification links (no account needed)
    ];

    // Exact match for "/" but startsWith for everything else
    const isPublicRoute = publicRoutes.some((route) =>
        route === '/' ? pathname === '/' : pathname.startsWith(route)
    );

    if (isPublicRoute) {
        return NextResponse.next();
    }

    // ── 2. Unauthenticated → redirect to /login ─────────────────────
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ── 3. Authenticated – allow onboarding & echo unconditionally ──
    if (pathname.startsWith('/onboarding') || pathname.startsWith('/echo')) {
        return NextResponse.next();
    }

    // ── 4. Onboarding gate — redirect to /onboarding if not complete ─
    //    token.onboardingCompleted is set by the NextAuth jwt() callback
    if (!token.onboardingCompleted) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // ── 5. Fully authenticated + onboarded → allow ──────────────────
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

