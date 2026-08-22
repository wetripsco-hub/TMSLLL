'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Users, Truck, DollarSign, Activity, 
  Server, Database, Sparkles, ArrowUpRight, TrendingUp, 
  CheckCircle2, Clock, BarChart3, AlertCircle, RefreshCw, ChevronRight
} from 'lucide-react';
import { authService } from '@/lib/services/authService';
import { loadService } from '@/lib/services/loadService';
import { UserProfile } from '@/types/database.types';
import { DispatchLoad } from '@/types/tms';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loads, setLoads] = useState<DispatchLoad[]>([]);
  const [activeGrowthMetric, setActiveGrowthMetric] = useState<'gmv' | 'users'>('gmv');

  useEffect(() => {
    authService.getUsers().then(setUsers);
    loadService.getLoads().then(setLoads);
  }, []);

  const brokersCount = users.filter((u) => u.role === 'broker').length;
  const dispatchersCount = users.filter((u) => u.role === 'dispatcher').length;
  const totalPlatformGMV = loads.reduce((acc, l) => acc + l.financials.shipperRate, 0);
  const activeOrdersCount = loads.filter((l) => l.status === 'in_transit' || l.status === 'dispatched' || l.status === 'booked').length;

  // Platform Growth Trend Data (Last 6 Months)
  const monthlyGrowthData = [
    { month: 'Oct 2025', gmv: 84000, loads: 28, users: 4 },
    { month: 'Nov 2025', gmv: 142000, loads: 46, users: 8 },
    { month: 'Dec 2025', gmv: 210000, loads: 68, users: 14 },
    { month: 'Jan 2026', gmv: 345000, loads: 112, users: 22 },
    { month: 'Feb 2026', gmv: 490000, loads: 158, users: 35 },
    { month: 'Mar 2026', gmv: 620000, loads: 204, users: 48 },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Platform Header & Age Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              FreightFlow Global Platform Cockpit
            </h1>
            <span className="text-[10px] font-mono font-bold bg-purple-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
              SUPER ADMIN
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Multi-tenant infrastructure health, cross-tenant freight volume, user growth metrics, and audit logs.
          </p>
        </div>

        {/* Platform Uptime & Age Metric */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-card border border-border rounded-xl text-xs font-mono flex items-center gap-2 shadow-xs">
            <Server className="w-4 h-4 text-purple-500" />
            <div>
              <span className="text-[10px] text-muted-foreground block font-sans font-semibold">System Age</span>
              <strong className="text-foreground">184 Days Live (v2.8)</strong>
            </div>
          </div>

          <div className="p-2.5 bg-card border border-border rounded-xl text-xs font-mono flex items-center gap-2 shadow-xs">
            <Activity className="w-4 h-4 text-emerald-500" />
            <div>
              <span className="text-[10px] text-muted-foreground block font-sans font-semibold">Global Uptime</span>
              <strong className="text-emerald-600 dark:text-emerald-400">99.98% Operational</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Global Administrative KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Total Platform Users</span>
            <span className="text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              Multi-Tenant
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            {users.length} Accounts
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            {brokersCount} Brokers (3PL) • {dispatchersCount} Dispatchers
          </p>
        </div>

        <div className="bg-card border border-purple-200 dark:border-purple-500/30 rounded-2xl p-5 shadow-md shadow-purple-500/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-700 dark:text-purple-400 font-extrabold uppercase tracking-wider">
            <span>Total Gross GMV Processed</span>
            <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-mono font-bold">
              +44.2% MoM
            </span>
          </div>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
            ${totalPlatformGMV.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-purple-700/80 font-medium">Cumulative shipper billing volume</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Active Dispatches & Orders</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              Live Fleet
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            {activeOrdersCount} Loads
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Across all broker & dispatcher tenants</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>AI Vision OCR Throughput</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              Gemini 2.0
            </span>
          </div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
            1,420 Scans
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">99.4% optical confidence accuracy</p>
        </div>
      </div>

      {/* Item 5: Multi-Month Platform Growth Chart */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <h2 className="text-base font-extrabold text-foreground">Platform Growth & GMV Trajectory</h2>
            </div>
            <p className="text-xs text-muted-foreground">Historical volume expansion over past 6 months</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveGrowthMetric('gmv')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeGrowthMetric === 'gmv'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Gross Freight GMV ($)
            </button>
            <button
              type="button"
              onClick={() => setActiveGrowthMetric('users')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeGrowthMetric === 'users'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Registered Tenancies
            </button>
          </div>
        </div>

        {/* Growth Visualizer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {monthlyGrowthData.map((data, i) => {
            const heightPercent = activeGrowthMetric === 'gmv' ? (data.gmv / 620000) * 100 : (data.users / 48) * 100;

            return (
              <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-background border border-border">
                <span className="text-xs font-mono font-bold text-foreground">
                  {activeGrowthMetric === 'gmv' ? `$${(data.gmv / 1000).toFixed(0)}k` : `${data.users} Users`}
                </span>

                <div className="w-full h-32 bg-muted/40 rounded-lg flex items-end p-1">
                  <div
                    style={{ height: `${Math.max(15, heightPercent)}%` }}
                    className="w-full rounded-md bg-gradient-to-t from-purple-600 to-indigo-500 shadow-sm transition-all duration-500"
                  />
                </div>

                <span className="text-[10px] font-mono text-muted-foreground">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Infrastructure Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-500" />
              Supabase PostgreSQL Core
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              18ms Latency
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">Row Level Security active across all 6 core tables.</p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Gemini 2.0 Flash Vision
            </span>
            <span className="text-[10px] font-mono text-purple-600 font-bold bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full">
              Ready
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">OCR extraction pipeline operational with structured JSON parsing.</p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              FMCSA SAFER Scraper
            </span>
            <span className="text-[10px] font-mono text-orange-600 font-bold bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full">
              Live API
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">ScrapeGraphAI safety scoring and insurance countdown workers online.</p>
        </div>
      </div>
    </div>
  );
}
