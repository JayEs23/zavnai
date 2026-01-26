import { MdCheckCircle, MdGraphicEq } from "react-icons/md";

import Link from "next/link";

export const VoiceInteractionSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="flex flex-col items-center gap-16 overflow-hidden rounded-[3rem] border border-slate-200/60 bg-slate-50 p-8 dark:border-white/5 dark:bg-slate-900/40 lg:flex-row md:p-20 shadow-sm">
        <div className="flex-1 space-y-10">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Experience Voice-First Interaction
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Traditional apps demand your attention. ZAVN only needs your voice.
            Speak your goals, reflect on hurdles, and let the agents handle the
            rest.
          </p>
          <ul className="space-y-5">
            {[
              "Zero-friction interaction flow",
              "Context-aware behavior coaching",
              "End-to-end encrypted voice logs",
            ].map((item) => (
              <li key={item} className="flex items-center gap-4">
                <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MdCheckCircle className="text-lg" />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/science"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-10 py-4.5 font-bold text-white shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-1 dark:bg-primary dark:hover:bg-primary/90"
          >
            Discover the Science
          </Link>
        </div>
        <div className="relative aspect-square w-full max-w-md flex-1">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse-slow h-full w-full rounded-full border border-primary/10" />
            <div className="absolute h-5/6 w-5/6 rounded-full border border-primary/20" />
            <div className="absolute h-4/6 w-4/6 rounded-full border border-primary/30" />
            <div className="absolute flex h-2/5 w-2/5 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-2xl">
              <MdGraphicEq className="text-6xl text-primary animate-pulse" />
            </div>
          </div>
          <div className="pointer-events-none absolute -right-4 -top-4 hidden rounded-2xl border border-slate-200/60 bg-white/90 backdrop-blur-md p-5 shadow-2xl dark:border-white/10 dark:bg-slate-800/90 sm:block transition-all">
            <div className="flex items-center gap-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Echo Session Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


