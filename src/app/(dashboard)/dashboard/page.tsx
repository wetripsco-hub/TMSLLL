'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  DollarSign, TrendingUp, Truck, CheckCircle2, ArrowUpRight, 
  Plus, ShieldCheck, Sparkles, Download, Navigation, AlertTriangle, 
  Building2, Users, FileText, ArrowRight, BarChart3, PieChart, Activity
} from 'lucide-react';
import { initialMockLoads, initialMockCarriers } from '@/lib/mock-data';
import { CarrierVerifyModal } from '@/components/modals/CarrierVerifyModal';
import * as XLSX from 'xlsx';

export default function DashboardPage() {
  const [loads] = useState(initialMockLoads);
  const [carriers] = useState(initialMockCarriers);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('monthly');

  // Computations
  const totalRevenue = loads.reduce((acc, l) => acc + l.financials.shipperRate, 0);
  const totalCarrierCost = loads.reduce((acc, l) => acc + l.financials.carrierRate, 0);
  const totalMargin = totalRevenue - totalCarrierCost;
  const avgMarginPct = totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0;
  
  const activeTrucks = loads.filter((l) => ['dispatched', 'loaded', 'in_transit'].includes(l.status)).length;
  const deliveredUninvoiced = loads.filter((l) => l.status === 'delivered').length;

  const expiringCarriers = carriers.filter((c) => c.daysToInsuranceExpiry < 30);

  // TailAdmin-style Chart Mock Data
  const monthlyRevenueData = [
    { month: 'May', revenue: 38200, cost: 31000, margin: 7200 },
    { month: 'Jun', revenue: 44500, cost: 35800, margin: 8700 },
    { month: 'Jul', revenue: 51200, cost: 41900, margin: 9300 },
    { month: 'Aug', revenue: 64800, cost: 52400, margin: 12400 },
  ];

  const handleExportAll = () => {
    const data = loads.map(l => ({
      'Load #': l.loadNumber,
      'Status': l.status.toUpperCase(),
      'Shipper': l.shipper.name,
      'Carrier': l.carrier?.name || 'Unassigned',
      'Origin': `${l.stops[0].city}, ${l.stops[0].state}`,
      'Destination': `${l.stops[l.stops.length - 1].city}, ${l.stops[l.stops.length - 1].state}`,
      'Shipper Rate ($)': l.financials.shipperRate,
      'Carrier Pay ($)': l.financials.carrierRate,
      'Margin ($)': l.financials.margin,
      'Margin (%)': `${l.financials.marginPercent.toFixed(1)}%`,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Executive TMS Snapshot');
    XLSX.writeFile(wb, `TMS_Executive_Summary_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            Executive Command Center
            <span className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 font-bold">
              TailAdmin Logistics OS
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Real-time brokerage margins, active truck telematics, Gemini OCR scanning, and carrier compliance.
          </p>
        </div>

        {/* Quick Dispatch Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsVerifyOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-all shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>Verify MC#</span>
          </button>

          <Link
            href="/documents"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Scan Document</span>
          </Link>

          <button
            onClick={handleExportAll}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>

          <Link
            href="/loads/new"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Load</span>
          </Link>
        </div>
      </div>

      {/* TailAdmin Style KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Gross Revenue */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Total Gross Revenue</span>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
              +18.4% MTD
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-foreground font-mono">
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>Across 5 active customer billing accounts</span>
          </div>
        </div>

        {/* Gross Profit Margin */}
        <div className="bg-card border border-orange-200 dark:border-orange-500/30 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between text-xs text-orange-700 dark:text-orange-400 font-extrabold uppercase tracking-wider">
            <span>Net Brokerage Margin</span>
            <span className="text-[10px] font-extrabold bg-orange-500 text-white px-2.5 py-0.5 rounded-full font-mono shadow-xs">
              {avgMarginPct.toFixed(1)}% Spread
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
              ${totalMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Avg ${(totalMargin / loads.length).toFixed(2)} profit per load</span>
          </div>
        </div>

        {/* Active Trucks In-Transit */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Fleet Trucks In-Transit</span>
            <span className="text-[10px] font-extrabold text-orange-700 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30 px-2 py-0.5 rounded-full font-mono">
              LIVE TELEMATICS
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-foreground font-mono">
              {activeTrucks} Units
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
            <Navigation className="w-3.5 h-3.5 text-orange-500" />
            <span>Real-time GPS tracking active on {activeTrucks} units</span>
          </div>
        </div>

        {/* Delivered Uninvoiced */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Delivered (Uninvoiced)</span>
            <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
              AUDIT READY
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-foreground font-mono">
              {deliveredUninvoiced} Loads
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>POD verified, ready for 1-click A/R billing</span>
          </div>
        </div>
      </div>

      {/* TailAdmin Analytics Chart & Fleet Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Revenue & Margin Bar Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                Revenue & Net Margin Analytics
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monthly gross customer billing vs carrier transportation expense spread.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-muted p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setChartPeriod('monthly')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartPeriod === 'monthly' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setChartPeriod('weekly')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartPeriod === 'weekly' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          {/* Visual SVG Bar / Trend Chart */}
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-4 gap-4 h-48 items-end pt-6 pb-2 border-b border-border font-mono text-xs">
              {monthlyRevenueData.map((item, idx) => {
                const heightPct = (item.revenue / 70000) * 100;
                const costPct = (item.cost / 70000) * 100;
                const marginPct = (item.margin / 70000) * 100;

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[11px] text-muted-foreground group-hover:text-orange-600 font-bold">
                      ${(item.revenue / 1000).toFixed(0)}k
                    </div>
                    <div className="w-full max-w-[48px] flex items-end justify-center gap-1.5 h-full">
                      {/* Revenue Bar */}
                      <div 
                        style={{ height: `${heightPct}%` }}
                        className="w-1/2 bg-orange-500 hover:bg-orange-600 rounded-t-lg transition-all shadow-xs"
                        title={`Revenue: $${item.revenue.toLocaleString()}`}
                      />
                      {/* Margin Bar */}
                      <div 
                        style={{ height: `${marginPct * 2}%` }}
                        className="w-1/2 bg-emerald-500 hover:bg-emerald-600 rounded-t-lg transition-all shadow-xs"
                        title={`Margin: $${item.margin.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground">{item.month}</span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-orange-500" />
                <span className="font-semibold text-foreground">Gross Revenue ($)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                <span className="font-semibold text-foreground">Net Margin Spread ($)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Fleet Capacity & Fast Actions */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <PieChart className="w-5 h-5 text-orange-500" />
              Active Fleet Mix
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-foreground mb-1">
                  <span>Reefer (Refrigerated 53')</span>
                  <span className="font-mono text-orange-600">45%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-foreground mb-1">
                  <span>53' Dry Van</span>
                  <span className="font-mono text-blue-600">35%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-foreground mb-1">
                  <span>Flatbed / Step Deck</span>
                  <span className="font-mono text-emerald-600">20%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-muted rounded-xl border border-orange-100 dark:border-border space-y-2">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>AI Margin Optimization</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Gemini Vision detected 3 unbilled lumper receipts available for reimbursement.
            </p>
            <Link
              href="/documents"
              className="inline-block text-xs font-bold text-orange-600 hover:text-orange-700 underline underline-offset-4"
            >
              Review in AI Scanner $\rightarrow$
            </Link>
          </div>
        </div>
      </div>

      {/* Compliance Watchlist Alert Banner */}
      {expiringCarriers.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <span className="font-extrabold text-foreground">Carrier Compliance Alert:</span>{' '}
              <span className="font-medium">{expiringCarriers.length} motor carrier(s) have insurance expiring within 30 days.</span>
            </div>
          </div>
          <Link
            href="/carriers"
            className="px-3.5 py-1.5 bg-white dark:bg-card hover:bg-orange-50 hover:text-orange-700 border border-amber-200 dark:border-border rounded-xl font-bold text-foreground text-center shadow-xs transition-colors"
          >
            Review Carriers $\rightarrow$
          </Link>
        </div>
      )}

      {/* Live Freight Operations Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-500" />
              Live Freight Operations Matrix
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click any load to open its complete dispatch dossier or view driver telemetry.
            </p>
          </div>
          <Link
            href="/loads"
            className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 font-bold flex items-center gap-1 transition-colors"
          >
            <span>View Full Dispatch Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Load #</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Shipper</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Carrier Assigned</th>
                <th className="py-3 px-4 text-right">Shipper Rate</th>
                <th className="py-3 px-4 text-right">Margin ($)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {loads.map((load) => (
                <tr key={load.id} className="hover:bg-orange-50/40 dark:hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    <Link href={`/loads/${load.id}`} className="hover:text-orange-600 transition-colors">
                      {load.loadNumber}
                    </Link>
                    <span className="block text-[10px] text-muted-foreground font-sans">{load.commodity}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
                      {load.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground">{load.shipper.name}</div>
                    <span className="text-[10px] text-muted-foreground">{load.shipper.contact}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-foreground font-semibold">
                      {load.stops[0].city}, {load.stops[0].state} $\rightarrow$ {load.stops[load.stops.length - 1].city}, {load.stops[load.stops.length - 1].state}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{load.miles} miles • {load.equipment.toUpperCase()}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    {load.carrier ? (
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-1">
                          {load.carrier.name}
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">Driver: {load.carrier.driverName}</span>
                      </div>
                    ) : (
                      <span className="text-orange-600 text-xs italic font-bold">Unassigned</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                    ${load.financials.shipperRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +${load.financials.margin.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="block text-[10px] text-muted-foreground font-mono">
                      {load.financials.marginPercent.toFixed(1)}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <Link
                      href={`/loads/${load.id}`}
                      className="p-2 rounded-xl bg-muted hover:bg-orange-500 hover:text-white text-foreground inline-block transition-all shadow-xs"
                      title="Open Load Dossier"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CarrierVerifyModal isOpen={isVerifyOpen} onClose={() => setIsVerifyOpen(false)} />
    </div>
  );
}
