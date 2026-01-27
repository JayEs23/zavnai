'use client';

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  MdStar,
  MdPerson,
  MdMail,
  MdLock,
  MdVisibility,
  MdArrowForward,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { authApi } from "@/services/authApi";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authApi.register({
        email,
        password,
        auth_provider: "email",
      });

      await authApi.login({ email, password });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result || result.error) {
        setError("Unable to sign you in after registration");
        setIsLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("full_name", fullName);
      }

      router.push("/onboarding");
    } catch (err: any) {
      setError(err?.message || "Failed to create account");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <div className="flex min-h-screen w-full flex-col md:flex-row font-sans">
        {/* Brand & Testimonial Side Panel (Left) */}
        <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--muted)] p-12 lg:flex lg:w-5/12">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[var(--border-subtle)] blur-[120px]" />
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
              <h2 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/70">
                ZAVN
              </h2>
            </Link>
            <div className="space-y-8 mt-12">
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tighter text-[var(--foreground)]">
                Build high-performance <br /> habits with ZAVN.
              </h1>
              <p className="max-w-md text-xl text-body">
                Join thousands of individuals closing the gap between intention and action. Start your 7-day trial.
              </p>
            </div>
          </div>
          <div className="relative z-10">
            <div className="space-y-5 rounded-[2.5rem] border border-[var(--border-subtle)] bg-[var(--card-bg)] p-10 shadow-sm backdrop-blur-md">
              <div className="flex gap-1.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <MdStar key={idx} className="text-xl" />
                ))}
              </div>
              <p className="text-lg font-medium italic leading-relaxed text-[var(--foreground)]/90">
                &quot;ZAVN transformed how I approach my daily energy management; the
                cognitive agents are like having a performance coach in my pocket.&quot;
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-subtle)]">
                <div className="relative size-12 overflow-hidden rounded-2xl bg-[var(--muted)]">
                  <Image
                    src="/placeholder.svg"
                    alt="Testimonial avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-base font-bold text-[var(--foreground)]">Marcus Thorne</p>
                  <p className="text-xs font-black uppercase tracking-widest text-[var(--primary)]">Founder, Flux Systems</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Registration Form Side (Right) */}
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
                Create your account
              </h2>
              <p className="text-lg font-medium text-[var(--muted-foreground)]">
                The journey to alignment starts here.
              </p>
            </div>

            {/* Registration Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="label">
                  Full Name
                </label>
                <div className="relative">
                  <MdPerson className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="input-field pl-12 pr-4 bg-[var(--muted)]/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label">
                  Email address
                </label>
                <div className="relative">
                  <MdMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[var(--muted-foreground)]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="input-field pl-12 pr-4 bg-[var(--muted)]/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label">
                  Password
                </label>
                <div className="relative">
                  <MdLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[var(--muted-foreground)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="input-field pl-12 pr-12 bg-[var(--muted)]/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                  >
                    <MdVisibility className="text-xl" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-14 w-full items-center justify-center gap-2 text-lg btn-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>{isLoading ? "Creating account..." : "Create Account"}</span>
                <MdArrowForward className="text-xl" />
              </button>
            </form>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-8 pt-4 text-center">
              <p className="text-sm font-medium text-[var(--muted-foreground)] leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="font-bold text-[var(--primary)] hover:underline underline-offset-4">Terms</Link> and{" "}
                <Link href="/privacy" className="font-bold text-[var(--primary)] hover:underline underline-offset-4">Privacy Policy</Link>.
              </p>
              <div className="border-t border-[var(--border-subtle)] pt-8">
                <p className="text-[var(--muted-foreground)] font-medium">
                  Already have an account?
                  <Link
                    href="/login"
                    className="ml-2 font-black text-[var(--primary)] hover:underline underline-offset-4"
                  >
                    Log In
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
