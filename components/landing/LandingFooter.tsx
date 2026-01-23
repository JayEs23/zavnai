import Link from "next/link";
import { MdBolt, MdShare, MdLanguage } from "react-icons/md";

export const LandingFooter = () => {
  return (
    <footer className="bg-slate-50 px-6 py-16 dark:bg-charcoal-custom dark:border-t dark:border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 md:flex-row md:items-center">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-6 items-center justify-center rounded bg-primary text-white">
              <MdBolt className="text-sm" />
            </div>
            <h2 className="text-lg font-extrabold tracking-tight">ZAVN</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} ZAVN Behavior Alignment. All rights
            reserved.
          </p>
        </div>
        <nav className="flex flex-wrap gap-8">
          <Link
            className="text-sm font-medium transition-colors hover:text-primary"
            href="/privacy"
          >
            Privacy
          </Link>
          <Link
            className="text-sm font-medium transition-colors hover:text-primary"
            href="/terms"
          >
            Terms
          </Link>
          <Link
            className="text-sm font-medium transition-colors hover:text-primary"
            href="/blog"
          >
            Blog
          </Link>
          <Link
            className="text-sm font-medium transition-colors hover:text-primary"
            href="/contact"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-slate-200 transition-all hover:bg-primary/10 hover:text-primary dark:border-slate-800"
          >
            <MdShare className="text-lg" />
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-slate-200 transition-all hover:bg-primary/10 hover:text-primary dark:border-slate-800"
          >
            <MdLanguage className="text-lg" />
          </button>
        </div>
      </div>
    </footer>
  );
};


