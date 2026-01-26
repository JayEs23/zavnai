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
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-background-dark dark:text-white">
      <div className="flex min-h-screen w-full flex-col md:flex-row font-sans">
        {/* Brand & Testimonial Side Panel (Left) */}
        <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-slate-100 bg-slate-50 p-12 lg:flex lg:w-5/12 dark:border-white/5 dark:bg-primary/5">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/20" />
          <div className="relative z-10">
            <Link href="/" className="mb-16 flex items-center gap-3 group">
              <div className="relative h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
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
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tighter text-slate-900 dark:text-white">
                Build high-performance <br /> habits with ZAVN.
              </h1>
              <p className="max-w-md text-xl leading-relaxed text-slate-500 dark:text-white/60">
                Join thousands of individuals closing the gap between intention and action. Start your 7-day trial.
              </p>
            </div>
          </div>
          <div className="relative z-10">
            <div className="space-y-5 rounded-[2.5rem] border border-slate-200/60 bg-white p-10 shadow-sm dark:border-white/10 dark:bg-white/5 backdrop-blur-md">
              <div className="flex gap-1.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <MdStar key={idx} className="text-xl" />
                ))}
              </div>
              <p className="text-lg font-medium italic leading-relaxed text-slate-700 dark:text-white/90">
                &quot;ZAVN transformed how I approach my daily energy management; the
                cognitive agents are like having a performance coach in my pocket.&quot;
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="relative size-12 overflow-hidden rounded-2xl bg-primary/10">
                  <Image
                    src="/placeholder.svg"
                    alt="Testimonial avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900 dark:text-white">Marcus Thorne</p>
                  <p className="text-xs font-black uppercase tracking-widest text-primary">Founder, Flux Systems</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Registration Form Side (Right) */}
        <main className="flex flex-1 flex-col items-center justify-center bg-white p-6 dark:bg-background-dark md:p-12 lg:p-24 transition-colors duration-300">
          <div className="w-full max-w-[460px] space-y-10">
            {/* Mobile Logo */}
            <div className="mb-12 flex items-center justify-center gap-3 lg:hidden">
              <div className="relative h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Image src="/zavn-icon.png" alt="ZAVN" fill className="object-contain p-1.5" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">ZAVN</h2>
            </div>

            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Create your account
              </h2>
              <p className="text-lg font-medium text-slate-500 dark:text-white/50">
                The journey to alignment starts here.
              </p>
            </div>

            {/* Registration Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="ml-1 block text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <MdPerson className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20 dark:focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 block text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300">
                  Email address
                </label>
                <div className="relative">
                  <MdMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20 dark:focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 block text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <MdLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20 dark:focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
                  >
                    <MdVisibility className="text-xl" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-xl transition-all hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:hover:bg-primary/90 shadow-slate-200 dark:shadow-primary/20"
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
              <p className="text-sm font-medium text-slate-500 dark:text-white/40 leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-primary font-bold hover:underline underline-offset-4">Terms</Link> and{" "}
                <Link href="/privacy" className="text-primary font-bold hover:underline underline-offset-4">Privacy Policy</Link>.
              </p>
              <div className="border-t border-slate-100 dark:border-white/5 pt-8">
                <p className="text-slate-600 dark:text-white/80 font-medium">
                  Already have an account?
                  <Link
                    href="/login"
                    className="ml-2 font-black text-primary hover:underline underline-offset-4"
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
