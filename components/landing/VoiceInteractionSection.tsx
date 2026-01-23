import { MdCheckCircle, MdGraphicEq } from "react-icons/md";

import Link from "next/link";

export const VoiceInteractionSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="flex flex-col items-center gap-16 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 p-8 dark:border-slate-800 dark:bg-slate-900/40 lg:flex-row md:p-16">
        <div className="flex-1 space-y-8">
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Experience Voice-First Interaction
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Traditional apps demand your attention. ZAVN only needs your voice.
            Speak your goals, reflect on hurdles, and let the agents handle the
            rest.
          </p>
          <ul className="space-y-4">
            {[
              "Zero-friction interaction flow",
              "Context-aware behavior coaching",
              "End-to-end encrypted voice logs",
            ].map((item) => (
              <li key={item} className="flex items-center gap-4">
                <MdCheckCircle className="text-primary text-xl" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/science"
            className="inline-flex rounded-xl bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
          >
            Discover the Science
          </Link>
        </div>
        <div className="relative aspect-square w-full max-w-md flex-1">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse-slow h-full w-full rounded-full border border-primary/20" />
            <div className="absolute h-4/5 w-4/5 rounded-full border border-primary/40" />
            <div className="absolute h-3/5 w-3/5 rounded-full border border-primary/60" />
            <div className="absolute flex h-2/5 w-2/5 items-center justify-center rounded-full bg-primary/10">
              <MdGraphicEq className="text-6xl text-primary" />
            </div>
          </div>
          <div className="pointer-events-none absolute -right-4 -top-4 hidden rounded-xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-800 sm:block">
            <div className="flex items-center gap-3">
              <div className="size-3 rounded-full bg-green-500" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                Echo Session Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


