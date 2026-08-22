import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Zap, Lock, Mail } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-850 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-zinc-950 shadow-md">
                <Truck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-base tracking-tight text-white">
                FreightFlow <span className="text-emerald-400">AI</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              The next-generation logistics operating system designed to eliminate manual data entry, streamline multi-carrier dispatching, automate rate confirmations, and safeguard freight margins.
            </p>
            <div className="flex items-center gap-3 text-zinc-500 pt-1">
              <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> SOC2 Type II Certified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-blue-400" /> 256-Bit Encrypted
              </span>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/demo/broker" className="hover:text-emerald-400 transition-colors">Brokerage 3PL Sandbox</Link></li>
              <li><Link href="/demo/dispatcher" className="hover:text-emerald-400 transition-colors">Dispatcher Fleet Sandbox</Link></li>
              <li><Link href="/documents" className="hover:text-emerald-400 transition-colors">Gemini AI OCR Scanner</Link></li>
              <li><Link href="/loads" className="hover:text-emerald-400 transition-colors">Live Dispatch Grid</Link></li>
              <li><Link href="/accounting" className="hover:text-emerald-400 transition-colors">A/R & A/P Factoring Hub</Link></li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Solutions</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="hover:text-emerald-400 transition-colors">1-Click Rate Con eSign</Link></li>
              <li><Link href="#features" className="hover:text-emerald-400 transition-colors">Driver Mobile GPS Links</Link></li>
              <li><Link href="#features" className="hover:text-emerald-400 transition-colors">FMCSA SAFER Carrier Audit</Link></li>
              <li><Link href="#features" className="hover:text-emerald-400 transition-colors">SheetJS Excel Exporter</Link></li>
              <li><Link href="#features" className="hover:text-emerald-400 transition-colors">TriumphPay & QuickBooks Sync</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing & ROI</Link></li>
              <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Enterprise Login</Link></li>
              <li><Link href="#security" className="hover:text-emerald-400 transition-colors">Security & Trust</Link></li>
              <li><Link href="#contact" className="hover:text-emerald-400 transition-colors">Schedule Strategy Call</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} FreightFlow AI Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-zinc-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-zinc-300">Terms of Service</Link>
            <Link href="#" className="hover:text-zinc-300">FMCSA Compliance Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
