import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware – Auth & Onboarding Gate
 *
 * Uses middleware.ts (not proxy.ts) for Next.js 16 compatibility – proxy.ts
 * has known issues with Response/NextResponse instanceof checks causing 404s.
 *
 * 1. Public routes → pass through (no auth needed)
 * 2. Unauthenticated users on protected routes → redirect to /login
 * 3. Authenticated but NOT onboarded → redirect to /onboarding
 * 4. Authenticated + onboarded → allow access
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── 1. Public routes (no auth required) – check BEFORE getToken ─────
    const publicRoutes = [
        '/login',
        '/signup',
        '/forgot-password',
        '/',
        '/api',
        '/verify',
        '/auth',
        '/privacy',
        '/terms',
        '/refund',
        '/contact',
        '/about',
        '/blog',
        '/science',
        '/agents',
        '/test-ai',
        '/how-it-works',
        '/features',
        '/community',
        '/pricing',
        '/tribe/verify',
        '/tribe/vetting',
    ];

    const isPublicRoute = publicRoutes.some((route) =>
        route === '/' ? pathname === '/' : pathname.startsWith(route)
    );

    if (isPublicRoute) {
        return NextResponse.next();
    }

    // ── 2. Protected routes – require token ─────────────────────────────
    const token = await getToken({
        req: request,
        secret: process.env.JWT_SECRET_KEY || process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ── 3. Authenticated – allow onboarding & echo unconditionally ──────
    if (pathname.startsWith('/onboarding') || pathname.startsWith('/echo')) {
        return NextResponse.next();
    }

    // ── 4. Onboarding gate ──────────────────────────────────────────────
    if (!token.onboardingCompleted) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
