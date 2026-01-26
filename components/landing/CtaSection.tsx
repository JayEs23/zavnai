import Link from "next/link";

export const CtaSection = () => {
  return (
    <section className="px-6 py-32 sm:py-48">
      <div className="mx-auto max-w-5xl rounded-[3.5rem] bg-slate-900 px-8 py-20 text-center shadow-2xl dark:bg-white/5 md:px-16 md:py-32 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative z-10">
          <h2 className="mb-8 text-4xl font-extrabold tracking-tight leading-tight text-white md:text-7xl">
            Start your alignment <br /> journey today.
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-xl text-slate-300 dark:text-slate-400">
            Join 50,000+ individuals using behavioral science to close the gap
            between who they are and who they want to be.
          </p>
          <div className="flex flex-col justify-center items-center gap-6 sm:flex-row">
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center rounded-full bg-primary px-12 py-5 text-xl font-bold text-white shadow-xl shadow-primary/40 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95"
            >
              Get Started for Free
            </Link>
            <Link
              href="/contact"
              className="text-lg font-bold text-white/80 hover:text-white transition-colors"
            >
              Book a Demo &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};


