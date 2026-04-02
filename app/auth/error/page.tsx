'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthErrorInner() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const message =
    error === 'OAuthAccountNotLinked'
      ? 'This email is already registered with another sign-in method.'
      : error === 'Configuration'
        ? 'Authentication is not configured correctly. Check server environment variables.'
        : error === 'AccessDenied'
          ? 'Access was denied. You can try again or use a different sign-in method.'
          : 'Something went wrong while signing in.';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-foreground mb-2">Sign-in error</h1>
        <p className="text-muted-foreground text-sm mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex justify-center px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90"
          >
            Back to login
          </Link>
          <Link
            href="/"
            className="inline-flex justify-center px-4 py-2.5 rounded-xl border border-border font-medium hover:bg-muted"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthErrorInner />
    </Suspense>
  );
}
