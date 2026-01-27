import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../ThemeToggle";

export const LandingNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-12 rounded-xl transition-transform group-hover:scale-110 icon-container">
            <Image
              src="/zavn-icon.png"
              alt="ZAVN logo"
              fill
              className="object-contain p-1.5"
              priority
            />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/70">
            ZAVN
          </h2>
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {["Echo", "Doyn", "Thrive", "Tribe"].map((item) => (
            <a
              key={item}
              className="nav-link"
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
            className="nav-link font-bold text-[var(--foreground)] hover:text-[var(--primary)]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="hidden sm:inline-flex btn-primary px-6 py-2.5 text-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};


