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
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <div className="w-full max-w-md card border-[var(--border-subtle)] shadow-sm">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight">Log in</h1>
          <p className="mt-2 text-base text-body">
            Welcome back. Enter your credentials to continue.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="input-field"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-14 w-full text-base btn-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm font-medium text-body">
          New to ZAVN?{" "}
          <Link
            href="/signup"
            className="font-bold text-[var(--primary)] hover:underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}



