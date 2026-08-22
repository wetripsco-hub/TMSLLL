'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, Briefcase, Sparkles, ArrowRight, ShieldCheck, RefreshCw, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BookDemoModal } from '@/components/modals/BookDemoModal';

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const isBroker = pathname.includes('/broker');
  const isDispatcher = pathname.includes('/dispatcher');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors">
      {/* Top Interactive Sandbox Announcement Banner */}
      <div className="bg-card border-b border-orange-200 dark:border-orange-500/30 px-4 py-2.5 text-xs text-foreground sticky top-0 z-50 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping flex-shrink-0" />
            <span className="font-extrabold text-foreground">
              {isBroker ? '3PL Freight Brokerage Sandbox' : 'Independent Dispatcher Fleet Sandbox'}
            </span>
            <span className="hidden md:inline text-muted-foreground">• Real-time interactive simulation with preloaded mock ledgers.</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="flex items-center bg-muted border border-border rounded-xl p-1 text-[11px] font-bold">
              <Link
                href="/demo/broker"
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  isBroker ? 'bg-orange-500 text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>Broker Mode</span>
              </Link>
              <Link
                href="/demo/dispatcher"
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  isDispatcher ? 'bg-orange-500 text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Truck className="w-3 h-3" />
                <span>Dispatcher Mode</span>
              </Link>
            </div>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="hidden lg:flex items-center gap-1 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-[11px] transition-all shadow-xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>Book Strategy Call</span>
            </button>

            <Link
              href="/dashboard"
              className="flex items-center gap-1 px-3.5 py-1.5 bg-card hover:bg-muted text-foreground font-bold rounded-xl text-[11px] border border-border transition-colors"
            >
              <LayoutDashboard className="w-3 h-3 text-orange-500" />
              <span>Full App</span>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Demo Page Content */}
      <div className="flex-1">
        {children}
      </div>

      <BookDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
