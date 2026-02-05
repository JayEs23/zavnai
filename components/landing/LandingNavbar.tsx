"use client";

import Link from "next/link";
import Image from "next/image";

export const LandingNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/zavn-icon.png"
            alt="ZAVN Logo"
            width={40}
            height={40}
            className="transition-transform group-hover:scale-105"
          />
          <span className="text-2xl font-bold tracking-tight text-foreground">
            ZAVN
          </span>
        </Link>
        
        <nav className="hidden items-center gap-8 lg:flex">
          {[
            { name: "How It Works", href: "#how-it-works" },
            { name: "Features", href: "#features" },
            { name: "Community", href: "#community" },
            { name: "Pricing", href: "#pricing" },
          ].map((item) => (
            <a
              key={item.name}
              className="nav-link"
              href={item.href}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="nav-link font-semibold"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="btn-primary"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};
