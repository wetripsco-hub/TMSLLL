'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, Building, DollarSign, ShieldCheck, Plus, 
  Search, Phone, Mail, MapPin, Download, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { shipperService } from '@/lib/services/shipperService';
import { ShipperAccount } from '@/types/tms';
import * as XLSX from 'xlsx';

export default function BrokerShippersPage() {
  const [shippers, setShippers] = useState<ShipperAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newShipperName, setNewShipperName] = useState('');
  const [newCreditLimit, setNewCreditLimit] = useState(75000);
  const [newContact, setNewContact] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    shipperService.getShippers().then(setShippers);
  }, []);

  const filteredShippers = shippers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCreditExtended = shippers.reduce((acc, s) => acc + s.creditLimit, 0);
  const totalAvailableCredit = shippers.reduce((acc, s) => acc + s.availableCredit, 0);

  const handleExportExcel = () => {
    const data = filteredShippers.map((s) => ({
      'Account #': s.accountNumber,
      'Company Name': s.name,
      'Contact Person': s.contactName,
      'Phone': s.phone,
      'Email': s.email,
      'Credit Limit ($)': s.creditLimit,
      'Available Credit ($)': s.availableCredit,
      'Payment Terms': s.paymentTerms,
      'Credit Status': (s.creditStatus || 'approved').toUpperCase(),
      'Location': `${s.city || 'Dallas'}, ${s.state || 'TX'}`,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Shippers CRM');
    XLSX.writeFile(wb, `Shippers_CRM_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleAddShipper = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await shipperService.addShipper({
      name: newShipperName,
      creditLimit: newCreditLimit,
      availableCredit: newCreditLimit,
      contactName: newContact,
      phone: newPhone,
      email: newEmail,
    });
    setShippers([created, ...shippers]);
    setIsAddModalOpen(false);
    setNewShipperName('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
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
            Manage shipper accounts, Experian commercial credit limits, payment terms, and active contracts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Accounts</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shipper Account</span>
          </button>
        </div>
      </div>

      {/* Credit Pool KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Total Credit Extended</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              Experian
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            ${totalCreditExtended.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Active credit approved across {shippers.length} shippers</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Available Shipper Credit</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              Liquid
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            ${totalAvailableCredit.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Ready for immediate freight booking</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Credit Risk Health</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              Prime
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            99.2%
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">0 accounts currently on credit hold</p>
        </div>
      </div>

      {/* Search & Grid */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Shipper Account or Contact..."
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
                <th className="py-3 px-4">Account #</th>
                <th className="py-3 px-4">Shipper Company</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Credit Limit</th>
                <th className="py-3 px-4">Available Credit</th>
                <th className="py-3 px-4">Terms</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {filteredShippers.map((s) => (
                <tr key={s.id} className="hover:bg-orange-50/40 dark:hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    {s.accountNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground">{s.name}</div>
                    <span className="text-[10px] text-muted-foreground">{s.city}, {s.state}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-foreground font-semibold">{s.contactName}</div>
                    <span className="text-[10px] text-muted-foreground">{s.phone}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    ${s.creditLimit.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ${s.availableCredit.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-muted-foreground">
                    {s.paymentTerms}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/20 uppercase">
                      {s.creditStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Shipper Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h2 className="text-lg font-extrabold text-foreground">Add New Shipper Account</h2>
            <form onSubmit={handleAddShipper} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Shipper Legal Name</label>
                <input
                  required
                  type="text"
                  placeholder="Archer Daniels Logistics LLC"
                  value={newShipperName}
                  onChange={(e) => setNewShipperName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Approved Credit Limit ($)</label>
                <input
                  required
                  type="number"
                  value={newCreditLimit}
                  onChange={(e) => setNewCreditLimit(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Primary Contact Name</label>
                <input
                  required
                  type="text"
                  placeholder="Dave Kowalski"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Direct Phone</label>
                  <input
                    required
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Work Email</label>
                  <input
                    required
                    type="email"
                    placeholder="dave@company.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
