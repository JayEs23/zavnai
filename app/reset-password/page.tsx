'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { authApi } from "@/services/authApi";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Use at least 8 characters");
      return;
    }
    if (!token || !email) {
      toast.error("Invalid or expired reset link");
      return;
    }
    setSubmitting(true);
    try {
      await authApi.resetPassword({ email: email.trim(), token, new_password: password });
      toast.success("Password updated. You can log in.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Invalid link</h2>
        <p className="text-muted-foreground">
          Open the reset link from your email, or request a new one from forgot password.
        </p>
        <Link href="/forgot-password" className="btn-primary inline-flex justify-center text-center">
          Request reset
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md space-y-4">
      <h2 className="text-3xl font-bold text-foreground">Set new password</h2>
      <p className="text-sm text-muted-foreground">For {email}</p>
      <div>
        <label htmlFor="np" className="block text-sm font-medium text-foreground mb-1">
          New password
        </label>
        <input
          id="np"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
        />
      </div>
      <div>
        <label htmlFor="npc" className="block text-sm font-medium text-foreground mb-1">
          Confirm password
        </label>
        <input
          id="npc"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full inline-flex justify-center text-center disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          <h1 className="text-4xl font-bold leading-tight">Secure reset</h1>
          <p className="mt-4 text-lg text-white/90">Choose a strong password you haven&apos;t used elsewhere.</p>
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
          <Suspense
            fallback={
              <div className="text-muted-foreground text-sm" role="status">
                Loading…
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
