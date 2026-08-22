'use client';

import React, { useEffect, useState } from 'react';
import { 
  Briefcase, ShieldCheck, AlertTriangle, Search, Plus, 
  Download, Phone, Mail, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { carrierService } from '@/lib/services/carrierService';
import { CarrierProfile } from '@/types/tms';
import { CarrierVerifyModal } from '@/components/modals/CarrierVerifyModal';
import * as XLSX from 'xlsx';

export default function BrokerCarriersPage() {
  const [carriers, setCarriers] = useState<CarrierProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  useEffect(() => {
    carrierService.getCarriers().then(setCarriers);
  }, []);

  const filteredCarriers = carriers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.mcNumber.includes(searchQuery) ||
    c.dotNumber.includes(searchQuery)
  );

  const handleExportExcel = () => {
    const data = filteredCarriers.map((c) => ({
      'MC #': c.mcNumber,
      'DOT #': c.dotNumber,
      'Carrier Name': c.name,
      'Contact': c.contactName,
      'Phone': c.phone,
      'Safety Rating': c.safetyRating,
      'Safety Score': c.safetyScore,
      'Insurance Expiry': c.insuranceExpiration,
      'Days to Expiry': c.daysToInsuranceExpiry,
      'BIPD Coverage ($)': c.insuranceCoverageAmount,
      'Factoring Company': c.factoringCompany || 'Direct Pay',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Carriers Compliance');
    XLSX.writeFile(wb, `Carrier_Compliance_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Carrier Compliance & Safety Registry
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Monitor FMCSA SAFER safety ratings, active operating authority, insurance expirations, and fraud risk scores.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Roster</span>
          </button>

          <button
            onClick={() => setIsVerifyModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/25 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>FMCSA SAFER Audit</span>
          </button>
        </div>
      </div>

      {/* Insurance Alert Banner */}
      <div className="bg-amber-50/80 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300">
              1 Carrier Insurance Expiring within 30 Days
            </h3>
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              Auto-notification email dispatched to Eagle Express (MC #761920) requesting renewed COI.
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search MC#, DOT#, or Carrier Name..."
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
                <th className="py-3 px-4">MC / DOT #</th>
                <th className="py-3 px-4">Motor Carrier Legal Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Safety Rating</th>
                <th className="py-3 px-4">Insurance Policy & Expiry</th>
                <th className="py-3 px-4">Factoring</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {filteredCarriers.map((c) => (
                <tr key={c.id} className="hover:bg-orange-50/40 dark:hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    <div>MC #{c.mcNumber}</div>
                    <span className="text-[10px] text-muted-foreground">DOT #{c.dotNumber}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      {c.name}
                      {c.preferred && <span className="text-[10px] bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 px-1.5 py-0.2 rounded font-bold">PREF</span>}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{c.city}, {c.state}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-foreground font-semibold">{c.contactName}</div>
                    <span className="text-[10px] text-muted-foreground font-mono">{c.phone}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/20">
                      {c.safetyRating} ({c.safetyScore}/100)
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-foreground font-semibold">${(c.insuranceCoverageAmount / 1000000).toFixed(1)}M Auto Liability</div>
                    <span className={`text-[10px] font-mono font-bold ${
                      c.daysToInsuranceExpiry < 30 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
                    }`}>
                      Expires: {c.insuranceExpiration} ({c.daysToInsuranceExpiry}d left)
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-muted-foreground">
                    {c.factoringCompany || 'Direct Pay'}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-bold uppercase">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CarrierVerifyModal isOpen={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)} />
    </div>
  );
}
