'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Truck, FileText, Users, Briefcase, 
  DollarSign, Sparkles, Navigation, ShieldCheck, ChevronRight,
  PlusCircle, BarChart3, Layers
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const menuGroups = [
    {
      group: 'MAIN DASHBOARD',
      items: [
        { label: 'Command Center', href: '/dashboard', icon: LayoutDashboard, badge: 'Live' },
        { label: 'Dispatch Board', href: '/loads', icon: Truck, badge: '5' },
      ]
    },
    {
      group: 'LOGISTICS & AI ENGINES',
      items: [
        { label: 'Gemini AI OCR Scanner', href: '/documents', icon: Sparkles, badge: 'AI' },
        { label: 'Carrier Compliance Hub', href: '/carriers', icon: Briefcase, badge: null },
        { label: 'Shipper CRM & Credits', href: '/shippers', icon: Users, badge: null },
        { label: 'Accounting & Settlements', href: '/accounting', icon: DollarSign, badge: 'A/R' },
      ]
    }
  ];

  return (
    <aside className="w-64 h-screen bg-[#1c2434] text-[#dee4ee] flex flex-col justify-between p-4 flex-shrink-0 z-40 border-r border-[#2e3a47]">
      {/* Brand Header */}
      <div className="space-y-6">
        <Link href="/" className="flex items-center gap-3 px-2 pt-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <Truck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              FreightFlow <span className="text-orange-400 font-mono text-xs px-1.5 py-0.2 rounded bg-orange-500/20 border border-orange-500/30">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 -mt-0.5 tracking-wider uppercase font-bold">TailAdmin Logistics</span>
          </div>
        </Link>

        {/* Navigation Groups */}
        <nav className="space-y-5">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.group}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-[#333a48]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badge === 'AI'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'bg-[#333a48] text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Sandbox & Interactive Mode Footer */}
      <div className="space-y-3 pt-4 border-t border-[#2e3a47]">
        <div className="p-3 bg-[#24303f] border border-[#2e3a47] rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              TailAdmin Sandboxes
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Switch simulation profiles with preloaded test freight.</p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <Link
              href="/demo/broker"
              className="py-1.5 px-2 bg-[#1c2434] hover:bg-orange-500 hover:text-white text-slate-200 text-center rounded-lg border border-[#2e3a47] transition-all font-semibold"
            >
              Broker 3PL
            </Link>
            <Link
              href="/demo/dispatcher"
              className="py-1.5 px-2 bg-[#1c2434] hover:bg-orange-500 hover:text-white text-slate-200 text-center rounded-lg border border-[#2e3a47] transition-all font-semibold"
            >
              Dispatcher
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
          <span className="font-mono">v2.8 TailAdmin OS</span>
          <span className="flex items-center gap-1 text-orange-400 font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
