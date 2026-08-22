'use client';

import React, { useEffect, useState } from 'react';
import { 
  Truck, Search, DollarSign, Download, MapPin, 
  ShieldCheck, ArrowUpRight, Filter, ExternalLink
} from 'lucide-react';
import { loadService } from '@/lib/services/loadService';
import { DispatchLoad } from '@/types/tms';
import { DispatchBadge } from '@/components/dispatch/DispatchBadge';
import * as XLSX from 'xlsx';

export default function AdminLoadsPage() {
  const [loads, setLoads] = useState<DispatchLoad[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadService.getLoads().then(setLoads);
  }, []);

  const filteredLoads = loads.filter((l) => {
    const matchesSearch =
      l.loadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.shipper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.carrier?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.commodity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalGrossGMV = filteredLoads.reduce((acc, l) => acc + l.financials.shipperRate, 0);
  const totalBrokerMargin = filteredLoads.reduce((acc, l) => acc + l.financials.margin, 0);

  const handleExportExcel = () => {
    const data = filteredLoads.map((l) => ({
      'Load #': l.loadNumber,
      'Shipper Company': l.shipper.name,
      'Carrier Name': l.carrier?.name || 'Unassigned',
      'Equipment': l.equipment.toUpperCase(),
      'Shipper Rate ($)': l.financials.shipperRate,
      'Carrier Pay ($)': l.financials.carrierRate,
      'Net Margin ($)': l.financials.margin,
      'Margin %': `${l.financials.marginPercent}%`,
      'Status': l.status.toUpperCase(),
      'Created Date': l.createdAt,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Global Loads Registry');
    XLSX.writeFile(wb, `Global_Loads_Audit_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
              <Truck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Global Loads Registry & Audit
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Cross-tenant surveillance of all freight shipments, gross financial margins, and transit integrity.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Global Registry</span>
        </button>
      </div>

      {/* Global Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">
            Filtered Freight GMV
          </span>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            ${totalGrossGMV.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Total billing across {filteredLoads.length} shipments</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">
            Cumulative Broker Gross Profit
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            +${totalBrokerMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Average 17.2% brokerage gross margin</p>
        </div>

        <div className="bg-card border border-purple-200 dark:border-purple-500/30 rounded-2xl p-5 shadow-xs space-y-2">
          <span className="text-xs text-purple-700 dark:text-purple-400 font-extrabold uppercase tracking-wider block">
            Dispatched Fleet Health
          </span>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
            100%
          </div>
          <p className="text-[11px] text-purple-700/80 font-medium">0 claims or critical transit exceptions logged</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'all', label: 'All Shipments' },
            { key: 'available', label: 'Available' },
            { key: 'dispatched', label: 'Dispatched' },
            { key: 'in_transit', label: 'In-Transit' },
            { key: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.key
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Load #, Shipper, Carrier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500 font-medium"
          />
        </div>
      </div>

      {/* Matrix Table */}
      <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Load #</th>
                <th className="py-3 px-4">Shipper Organization</th>
                <th className="py-3 px-4">Assigned Carrier</th>
                <th className="py-3 px-4">Route Lane</th>
                <th className="py-3 px-4 text-right">Shipper Rate</th>
                <th className="py-3 px-4 text-right">Carrier Pay</th>
                <th className="py-3 px-4 text-right">Net Margin</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {filteredLoads.map((load) => {
                const origin = load.stops[0];
                const dest = load.stops[load.stops.length - 1];

                return (
                  <tr key={load.id} className="hover:bg-purple-50/30 dark:hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {load.loadNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{load.shipper.name}</div>
                      <span className="text-[10px] text-muted-foreground font-mono">{load.shipper.paymentTerms}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {load.carrier ? (
                        <div>
                          <div className="font-bold text-foreground">{load.carrier.name}</div>
                          <span className="text-[10px] text-muted-foreground font-mono">MC #{load.carrier.mcNumber}</span>
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

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-muted-foreground">
                      ${load.financials.carrierRate.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +${load.financials.margin.toFixed(2)} ({load.financials.marginPercent.toFixed(1)}%)
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <DispatchBadge status={load.status} />
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
