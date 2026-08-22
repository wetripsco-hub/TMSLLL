'use client';

import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, Download, CheckCircle2, Clock, 
  AlertCircle, FileText, ArrowUpRight, Search, Check, RefreshCw
} from 'lucide-react';
import { initialMockAccounting } from '@/lib/mock-data';
import { AccountingTransaction } from '@/types/tms';
import * as XLSX from 'xlsx';

export default function BrokerAccountingPage() {
  const [transactions, setTransactions] = useState<AccountingTransaction[]>(initialMockAccounting);
  const [activeTab, setActiveTab] = useState<'receivable' | 'payable'>('receivable');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTx = transactions.filter(
    (t) =>
      t.type === activeTab &&
      (t.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.loadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.partyName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalReceivables = transactions
    .filter((t) => t.type === 'receivable')
    .reduce((acc, t) => acc + t.balanceDue, 0);

  const totalPayables = transactions
    .filter((t) => t.type === 'payable')
    .reduce((acc, t) => acc + t.balanceDue, 0);

  const handleExportAccountingExcel = () => {
    const data = filteredTx.map((t) => ({
      'Invoice / Settlement #': t.referenceNumber,
      'Load #': t.loadNumber,
      'Account / Carrier': t.partyName,
      'Issue Date': t.issueDate,
      'Due Date': t.dueDate,
      'Total Amount ($)': t.amount,
      'Paid Amount ($)': t.paidAmount,
      'Balance Due ($)': t.balanceDue,
      'Aging Bucket': t.agingBucket,
      'Status': t.status.toUpperCase(),
      'Payment Ref / Factoring': t.paymentReference || t.factoringBatchId || 'Pending',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab === 'receivable' ? 'Accounts Receivable' : 'Carrier Payables');
    XLSX.writeFile(wb, `Broker_${activeTab.toUpperCase()}_Ledger_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleMarkAsPaid = (id: string) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...t, status: 'paid', paidAmount: t.amount, balanceDue: 0, paymentReference: `ACH-${Math.floor(100000 + Math.random() * 900000)}` } : t
      )
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <DollarSign className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Accounting, Invoicing & Settlement Hub
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Track customer Accounts Receivable (A/R), carrier settlements (A/P), aging buckets, and factoring batches.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportAccountingExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export {activeTab === 'receivable' ? 'A/R' : 'A/P'} Ledger</span>
          </button>
        </div>
      </div>

      {/* Accounting KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Outstanding A/R (Customer Invoices)</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              Receivables
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            ${totalReceivables.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Pending payment collection from active shippers</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Outstanding A/P (Carrier Settlements)</span>
            <span className="text-[10px] bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              Payables
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            ${totalPayables.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Due to motor carriers & factoring partners</p>
        </div>

        <div className="bg-card border border-orange-200 dark:border-orange-500/30 rounded-2xl p-5 shadow-md shadow-orange-500/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-orange-700 dark:text-orange-400 font-extrabold uppercase tracking-wider">
            <span>Net Working Capital Spread</span>
            <span className="text-[10px] bg-orange-500 text-white px-2.5 py-0.5 rounded-full font-mono font-bold shadow-xs">
              Spread
            </span>
          </div>
          <div className="text-3xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
            +${(totalReceivables - totalPayables).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-orange-700/80 font-medium">Positive cash flow coverage ratio</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('receivable')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'receivable'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Accounts Receivable (Shipper Invoices)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payable')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'payable'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Accounts Payable (Carrier Settlements)
          </button>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Ref#, Load#, Shipper, Carrier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
          />
        </div>
      </div>

      {/* Matrix Table */}
      <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Load #</th>
                <th className="py-3 px-4">{activeTab === 'receivable' ? 'Customer (Shipper)' : 'Motor Carrier / Factoring'}</th>
                <th className="py-3 px-4">Issue & Due Date</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Aging Bucket</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {filteredTx.map((t) => (
                <tr key={t.id} className="hover:bg-orange-50/40 dark:hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    {t.referenceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-orange-600 font-bold">
                    {t.loadNumber}
                  </td>
                  <td className="py-3.5 px-4 text-foreground font-bold">
                    {t.partyName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-muted-foreground">
                    <div>Issue: {t.issueDate}</div>
                    <span className="text-[10px] text-foreground font-bold">Due: {t.dueDate}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                    ${t.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-orange-600 dark:text-orange-400">
                    ${t.balanceDue.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      {t.agingBucket}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {t.status !== 'paid' ? (
                      <button
                        onClick={() => handleMarkAsPaid(t.id)}
                        className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground font-mono font-bold">
                        {t.paymentReference}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
