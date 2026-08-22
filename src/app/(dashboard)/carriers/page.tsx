'use client';

import React, { useState } from 'react';
import { 
  Briefcase, ShieldCheck, AlertTriangle, CheckCircle2, Search, 
  Plus, Download, Phone, Mail, FileText, Building2, Truck
} from 'lucide-react';
import { initialMockCarriers } from '@/lib/mock-data';
import { CarrierProfile } from '@/types/tms';
import { CarrierVerifyModal } from '@/components/modals/CarrierVerifyModal';
import * as XLSX from 'xlsx';

export default function CarriersPage() {
  const [carriers, setCarriers] = useState<CarrierProfile[]>(initialMockCarriers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const filteredCarriers = carriers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mcNumber.includes(searchQuery) ||
      c.dotNumber.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCarriers = () => {
    const data = carriers.map((c) => ({
      'Carrier Name': c.name,
      'MC Number': c.mcNumber,
      'DOT Number': c.dotNumber,
      'Safety Rating': c.safetyRating,
      'Safety Score': c.safetyScore,
      'Insurance Expiration': c.insuranceExpiration,
      'Days to Expiry': c.daysToInsuranceExpiry,
      'Insurance Limit ($)': c.insuranceCoverageAmount,
      'W-9 Verified': c.w9Verified ? 'YES' : 'NO',
      'COI Verified': c.coiVerified ? 'YES' : 'NO',
      'Factoring Partner': c.factoringCompany || 'Direct Pay',
      'Fleet Types': c.equipmentFleet.join(', ').toUpperCase(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Carrier Compliance');
    XLSX.writeFile(wb, `Carrier_Compliance_Registry_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Carrier Compliance & Fleet Registry
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Real-time FMCSA SAFER safety scores, active insurance monitoring, W-9 validation, and factoring notices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsVerifyOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>Verify New MC#</span>
          </button>

          <button
            onClick={handleExportCarriers}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Compliance</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-card p-3 rounded-2xl border border-border shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Carrier Name, MC#, DOT#, City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
          />
        </div>
        <span className="text-xs text-muted-foreground font-mono font-bold">
          {filteredCarriers.length} Carriers Listed
        </span>
      </div>

      {/* High-Density Carrier Grid */}
      <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Carrier Name & Location</th>
                <th className="py-3 px-4">MC# & DOT#</th>
                <th className="py-3 px-4 text-center">FMCSA Safety</th>
                <th className="py-3 px-4">Insurance Policy & Expiry</th>
                <th className="py-3 px-4 text-center">Compliance Badges</th>
                <th className="py-3 px-4">Factoring Partner</th>
                <th className="py-3 px-4 text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {filteredCarriers.map((carrier) => {
                const isExpiringSoon = carrier.daysToInsuranceExpiry < 30;

                return (
                  <tr key={carrier.id} className="hover:bg-orange-50/40 dark:hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        {carrier.name}
                        {carrier.safetyRating === 'Satisfactory' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{carrier.city}, {carrier.state} • {carrier.phone}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-foreground font-bold">MC #{carrier.mcNumber}</div>
                      <span className="text-[10px] text-muted-foreground">DOT #{carrier.dotNumber}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        carrier.safetyRating === 'Satisfactory'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                      }`}>
                        {carrier.safetyRating} ({carrier.safetyScore}/100)
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-foreground font-mono font-bold">${(carrier.insuranceCoverageAmount / 1000).toFixed(0)}k Auto Liability</div>
                      <div className={`text-[10px] font-mono flex items-center gap-1 font-bold ${
                        isExpiringSoon ? 'text-orange-600' : 'text-muted-foreground'
                      }`}>
                        {isExpiringSoon && <AlertTriangle className="w-3 h-3 text-orange-500" />}
                        <span>Expires: {carrier.insuranceExpiration} ({carrier.daysToInsuranceExpiry}d)</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-foreground" title="W-9 Tax Form on File">
                          W-9 ✓
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-foreground" title="Certificate of Insurance Verified">
                          COI ✓
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-foreground text-xs font-bold">{carrier.factoringCompany || 'Direct QuickPay'}</span>
                      <span className="text-[10px] text-muted-foreground block font-mono">{carrier.equipmentFleet.join(', ').toUpperCase()}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="font-bold text-foreground">{carrier.onTimeDeliveryRate}% On-Time</div>
                      <span className="text-[10px] text-muted-foreground">{carrier.totalLoadsCompleted} loads</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CarrierVerifyModal isOpen={isVerifyOpen} onClose={() => setIsVerifyOpen(false)} />
    </div>
  );
}
