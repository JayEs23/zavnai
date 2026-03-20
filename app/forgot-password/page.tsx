import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

/**
 * Password reset is not yet exposed on the FastAPI surface; this page replaces a dead link
 * from login and sets expectations (zavnexample ch.2 — clear errors, no mystery 404s).
 */
export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-hero-gradient flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-primary to-accent p-12 text-white">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/zavn-icon.png"
            alt="ZAVN Logo"
            width={40}
            height={40}
            className="brightness-0 invert"
          />
          <span className="text-2xl font-bold">ZAVN</span>
        </Link>
        <div>
          <h1 className="text-4xl font-bold leading-tight">Account help</h1>
          <p className="mt-4 text-lg text-white/90">
            We&apos;ll add self-serve reset when the backend endpoint ships. Until then, use the options on the right.
          </p>
        </div>
        <p className="text-sm text-white/70">ZAVN</p>
      </div>
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to log in
          </Link>
          <h2 className="text-3xl font-bold text-foreground">Forgot password?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Automated password reset isn&apos;t wired up yet. If you signed up with{" "}
            <span className="font-semibold text-foreground">Google</span> or{" "}
            <span className="font-semibold text-foreground">GitHub</span>, use that provider&apos;s
            sign-in on the log in page. For email accounts, contact support or create a new account with
            a different email until reset is available.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="btn-primary inline-flex justify-center text-center">
              Return to log in
            </Link>
            <Link href="/signup" className="btn-secondary inline-flex justify-center text-center">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
