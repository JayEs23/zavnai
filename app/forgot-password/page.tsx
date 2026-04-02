'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { authApi } from "@/services/authApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
      toast.success("Check your inbox for reset instructions.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

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
            Enter your email and we&apos;ll send a secure link to set a new password. Google or GitHub
            sign-in? Use those providers on the log in page instead.
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
          {sent ? (
            <p className="text-muted-foreground leading-relaxed">
              If that email is registered, you&apos;ll receive reset instructions shortly. Check spam
              folders too.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full inline-flex justify-center text-center disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="btn-secondary inline-flex justify-center text-center">
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
