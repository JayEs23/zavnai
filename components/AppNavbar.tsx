'use client';

import React, { useState, useEffect } from 'react';
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
  MdNotifications,
} from 'react-icons/md';
import { goalsApi, CommitmentSummary } from '@/services/goalsApi';

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
  const [urgentCount, setUrgentCount] = useState(0);

  // Poll for overdue / approaching commitments
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const commitments: CommitmentSummary[] = await goalsApi.getTodaysCommitments();
        const now = Date.now();
        const count = commitments.filter((c) => {
          if (c.status !== 'pending') return false;
          const hoursLeft = (new Date(c.due_at).getTime() - now) / (1000 * 60 * 60);
          return hoursLeft < 2; // overdue or < 2 hours
        }).length;
        if (!cancelled) setUrgentCount(count);
      } catch {
        // silently ignore — navbar shouldn't break on API failure
      }
    };

    check();
    const interval = setInterval(check, 60_000); // re-check every minute
    return () => { cancelled = true; clearInterval(interval); };
  }, [pathname]); // re-check on route change

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

        {/* Notification Bell + Sign Out */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Notification bell */}
          <Link
            href="/dashboard"
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={urgentCount > 0 ? `${urgentCount} commitment${urgentCount > 1 ? 's' : ''} need attention` : 'No urgent commitments'}
          >
            <MdNotifications size={20} />
            {urgentCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                {urgentCount}
              </span>
            )}
          </Link>

          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Sign out"
          >
            <MdLogout size={18} />
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

