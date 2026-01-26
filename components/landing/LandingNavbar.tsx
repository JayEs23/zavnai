import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../ThemeToggle";

export const LandingNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-background-dark/80 glass-nav transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
            <Image
              src="/zavn-icon.png"
              alt="ZAVN logo"
              fill
              className="object-contain p-1.5"
              priority
            />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/70">
            ZAVN
          </h2>
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {["Echo", "Doyn", "Thrive", "Tribe"].map((item) => (
            <a
              key={item}
              className="text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors"
              href={`#${item.toLowerCase()}`}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 sm:gap-6">
          <ThemeToggle />
          <div className="hidden h-6 w-[1px] bg-slate-200 dark:bg-white/10 sm:block" />
          <Link
            href="/login"
            className="text-sm font-bold text-slate-700 hover:text-primary dark:text-slate-200 dark:hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="hidden sm:inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};


