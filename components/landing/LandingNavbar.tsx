import Image from "next/image";
import Link from "next/link";

export const LandingNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background-light/80 dark:bg-background-dark/80 glass-nav">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded bg-primary/5">
            <Image
              src="/zavn-icon.png"
              alt="ZAVN logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">ZAVN</h2>
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          <a
            className="text-sm font-medium transition-colors hover:text-primary"
            href="#echo"
          >
            Echo
          </a>
          <a
            className="text-sm font-medium transition-colors hover:text-primary"
            href="#doyn"
          >
            Doyn
          </a>
          <a
            className="text-sm font-medium transition-colors hover:text-primary"
            href="#thrive"
          >
            Thrive
          </a>
          <a
            className="text-sm font-medium transition-colors hover:text-primary"
            href="#tribe"
          >
            Tribe
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};


