import Link from "next/link";

export const CtaSection = () => {
  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-8 text-4xl font-extrabold tracking-tight leading-tight md:text-6xl">
          Start your alignment <br /> journey today.
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-xl text-slate-600 dark:text-slate-400">
          Join 50,000+ individuals using behavioral science to close the gap
          between who they are and who they want to be.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-2xl bg-primary px-10 py-5 text-xl font-bold text-white shadow-2xl shadow-primary/40 transition-transform hover:scale-105"
          >
            Get Started for Free
          </Link>
          <Link
            href="/contact"
            className="rounded-2xl border border-slate-200 bg-white px-10 py-5 text-xl font-bold transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Speak to Sales
          </Link>
        </div>
      </div>
    </section>
  );
};


