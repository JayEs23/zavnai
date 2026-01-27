import { MdMic } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="hero-gradient relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 dark:opacity-40">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-black/10 blur-[120px] dark:bg-white/10" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-black/5 blur-[120px] dark:bg-white/5" />
      </div>
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        <div className="mb-12 animate-float-slow">
          <div className="relative size-40 rounded-3xl border border-[var(--border-subtle)] shadow-2xl shadow-black/10 dark:shadow-white/10 icon-container">
            <Image
              src="/zavn-icon.png"
              alt="ZAVN logo"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>
        </div>
        <h1 className="mb-8 bg-gradient-to-b from-slate-900 to-slate-700 bg-clip-text text-center text-5xl font-extrabold tracking-tight text-transparent dark:from-white dark:to-slate-400 md:text-7xl">
          Close the Gap Between{" "}
          <br className="hidden md:block" />
          Intention and Action
        </h1>
        <p className="mb-12 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
          A voice-led behavior alignment system. Harness
          AI-driven behavioral science through natural conversation.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="flex h-14 min-w-[240px] items-center justify-center gap-3 text-lg btn-primary"
          >
            <MdMic className="text-xl" />
            <span>Get Started</span>
          </Link>
          <Link
            href="/agents"
            className="h-14 rounded-xl border border-[var(--border-subtle)] px-8 text-lg font-bold transition-colors hover:bg-[var(--muted)] text-[var(--foreground)]"
          >
            Explore Agents
          </Link>
        </div>
      </div>
    </section>
  );
};


