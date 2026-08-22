'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, Download, Plus, ArrowUpDown, ChevronRight, 
  MapPin, ShieldCheck, Phone, Navigation, Copy, Check, FileText, ArrowUpRight
} from 'lucide-react';
import { DispatchLoad, LoadStatus } from '@/types/tms';
import { DispatchBadge } from './DispatchBadge';
import { DispatchStats } from './DispatchStats';
import { RateConModal } from '@/components/modals/RateConModal';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';

interface DispatchBoardProps {
  initialLoads: DispatchLoad[];
}

export function DispatchBoard({ initialLoads }: DispatchBoardProps) {
  const [loads, setLoads] = useState<DispatchLoad[]>(initialLoads);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLoad, setSelectedLoad] = useState<DispatchLoad | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [rateConModalLoad, setRateConModalLoad] = useState<DispatchLoad | null>(null);

  // Status Filter Tabs
  const statusTabs = [
    { key: 'all', label: 'All Loads', count: loads.length },
    { key: 'available', label: 'Available', count: loads.filter(l => l.status === 'available').length },
    { key: 'dispatched', label: 'Dispatched', count: loads.filter(l => l.status === 'dispatched').length },
    { key: 'in_transit', label: 'In Transit', count: loads.filter(l => l.status === 'in_transit').length },
    { key: 'delivered', label: 'Delivered', count: loads.filter(l => l.status === 'delivered').length },
    { key: 'invoiced', label: 'Invoiced', count: loads.filter(l => l.status === 'invoiced').length },
  ];

  // Filtering Logic
  const filteredLoads = useMemo(() => {
    return loads.filter((load) => {
      const matchesStatus = selectedStatus === 'all' || load.status === selectedStatus;
      const matchesSearch = 
        load.loadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.shipper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (load.carrier?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        load.stops.some(s => s.city.toLowerCase().includes(searchQuery.toLowerCase()) || s.state.toLowerCase().includes(searchQuery.toLowerCase())) ||
        load.commodity.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [loads, selectedStatus, searchQuery]);

  // Fast SheetJS Excel Export
  const handleExportExcel = () => {
    const data = filteredLoads.map(l => ({
      'Load #': l.loadNumber,
      'Status': l.status.toUpperCase(),
      'Shipper': l.shipper.name,
      'Carrier': l.carrier?.name || 'Unassigned',
      'Origin': `${l.stops[0].city}, ${l.stops[0].state}`,
      'Destination': `${l.stops[l.stops.length - 1].city}, ${l.stops[l.stops.length - 1].state}`,
      'Equipment': l.equipment.replace('_', ' ').toUpperCase(),
      'Miles': l.miles,
      'Shipper Rate ($)': l.financials.shipperRate,
      'Carrier Rate ($)': l.financials.carrierRate,
      'Margin ($)': l.financials.margin,
      'Margin (%)': `${l.financials.marginPercent.toFixed(1)}%`,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dispatch Ledgers');
    XLSX.writeFile(wb, `TMS_Dispatch_Ledger_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleCopyLink = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/track/${token}`);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            Live Dispatch Board
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 font-bold">
              TailAdmin Matrix
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">Manage active freight, carrier assignment, tracking, and billing margins.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border rounded-xl text-foreground transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Excel
          </button>
          <Link 
            href="/loads/new"
            className="flex items-center gap-2 px-4 py-2 text-xs font-extrabold bg-orange-500 hover:bg-orange-600 rounded-xl text-white transition-all shadow-md shadow-orange-500/25 transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Create Load
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <DispatchStats loads={loads} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5',
                selectedStatus === tab.key
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {tab.label}
              <span className={cn(
                'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                selectedStatus === tab.key ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[280px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Load #, Shipper, Carrier, City..."
            className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* High-Density Data Table */}
      <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Load #</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Shipper</th>
                <th className="py-3 px-4">Origin $\rightarrow$ Destination</th>
                <th className="py-3 px-4">Equipment / Miles</th>
                <th className="py-3 px-4">Assigned Carrier</th>
                <th className="py-3 px-4 text-right">Revenue</th>
                <th className="py-3 px-4 text-right">Carrier Pay</th>
                <th className="py-3 px-4 text-right">Margin ($ / %)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {filteredLoads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-muted-foreground">
                    No active loads match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLoads.map((load) => {
                  const origin = load.stops[0];
                  const destination = load.stops[load.stops.length - 1];
                  const isPositiveMargin = load.financials.margin >= 0;

                  return (
                    <tr 
                      key={load.id} 
                      onClick={() => setSelectedLoad(load)}
                      className="hover:bg-orange-50/40 dark:hover:bg-muted/40 cursor-pointer transition-colors group"
                    >
                      {/* Load Number */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-foreground group-hover:text-orange-600 transition-colors flex items-center gap-1.5">
                          {load.loadNumber}
                          {load.trackingActive && (
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" title="Live Tracking Active" />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">{load.commodity}</span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <DispatchBadge status={load.status} />
                      </td>

                      {/* Shipper */}
                      <td className="py-3.5 px-4">
                        <div className="text-foreground font-bold">{load.shipper.name}</div>
                        <span className="text-[10px] text-muted-foreground">{load.shipper.contact}</span>
                      </td>

                      {/* Origin & Destination Stops */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 font-bold text-foreground">
                          <span className="text-muted-foreground font-medium">{origin.city}, {origin.state}</span>
                          <span className="text-muted-foreground">$\rightarrow$</span>
                          <span className="text-foreground">{destination.city}, {destination.state}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5 font-medium">
                          <span>Pickup: {origin.date}</span>
                          {load.stops.length > 2 && (
                            <span className="px-1.5 py-0.2 bg-muted rounded text-muted-foreground font-mono">
                              +{load.stops.length - 2} stop
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Equipment & Miles */}
                      <td className="py-3.5 px-4">
                        <div className="text-foreground capitalize font-semibold">{load.equipment.replace('_', ' ')}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{load.miles.toLocaleString()} mi (${load.rpm.toFixed(2)}/mi)</div>
                      </td>

                      {/* Carrier */}
                      <td className="py-3.5 px-4">
                        {load.carrier ? (
                          <div>
                            <div className="text-foreground font-bold flex items-center gap-1">
                              {load.carrier.name}
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono">MC #{load.carrier.mcNumber}</div>
                          </div>
                        ) : (
                          <span className="text-orange-600 italic font-semibold">Unassigned</span>
                        )}
                      </td>

                      {/* Shipper Rate */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                        ${load.financials.shipperRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Carrier Rate */}
                      <td className="py-3.5 px-4 text-right font-mono text-muted-foreground">
                        ${load.financials.carrierRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Margin ($ & %) */}
                      <td className="py-3.5 px-4 text-right">
                        <div className={cn("font-mono font-bold", isPositiveMargin ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600")}>
                          ${load.financials.margin.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className={cn("text-[10px] font-mono", isPositiveMargin ? "text-emerald-700/80" : "text-rose-700/80")}>
                          {load.financials.marginPercent.toFixed(1)}%
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <Link 
                          href={`/loads/${load.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex p-2 rounded-xl bg-muted hover:bg-orange-500 hover:text-white text-foreground transition-all shadow-xs"
                          title="Open Load Dossier"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Inspection Drawer Panel */}
      {selectedLoad && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-card border-l border-border shadow-2xl p-6 flex flex-col justify-between z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">Quick Dossier</span>
                <h2 className="text-xl font-extrabold text-foreground font-mono">{selectedLoad.loadNumber}</h2>
              </div>
              <button 
                onClick={() => setSelectedLoad(null)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Financial Summary Card */}
            <div className="bg-background p-4 rounded-xl border border-border">
              <span className="text-xs font-bold text-muted-foreground">Financial Spread</span>
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-card p-2.5 rounded-xl border border-border">
                  <div className="text-[10px] text-muted-foreground font-semibold">Shipper</div>
                  <div className="text-sm font-bold text-foreground font-mono">${selectedLoad.financials.shipperRate}</div>
                </div>
                <div className="bg-card p-2.5 rounded-xl border border-border">
                  <div className="text-[10px] text-muted-foreground font-semibold">Carrier</div>
                  <div className="text-sm font-bold text-foreground font-mono">${selectedLoad.financials.carrierRate}</div>
                </div>
                <div className="bg-card p-2.5 rounded-xl border border-orange-200 dark:border-orange-500/30">
                  <div className="text-[10px] text-orange-600 font-bold">Margin</div>
                  <div className="text-sm font-bold text-orange-600 font-mono">${selectedLoad.financials.margin}</div>
                </div>
              </div>
            </div>

            {/* Stops Timeline */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Routing & Schedule</span>
              <div className="space-y-3 border-l-2 border-orange-500/40 pl-4 ml-2">
                {selectedLoad.stops.map((stop) => (
                  <div key={stop.id} className="relative">
                    <span className={cn(
                      "w-3 h-3 rounded-full absolute -left-[23px] top-1 border-2 border-background",
                      stop.type === 'pickup' ? "bg-blue-500" : "bg-orange-500"
                    )} />
                    <div className="text-xs font-bold text-foreground capitalize">{stop.type}: {stop.facility}</div>
                    <div className="text-xs text-muted-foreground">{stop.city}, {stop.state} {stop.zip}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">{stop.date} @ {stop.timeWindow}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate Con Action */}
            <div className="bg-background p-4 rounded-xl border border-border flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-foreground block">Rate Confirmation</span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {selectedLoad.rateConSigned ? 'Signed & Digitally Certified' : 'Ready for eSign'}
                </span>
              </div>
              <button
                onClick={() => setRateConModalLoad(selectedLoad)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{selectedLoad.rateConSigned ? 'View eSign' : 'Generate PDF'}</span>
              </button>
            </div>

            {/* Tracking Link Generator */}
            <div className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-orange-500" />
                Driver GPS Tracking Link
              </span>
              <p className="text-[11px] text-muted-foreground">Send this mobile web link to the driver via SMS/WhatsApp to share live location.</p>
              <button 
                onClick={() => handleCopyLink(selectedLoad.trackingToken)}
                className="mt-1 flex items-center justify-center gap-2 w-full py-2 px-3 bg-muted hover:bg-orange-50 hover:text-orange-700 text-xs font-bold rounded-xl text-foreground transition-colors border border-border"
              >
                {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedToken ? 'Tracking Link Copied!' : 'Copy Mobile Tracking URL'}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center gap-3">
            <Link 
              href={`/loads/${selectedLoad.id}`}
              className="w-full text-center py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-xs font-extrabold text-white transition-colors shadow-md shadow-orange-500/20"
            >
              Open Full Load Dossier $\rightarrow$
            </Link>
          </div>
        </div>
      )}

      {/* Rate Confirmation Modal */}
      <RateConModal
        isOpen={!!rateConModalLoad}
        onClose={() => setRateConModalLoad(null)}
        load={rateConModalLoad}
        onSignComplete={(signer) => {
          if (rateConModalLoad) {
            setLoads(loads.map(l => l.id === rateConModalLoad.id ? { ...l, rateConSigned: true, rateConSignerName: signer } : l));
          }
        }}
      />
    </div>
  );
}
