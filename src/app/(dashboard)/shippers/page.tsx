'use client';

import React, { useState } from 'react';
import { 
  Users, DollarSign, ShieldCheck, Download, Search, Plus, 
  Building2, Phone, Mail, CheckCircle2, TrendingUp, AlertCircle
} from 'lucide-react';
import { initialMockShippers } from '@/lib/mock-data';
import { ShipperProfile } from '@/types/tms';
import * as XLSX from 'xlsx';

export default function ShippersPage() {
  const [shippers, setShippers] = useState<ShipperProfile[]>(initialMockShippers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Shipper Form State
  const [newShipper, setNewShipper] = useState({
    name: '',
    contactName: '',
    phone: '',
    email: '',
    creditLimit: 100000,
    paymentTerms: 'Net 30' as const,
    primaryCommodity: 'General Freight',
  });

  const filteredShippers = shippers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportShippers = () => {
    const data = shippers.map((s) => ({
      'Account #': s.accountNumber,
      'Shipper Name': s.name,
      'Contact Person': s.contactName,
      'Phone': s.phone,
      'Email': s.email,
      'Credit Score': s.creditScore,
      'Credit Limit ($)': s.creditLimit,
      'Available Credit ($)': s.availableCredit,
      'Payment Terms': s.paymentTerms,
      'Total Loads': s.totalLoadsBooked,
      'MTD Volume ($)': s.mtdVolume,
      'YTD Volume ($)': s.ytdVolume,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Shipper CRM');
    XLSX.writeFile(wb, `Shipper_Credit_CRM_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleAddShipper = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ShipperProfile = {
      id: `shp_${Date.now()}`,
      name: newShipper.name,
      accountNumber: `ACT-${newShipper.name.substring(0, 3).toUpperCase()}-0${shippers.length + 1}`,
      contactName: newShipper.contactName,
      phone: newShipper.phone,
      email: newShipper.email,
      billingAddress: '100 Corporate Pkwy',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      creditScore: 88,
      creditLimit: Number(newShipper.creditLimit),
      availableCredit: Number(newShipper.creditLimit),
      paymentTerms: newShipper.paymentTerms,
      status: 'active',
      totalLoadsBooked: 0,
      mtdVolume: 0,
      ytdVolume: 0,
      primaryCommodity: newShipper.primaryCommodity,
      rating: 5.0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setShippers([...shippers, created]);
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Customer CRM & Credit Ledger
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Manage customer accounts, monitor Experian freight credit limits, set billing payment terms, and track MTD spend.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportShippers}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Shipper CRM</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shipper Account</span>
          </button>
        </div>
      </div>

      {/* Search & Counter Bar */}
      <div className="flex items-center justify-between gap-4 bg-card p-3 rounded-2xl border border-border shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Shipper Name, Account#, Contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
          />
        </div>
        <span className="text-xs text-muted-foreground font-mono font-bold">
          {filteredShippers.length} Accounts Active
        </span>
      </div>

      {/* High-Density Shipper CRM Grid */}
      <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Shipper Account</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4 text-center">Credit Score</th>
                <th className="py-3 px-4 text-right">Credit Limit</th>
                <th className="py-3 px-4 text-right">Available Credit</th>
                <th className="py-3 px-4">Payment Terms</th>
                <th className="py-3 px-4 text-right">MTD Volume</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {filteredShippers.map((shipper) => {
                const creditUtilization = ((shipper.creditLimit - shipper.availableCredit) / shipper.creditLimit) * 100;

                return (
                  <tr key={shipper.id} className="hover:bg-orange-50/40 dark:hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {shipper.name}
                      <span className="block text-[10px] text-muted-foreground font-mono">{shipper.accountNumber} • {shipper.city}, {shipper.state}</span>
                    </td>

                    <td className="py-3.5 px-4 text-foreground">
                      <div className="font-bold">{shipper.contactName}</div>
                      <span className="text-[10px] text-muted-foreground">{shipper.phone}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        {shipper.creditScore}/100 Experian
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                      ${shipper.creditLimit.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${shipper.availableCredit.toLocaleString()}
                      <span className="block text-[9px] text-muted-foreground font-sans">
                        {creditUtilization.toFixed(0)}% used
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-foreground font-bold">
                      {shipper.paymentTerms}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                      ${shipper.mtdVolume.toLocaleString()}
                      <span className="block text-[10px] text-muted-foreground font-sans">{shipper.totalLoadsBooked} loads</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        APPROVED
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Shipper Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 text-foreground space-y-4">
            <h2 className="text-xl font-extrabold text-foreground">Onboard New Customer Account</h2>
            <form onSubmit={handleAddShipper} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-muted-foreground font-bold mb-1">Company Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Acme Cold Logistics"
                  value={newShipper.name}
                  onChange={(e) => setNewShipper({ ...newShipper, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-bold mb-1">Contact Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Sarah Jenkins"
                    value={newShipper.contactName}
                    onChange={(e) => setNewShipper({ ...newShipper, contactName: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-bold mb-1">Phone</label>
                  <input
                    required
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={newShipper.phone}
                    onChange={(e) => setNewShipper({ ...newShipper, phone: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-bold mb-1">Approved Credit Limit ($)</label>
                  <input
                    required
                    type="number"
                    value={newShipper.creditLimit}
                    onChange={(e) => setNewShipper({ ...newShipper, creditLimit: Number(e.target.value) })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-bold mb-1">Payment Terms</label>
                  <select
                    value={newShipper.paymentTerms}
                    onChange={(e) => setNewShipper({ ...newShipper, paymentTerms: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-bold"
                  >
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="QuickPay 2%">QuickPay 2%</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl shadow-md shadow-orange-500/25"
                >
                  Save & Approve Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
