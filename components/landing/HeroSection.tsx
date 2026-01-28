 "use client";

import { MdMic } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen px-4 py-24 flex items-center bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      <div className="absolute inset-0 hero-gradient pointer-events-none" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-16 md:flex-row md:items-center">
        {/* Left: copy + CTA */}
        <div className="flex-1 min-w-0 w-full max-w-xl space-y-8">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] flex items-center justify-center">
              <Image
                src="/zavn-icon.png"
                alt="ZAVN logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              ZAVN · Zero-gap Action Network
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Keep the promises you make to yourself.
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] max-w-xl">
              Zavn turns “I&apos;ll do it later” into small, verified actions. No hype—just
              a system that helps you follow through on what you already care about.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-[var(--muted-foreground)]">
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-[var(--primary)]" />
              <p>
                Echo listens to your real constraints and patterns—no judgment, no
                productivity slogans.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-[var(--primary)]" />
              <p>
                Doyn gives you 1–2 tiny commitments that fit your actual week, not a fantasy schedule.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-[var(--primary)]" />
              <p>
                Tribe and Thrive quietly verify progress and protect you from burnout.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="btn-primary h-14 px-8 text-base sm:text-lg justify-center gap-2"
            >
              <MdMic className="text-xl" />
              <span>Try the onboarding (7 minutes)</span>
            </Link>
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-[var(--border-subtle)] text-sm font-semibold text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            >
              See how it works
            </button>
          </div>
        </div>

        {/* Right: product preview */}
        <div className="flex-1 min-w-[320px] w-full max-w-md">
          <div className="relative rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-lg shadow-black/5 dark:shadow-black/40 p-5 space-y-4">
            {/* Echo snippet */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-sm font-bold text-[var(--primary)]">
                  E
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Echo · Reflection
                </span>
              </div>
              <div className="rounded-2xl bg-[var(--background)] border border-[var(--border-subtle)] p-4 text-sm text-[var(--muted-foreground)] space-y-2">
                <p className="font-semibold text-[var(--foreground)]">
                  “You keep saying you&apos;ll code after work, but your energy is gone by 7pm.”
                </p>
                <p>
                  Let&apos;s look at the last two weeks and find one 25‑minute block that actually stayed free.
                </p>
              </div>
            </div>

            {/* Doyn snippet */}
            <div className="space-y-3 border-t border-dashed border-[var(--border-subtle)] pt-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-sm font-bold text-[var(--primary)]">
                  D
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Doyn · Commitments
                </span>
              </div>
              <div className="rounded-2xl bg-[var(--background)] border border-[var(--border-subtle)] p-4 text-sm space-y-2">
                <p className="font-semibold text-[var(--foreground)]">
                  This week&apos;s contract
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[var(--muted-foreground)]">
                  <li>One 25‑minute coding block on Tue or Thu, before 6:30pm.</li>
                  <li>Reply “done” with a screenshot of your editor.</li>
                </ul>
              </div>
            </div>

            {/* Small footer */}
            <div className="flex items-center justify-between pt-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              <span>Verified by tribe &amp; data</span>
              <span>Zero shaming · Just truth</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
