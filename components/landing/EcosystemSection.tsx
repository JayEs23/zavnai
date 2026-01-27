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
          <span className="mb-4 block text-xs font-bold tracking-widest text-[var(--foreground)]">
            The Ecosystem
          </span>
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Four pillars of behavior alignment
          </h2>
          <p className="text-lg text-body">
            Designed to help you align your daily actions with your deepest
            intentions using specialized cognitive agents.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full border border-slate-200 p-3 transition-all hover:bg-black/5 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-white/5 dark:hover:text-white">
            <MdChevronLeft className="text-xl" />
          </button>
          <button className="rounded-full border border-slate-200 p-3 transition-all hover:bg-black/5 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-white/5 dark:hover:text-white">
            <MdChevronRight className="text-xl" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {agents.map((agent) => (
          <article
            key={agent.id}
            id={agent.id}
            className="group card"
          >
            <div className="absolute right-0 top-0 p-6 opacity-[0.03] transition-opacity group-hover:opacity-[0.07] dark:opacity-10 dark:group-hover:opacity-20">
              <agent.BadgeIcon className="text-8xl" />
            </div>
            <div className="mb-8 size-14 rounded-2xl icon-container group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)] group-hover:rotate-[10deg] group-hover:scale-110 transition-all duration-500">
              <agent.Icon className="text-2xl" />
            </div>
            <h3 className="mb-3 text-2xl font-bold tracking-tight">{agent.title}</h3>
            <p className="mb-8 text-[15px] text-body">
              {agent.description}
            </p>
            <Link
              href={`/agents/${agent.id}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--foreground)] group-hover:gap-3 transition-all"
            >
              <span>Explore {agent.title}</span>
              <MdArrowForward className="text-base" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};


