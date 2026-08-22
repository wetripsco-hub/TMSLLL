'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, TrendingUp, ShieldCheck, Download, Search, Plus, 
  FileText, CheckCircle2, AlertTriangle, ArrowUpRight, DollarSign, Users, Sparkles
} from 'lucide-react';
import { initialMockLoads, initialMockShippers, initialMockCarriers } from '@/lib/mock-data';
import { DispatchLoad, ShipperProfile } from '@/types/tms';
import { RateConModal } from '@/components/modals/RateConModal';
import { CarrierVerifyModal } from '@/components/modals/CarrierVerifyModal';
import * as XLSX from 'xlsx';

export default function BrokerDemoPage() {
  const [loads, setLoads] = useState<DispatchLoad[]>(initialMockLoads);
  const [shippers] = useState<ShipperProfile[]>(initialMockShippers);
  const [selectedLoad, setSelectedLoad] = useState<DispatchLoad | null>(null);
  const [rateConLoad, setRateConLoad] = useState<DispatchLoad | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'loads' | 'shippers' | 'dat_benchmarks'>('loads');

  // Brokerage Metrics
  const totalShipperRevenue = loads.reduce((acc, l) => acc + l.financials.shipperRate, 0);
  const totalCarrierCost = loads.reduce((acc, l) => acc + l.financials.carrierRate, 0);
  const totalNetMargin = totalShipperRevenue - totalCarrierCost;
  const avgMarginPercentage = totalShipperRevenue > 0 ? (totalNetMargin / totalShipperRevenue) * 100 : 0;

  const handleExportBrokerageLedger = () => {
    const data = loads.map(l => ({
      'Load #': l.loadNumber,
      'Shipper Name': l.shipper.name,
      'Credit Limit ($)': l.shipper.creditLimit,
      'Carrier Assigned': l.carrier?.name || 'Unassigned',
      'Carrier MC#': l.carrier?.mcNumber || 'N/A',
      'Origin': `${l.stops[0].city}, ${l.stops[0].state}`,
      'Destination': `${l.stops[l.stops.length - 1].city}, ${l.stops[l.stops.length - 1].state}`,
      'Shipper Revenue ($)': l.financials.shipperRate,
      'Carrier Cost ($)': l.financials.carrierRate,
      'Net Spread Margin ($)': l.financials.margin,
      'Margin Spread (%)': `${l.financials.marginPercent.toFixed(1)}%`,
      'Rate Con Status': l.rateConSigned ? 'Signed & Locked' : 'Pending Signature',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Broker Margin Ledger');
    XLSX.writeFile(wb, `Brokerage_Margin_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Brokerage Command Center (3PL Sandbox)
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Manage shipper credit lines, monitor lane profit margins, verify FMCSA carrier compliance, and generate rate-cons.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsVerifyModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>FMCSA MC# Lookup</span>
          </button>

          <button
            onClick={handleExportBrokerageLedger}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Margin Ledger</span>
          </button>

          <Link
            href="/loads/new"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Load</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards with Margins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Shipper Gross Billing</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">+18.4% MTD</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-foreground font-mono">
              ${totalShipperRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-medium">Across {loads.length} active brokerage loads</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Carrier Linehaul Cost</span>
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono font-bold">A/P Direct</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-muted-foreground font-mono">
              ${totalCarrierCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-medium">Total payable to motor carriers</div>
        </div>

        <div className="bg-card border border-orange-200 dark:border-orange-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between text-xs text-orange-700 dark:text-orange-400 font-extrabold uppercase tracking-wider">
            <span>Net Broker Profit Margin</span>
            <span className="text-[10px] bg-orange-500 text-white px-2.5 py-0.5 rounded-full font-mono font-bold shadow-xs">
              {avgMarginPercentage.toFixed(1)}% Spread
            </span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
              ${totalNetMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-orange-600 font-semibold">Average ${(totalNetMargin / loads.length).toFixed(2)} profit / load</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Shipper Credit Limits</span>
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono font-bold">5 Accounts</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-foreground font-mono">$700,000</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-medium">Total authorized customer credit pool</div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('loads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'loads'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Active Freight Loads & Margins ({loads.length})
          </button>
          <button
            onClick={() => setActiveTab('shippers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'shippers'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Customer CRM & Credit Ledger ({shippers.length})
          </button>
          <button
            onClick={() => setActiveTab('dat_benchmarks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dat_benchmarks'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            DAT Market Rate Benchmarks
          </button>
        </div>
      </div>

      {/* Tab 1: Loads Table with Margin Breakdowns */}
      {activeTab === 'loads' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Load #</th>
                  <th className="py-3 px-4">Customer (Shipper)</th>
                  <th className="py-3 px-4">Origin $\rightarrow$ Dest</th>
                  <th className="py-3 px-4">Carrier & MC#</th>
                  <th className="py-3 px-4 text-right">Shipper Rate</th>
                  <th className="py-3 px-4 text-right">Carrier Pay</th>
                  <th className="py-3 px-4 text-right">Net Margin</th>
                  <th className="py-3 px-4 text-center">Rate Con</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {loads.map((load) => (
                  <tr key={load.id} className="hover:bg-orange-50/40 dark:hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {load.loadNumber}
                      <span className="block text-[10px] text-muted-foreground font-sans">{load.commodity}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-foreground">{load.shipper.name}</div>
                      <span className="text-[10px] text-muted-foreground font-mono">Limit: ${load.shipper.creditLimit.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-foreground font-semibold">
                        {load.stops[0].city}, {load.stops[0].state} $\rightarrow$ {load.stops[load.stops.length - 1].city}, {load.stops[load.stops.length - 1].state}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">{load.miles} miles</span>
                    </td>
                    <td className="py-3 px-4">
                      {load.carrier ? (
                        <div>
                          <div className="font-bold text-foreground flex items-center gap-1">
                            {load.carrier.name}
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">MC #{load.carrier.mcNumber}</span>
                        </div>
                      ) : (
                        <span className="text-orange-600 text-xs italic font-bold">Open for Tender</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                      ${load.financials.shipperRate.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                      ${load.financials.carrierRate.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        +${load.financials.margin.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {load.financials.marginPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setRateConLoad(load)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                          load.rateConSigned
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                            : 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300 border-orange-200 dark:border-orange-500/30 hover:bg-orange-100'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {load.rateConSigned ? 'Signed & Certified' : 'Generate & Sign'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/loads/${load.id}`}
                        className="p-2 rounded-xl bg-muted hover:bg-orange-500 hover:text-white text-foreground inline-block transition-all shadow-xs"
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
      )}

      {/* Tab 2: Shipper CRM */}
      {activeTab === 'shippers' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Shipper Account</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-center">Credit Score</th>
                  <th className="py-3 px-4 text-right">Credit Limit</th>
                  <th className="py-3 px-4 text-right">Available Credit</th>
                  <th className="py-3 px-4">Payment Terms</th>
                  <th className="py-3 px-4 text-center">Active Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {shippers.map((s) => (
                  <tr key={s.id} className="hover:bg-orange-50/40 dark:hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {s.name}
                      <span className="block text-[10px] text-muted-foreground font-mono">{s.accountNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 text-foreground">
                      <div>{s.contactName}</div>
                      <span className="text-[10px] text-muted-foreground">{s.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                        {s.creditScore}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                      ${s.creditLimit.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${s.availableCredit.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-foreground">
                      {s.paymentTerms}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        APPROVED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: DAT Benchmarks */}
      {activeTab === 'dat_benchmarks' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-xs">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Dallas, TX $\rightarrow$ Atlanta, GA (Reefer)</span>
            <div className="text-3xl font-extrabold font-mono text-foreground">$4.92 / mi</div>
            <p className="text-xs text-muted-foreground font-medium">DAT 7-Day Average: $4.65/mi. Your booked rate is beating market spread by +$0.27/mi (+5.8%).</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-xs">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Gary, IN $\rightarrow$ Wichita, KS (Flatbed)</span>
            <div className="text-3xl font-extrabold font-mono text-foreground">$4.43 / mi</div>
            <p className="text-xs text-muted-foreground font-medium">DAT 7-Day Average: $4.20/mi. Capacity is tight on I-80 steel lanes. High demand.</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-xs">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Orlando, FL $\rightarrow$ Bronx, NY (Reefer)</span>
            <div className="text-3xl font-extrabold font-mono text-foreground">$4.07 / mi</div>
            <p className="text-xs text-muted-foreground font-medium">DAT 7-Day Average: $3.85/mi. Produce season surcharge locked with customer.</p>
          </div>
        </div>
      )}

      {/* Rate Con Modal */}
      <RateConModal
        isOpen={!!rateConLoad}
        onClose={() => setRateConLoad(null)}
        load={rateConLoad}
        onSignComplete={(signer) => {
          if (rateConLoad) {
            setLoads(loads.map(l => l.id === rateConLoad.id ? { ...l, rateConSigned: true, rateConSignerName: signer } : l));
          }
        }}
      />

      {/* Carrier Verify Modal */}
      <CarrierVerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />
    </div>
  );
}
