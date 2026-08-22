'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Truck, FileText, Users, Briefcase, 
  DollarSign, Sparkles, Navigation, ShieldCheck, ChevronRight,
  PlusCircle, BarChart3, Layers, UserCheck, RefreshCw, LogOut
} from 'lucide-react';
import { authService } from '@/lib/services/authService';
import { UserProfile, UserRole } from '@/types/database.types';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const active = authService.getCurrentUser();
    setUser(active);
  }, []);

  const isDispatcher = pathname.startsWith('/dispatcher') || user?.role === 'dispatcher';
  const role: UserRole = isDispatcher ? 'dispatcher' : 'broker';

  const handleSwitchRole = (newRole: UserRole) => {
    const updated = authService.setDemoSession(newRole);
    setUser(updated);
    if (newRole === 'dispatcher') {
      router.push('/dispatcher/dashboard');
    } else {
      router.push('/broker/dashboard');
    }
  };

  const brokerMenuGroups = [
    {
      group: '3PL BROKERAGE OPERATIONS',
      items: [
        { label: 'Broker Command Center', href: '/broker/dashboard', icon: LayoutDashboard, badge: 'Live' },
        { label: 'Dispatch Board', href: '/broker/loads', icon: Truck, badge: '5 Loads' },
        { label: 'Shipper CRM & Credits', href: '/broker/shippers', icon: Users, badge: null },
        { label: 'Carrier Compliance Hub', href: '/broker/carriers', icon: Briefcase, badge: 'FMCSA' },
      ],
    },
    {
      group: 'FINANCIALS & AI AUTOMATION',
      items: [
        { label: 'Accounting & Factoring', href: '/broker/accounting', icon: DollarSign, badge: 'A/R & A/P' },
        { label: 'Gemini AI OCR Scanner', href: '/documents', icon: Sparkles, badge: 'AI OCR' },
      ],
    },
  ];

  const dispatcherMenuGroups = [
    {
      group: 'FLEET DISPATCH OPERATIONS',
      items: [
        { label: 'Fleet Command Center', href: '/dispatcher/dashboard', icon: LayoutDashboard, badge: 'Live' },
        { label: 'My Trucks & Drivers', href: '/dispatcher/my-trucks', icon: Truck, badge: '4 Units' },
        { label: 'My Assigned Loads', href: '/dispatcher/loads', icon: Briefcase, badge: 'Active' },
        { label: 'Live GPS Telematics', href: '/dispatcher/tracking', icon: Navigation, badge: 'GPS' },
      ],
    },
    {
      group: 'INTELLIGENCE & TOOLS',
      items: [
        { label: 'Gemini AI OCR Scanner', href: '/documents', icon: Sparkles, badge: 'AI OCR' },
      ],
    },
  ];

  const activeMenuGroups = isDispatcher ? dispatcherMenuGroups : brokerMenuGroups;

  return (
    <aside className="w-64 h-screen bg-[#1c2434] text-[#dee4ee] flex flex-col justify-between p-4 flex-shrink-0 z-40 border-r border-[#2e3a47] font-sans">
      {/* Brand Header */}
      <div className="space-y-5 overflow-y-auto pr-1">
        <Link href="/" className="flex items-center gap-3 px-2 pt-2 group">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <Truck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              FreightFlow <span className="text-orange-400 font-mono text-xs px-1.5 py-0.2 rounded bg-orange-500/20 border border-orange-500/30">AI</span>
            </span>
            <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
              {isDispatcher ? 'Dispatcher Portal' : 'Brokerage 3PL Portal'}
            </span>
          </div>
        </Link>

        {/* Navigation Groups */}
        <nav className="space-y-5">
          {activeMenuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.group}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/broker/dashboard' && item.href !== '/dispatcher/dashboard' && pathname.startsWith(item.href));

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
                          : item.badge === 'AI OCR'
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

      {/* Role Switcher & User Profile Footer */}
      <div className="space-y-3 pt-3 border-t border-[#2e3a47]">
        <div className="p-2.5 bg-[#24303f] border border-[#2e3a47] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-orange-400" />
              Active Workspace
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
              {role}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleSwitchRole('broker')}
              className={`py-1.5 px-2 rounded-lg text-center font-bold transition-all border ${
                !isDispatcher
                  ? 'bg-orange-500 text-white border-orange-400 shadow-xs'
                  : 'bg-[#1c2434] text-slate-300 border-[#2e3a47] hover:text-white'
              }`}
            >
              Broker
            </button>
            <button
              type="button"
              onClick={() => handleSwitchRole('dispatcher')}
              className={`py-1.5 px-2 rounded-lg text-center font-bold transition-all border ${
                isDispatcher
                  ? 'bg-orange-500 text-white border-orange-400 shadow-xs'
                  : 'bg-[#1c2434] text-slate-300 border-[#2e3a47] hover:text-white'
              }`}
            >
              Dispatcher
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
          <Link href="/login" className="hover:text-orange-400 flex items-center gap-1 font-semibold transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Account</span>
          </Link>
          <span className="flex items-center gap-1 text-orange-400 font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            v2.8 Live
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
