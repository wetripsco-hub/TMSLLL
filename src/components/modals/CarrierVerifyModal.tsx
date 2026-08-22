'use client';

import React, { useState } from 'react';
import { X, Search, ShieldCheck, ShieldAlert, CheckCircle, FileText, Building2, Truck, AlertTriangle } from 'lucide-react';
import { initialMockCarriers } from '@/lib/mock-data';

interface CarrierVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CarrierVerifyModal({ isOpen, onClose }: CarrierVerifyModalProps) {
  const [mcInput, setMcInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcInput.trim()) return;

    setIsSearching(true);
    setHasSearched(false);

    setTimeout(() => {
      const cleanMC = mcInput.replace(/\D/g, '');
      const found = initialMockCarriers.find(
        (c) => c.mcNumber.includes(cleanMC) || c.dotNumber.includes(cleanMC) || c.name.toLowerCase().includes(mcInput.toLowerCase())
      );

      if (found) {
        setSearchResult(found);
      } else {
        // Generate simulated FMCSA live report
        setSearchResult({
          name: `Freight Pioneer Express LLC (MC #${cleanMC || '993182'})`,
          mcNumber: cleanMC || '993182',
          dotNumber: '3819201',
          contactName: 'Dispatch Operations',
          phone: '+1 (800) 555-0192',
          email: 'compliance@freightpioneer.com',
          safetyRating: 'Satisfactory',
          safetyScore: 92,
          insuranceCompany: 'Nationwide Commercial Mutual',
          insuranceCoverageAmount: 1000000,
          insuranceExpiration: '2026-12-15',
          daysToInsuranceExpiry: 115,
          w9Verified: true,
          coiVerified: true,
          authorityActive: true,
          status: 'active',
          equipmentFleet: ['dry_van', 'reefer'],
          totalLoadsCompleted: 38,
          onTimeDeliveryRate: 97.4,
          averageRatePerMile: 2.65,
        });
      }
      setIsSearching(false);
      setHasSearched(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-foreground p-6 sm:p-7">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Live FMCSA SAFER Database Lookup</span>
        </div>
        <h2 className="text-xl font-extrabold text-foreground mb-1">
          Carrier Compliance & Fraud Verification
        </h2>
        <p className="text-xs text-muted-foreground mb-5 font-medium">
          Instantly verify active operating authority, insurance policy limits, safety scores, and double-brokering alerts.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter MC# (e.g. 1049281, 892110, 761920) or Carrier Name..."
              value={mcInput}
              onChange={(e) => setMcInput(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-orange-500/25 flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSearching ? 'Verifying...' : 'Verify MC#'}
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="flex items-center gap-2 mb-6 text-[11px] text-muted-foreground">
          <span>Try sample:</span>
          {['1049281', '892110', '761920', '449102'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setMcInput(sample);
              }}
              className="px-2.5 py-1 rounded-lg bg-muted border border-border hover:border-orange-300 hover:text-orange-600 text-foreground font-mono text-[10px] font-bold transition-colors"
            >
              MC #{sample}
            </button>
          ))}
        </div>

        {/* Results Card */}
        {searchResult && (
          <div className="bg-background border border-border rounded-xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-foreground text-sm">{searchResult.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-mono">
                    AUTHORITY ACTIVE
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">
                  MC #{searchResult.mcNumber} • DOT #{searchResult.dotNumber}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Safety Score</div>
                <div className="text-lg font-extrabold text-emerald-600 font-mono">{searchResult.safetyScore || 92}/100</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-card p-2.5 rounded-xl border border-border">
                <span className="text-[10px] text-muted-foreground block font-sans">FMCSA Rating</span>
                <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  {searchResult.safetyRating}
                </span>
              </div>
              <div className="bg-card p-2.5 rounded-xl border border-border">
                <span className="text-[10px] text-muted-foreground block font-sans">Auto Liability</span>
                <span className="font-bold text-foreground mt-0.5">
                  ${(searchResult.insuranceCoverageAmount || 1000000).toLocaleString()}
                </span>
              </div>
              <div className="bg-card p-2.5 rounded-xl border border-border">
                <span className="text-[10px] text-muted-foreground block font-sans">Insurance Expiry</span>
                <span className={`font-bold mt-0.5 block ${searchResult.daysToInsuranceExpiry < 30 ? 'text-orange-600' : 'text-foreground'}`}>
                  {searchResult.insuranceExpiration} ({searchResult.daysToInsuranceExpiry}d)
                </span>
              </div>
            </div>

            {searchResult.daysToInsuranceExpiry < 30 && (
              <div className="flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl text-amber-800 dark:text-amber-300 text-xs font-medium">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-orange-500" />
                <span>Notice: Insurance policy renews in {searchResult.daysToInsuranceExpiry} days. An updated COI will be requested upon dispatch.</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-border">
              <span className="text-[11px] text-muted-foreground font-medium">W-9 on File & Certificate Verified</span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-colors"
              >
                Approve & Dispatch Carrier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
