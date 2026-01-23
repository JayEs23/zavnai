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
      // 1) Register user in backend
      await authApi.register({
        email,
        password,
        auth_provider: "email",
      });

      // 2) Log in (store JWT + user_id in localStorage)
      await authApi.login({ email, password });

      // 3) Establish NextAuth session
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
    <div className="min-h-screen bg-background-light text-white dark:bg-background-dark">
      <div className="flex min-h-screen w-full flex-col md:flex-row font-sans">
        {/* Brand & Testimonial Side Panel (Left) */}
        <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-white/5 bg-primary/10 p-12 lg:flex lg:w-5/12">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
          <div className="relative z-10">
            <div className="mb-16 flex items-center gap-3">
              <div className="relative h-8 w-8">
                <Image
                  src="/zavn-icon.png"
                  alt="ZAVN logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                ZAVN
              </h2>
            </div>
            <div className="space-y-6">
              <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-white">
                Build safer teams with ZAVN.
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-white/70">
                Join over 2,000+ teams improving their culture today. Start your
                7-day full access trial. No credit card required.
              </p>
            </div>
          </div>
          <div className="relative z-10">
            <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="flex gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <MdStar key={idx} className="text-xl" />
                ))}
              </div>
              <p className="text-lg italic leading-relaxed text-white">
                &quot;ZAVN transformed how our team communicates; the
                psychological safety features are an absolute game-changer for
                our remote workflow.&quot;
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="relative size-10 overflow-hidden rounded-full bg-slate-500">
                  <Image
                    src="/placeholder.svg"
                    alt="Testimonial avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Sarah Jenkins</p>
                  <p className="text-xs text-white/50">
                    Director of Ops, CloudScale
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Registration Form Side (Right) */}
        <main className="flex flex-1 flex-col items-center justify-center bg-background-light p-6 text-white dark:bg-background-dark md:p-12 lg:p-24">
          <div className="w-full max-w-[440px] space-y-8">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center justify-center gap-2 text-primary lg:hidden">
              <div className="relative h-6 w-6">
                <Image
                  src="/zavn-icon.png"
                  alt="ZAVN logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-bold text-white">ZAVN</h2>
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Create your account
              </h2>
              <p className="mt-2 text-white/60">
                Join the movement for better workplace culture.
              </p>
            </div>

            {/* Social Sign Up */}
            <button className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-white font-bold text-gray-900 transition-colors hover:bg-white/90">
              <span className="flex size-5 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-900 shadow">
                G
              </span>
              <span>Sign up with Google</span>
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10" />
              <span className="mx-4 flex-shrink text-sm font-medium uppercase tracking-widest text-white/30">
                Or email
              </span>
              <div className="flex-grow border-t border-white/10" />
            </div>

            {/* Registration Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="ml-1 block text-sm font-semibold text-white">
                Full Name
              </label>
              <div className="relative">
                <MdPerson className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white/40" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-14 w-full rounded-lg border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-white/20 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 block text-sm font-semibold text-white">
                Work Email
              </label>
              <div className="relative">
                <MdMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="h-14 w-full rounded-lg border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-white/20 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 block text-sm font-semibold text-white">
                Password
              </label>
              <div className="relative">
                <MdLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="h-14 w-full rounded-lg border border-white/10 bg-white/5 pl-12 pr-12 text-white placeholder:text-white/20 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
                >
                  <MdVisibility className="text-xl" />
                </button>
              </div>
              <p className="mt-1 px-1 text-xs text-white/40">
                Must be at least 8 characters long.
              </p>
            </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>{isLoading ? "Creating account..." : "Create Account"}</span>
                <MdArrowForward className="text-xl" />
              </button>
            </form>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-6 pt-4 text-center">
              <p className="text-sm text-white/60">
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <div className="border-t border-white/10 pt-6">
                <p className="text-white/80">
                  Already have an account?
                  <Link
                    href="/login"
                    className="ml-1 font-bold text-primary underline-offset-2 hover:underline"
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


