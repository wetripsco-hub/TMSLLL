'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Truck, Navigation, Copy, Check, Phone, DollarSign, Calendar, 
  MapPin, ShieldCheck, Download, Plus, ArrowUpRight, CheckCircle2, UserCheck
} from 'lucide-react';
import { initialMockLoads, initialMockCarriers } from '@/lib/mock-data';
import { DispatchLoad } from '@/types/tms';
import * as XLSX from 'xlsx';

export default function DispatcherDemoPage() {
  const [loads, setLoads] = useState<DispatchLoad[]>(initialMockLoads);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [dispatcherFeePct, setDispatcherFeePct] = useState<number>(8); // 8% fee standard

  // Dispatcher Metrics
  const activeFleetCount = loads.filter(l => ['dispatched', 'loaded', 'in_transit'].includes(l.status)).length;
  const totalFleetGross = loads.reduce((acc, l) => acc + l.financials.carrierRate, 0);
  const totalDispatcherEarnings = (totalFleetGross * dispatcherFeePct) / 100;
  const totalMilesDispatched = loads.reduce((acc, l) => acc + l.miles, 0);
  const avgFleetRPM = totalMilesDispatched > 0 ? (totalFleetGross / totalMilesDispatched) : 0;

  const handleCopyDriverLink = (load: DispatchLoad) => {
    const url = `${window.location.origin}/track/${load.trackingToken}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(load.id);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleExportDispatcherSettlement = () => {
    const data = loads.map(l => ({
      'Load #': l.loadNumber,
      'Driver Name': l.carrier?.driverName || 'Unassigned',
      'Truck / Trailer': `${l.carrier?.truckNumber || 'N/A'} / ${l.carrier?.trailerNumber || 'N/A'}`,
      'Equipment': l.equipment.toUpperCase(),
      'Route': `${l.stops[0].city}, ${l.stops[0].state} -> ${l.stops[l.stops.length - 1].city}, ${l.stops[l.stops.length - 1].state}`,
      'Loaded Miles': l.miles,
      'Gross Linehaul ($)': l.financials.carrierRate,
      'Avg Rate/Mile ($)': (l.financials.carrierRate / l.miles).toFixed(2),
      [`Dispatcher Fee (${dispatcherFeePct}%)`]: ((l.financials.carrierRate * dispatcherFeePct) / 100).toFixed(2),
      'Carrier Net Pay ($)': (l.financials.carrierRate * (1 - dispatcherFeePct / 100)).toFixed(2),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fleet Settlements');
    XLSX.writeFile(wb, `Dispatcher_Fleet_Settlement_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Truck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Fleet Dispatch Command (Dispatcher Sandbox)
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Track multi-truck fleets, send 1-click mobile tracking links to drivers, calculate rate-per-mile, and generate dispatch percentage fee settlements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3.5 py-2 text-xs text-foreground shadow-xs">
            <span className="text-muted-foreground font-bold">My Fee:</span>
            <select
              value={dispatcherFeePct}
              onChange={(e) => setDispatcherFeePct(Number(e.target.value))}
              className="bg-background border border-border rounded-lg px-2 py-0.5 text-foreground font-bold font-mono focus:outline-none focus:border-orange-500"
            >
              <option value="5">5% of Gross</option>
              <option value="7">7% of Gross</option>
              <option value="8">8% of Gross</option>
              <option value="10">10% of Gross</option>
              <option value="12">12% of Gross</option>
            </select>
          </div>

          <button
            onClick={handleExportDispatcherSettlement}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Carrier Settlement</span>
          </button>

          <Link
            href="/loads/new"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Dispatch New Load</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards for Dispatchers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Fleet Trucks In-Transit</span>
            <span className="text-[10px] bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 px-2 py-0.5 rounded-full font-mono font-bold">Live GPS</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-foreground font-mono">{activeFleetCount} Trucks</span>
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-medium">Across Reefer, Dry Van & Flatbed</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Total Fleet Gross Linehaul</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-0.5 rounded-full font-mono font-bold">Weekly Run</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-foreground font-mono">
              ${totalFleetGross.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-medium">{totalMilesDispatched.toLocaleString()} total loaded miles</div>
        </div>

        <div className="bg-card border border-orange-200 dark:border-orange-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between text-xs text-orange-700 dark:text-orange-400 font-extrabold uppercase tracking-wider">
            <span>Dispatcher Commission ({dispatcherFeePct}%)</span>
            <span className="text-[10px] bg-orange-500 text-white px-2.5 py-0.5 rounded-full font-mono font-bold shadow-xs">
              Net Payout
            </span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
              ${totalDispatcherEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-orange-600 font-semibold">Your gross dispatcher service revenue</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Average Fleet Yield (RPM)</span>
            <span className="text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 px-2 py-0.5 rounded-full font-mono font-bold">+12.4% vs DAT</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
              ${avgFleetRPM.toFixed(2)} / mi
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              <Navigation className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-medium">Exceeding national spot averages</div>
        </div>
      </div>

      {/* High-Density Fleet Dispatch Matrix */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <h2 className="font-extrabold text-foreground text-sm flex items-center gap-2">
            <Truck className="w-4 h-4 text-orange-500" />
            Active Fleet Dispatch & Driver Telematics Board
          </h2>
          <span className="text-xs text-muted-foreground font-medium">
            Click "Copy Mobile GPS Link" to send instantaneous driver tracking links.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Truck & Driver</th>
                <th className="py-3 px-4">Equipment</th>
                <th className="py-3 px-4">Load #</th>
                <th className="py-3 px-4">Route (Origin $\rightarrow$ Dest)</th>
                <th className="py-3 px-4 text-right">Gross Pay</th>
                <th className="py-3 px-4 text-right">Yield (RPM)</th>
                <th className="py-3 px-4 text-right">My Fee ({dispatcherFeePct}%)</th>
                <th className="py-3 px-4 text-center">Driver GPS Link</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {loads.map((load) => {
                const isCopied = copiedToken === load.id;
                const carrierPay = load.financials.carrierRate;
                const dispatcherCut = (carrierPay * dispatcherFeePct) / 100;
                const rpm = (carrierPay / load.miles).toFixed(2);

                return (
                  <tr key={load.id} className="hover:bg-orange-50/40 dark:hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4">
                      {load.carrier ? (
                        <div>
                          <div className="font-bold text-foreground flex items-center gap-1.5">
                            {load.carrier.driverName || 'Assigned Driver'}
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {load.carrier.truckNumber} • {load.carrier.driverPhone}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic font-medium">No Driver Assigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="capitalize text-foreground font-semibold">
                        {load.equipment.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-muted-foreground block font-mono">
                        {load.weightLbs.toLocaleString()} lbs
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {load.loadNumber}
                      <span className="text-[10px] text-muted-foreground font-sans block truncate max-w-[120px]">
                        {load.commodity}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-foreground font-semibold">
                        {load.stops[0].city}, {load.stops[0].state} $\rightarrow$ {load.stops[load.stops.length - 1].city}, {load.stops[load.stops.length - 1].state}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">{load.miles} mi</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                      ${carrierPay.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      ${rpm} / mi
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-orange-600 dark:text-orange-400">
                      ${dispatcherCut.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleCopyDriverLink(load)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          isCopied
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-300'
                            : 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300 border-orange-200 dark:border-orange-500/30 hover:bg-orange-100'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Link Copied!' : 'Copy Mobile Link'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
                        {load.status.replace('_', ' ')}
                      </span>
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
