'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, ArrowRight, ShieldCheck, Sparkles, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BookDemoModal } from '@/components/modals/BookDemoModal';

export function LandingNav() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-card/90 border-b border-border transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-foreground flex items-center gap-1.5">
                FreightFlow <span className="text-orange-600 dark:text-orange-400 font-mono text-xs px-1.5 py-0.2 rounded bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20">AI</span>
              </span>
              <span className="text-[10px] text-muted-foreground -mt-0.5 tracking-wider uppercase font-bold">Broker & Dispatch TMS</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-muted-foreground">
            <Link href="#features" className="hover:text-orange-600 transition-colors">
              Platform Features
            </Link>
            <Link href="#comparison" className="hover:text-orange-600 transition-colors">
              Brokers vs Dispatchers
            </Link>
            <Link href="#ai-ocr" className="hover:text-orange-600 transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              Gemini OCR Engine
            </Link>
            <Link href="#calculator" className="hover:text-orange-600 transition-colors">
              ROI Calculator
            </Link>
            <Link href="#pricing" className="hover:text-orange-600 transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="px-3.5 py-2 text-xs font-bold text-foreground hover:text-orange-600 rounded-xl hover:bg-orange-50 dark:hover:bg-muted transition-colors border border-border"
            >
              Sign In
            </Link>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Book VIP Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card px-4 py-4 space-y-3 text-sm animate-in slide-in-from-top-2 duration-200">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-foreground font-semibold hover:text-orange-600 py-1"
            >
              Platform Features
            </Link>
            <Link
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-foreground font-semibold hover:text-orange-600 py-1"
            >
              Brokers vs Dispatchers
            </Link>
            <Link
              href="#ai-ocr"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-foreground font-semibold hover:text-orange-600 py-1"
            >
              Gemini OCR Scanner
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-foreground font-semibold hover:text-orange-600 py-1"
            >
              Pricing
            </Link>
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link
                href="/demo/broker"
                className="w-full text-center py-2 bg-muted text-foreground rounded-xl text-xs font-bold border border-border"
              >
                Launch Broker Sandbox
              </Link>
              <Link
                href="/demo/dispatcher"
                className="w-full text-center py-2 bg-muted text-foreground rounded-xl text-xs font-bold border border-border"
              >
                Launch Dispatcher Sandbox
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDemoModalOpen(true);
                }}
                className="w-full py-2.5 bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Book VIP Demo
              </button>
            </div>
          </div>
        )}
      </header>

      <BookDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </>
  );
}
