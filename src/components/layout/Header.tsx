'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, Search, UserCircle, Plus, ShieldCheck, 
  Sparkles, Menu, Check, ChevronDown, MessageSquare
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CarrierVerifyModal } from '@/components/modals/CarrierVerifyModal';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-border bg-card/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 text-foreground sticky top-0 z-30 transition-colors shadow-xs">
        {/* Left Side: Mobile Menu + Search */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground md:hidden hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-60 sm:w-80 md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Type to search (Load #, MC#, Shipper, Carrier)..."
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Right Side: Action Badges + Theme Toggle + Notifications + User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Carrier Verify */}
          <button
            onClick={() => setIsVerifyOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 text-xs font-bold rounded-xl border border-orange-200 dark:border-orange-500/30 transition-colors"
            title="Verify Carrier Operating Authority & Insurance"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify MC#</span>
          </button>

          {/* Quick Create Load CTA */}
          <Link
            href="/loads/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Load</span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted relative border border-border transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-1.5 right-1.5 ring-2 ring-card" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl p-4 text-xs space-y-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-bold text-foreground">Operational Alerts</span>
                  <span className="text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400 px-2 py-0.5 rounded-full font-mono font-bold">
                    3 New
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 bg-orange-50/60 dark:bg-muted/60 rounded-xl space-y-0.5 border border-orange-100 dark:border-border">
                    <span className="font-bold text-foreground block">Carrier Insurance Notice</span>
                    <p className="text-[11px] text-muted-foreground">Eagle Express (MC 761920) insurance expires in 17 days.</p>
                  </div>
                  <div className="p-2.5 bg-muted/60 rounded-xl space-y-0.5 border border-border">
                    <span className="font-bold text-foreground block">Driver GPS Check-in</span>
                    <p className="text-[11px] text-muted-foreground">Marcus Vance arrived at Jackson, MS waypoint (Load #FF-88902).</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown / Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-border">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm shadow-orange-500/20">
              AD
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-foreground leading-tight">Alex Danvers</span>
              <span className="text-[10px] text-orange-600 dark:text-orange-400 font-mono font-semibold">Senior Dispatcher</span>
            </div>
          </div>
        </div>
      </header>

      <CarrierVerifyModal isOpen={isVerifyOpen} onClose={() => setIsVerifyOpen(false)} />
    </>
  );
}

export default Header;
