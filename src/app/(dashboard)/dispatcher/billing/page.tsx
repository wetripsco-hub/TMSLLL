'use client';

import React, { useEffect, useState } from 'react';
import { 
  DollarSign, TrendingUp, Download, CheckCircle2, Clock, 
  FileText, ShieldCheck, User, Truck, ArrowUpRight, Search, Plus
} from 'lucide-react';
import { loadService } from '@/lib/services/loadService';
import { truckService } from '@/lib/services/truckService';
import { DispatchLoad } from '@/types/tms';
import { exportToExcel } from '@/lib/excel';

export default function DispatcherBillingPage() {
  const [loads, setLoads] = useState<DispatchLoad[]>([]);
  const [commissionPercent, setCommissionPercent] = useState<number>(8); // 8% fee
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadService.getLoads().then(setLoads);
  }, []);

  const filteredLoads = loads.filter((l) =>
    l.loadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.shipper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.carrier?.driverName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalGrossLinehaul = filteredLoads.reduce((acc, l) => acc + l.financials.carrierRate, 0);
  const totalCommissionEarned = (totalGrossLinehaul * commissionPercent) / 100;
  const totalDriverNetPayout = totalGrossLinehaul - totalCommissionEarned;

  const handleExportBilling = () => {
    const data = filteredLoads.map((l) => {
      const linehaul = l.financials.carrierRate;
      const commission = (linehaul * commissionPercent) / 100;
      const driverPay = linehaul - commission;

      return {
        'Load #': l.loadNumber,
        'Broker / Customer': l.shipper.name,
        'Assigned Driver': l.carrier?.driverName || 'Fleet Unit 101',
        'Gross Linehaul ($)': linehaul,
        [`Dispatch Fee (${commissionPercent}%) ($)`]: commission,
        'Driver Net Settlement ($)': driverPay,
        'Miles': l.miles,
        'RPM ($/mi)': l.rpm,
        'Status': l.status.toUpperCase(),
        'Date': l.createdAt.split('T')[0],
      };
    });

    exportToExcel(data, `Dispatcher_Settlements_Ledger_${new Date().toISOString().split('T')[0]}`, {
      sheetName: 'Factoring & Settlements',
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <DollarSign className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Factoring, Driver Settlements & Commission Ledger
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Generate driver settlement sheets, calculate dispatcher percentage commission yields, and export factoring schedules.
          </p>
        </div>

        <button
          onClick={handleExportBilling}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Settlements (.xlsx)</span>
        </button>
      </div>

      {/* Commission Yield Slider Card */}
      <div className="bg-card border border-orange-200 dark:border-orange-500/30 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
              Dispatcher Commission Rate
            </span>
            <h3 className="text-base font-extrabold text-foreground">
              Active Yield Setting: <span className="text-orange-600 font-mono text-xl">{commissionPercent}%</span> of Gross Linehaul
            </h3>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-xs text-muted-foreground block font-sans font-semibold">Your Net Dispatch Fee Revenue</span>
            <span className="text-3xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
              +${totalCommissionEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground font-semibold">
            <span>5% Standard</span>
            <span>7% Tier 2</span>
            <span>8% Performance</span>
            <span>10% Premium</span>
            <span>12% Full Service</span>
          </div>
          <input
            type="range"
            min="5"
            max="12"
            step="0.5"
            value={commissionPercent}
            onChange={(e) => setCommissionPercent(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer h-2 bg-muted rounded-lg"
          />
        </div>
      </div>

      {/* Financial Settlement KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">
            Total Gross Fleet Linehaul
          </span>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            ${totalGrossLinehaul.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Billed to freight brokers across {filteredLoads.length} loads</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">
            Driver / Carrier Net Settlement
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            ${totalDriverNetPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Payable to owner-operators & fleet drivers</p>
        </div>

        <div className="bg-card border border-orange-200 dark:border-orange-500/30 rounded-2xl p-5 shadow-xs space-y-2">
          <span className="text-xs text-orange-700 dark:text-orange-400 font-extrabold uppercase tracking-wider block">
            Dispatcher Commission Yield
          </span>
          <div className="text-3xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
            ${totalCommissionEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-orange-700/80 font-medium">{commissionPercent}% retained dispatch fee</p>
        </div>
      </div>

      {/* Settlement Records Matrix */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Load #, Broker, Driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Load #</th>
                <th className="py-3 px-4">Broker / Shipper</th>
                <th className="py-3 px-4">Assigned Driver</th>
                <th className="py-3 px-4 text-right">Gross Linehaul</th>
                <th className="py-3 px-4 text-right">Dispatch Fee ({commissionPercent}%)</th>
                <th className="py-3 px-4 text-right">Driver Net Payout</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {filteredLoads.map((load) => {
                const gross = load.financials.carrierRate;
                const fee = (gross * commissionPercent) / 100;
                const net = gross - fee;

                return (
                  <tr key={load.id} className="hover:bg-orange-50/40 dark:hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {load.loadNumber}
                    </td>

                    <td className="py-3.5 px-4 text-foreground font-bold">
                      {load.shipper.name}
                    </td>

                    <td className="py-3.5 px-4 text-foreground">
                      <div className="font-semibold">{load.carrier?.driverName || 'Marcus Vance'}</div>
                      <span className="text-[10px] text-muted-foreground font-mono">{load.equipment.toUpperCase()}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                      ${gross.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-orange-600 dark:text-orange-400">
                      +${fee.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${net.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-bold uppercase border border-emerald-200">
                        Settled
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
