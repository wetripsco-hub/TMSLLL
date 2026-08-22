'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Truck, DollarSign, TrendingUp, Navigation, Users, 
  Sparkles, CheckCircle2, ChevronRight, Plus, Copy, Check, ShieldCheck, MapPin
} from 'lucide-react';
import { truckService } from '@/lib/services/truckService';
import { loadService } from '@/lib/services/loadService';
import { TruckItem } from '@/types/database.types';
import { DispatchLoad } from '@/types/tms';
import { DispatchBadge } from '@/components/dispatch/DispatchBadge';

export default function DispatcherDashboardPage() {
  const [trucks, setTrucks] = useState<TruckItem[]>([]);
  const [loads, setLoads] = useState<DispatchLoad[]>([]);
  const [commissionRate, setCommissionRate] = useState<number>(8); // 8% standard dispatch fee
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    truckService.getTrucks().then(setTrucks);
    loadService.getLoads().then(setLoads);
  }, []);

  const activeTrucks = trucks.filter((t) => t.status === 'in_transit' || t.status === 'dispatched');
  const availableTrucks = trucks.filter((t) => t.status === 'available');
  const totalFleetLinehaul = loads.reduce((acc, l) => acc + l.financials.carrierRate, 0);
  const dispatcherEarnings = (totalFleetLinehaul * commissionRate) / 100;
  const avgFleetRPM = 2.88;

  const handleCopyLink = (token: string, id: string) => {
    const url = `${window.location.origin}/track/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Dispatcher Hero Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Truck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Fleet Dispatch Command Center
            </h1>
            <span className="text-[10px] font-mono font-bold bg-orange-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
              DISPATCHER MODE
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Manage your fleet of assigned trucks, dispatch drivers, generate mobile GPS links, and track commission earnings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dispatcher/my-trucks"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Fleet Units</span>
          </Link>
        </div>
      </div>

      {/* Dynamic Dispatcher Yield & Commission Slider */}
      <div className="bg-card border border-orange-200 dark:border-orange-500/30 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
              Dispatcher Fee Yield Calculator
            </span>
            <h3 className="text-base font-extrabold text-foreground">
              Your Commission Rate: <span className="text-orange-600 font-mono text-xl">{commissionRate}%</span> of Gross Linehaul
            </h3>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-xs text-muted-foreground block font-sans font-semibold">Projected Monthly Dispatch Earnings</span>
            <span className="text-3xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
              +${dispatcherEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground font-semibold">
            <span>5% Standard</span>
            <span>8% Performance</span>
            <span>10% Premium</span>
            <span>12% Full Service</span>
          </div>
          <input
            type="range"
            min="5"
            max="12"
            step="0.5"
            value={commissionRate}
            onChange={(e) => setCommissionRate(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer h-2 bg-muted rounded-lg"
          />
        </div>
      </div>

      {/* Dispatcher Fleet KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Total Fleet Power Units</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              {trucks.length} Trucks
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            {trucks.length} Units
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Assigned Class 8 tractors & trailers</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Rolling In-Transit Units</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              GPS Online
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            {activeTrucks.length} Active
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Currently on highway transit corridors</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Available for Dispatch</span>
            <span className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              Ready
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            {availableTrucks.length} Ready
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Ready to book loads in Dallas & Houston</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Average Fleet Yield (RPM)</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              Yield
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            ${avgFleetRPM.toFixed(2)} / mi
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Average rate booked across all trucks</p>
        </div>
      </div>

      {/* Fleet Roster Live Grid */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-foreground">Fleet Roster & Telematics Status</h3>
            <p className="text-xs text-muted-foreground">Your managed trucks, assigned drivers, and live locations</p>
          </div>
          <Link
            href="/dispatcher/my-trucks"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Manage All Trucks</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Unit #</th>
                <th className="py-3 px-4">Tractor / Trailer</th>
                <th className="py-3 px-4">Assigned Driver</th>
                <th className="py-3 px-4">Current Waypoint</th>
                <th className="py-3 px-4">Target RPM</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Driver Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {trucks.map((truck) => (
                <tr key={truck.id} className="hover:bg-orange-50/40 dark:hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    {truck.unitNumber}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground">{truck.makeModel}</div>
                    <span className="text-[10px] text-muted-foreground font-mono">{truck.equipmentType.toUpperCase()} • {truck.trailerNumber || 'No Trailer'}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    {truck.assignedDriver ? (
                      <div>
                        <span className="font-bold text-foreground">{truck.assignedDriver.name}</span>
                        <span className="text-[10px] text-muted-foreground block font-mono">{truck.assignedDriver.phone}</span>
                      </div>
                    ) : (
                      <span className="text-orange-600 font-semibold italic">Unassigned</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      <span>{truck.currentLocation.city}, {truck.currentLocation.state}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">Ping: {truck.currentLocation.updatedAt}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    ${truck.rpmTarget.toFixed(2)} / mi
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      truck.status === 'in_transit'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                        : truck.status === 'dispatched'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}>
                      {truck.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleCopyLink('trk_marcus_vance_88902', truck.id)}
                      className="px-2.5 py-1 bg-muted hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted/80 text-foreground rounded-lg text-[11px] font-bold border border-border transition-colors inline-flex items-center gap-1"
                    >
                      {copiedId === truck.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === truck.id ? 'Copied' : 'GPS Link'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
