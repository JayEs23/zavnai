import Link from "next/link";
import { MdBolt, MdShare, MdLanguage } from "react-icons/md";

export const LandingFooter = () => {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-20 dark:border-white/5 dark:bg-background-dark/50">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
          <div className="max-w-xs space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MdBolt className="text-xl" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight dark:text-white">ZAVN</h2>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              The world&apos;s first voice-led behavior alignment system. Harnessing AI-driven behavioral science through natural conversation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">Product</h3>
              <nav className="flex flex-col gap-3">
                {["Echo", "Doyn", "Thrive", "Tribe"].map(item => (
                  <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 transition-colors">{item}</Link>
                ))}
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">Company</h3>
              <nav className="flex flex-col gap-3">
                {["About", "Science", "Blog", "Contact"].map(item => (
                  <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 transition-colors">{item}</Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-8 border-t border-slate-100 pt-8 dark:border-white/5 sm:flex-row">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} ZAVN. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-primary transition-colors">Terms</Link>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10">
              <button className="text-slate-400 hover:text-primary transition-colors"><MdShare /></button>
              <button className="text-slate-400 hover:text-primary transition-colors"><MdLanguage /></button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


