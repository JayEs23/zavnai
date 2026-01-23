import Link from "next/link";

const agents = [
  { id: "echo", name: "Echo", blurb: "Voice reflection and awareness." },
  { id: "doyn", name: "Doyn", blurb: "Execution and momentum." },
  { id: "thrive", name: "Thrive", blurb: "Wellbeing and sustainable growth." },
  { id: "tribe", name: "Tribe", blurb: "Collective alignment and community." },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-background-light px-6 py-16 text-slate-900 dark:bg-background-dark dark:text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight">Agents</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
          Explore the core ZAVN cognitive agents and how they help you align
          intention with action.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:border-slate-800 dark:bg-charcoal-custom"
            >
              <h2 className="text-xl font-semibold group-hover:text-primary">
                {agent.name}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {agent.blurb}
              </p>
              <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-primary">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


