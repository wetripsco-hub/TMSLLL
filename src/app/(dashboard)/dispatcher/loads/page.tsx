'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, Search, Copy, Check, MapPin, DollarSign, 
  Truck, Navigation, ExternalLink, ShieldCheck, Download
} from 'lucide-react';
import { loadService } from '@/lib/services/loadService';
import { DispatchLoad } from '@/types/tms';
import { DispatchBadge } from '@/components/dispatch/DispatchBadge';
import * as XLSX from 'xlsx';

export default function DispatcherLoadsPage() {
  const [loads, setLoads] = useState<DispatchLoad[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadService.getLoads().then(setLoads);
  }, []);

  const filteredLoads = loads.filter(
    (l) =>
      l.loadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.shipper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.commodity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyDriverLink = (token: string, id: string) => {
    const url = `${window.location.origin}/track/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportExcel = () => {
    const data = filteredLoads.map((l) => ({
      'Load #': l.loadNumber,
      'Customer Shipper': l.shipper.name,
      'Carrier Agreed Pay ($)': l.financials.carrierRate,
      'Equipment': l.equipment.toUpperCase(),
      'Miles': l.miles,
      'Status': l.status.toUpperCase(),
      'Driver Tracking Link': `${typeof window !== 'undefined' ? window.location.origin : ''}/track/${l.trackingToken}`,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'My Dispatch Loads');
    XLSX.writeFile(wb, `My_Dispatch_Loads_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              My Assigned Fleet Loads
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Track loads assigned to your fleet drivers, send smartphone GPS tracking links, and manage linehaul settlements.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Loads</span>
        </button>
      </div>

      {/* Quick Search */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Load #, Commodity, or Shipper..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
          />
        </div>
      </div>

      {/* Loads Matrix */}
      <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Load #</th>
                <th className="py-3 px-4">Broker / Shipper</th>
                <th className="py-3 px-4">Lane & Route</th>
                <th className="py-3 px-4">Equipment & Miles</th>
                <th className="py-3 px-4 text-right">Agreed Carrier Pay</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Driver GPS Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {filteredLoads.map((load) => {
                const origin = load.stops[0];
                const dest = load.stops[load.stops.length - 1];

                return (
                  <tr key={load.id} className="hover:bg-orange-50/40 dark:hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {load.loadNumber}
                    </td>

                    <td className="py-3.5 px-4 text-foreground font-bold">
                      {load.shipper.name}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground">
                        {origin?.city}, {origin?.state} $\rightarrow$ {dest?.city}, {dest?.state}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">{origin?.date}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      <div>{load.equipment.toUpperCase()}</div>
                      <span className="text-[10px] text-foreground font-bold">{load.miles} mi</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground text-sm">
                      ${load.financials.carrierRate.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <DispatchBadge status={load.status} />
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleCopyDriverLink(load.trackingToken, load.id)}
                        className="px-3 py-1.5 bg-muted hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted/80 text-foreground rounded-xl text-[11px] font-bold border border-border transition-colors inline-flex items-center gap-1.5 shadow-xs"
                      >
                        {copiedId === load.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === load.id ? 'Copied Link!' : 'Copy Mobile Link'}</span>
                      </button>
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
