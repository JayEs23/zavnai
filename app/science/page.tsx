export default function SciencePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-16 text-[var(--foreground)] transition-colors duration-300">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
          Behind ZAVN
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          The science of behavior alignment
        </h1>
        <p className="mt-4 text-lg text-[var(--muted-foreground)]">
          ZAVN blends behavioral science, coaching psychology, and conversational
          AI to help you close the gap between intention and action. This is a
          high-level primer you can refine later with your own research layer.
        </p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--foreground)]/80">
          <p>
            Echo sessions externalize your thinking so cognitive distortions and
            hidden assumptions become visible. Doyn turns those clarified
            intentions into concrete, low-friction next actions. Thrive guards
            energy and capacity so execution is sustainable. Tribe connects that
            progress with the people who matter, creating healthy accountability
            loops.
          </p>
          <p>
            Under the hood, this looks like stateful conversations, goal
            formation, implementation intentions, and ongoing feedback loops—
            orchestrated by agents that remember where you are in the process.
          </p>
        </div>
      </div>
    </div>
  );
}


