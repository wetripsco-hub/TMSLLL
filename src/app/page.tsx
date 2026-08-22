'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Truck, ArrowRight, ShieldCheck, Sparkles, FileText, CheckCircle2, 
  DollarSign, TrendingUp, Navigation, Users, Briefcase, Zap, Download, 
  Lock, RefreshCw, ChevronRight, BarChart3, Check, Star, Play
} from 'lucide-react';
import { LandingNav } from '@/components/layout/LandingNav';
import { LandingFooter } from '@/components/layout/LandingFooter';
import { BookDemoModal } from '@/components/modals/BookDemoModal';
import { CarrierVerifyModal } from '@/components/modals/CarrierVerifyModal';

export default function LandingPage() {
  const [activeSegment, setActiveSegment] = useState<'broker' | 'dispatcher'>('broker');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyOpen] = useState(false);
  const [annualBilling, setAnnualBilling] = useState(true);
  
  // Interactive ROI Calculator State
  const [monthlyLoads, setMonthlyLoads] = useState<number>(85);
  const [avgMarginPerLoad, setAvgMarginPerLoad] = useState<number>(450);

  // Calculations
  const hoursSavedPerMonth = Math.round(monthlyLoads * 0.85); // 50 mins saved per load
  const annualMarginEarned = Math.round(monthlyLoads * avgMarginPerLoad * 12);
  const annualTimeCostSaved = Math.round(hoursSavedPerMonth * 35 * 12); // $35/hr dispatcher wage

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors selection:bg-orange-500 selection:text-white">
      <LandingNav />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-border bg-gradient-to-b from-orange-50/50 via-background to-background dark:from-slate-900/40 dark:to-background">
        {/* Glowing Background Radial Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-orange-500/15 via-amber-400/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Announcement Chip */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-orange-200 dark:border-orange-500/30 text-foreground text-xs font-semibold backdrop-blur-md shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-600 dark:text-orange-400 font-bold">TailAdmin & Gemini 2.0 AI</span>
              <span className="text-muted-foreground">•</span>
              <span>Zero-Manual-Entry Document OCR</span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              The Operating System for Modern{' '}
              <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Freight Brokerages & Dispatchers
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Unified cloud TMS engineered for commercial 3PL brokers and independent dispatch fleets: instant Gemini 2.0 OCR document parsing, automated carrier compliance audits, Margin Guard analytics, and live smartphone GPS telematics.
            </p>

            {/* Dual Commercial Selection Paths */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2 text-left">
              {/* Path 1: Brokerage Edition */}
              <div className="p-5 rounded-2xl bg-card border border-orange-200 dark:border-orange-500/30 hover:border-orange-500 transition-all shadow-xs space-y-3 group">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 font-bold">
                    <Briefcase className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-500/20">
                    3PL EDITION
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-base">Freight Brokerage Edition</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Customer Shipper CRM, Experian credit limit pools, gross profit margins ($ / %), and live FMCSA SAFER safety registry audits.
                  </p>
                </div>
                <div className="pt-1 flex items-center gap-2">
                  <Link
                    href="/demo/broker"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs text-center shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Launch Broker Sandbox</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Path 2: Dispatcher Edition */}
              <div className="p-5 rounded-2xl bg-card border border-border hover:border-orange-500 transition-all shadow-xs space-y-3 group">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-muted text-foreground font-bold">
                    <Truck className="w-5 h-5 text-orange-500" />
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">
                    FLEET DISPATCH
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-base">Truck Dispatcher Edition</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Power unit fleet directory, assigned driver schedules, 5-12% commission yield slider, and 1-click mobile GPS tracking links.
                  </p>
                </div>
                <div className="pt-1 flex items-center gap-2">
                  <Link
                    href="/demo/dispatcher"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-card hover:bg-muted text-foreground font-extrabold text-xs text-center border border-border shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Launch Dispatcher Sandbox</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Buyer Actions Row */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3 text-xs">
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted text-foreground font-bold border border-border shadow-xs transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Request Enterprise Access / Dedicated Sandbox</span>
              </button>

              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Start Instant 14-Day Trial</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-10 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-muted-foreground font-semibold">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>FMCSA SAFER API Live</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>SOC2 Type II Certified</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Gemini 2.0 Flash AI</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>$420M+ Freight Dispatched</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Graphic UI Preview */}
          <div className="mt-14 max-w-5xl mx-auto bg-card border border-border rounded-2xl shadow-xl p-4 sm:p-6 backdrop-blur-xl">
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-muted-foreground font-semibold">freightflow-ai.tailadmin.app</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 font-mono text-[10px] font-bold">
                  ● LIVE TELEMATICS ACTIVE
                </span>
              </div>
            </div>

            {/* Quick Hero Dashboard Teaser */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: AI OCR Extraction */}
              <div className="bg-background p-4 rounded-xl border border-border flex flex-col justify-between space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    Gemini 2.0 OCR Engine
                  </span>
                  <span className="text-[10px] font-mono text-orange-700 bg-orange-100 dark:bg-orange-500/20 px-2 py-0.5 rounded-full font-bold">
                    1.2s parse
                  </span>
                </div>
                <div className="p-3 bg-card rounded-lg border border-border font-mono text-[11px] space-y-1">
                  <div className="text-muted-foreground">Rate Con: <span className="text-foreground font-bold">FF-88902</span></div>
                  <div className="text-muted-foreground">Carrier: <span className="text-orange-600 font-bold">Titan Freight (MC 1049281)</span></div>
                  <div className="text-muted-foreground">Linehaul: <span className="text-foreground font-bold">$3,100.00</span></div>
                  <div className="text-muted-foreground text-[10px]">Confidence: 98.4% • Signatures valid</div>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center justify-between font-semibold">
                  <span>Target Rate Audit: Verified</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>

              {/* Card 2: Broker Margin Protected */}
              <div className="bg-background p-4 rounded-xl border border-border flex flex-col justify-between space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                    Real-Time Gross Margin
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    +19.48% Margin
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="bg-card p-2.5 rounded-lg border border-border">
                    <span className="text-[10px] text-muted-foreground block font-sans font-semibold">Shipper Rate</span>
                    <span className="text-sm font-bold text-foreground">$3,850.00</span>
                  </div>
                  <div className="bg-card p-2.5 rounded-lg border border-border">
                    <span className="text-[10px] text-muted-foreground block font-sans font-semibold">Carrier Cost</span>
                    <span className="text-sm font-bold text-muted-foreground">$3,100.00</span>
                  </div>
                </div>
                <div className="p-2 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-lg text-center font-mono text-xs font-extrabold text-orange-700 dark:text-orange-400">
                  +$750.00 Net Spread on Load
                </div>
              </div>

              {/* Card 3: Live Driver Telematics */}
              <div className="bg-background p-4 rounded-xl border border-border flex flex-col justify-between space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-blue-500" />
                    Mobile Driver GPS Link
                  </span>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                    No App Needed
                  </span>
                </div>
                <div className="p-3 bg-card rounded-lg border border-border space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Driver: Marcus Vance</span>
                    <span className="text-[10px] text-orange-600 font-mono font-bold">64 MPH</span>
                  </div>
                  <div className="text-muted-foreground text-[11px]">Location: Jackson, MS (I-20 East)</div>
                  <div className="text-muted-foreground text-[10px]">ETA to Kroger DC: Tomorrow 07:15 AM</div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                  <span>Geofence Pulse: Normal</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL SEGMENT SHOWCASE (BROKERS VS DISPATCHERS) */}
      <section id="comparison" className="py-20 bg-muted/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-orange-600 tracking-wider uppercase">Tailored Architectures</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-1">
              Engineered for Both Sides of the Freight Industry
            </h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              Whether you are an asset-light 3PL brokerage managing hundreds of shipper accounts or an independent dispatcher running high-yield truck fleets, FreightFlow AI configures to your workflow.
            </p>

            {/* Toggle Segment Tabs */}
            <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-card border border-border shadow-xs">
              <button
                type="button"
                onClick={() => setActiveSegment('broker')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSegment === 'broker'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Freight Brokerages (3PL)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSegment('dispatcher')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSegment === 'dispatcher'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Independent Truck Dispatchers</span>
              </button>
            </div>
          </div>

          {/* Segment Details Box */}
          {activeSegment === 'broker' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Automated Carrier Compliance</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Direct FMCSA SAFER API integration continuously checks carrier operating authority, safety ratings, insurance expiration alerts, and prevents double-brokering fraud.
                </p>
                <ul className="text-xs text-foreground font-medium space-y-2 pt-2 border-t border-border">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Instant MC# / DOT# lookup modal</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Certificate of Insurance (COI) tracking</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Automated 15-day policy renewal triggers</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Shipper CRM & Margin Guard</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Monitor customer credit limits (Experian freight scores), track net profit margins ($ and %) on every lane, and automatically lock in linehaul spreads before dispatching.
                </p>
                <ul className="text-xs text-foreground font-medium space-y-2 pt-2 border-t border-border">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-500" /> Customer credit limit enforcement</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-500" /> Rate-per-mile (RPM) benchmark comparison</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-500" /> 1-Click QuickBooks & SheetJS export</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xs">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">1-Click Rate Con eSign</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Generate certified PDF rate confirmations with pre-filled load stops and collect carrier digital signatures instantly with legal tamper-evident timestamping.
                  </p>
                </div>
                <Link
                  href="/demo/broker"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl text-center shadow-md shadow-orange-500/20 transition-all"
                >
                  Launch Live Brokerage Sandbox $\rightarrow$
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Multi-Carrier Fleet Dispatch</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dispatch Dry Vans, Reefers, Flatbeds, Step Decks, and Box Trucks across multiple motor carriers from a single command board without switching logins.
                </p>
                <ul className="text-xs text-foreground font-medium space-y-2 pt-2 border-t border-border">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Multi-stop route planner with appointment windows</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Driver check-in / check-out status timestamps</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Equipment & trailer assignment matrices</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 flex items-center justify-center">
                  <Navigation className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Driver Mobile Link (No App)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Drivers simply click a secure SMS or WhatsApp web link to share real-time GPS locations and upload POD photos with zero app store downloads.
                </p>
                <ul className="text-xs text-foreground font-medium space-y-2 pt-2 border-t border-border">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-500" /> 1-Click WhatsApp / SMS tracking token</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-500" /> Geofenced arrival & departure alerts</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-500" /> Mobile camera photo capture for instant POD</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xs">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Factoring & 10% Fee Settlements</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Automate your dispatcher percentage billing (e.g. 5-10% of gross linehaul) and generate formatted carrier settlements ready for TriumphPay, Apex, or OTR Capital.
                  </p>
                </div>
                <Link
                  href="/demo/dispatcher"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl text-center shadow-md shadow-orange-500/20 transition-all"
                >
                  Launch Live Dispatcher Sandbox $\rightarrow$
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. GEMINI 2.0 FLASH AI OCR DOCUMENT SCANNER DEEP DIVE */}
      <section id="ai-ocr" className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multimodal Vision OCR Engine</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Scan Invoices, BOLs & PODs in Seconds with Gemini 2.0 AI
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Tired of manual invoice entry and typos? Our integrated Gemini Vision engine analyzes handwritten BOL stamps, linehaul tables, fuel surcharges, and detention slips with 98%+ precision.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Automated field matching against active dispatch loads',
                  'Detects unexpected carrier accessorials & detention fee claims',
                  'Extracts handwritten consignee signee signatures & temperature stamps',
                  'Direct 1-click Push to Database & QuickBooks ledger',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-foreground font-semibold">
                    <div className="w-5 h-5 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/documents"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold transition-all shadow-md shadow-orange-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open AI Document Scanner Hub</span>
                </Link>
              </div>
            </div>

            {/* Split Screen OCR Interactive Mockup */}
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-500" />
                  Live Vision OCR Output: BOL-APX-88902.pdf
                </span>
                <span className="text-[10px] font-mono text-orange-700 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400 px-2.5 py-0.5 rounded-full font-bold border border-orange-200 dark:border-orange-500/20">
                  98.4% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="bg-muted/40 p-3 rounded-xl border border-border">
                  <span className="text-muted-foreground text-[10px] block font-sans font-semibold">Extracted Shipper</span>
                  <span className="text-foreground font-bold">Apex Cold Foods</span>
                </div>
                <div className="bg-muted/40 p-3 rounded-xl border border-border">
                  <span className="text-muted-foreground text-[10px] block font-sans font-semibold">Extracted Carrier</span>
                  <span className="text-orange-600 font-bold">Titan Freight Lines</span>
                </div>
                <div className="bg-muted/40 p-3 rounded-xl border border-border">
                  <span className="text-muted-foreground text-[10px] block font-sans font-semibold">Agreed Linehaul</span>
                  <span className="text-foreground font-bold">$3,100.00 USD</span>
                </div>
                <div className="bg-muted/40 p-3 rounded-xl border border-border">
                  <span className="text-muted-foreground text-[10px] block font-sans font-semibold">Fuel Surcharge</span>
                  <span className="text-foreground font-bold">$420.00 USD</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between font-semibold">
                <span>Verified Match: Load #FF-88902 in database</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px]">APPROVED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE ROI CALCULATOR */}
      <section id="calculator" className="py-20 bg-muted/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-orange-600 tracking-wider uppercase">Interactive ROI Engine</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-1">
              Calculate Your Dispatching Profit Increase
            </h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              See how eliminating manual load typing, automating tracking calls, and preventing unbilled detention directly adds thousands to your bottom line.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-foreground">Loads Dispatched Monthly:</span>
                  <span className="text-orange-600 font-mono text-base font-extrabold">{monthlyLoads} loads</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={monthlyLoads}
                  onChange={(e) => setMonthlyLoads(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
                  <span>10 loads</span>
                  <span>250 loads</span>
                  <span>500+ loads</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-foreground">Average Broker Margin per Load:</span>
                  <span className="text-orange-600 font-mono text-base font-extrabold">${avgMarginPerLoad}</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="1200"
                  step="25"
                  value={avgMarginPerLoad}
                  onChange={(e) => setAvgMarginPerLoad(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
                  <span>$150</span>
                  <span>$600</span>
                  <span>$1,200</span>
                </div>
              </div>
            </div>

            {/* Results Callout */}
            <div className="bg-muted/50 border border-border rounded-2xl p-6 space-y-4 text-center sm:text-left">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Estimated Hours Saved</span>
                <span className="text-3xl font-extrabold text-foreground font-mono">{hoursSavedPerMonth} hrs / mo</span>
                <span className="text-xs text-orange-600 font-bold block mt-0.5">~{(hoursSavedPerMonth / 4.3).toFixed(1)} hours saved every week</span>
              </div>

              <div className="pt-3 border-t border-border">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Annual Labor Cost Recovered</span>
                <span className="text-2xl font-extrabold text-emerald-600 font-mono">${annualTimeCostSaved.toLocaleString()} / yr</span>
              </div>

              <div className="pt-3 border-t border-border">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Annual Margin Run-Rate</span>
                <span className="text-xl font-bold text-foreground font-mono">${annualMarginEarned.toLocaleString()} / yr</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING MATRIX */}
      <section id="pricing" className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-orange-600 tracking-wider uppercase">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-1">
              Simple, Predictable Plans with Zero Hidden Fees
            </h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              Start with a 14-day full feature trial. No credit card required to explore the sandbox.
            </p>

            {/* Billing toggle */}
            <div className="mt-6 inline-flex items-center gap-3 bg-card border border-border p-1.5 rounded-2xl text-xs font-bold shadow-xs">
              <button
                type="button"
                onClick={() => setAnnualBilling(false)}
                className={`px-4 py-1.5 rounded-xl transition-colors ${
                  !annualBilling ? 'bg-orange-500 text-white shadow-xs' : 'text-muted-foreground'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setAnnualBilling(true)}
                className={`px-4 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                  annualBilling ? 'bg-orange-500 text-white shadow-xs' : 'text-muted-foreground'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-2 py-0.2 bg-orange-700 text-white rounded-full text-[10px]">SAVE 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plan 1 */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Solo Dispatcher</h3>
                <p className="text-xs text-muted-foreground">Perfect for independent truck dispatchers running 1 to 5 active trucks.</p>
                <div className="my-4">
                  <span className="text-3xl font-extrabold text-foreground font-mono">
                    ${annualBilling ? '79' : '99'}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal"> / month</span>
                </div>
                <ul className="text-xs text-foreground font-medium space-y-2.5 pt-4 border-t border-border">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Up to 5 Active Trucks</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> 100 AI OCR Scans / Month</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> 1-Click Rate Con eSign</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Driver Mobile GPS Links</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> SheetJS Excel Export</li>
                </ul>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full py-3 bg-muted hover:bg-orange-50 hover:text-orange-700 border border-border text-foreground font-bold text-xs rounded-xl transition-all"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Plan 2: Most Popular in Orange */}
            <div className="bg-card border-2 border-orange-500 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 relative shadow-xl shadow-orange-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 text-white font-extrabold text-[10px] rounded-full uppercase tracking-wider shadow-md">
                MOST POPULAR FOR BROKERAGES
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-foreground">Growing Brokerage (3PL)</h3>
                <p className="text-xs text-muted-foreground">Complete logistics suite for expanding freight brokerages and dispatch agencies.</p>
                <div className="my-4">
                  <span className="text-3xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
                    ${annualBilling ? '239' : '299'}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal"> / month</span>
                </div>
                <ul className="text-xs text-foreground font-semibold space-y-2.5 pt-4 border-t border-border">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Unlimited Loads & Active Trucks</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> 1,000 Gemini 2.0 OCR Scans / Mo</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Live FMCSA SAFER Compliance Check</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Shipper Credit CRM & Margin Guard</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> QuickBooks & TriumphPay Sync</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Up to 10 Dispatcher Seats</li>
                </ul>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Plan 3 */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Enterprise Fleet</h3>
                <p className="text-xs text-muted-foreground">High-volume 3PLs, dedicated fleets, and enterprise logistics networks.</p>
                <div className="my-4">
                  <span className="text-3xl font-extrabold text-foreground font-mono">
                    ${annualBilling ? '559' : '699'}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal"> / month</span>
                </div>
                <ul className="text-xs text-foreground font-medium space-y-2.5 pt-4 border-t border-border">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Unlimited Everything</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Unlimited AI OCR Document Scanning</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Custom EDI & Webhook Integrations</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Dedicated Account Manager & SLA</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Multi-Tenant Role Permissions</li>
                </ul>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full py-3 bg-muted hover:bg-orange-50 hover:text-orange-700 border border-border text-foreground font-bold text-xs rounded-xl transition-all"
              >
                Talk to Enterprise Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 bg-gradient-to-b from-card to-orange-50/60 dark:from-card dark:to-slate-900/60 text-center border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Ready to Cut 80% of Your Manual Freight Admin?
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto font-medium">
            Join hundreds of freight brokers and dispatchers who run high-margin operations on FreightFlow AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all"
            >
              Book Live Strategy Demo
            </button>
            <Link
              href="/demo/broker"
              className="w-full sm:w-auto px-8 py-3.5 bg-card hover:bg-muted text-foreground font-bold text-sm rounded-xl border border-border shadow-xs transition-all"
            >
              Explore Interactive Sandbox
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />

      {/* Modals */}
      <BookDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      <CarrierVerifyModal isOpen={isVerifyModalOpen} onClose={() => setIsVerifyOpen(false)} />
    </div>
  );
}
