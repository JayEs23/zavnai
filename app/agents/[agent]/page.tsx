import Link from "next/link";
import { notFound } from "next/navigation";

const agentCopy: Record<
  string,
  { name: string; description: string; focus: string }
> = {
  echo: {
    name: "Echo",
    description:
      "Echo is your voice-first reflection partner, helping you externalize mental models and notice patterns.",
    focus: "Awareness, reflection, clarity.",
  },
  doyn: {
    name: "Doyn",
    description:
      "Doyn turns complex intentions into simple next actions, keeping you moving without friction.",
    focus: "Execution, focus, flow.",
  },
  thrive: {
    name: "Thrive",
    description:
      "Thrive safeguards your wellbeing so performance never comes at the cost of your health.",
    focus: "Energy, sustainability, recovery.",
  },
  tribe: {
    name: "Tribe",
    description:
      "Tribe connects your progress with your people, creating healthy accountability and shared momentum.",
    focus: "Community, accountability, culture.",
  },
};

interface AgentPageProps {
  params: { agent: string };
}

export default function AgentPage({ params }: AgentPageProps) {
  const data = agentCopy[params.agent];

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background-light px-6 py-16 text-slate-900 dark:bg-background-dark dark:text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          ZAVN Agent
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">{data.name}</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          {data.description}
        </p>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-800 dark:bg-charcoal-custom">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Primary focus
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {data.focus}
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Get started with {data.name}
          </Link>
          <Link
            href="/agents"
            className="rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Back to agents
          </Link>
        </div>
      </div>
    </div>
  );
}


