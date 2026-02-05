'use client';

import React, { useState } from 'react';
import { DoynChat } from '@/components/dashboard/DoynChat';
import { CommitmentsSidebar } from '@/components/dashboard/CommitmentsSidebar';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCommitmentUpdate = () => {
    // Trigger refresh of commitments sidebar
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-border bg-white shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/zavn-icon.png"
                alt="ZAVN Logo"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-foreground">ZAVN</span>
            </Link>
            <div className="hidden sm:block w-px h-8 bg-border" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                Chat with Doyn to manage your commitments
              </p>
            </div>
          </div>
          
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-xl transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Doyn Chat - Main Area */}
        <div className="flex-1 flex flex-col bg-muted/30">
          <DoynChat onCommitmentUpdate={handleCommitmentUpdate} />
        </div>

        {/* Commitments Sidebar */}
        <div
          className={`
            w-full lg:w-96 border-l border-border bg-white flex-shrink-0
            ${sidebarOpen ? 'block' : 'hidden lg:block'}
            absolute lg:relative inset-y-0 right-0 z-20 lg:z-0
          `}
        >
          <CommitmentsSidebar refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
