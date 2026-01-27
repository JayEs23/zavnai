import Link from "next/link";
import { MdShare, MdLanguage } from "react-icons/md";
import Image from "next/image";

export const LandingFooter = () => {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--background)] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
          <div className="max-w-xs space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative size-12 rounded-xl icon-container">
                <Image
                  src="/zavn-icon.png"
                  alt="ZAVN logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight dark:text-white">ZAVN</h2>
            </Link>
            <p className="text-sm text-body">
              A voice-led behavior alignment system. Harnessing AI-driven behavioral science through natural conversation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--foreground)]">Product</h3>
              <nav className="flex flex-col gap-3">
                {["Echo", "Doyn", "Thrive", "Tribe"].map(item => (
                  <Link key={item} href={`#${item.toLowerCase()}`} className="nav-link">{item}</Link>
                ))}
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">Company</h3>
              <nav className="flex flex-col gap-3">
                {["About", "Science", "Blog", "Contact"].map(item => (
                  <Link key={item} href={`/${item.toLowerCase()}`} className="nav-link">{item}</Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-8 border-t border-slate-100 pt-8 dark:border-white/5 sm:flex-row">
          <p className="text-sm text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} ZAVN. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="nav-link">Privacy</Link>
            <Link href="/terms" className="nav-link">Terms</Link>
            <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-subtle)]">
              <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"><MdShare /></button>
              <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"><MdLanguage /></button>
            </div>
          </div>
        </div>
      </div >
    </footer >
  );
};


