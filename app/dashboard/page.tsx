'use client';

import React, { useState } from 'react';
import { DoynChat } from '@/components/dashboard/DoynChat';
import { CommitmentsSidebar } from '@/components/dashboard/CommitmentsSidebar';
import { MdMenu, MdClose } from 'react-icons/md';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCommitmentUpdate = () => {
    // Trigger refresh of commitments sidebar
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border-subtle bg-card-bg">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">ZAVN Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Chat with Doyn to manage your commitments
            </p>
          </div>
          
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Doyn Chat - Main Area */}
        <div className="flex-1 flex flex-col bg-background">
          <DoynChat onCommitmentUpdate={handleCommitmentUpdate} />
        </div>

        {/* Commitments Sidebar */}
        <div
          className={`
            w-full lg:w-96 border-l border-border-subtle bg-card-bg flex-shrink-0
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
