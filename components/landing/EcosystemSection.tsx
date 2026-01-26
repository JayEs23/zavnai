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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {agents.map((agent) => (
          <article
            key={agent.id}
            id={agent.id}
            className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:border-white/5 dark:bg-charcoal-custom dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
          >
            <div className="absolute right-0 top-0 p-6 opacity-[0.03] transition-opacity group-hover:opacity-[0.07] dark:opacity-10 dark:group-hover:opacity-20">
              <agent.BadgeIcon className="text-8xl" />
            </div>
            <div className="mb-8 flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:rotate-[10deg] group-hover:scale-110">
              <agent.Icon className="text-2xl" />
            </div>
            <h3 className="mb-3 text-2xl font-bold tracking-tight">{agent.title}</h3>
            <p className="mb-8 text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
              {agent.description}
            </p>
            <Link
              href={`/agents/${agent.id}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all"
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


