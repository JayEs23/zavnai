import Link from "next/link";

const agents = [
  { id: "echo", name: "Echo", blurb: "Voice reflection and awareness." },
  { id: "doyn", name: "Doyn", blurb: "Execution and momentum." },
  { id: "thrive", name: "Thrive", blurb: "Wellbeing and sustainable growth." },
  { id: "tribe", name: "Tribe", blurb: "Collective alignment and community." },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-16 text-[var(--foreground)] transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight">Agents</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted-foreground)]">
          Explore the core ZAVN cognitive agents and how they help you align
          intention with action.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="card group transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold group-hover:text-[var(--primary)] text-[var(--foreground)]">
                {agent.name}
              </h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {agent.blurb}
              </p>
              <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


