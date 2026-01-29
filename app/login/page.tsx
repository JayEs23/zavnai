'use client';

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { authApi } from "@/services/authApi";
import { MdMail, MdLock, MdArrowForward } from "react-icons/md";

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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <div className="flex min-h-screen w-full flex-col md:flex-row font-sans">
        {/* Brand Side Panel (Left) */}
        <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--muted)] p-12 lg:flex lg:w-5/12">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[var(--primary)]/20 blur-[120px]" />
          <div className="relative z-10">
            <Link href="/" className="mb-16 flex items-center gap-3 group">
              <div className="relative size-10 icon-container rounded-xl transition-transform group-hover:scale-110">
                <Image
                  src="/zavn-icon.png"
                  alt="ZAVN logo"
                  fill
                  className="object-contain p-1.5"
                />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)]">
                ZAVN
              </h2>
            </Link>
            <div className="space-y-8 mt-12">
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tighter text-[var(--foreground)]">
                Welcome back.
              </h1>
              <p className="max-w-md text-xl text-[var(--muted-foreground)]">
                Continue your journey to alignment. Your progress awaits.
              </p>
            </div>
          </div>
        </aside>

        {/* Login Form Side (Right) */}
        <main className="flex flex-1 flex-col items-center justify-center bg-[var(--background)] p-6 md:p-12 lg:p-24 transition-colors duration-300">
          <div className="w-full max-w-[460px] space-y-10">
            {/* Mobile Logo */}
            <div className="mb-12 flex items-center justify-center gap-3 lg:hidden">
              <div className="relative size-10 icon-container rounded-xl">
                <Image src="/zavn-icon.png" alt="ZAVN" fill className="object-contain p-1.5" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)]">ZAVN</h2>
            </div>

            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                Log in
              </h2>
              <p className="text-lg font-medium text-[var(--muted-foreground)]">
                Welcome back. Enter your credentials to continue.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="label">Email address</label>
                <div className="relative">
                  <MdMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[var(--muted-foreground)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="input-field pl-12 pr-4 bg-[var(--muted)]/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="label">Password</label>
                <div className="relative">
                  <MdLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[var(--muted-foreground)]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="input-field pl-12 pr-4 bg-[var(--muted)]/50"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-14 w-full items-center justify-center gap-2 text-lg btn-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>{isLoading ? "Logging in..." : "Log in"}</span>
                <MdArrowForward className="text-xl" />
              </button>
            </form>

            <div className="space-y-8 pt-4 text-center">
              <div className="border-t border-[var(--border-subtle)] pt-8">
                <p className="text-[var(--muted-foreground)] font-medium">
                  New to ZAVN?{" "}
                  <Link
                    href="/signup"
                    className="ml-2 font-black text-[var(--primary)] hover:underline underline-offset-4"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}



