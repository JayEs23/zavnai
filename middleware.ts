import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware - Phone verification is optional
 * Users can proceed without phone verification (email is default communication channel)
 */
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.JWT_SECRET_KEY || process.env.NEXTAUTH_SECRET });
    
    // Allow public routes
    const publicRoutes = ['/login', '/signup', '/', '/api', '/privacy', '/terms', '/contact', '/blog', '/science'];
    const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));
    
    if (isPublicRoute) {
        return NextResponse.next();
    }
    
    // If not authenticated, redirect to login
    if (!token) {
        if (request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/signup') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }
    
    // Phone verification is optional - users can proceed without it
    // Email is the default communication channel
    // No blocking of unverified users
    
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

