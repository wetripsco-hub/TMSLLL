'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Filter, Download, Truck, MapPin, 
  DollarSign, ArrowUpRight, CheckCircle2, ChevronRight, X, Phone, User
} from 'lucide-react';
import { loadService } from '@/lib/services/loadService';
import { DispatchLoad } from '@/types/tms';
import { DispatchBadge } from '@/components/dispatch/DispatchBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import * as XLSX from 'xlsx';

export default function BrokerLoadsPage() {
  const [loads, setLoads] = useState<DispatchLoad[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLoad, setSelectedLoad] = useState<DispatchLoad | null>(null);

  useEffect(() => {
    loadService.getLoads().then((data) => {
      setLoads(data);
      if (data.length > 0) setSelectedLoad(data[0]);
    });
  }, []);

  const filteredLoads = loads.filter((load) => {
    const matchesSearch =
      load.loadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      load.shipper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (load.carrier?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || load.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportExcel = () => {
    const data = filteredLoads.map((l) => ({
      'Load #': l.loadNumber,
      'Shipper': l.shipper.name,
      'Carrier': l.carrier?.name || 'Unassigned',
      'Carrier MC#': l.carrier?.mcNumber || '',
      'Status': l.status.toUpperCase(),
      'Equipment': l.equipment.toUpperCase(),
      'Miles': l.miles,
      'Shipper Rate ($)': l.financials.shipperRate,
      'Carrier Rate ($)': l.financials.carrierRate,
      'Broker Margin ($)': l.financials.margin,
      'Margin (%)': l.financials.marginPercent,
      'Origin City': l.stops[0]?.city,
      'Origin State': l.stops[0]?.state,
      'Dest City': l.stops[l.stops.length - 1]?.city,
      'Dest State': l.stops[l.stops.length - 1]?.state,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Brokerage Loads');
    XLSX.writeFile(wb, `Broker_Loads_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Truck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Brokerage Dispatch Board
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Manage shipper freight bookings, carrier assignments, rate confirmations, and margin spreads.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel</span>
          </button>

          <Link
            href="/broker/loads/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Load</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'all', label: 'All Loads' },
            { key: 'available', label: 'Available' },
            { key: 'dispatched', label: 'Dispatched' },
            { key: 'in_transit', label: 'In-Transit' },
            { key: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.key
                  ? 'bg-orange-500 text-white shadow-xs'
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
            className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
          />
        </div>
      </div>

      {/* Loads Data Table + Slide-over Drawer Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List (2 Cols) */}
        <div className="lg:col-span-2 border border-border rounded-2xl overflow-hidden bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Load #</th>
                  <th className="py-3 px-4">Shipper</th>
                  <th className="py-3 px-4">Carrier</th>
                  <th className="py-3 px-4">Lane & Miles</th>
                  <th className="py-3 px-4 text-right">Margin</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredLoads.map((load) => {
                  const origin = load.stops[0];
                  const dest = load.stops[load.stops.length - 1];
                  const isSelected = selectedLoad?.id === load.id;

                  return (
                    <tr
                      key={load.id}
                      onClick={() => setSelectedLoad(load)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-orange-50 dark:bg-orange-500/15'
                          : 'hover:bg-orange-50/40 dark:hover:bg-muted/40'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                        {load.loadNumber}
                      </td>

                      <td className="py-3.5 px-4 text-foreground font-bold">
                        {load.shipper.name}
                      </td>

                      <td className="py-3.5 px-4">
                        {load.carrier ? (
                          <span className="font-bold text-foreground">{load.carrier.name}</span>
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

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-orange-600 dark:text-orange-400">
                        +${load.financials.margin.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <DispatchBadge status={load.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredLoads.length === 0 && (
              <div className="p-8">
                <EmptyState
                  icon={Truck}
                  title="No Freight Loads Found"
                  description="There are currently no loads matching your search query or status filter."
                  actionLabel="Plan New Load"
                  actionHref="/broker/loads/new"
                />
              </div>
            )}
          </div>
        </div>

        {/* Selected Load Drawer Detail (1 Col) */}
        {selectedLoad && (
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Selected Load Dossier</span>
                <h3 className="text-lg font-extrabold text-foreground font-mono">{selectedLoad.loadNumber}</h3>
              </div>
              <DispatchBadge status={selectedLoad.status} />
            </div>

            {/* Margin Financials */}
            <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Customer Invoiced:</span>
                <strong className="text-foreground font-mono">${selectedLoad.financials.shipperRate.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Carrier Settlement:</span>
                <strong className="text-foreground font-mono">${selectedLoad.financials.carrierRate.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-orange-600 dark:text-orange-400 font-bold pt-1 border-t border-border">
                <span>Broker Profit Margin:</span>
                <span className="font-mono">+${selectedLoad.financials.margin.toFixed(2)} ({selectedLoad.financials.marginPercent.toFixed(1)}%)</span>
              </div>
            </div>

            {/* Routing Stops */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block">Routing Schedule</span>
              <div className="space-y-2 text-xs">
                {selectedLoad.stops.map((stop, i) => (
                  <div key={stop.id} className="p-2.5 bg-background border border-border rounded-xl space-y-0.5">
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>Stop {i + 1} ({stop.type.toUpperCase()}): {stop.facility}</span>
                    </div>
                    <div className="text-muted-foreground">{stop.city}, {stop.state} {stop.zip}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{stop.date} @ {stop.timeWindow}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href={`/broker/loads/${selectedLoad.id}`}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold text-center shadow-xs transition-all"
              >
                Open Full Load Dossier & Rate Con $\rightarrow$
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
