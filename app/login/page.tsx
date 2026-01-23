'use client';

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { authApi } from "@/services/authApi";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1) Log in against backend API (stores JWT + user_id in localStorage)
      await authApi.login({ email, password });

      // 2) Establish NextAuth session using the same credentials
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result || result.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      router.push("/onboarding");
    } catch (err: any) {
      setError(err?.message || "Failed to log in");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light text-slate-900 dark:bg-background-dark dark:text-white">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-charcoal-custom">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Log in</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Welcome back. Enter your credentials to continue.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          New to ZAVN?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}



