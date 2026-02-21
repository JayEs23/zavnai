"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Science", href: "/science" },
  ],
  Company: [
    { name: "About", href: "/blog" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
  Resources: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Documentation", href: "/blog" },
    { name: "Support", href: "/contact" },
  ],
};

export const LandingFooter = () => {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/zavn-icon.png"
                alt="ZAVN Logo"
                width={36}
                height={36}
              />
              <span className="text-xl font-bold">ZAVN</span>
            </Link>
            <p className="text-sm text-white/70 mb-4">
              Close the gap between intention and action.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="/contact"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} ZAVN. All rights reserved.
            </p>
            <p className="text-sm text-white/70">
              Built with behavioral science and AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
