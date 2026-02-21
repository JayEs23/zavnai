"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ENABLE_WAITLIST_MODE } from "@/constants/featureFlags";
import { WaitlistModal } from "./WaitlistModal";
import Link from "next/link";

export const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);

  const navItems = [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Features", href: "/features" },
    { name: "Community", href: "/community" },
    { name: "Pricing", href: "/pricing" },
    { name: "Science", href: "/science" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
        <div className="mx-auto flex h-20 w-full items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/zavn-icon.png"
                alt="ZAVN Logo"
                width={80}
                height={80}
                className="transition-transform group-hover:scale-105"
              />
            </div>
            <span className="text-3xl font-bold tracking-tight text-foreground">
              Z.A.V.N
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {ENABLE_WAITLIST_MODE ? (
              <button
                onClick={() => setWaitlistModalOpen(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-teal-600 text-white rounded-lg font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
              >
                Join Waitlist
              </button>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log In
                </a>
                <a
                  href="/signup"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-teal-600 text-white rounded-lg font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  Get Started
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-white border-t border-border overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border space-y-3">
                  {ENABLE_WAITLIST_MODE ? (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setWaitlistModalOpen(true);
                      }}
                      className="block w-full px-6 py-3 bg-gradient-to-r from-primary to-teal-600 text-white rounded-lg font-semibold text-center shadow-md shadow-primary/20"
                    >
                      Join Waitlist
                    </button>
                  ) : (
                    <>
                      <a
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                      >
                        Log In
                      </a>
                      <a
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full px-6 py-3 bg-gradient-to-r from-primary to-teal-600 text-white rounded-lg font-semibold text-center shadow-md shadow-primary/20"
                      >
                        Get Started
                      </a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <WaitlistModal isOpen={waitlistModalOpen} onClose={() => setWaitlistModalOpen(false)} />
    </>
  );
};
