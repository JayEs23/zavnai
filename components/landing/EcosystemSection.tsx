import Link from "next/link";
import {
  MdMic,
  MdContentCut,
  MdFavorite,
  MdGroup,
  MdGraphicEq,
  MdBolt,
  MdSpa,
  MdChevronLeft,
  MdChevronRight,
  MdArrowForward,
} from "react-icons/md";

const agents = [
  {
    id: "echo",
    Icon: MdMic,
    BadgeIcon: MdGraphicEq,
    title: "Echo",
    description:
      "The Voice Interface. Advanced reflection and awareness tools that listen to your mental models.",
  },
  {
    id: "doyn",
    Icon: MdContentCut,
    BadgeIcon: MdBolt,
    title: "Doyn",
    description:
      "Execution and productivity focus. Turning complex plans into immediate, friction-free movement.",
  },
  {
    id: "thrive",
    Icon: MdFavorite,
    BadgeIcon: MdSpa,
    title: "Thrive",
    description:
      "Wellbeing and sustainable growth. Ensuring performance doesn't come at the cost of your health.",
  },
  {
    id: "tribe",
    Icon: MdGroup,
    BadgeIcon: MdGroup,
    title: "Tribe",
    description:
      "Collective alignment. Social accountability features that link your progress with your community.",
  },
];

export const EcosystemSection = () => {
  return (
    <section className="mx-auto max-w-7xl border-t border-slate-200 px-6 py-24 dark:border-white/5 lg:px-10">
      <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="mb-4 block text-xs font-bold tracking-widest text-primary">
            The Ecosystem
          </span>
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Four pillars of behavior alignment
          </h2>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Designed to help you align your daily actions with your deepest
            intentions using specialized cognitive agents.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full border border-slate-200 p-3 transition-all hover:bg-primary/10 hover:text-primary dark:border-slate-800">
            <MdChevronLeft className="text-xl" />
          </button>
          <button className="rounded-full border border-slate-200 p-3 transition-all hover:bg-primary/10 hover:text-primary dark:border-slate-800">
            <MdChevronRight className="text-xl" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {agents.map((agent) => (
          <article
            key={agent.id}
            id={agent.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl dark:border-slate-800 dark:bg-charcoal-custom"
          >
            <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
              <agent.BadgeIcon className="text-6xl" />
            </div>
            <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
              <agent.Icon className="text-xl" />
            </div>
            <h3 className="mb-3 text-xl font-bold">{agent.title}</h3>
            <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-400">
              {agent.description}
            </p>
            <Link
              href={`/agents/${agent.id}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-transform group-hover:translate-x-2"
            >
              Learn More
              <MdArrowForward className="text-sm" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};


