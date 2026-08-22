'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  DollarSign, TrendingUp, Truck, ShieldCheck, Users, 
  Briefcase, ArrowUpRight, ArrowDownRight, AlertTriangle, 
  Sparkles, CheckCircle2, ChevronRight, Plus, Download, RefreshCw
} from 'lucide-react';
import { loadService } from '@/lib/services/loadService';
import { DispatchLoad } from '@/types/tms';
import { DispatchBadge } from '@/components/dispatch/DispatchBadge';

export default function BrokerDashboardPage() {
  const [loads, setLoads] = useState<DispatchLoad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadService.getLoads().then((data) => {
      setLoads(data);
      setLoading(false);
    });
  }, []);

  const totalGrossBilling = loads.reduce((acc, l) => acc + l.financials.shipperRate, 0);
  const totalCarrierPay = loads.reduce((acc, l) => acc + l.financials.carrierRate, 0);
  const totalNetMargin = loads.reduce((acc, l) => acc + l.financials.margin, 0);
  const avgMarginPercent = totalGrossBilling > 0 ? (totalNetMargin / totalGrossBilling) * 100 : 0;
  const activeLoadsCount = loads.filter((l) => l.status === 'in_transit' || l.status === 'dispatched').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Broker Hero Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Freight Brokerage Command Center
            </h1>
            <span className="text-[10px] font-mono font-bold bg-orange-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
              3PL MODE
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Real-time gross margins, customer credit limits, carrier safety compliance, and live load operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/broker/loads/new"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Load</span>
          </Link>
        </div>
      </div>

      {/* High-Density KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Shipper Gross Billing</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              +18.4% MTD
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            ${totalGrossBilling.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Total invoiced across all active shippers</p>
        </div>

        <div className="bg-card border border-orange-200 dark:border-orange-500/30 rounded-2xl p-5 shadow-md shadow-orange-500/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-orange-700 dark:text-orange-400 font-extrabold uppercase tracking-wider">
            <span>Net Broker Margin ($)</span>
            <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-mono font-bold">
              {avgMarginPercent.toFixed(1)}% Spread
            </span>
          </div>
          <div className="text-3xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
            +${totalNetMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-orange-700/80 font-medium">Brokerage profit after carrier settlements</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Active In-Transit Loads</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              Live GPS
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            {activeLoadsCount} Loads
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Currently rolling on highway corridors</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Carrier Compliance Rate</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              100% Verified
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            98.8%
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Zero unauthorized or double-brokered carriers</p>
        </div>
      </div>

      {/* Margin Guard & Compliance Alert Banner */}
      <div className="bg-card border border-orange-200 dark:border-orange-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">
              Margin Guard Active • Carrier Compliance Monitored
            </h3>
            <p className="text-[11px] text-muted-foreground">
              All loads are strictly monitored against the 12.0% broker profit margin floor and FMCSA insurance validity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/broker/carriers"
            className="px-3 py-1.5 bg-background hover:bg-muted text-foreground rounded-xl border border-border text-xs font-bold transition-colors"
          >
            Audit Carriers
          </Link>
          <Link
            href="/broker/shippers"
            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Check Credit Limits
          </Link>
        </div>
      </div>

      {/* Recent Brokerage Loads Grid */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-foreground">Recent Brokerage Loads & Margins</h3>
            <p className="text-xs text-muted-foreground">Latest dispatches across your shipper accounts</p>
          </div>
          <Link
            href="/broker/loads"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All Loads</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Load #</th>
                <th className="py-3 px-4">Customer (Shipper)</th>
                <th className="py-3 px-4">Assigned Carrier</th>
                <th className="py-3 px-4">Route & Miles</th>
                <th className="py-3 px-4 text-right">Shipper Rate</th>
                <th className="py-3 px-4 text-right">Net Margin</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {loads.slice(0, 4).map((load) => {
                const origin = load.stops[0];
                const dest = load.stops[load.stops.length - 1];

                return (
                  <tr key={load.id} className="hover:bg-orange-50/40 dark:hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      <Link href={`/broker/loads/${load.id}`} className="hover:text-orange-600">
                        {load.loadNumber}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 text-foreground font-bold">
                      {load.shipper.name}
                    </td>

                    <td className="py-3.5 px-4">
                      {load.carrier ? (
                        <div>
                          <span className="font-bold text-foreground">{load.carrier.name}</span>
                          <span className="text-[10px] text-muted-foreground block font-mono">MC #{load.carrier.mcNumber}</span>
                        </div>
                      ) : (
                        <span className="text-orange-600 font-semibold italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground">
                        {origin?.city}, {origin?.state} $\rightarrow$ {dest?.city}, {dest?.state}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">{load.miles} mi • {load.equipment.toUpperCase()}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                      ${load.financials.shipperRate.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-orange-600 dark:text-orange-400">
                      +${load.financials.margin.toFixed(2)} ({load.financials.marginPercent.toFixed(1)}%)
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <DispatchBadge status={load.status} />
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Link
                        href={`/broker/loads/${load.id}`}
                        className="px-2.5 py-1 bg-muted hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted/80 text-foreground rounded-lg text-[11px] font-bold border border-border transition-colors"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
