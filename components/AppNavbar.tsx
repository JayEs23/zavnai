'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  MdDashboard,
  MdRecordVoiceOver,
  MdFlag,
  MdPeople,
  MdFavorite,
  MdSettings,
  MdLogout,
  MdInsights,
} from 'react-icons/md';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { href: '/echo', label: 'Echo', icon: MdRecordVoiceOver },
  { href: '/goals', label: 'Goals', icon: MdFlag },
  { href: '/insights', label: 'Growth', icon: MdInsights },
  { href: '/tribe', label: 'Tribe', icon: MdPeople },
  { href: '/thrive', label: 'Thrive', icon: MdFavorite },
  { href: '/settings', label: 'Settings', icon: MdSettings },
];

export default function AppNavbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
          <Image src="/zavn-icon.png" alt="ZAVN" width={32} height={32} />
          <span className="text-lg font-bold text-foreground hidden sm:inline">ZAVN</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon size={18} />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
          title="Sign out"
        >
          <MdLogout size={18} />
          <span className="hidden lg:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}

