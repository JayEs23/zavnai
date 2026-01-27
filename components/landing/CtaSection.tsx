import Link from "next/link";

export const CtaSection = () => {
  return (
    <section className="px-6 py-32 sm:py-48">
      <div className="mx-auto max-w-5xl rounded-[3.5rem] bg-[var(--foreground)] px-8 py-20 text-center shadow-2xl md:px-16 md:py-32 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[var(--background)]/10 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[var(--background)]/5 blur-[100px]" />

        <div className="relative z-10">
          <h2 className="mb-8 text-4xl font-extrabold tracking-tight leading-tight text-[var(--background)] md:text-7xl">
            Start your alignment <br /> journey today.
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-xl text-[var(--background)]/70">
            Join a growing community using behavioral science to close the gap
            between who they are and who they want to be.
          </p>
          <div className="flex flex-col justify-center items-center gap-6 sm:flex-row">
            <Link
              href="/signup"
              className="group relative px-12 py-5 text-xl btn-primary bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--background)]/90"
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


