'use client';

import React, { useEffect, useState } from 'react';
import { 
  Building, Users, Plus, Search, ShieldCheck, 
  CheckCircle2, AlertCircle, Clock, ArrowRight, ExternalLink, 
  Copy, Check, Download, Zap, KeyRound, Sparkles
} from 'lucide-react';
import { tenantService, TenantOrganization, DemoRequest } from '@/lib/services/tenantService';
import * as XLSX from 'xlsx';

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<TenantOrganization[]>([]);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'tenants' | 'requests'>('tenants');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Provisioning Modal State
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [selectedDemoRequest, setSelectedDemoRequest] = useState<DemoRequest | null>(null);
  const [provOrgName, setProvOrgName] = useState('');
  const [provAdminEmail, setProvAdminEmail] = useState('');
  const [provMcDot, setProvMcDot] = useState('');
  const [provTier, setProvTier] = useState<'starter' | 'growth' | 'enterprise'>('growth');
  const [provType, setProvType] = useState<'freight_brokerage' | 'independent_dispatch'>('freight_brokerage');
  const [provisionedSuccess, setProvisionedSuccess] = useState<TenantOrganization | null>(null);

  useEffect(() => {
    tenantService.getTenants().then(setTenants);
    tenantService.getDemoRequests().then(setDemoRequests);
  }, []);

  const openProvisionFromRequest = (req: DemoRequest) => {
    setSelectedDemoRequest(req);
    setProvOrgName(req.companyName);
    setProvAdminEmail(req.workEmail);
    setProvMcDot(req.mcDotNumber);
    setProvType(req.edition);
    setIsProvisionModalOpen(true);
    setProvisionedSuccess(null);
  };

  const handleProvisionTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await tenantService.provisionTenant({
      name: provOrgName,
      adminEmail: provAdminEmail,
      mcDotNumber: provMcDot,
      subscriptionTier: provTier,
      type: provType,
      demoRequestId: selectedDemoRequest?.id,
    });

    setTenants([created, ...tenants]);
    if (selectedDemoRequest) {
      setDemoRequests(demoRequests.map((r) => r.id === selectedDemoRequest.id ? { ...r, status: 'provisioned' } : r));
    }
    setProvisionedSuccess(created);
  };

  const handleCopyLink = (token: string) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/login?activation=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleToggleStatus = async (tenantId: string) => {
    const updated = await tenantService.toggleTenantStatus(tenantId);
    setTenants(updated);
  };

  const handleExportTenants = () => {
    const data = tenants.map((t) => ({
      'Tenant ID': t.id,
      'Organization Name': t.name,
      'Workspace Slug': t.slug,
      'Edition Type': t.type.toUpperCase(),
      'Subscription Tier': t.subscriptionTier.toUpperCase(),
      'Monthly MRR ($)': t.mrr,
      'Admin Email': t.adminEmail,
      'MC / DOT': t.mcDotNumber,
      'Status': t.status.toUpperCase(),
      'Activation Token': t.activationToken,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tenants Roster');
    XLSX.writeFile(wb, `Platform_Tenants_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const totalMRR = tenants.reduce((acc, t) => acc + t.mrr, 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
              <Building className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Tenant Organizations & Provisioning Portal
            </h1>
            <span className="text-[10px] font-mono font-bold bg-purple-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
              MULTI-TENANCY
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Manage provisioned brokerages and dispatch fleets, review enterprise demo requests, and generate activation keys.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportTenants}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Roster</span>
          </button>

          <button
            onClick={() => {
              setSelectedDemoRequest(null);
              setProvOrgName('');
              setProvAdminEmail('');
              setProvMcDot('');
              setIsProvisionModalOpen(true);
              setProvisionedSuccess(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-purple-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>1-Click Provision Tenant</span>
          </button>
        </div>
      </div>

      {/* High-Impact Tenancy KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Total Active Tenancies</span>
            <span className="text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              Isolated
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            {tenants.length} Companies
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            {tenants.filter((t) => t.type === 'freight_brokerage').length} Brokerages • {tenants.filter((t) => t.type === 'independent_dispatch').length} Dispatch Fleets
          </p>
        </div>

        <div className="bg-card border border-purple-200 dark:border-purple-500/30 rounded-2xl p-5 shadow-md shadow-purple-500/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-700 dark:text-purple-400 font-extrabold uppercase tracking-wider">
            <span>Monthly Recurring Revenue (MRR)</span>
            <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-mono font-bold">
              SaaS Billing
            </span>
          </div>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
            ${totalMRR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-purple-700/80 font-medium">Across all active subscription tiers</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Pending Demo Queue</span>
            <span className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              Inbound
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            {demoRequests.filter((r) => r.status === 'pending').length} Inbound Requests
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Awaiting tenant sandbox provisioning</p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('tenants')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tenants'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Provisioned Tenants ({tenants.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'requests'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span>Inbound Demo Requests ({demoRequests.length})</span>
            {demoRequests.some((r) => r.status === 'pending') && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-orange-500 inline-block animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* Active Tab: Tenants Table */}
      {activeTab === 'tenants' && (
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Organization Name</th>
                  <th className="py-3 px-4">Workspace Slug</th>
                  <th className="py-3 px-4">Platform Type</th>
                  <th className="py-3 px-4">Tier & MRR</th>
                  <th className="py-3 px-4">Admin Email</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Activation Link</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-purple-50/30 dark:hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-purple-600" />
                        <span>{t.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">{t.mcDotNumber}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-purple-600 dark:text-purple-400 font-bold">
                      /{t.slug}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.type === 'freight_brokerage'
                          ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                      }`}>
                        {t.type === 'freight_brokerage' ? 'Brokerage (3PL)' : 'Fleet Dispatch'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-foreground">${t.mrr}/mo</div>
                      <span className="text-[10px] text-muted-foreground uppercase">{t.subscriptionTier} tier</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {t.adminEmail}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.status === 'suspended'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                      }`}>
                        {t.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleCopyLink(t.activationToken)}
                        className="px-2.5 py-1 bg-muted hover:bg-purple-50 hover:text-purple-700 text-foreground rounded-lg text-[11px] font-bold border border-border transition-colors inline-flex items-center gap-1"
                      >
                        {copiedToken === t.activationToken ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedToken === t.activationToken ? 'Copied' : 'Copy Link'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(t.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                          t.status === 'suspended'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-muted text-muted-foreground border-border hover:text-rose-600'
                        }`}
                      >
                        {t.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Tab: Demo Requests Table */}
      {activeTab === 'requests' && (
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Contact Name</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">MC / DOT #</th>
                  <th className="py-3 px-4">Requested Edition</th>
                  <th className="py-3 px-4">Volume / Size</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {demoRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-purple-50/30 dark:hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      <div>{r.fullName}</div>
                      <span className="text-[10px] text-muted-foreground font-mono">{r.workEmail}</span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {r.companyName}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {r.mcDotNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        r.edition === 'freight_brokerage'
                          ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200'
                      }`}>
                        {r.edition === 'freight_brokerage' ? 'Broker (3PL)' : 'Dispatch'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      {r.fleetSizeOrVolume}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {r.submittedAt}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        r.status === 'provisioned'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200'
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {r.status === 'pending' ? (
                        <button
                          onClick={() => openProvisionFromRequest(r)}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-extrabold transition-all shadow-xs"
                        >
                          Provision Tenant
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold">✓ Ready</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 1-Click Tenant Provisioning Modal */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-foreground">
            {!provisionedSuccess ? (
              <>
                <div className="border-b border-border pb-3">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase">
                    <Sparkles className="w-4 h-4" />
                    Instant Tenant Provisioning
                  </div>
                  <h2 className="text-lg font-extrabold text-foreground">Provision Dedicated Company Workspace</h2>
                </div>

                <form onSubmit={handleProvisionTenant} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Company Legal Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Apex Global Freight Logistics"
                      value={provOrgName}
                      onChange={(e) => setProvOrgName(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-purple-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">Target Admin Email</label>
                      <input
                        required
                        type="email"
                        placeholder="admin@company.com"
                        value={provAdminEmail}
                        onChange={(e) => setProvAdminEmail(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-purple-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">MC / DOT Number</label>
                      <input
                        type="text"
                        placeholder="MC-940128"
                        value={provMcDot}
                        onChange={(e) => setProvMcDot(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono focus:outline-none focus:border-purple-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">Platform Type</label>
                      <select
                        value={provType}
                        onChange={(e) => setProvType(e.target.value as any)}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-purple-500 font-medium"
                      >
                        <option value="freight_brokerage">Freight Brokerage (3PL)</option>
                        <option value="independent_dispatch">Independent Dispatch</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Subscription Tier</label>
                      <select
                        value={provTier}
                        onChange={(e) => setProvTier(e.target.value as any)}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-purple-500 font-medium"
                      >
                        <option value="starter">Starter ($239/mo)</option>
                        <option value="growth">Growth ($499/mo)</option>
                        <option value="enterprise">Enterprise ($999/mo)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setIsProvisionModalOpen(false)}
                      className="px-3.5 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl border border-border"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      Provision & Generate Link
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-4 space-y-3 text-xs">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-extrabold text-foreground">Workspace Provisioned!</h3>
                <p className="text-muted-foreground">
                  Tenant <strong className="text-foreground">{provisionedSuccess.name}</strong> has been provisioned with slug <span className="font-mono text-purple-600 font-bold">/{provisionedSuccess.slug}</span>.
                </p>

                <div className="p-3 bg-muted rounded-xl border border-border text-left font-mono space-y-1">
                  <div className="text-[10px] text-muted-foreground font-sans uppercase font-bold">Customer Activation Link:</div>
                  <div className="text-xs text-foreground truncate">{window.location.origin}/login?activation={provisionedSuccess.activationToken}</div>
                </div>

                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleCopyLink(provisionedSuccess.activationToken)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Customer Activation Link</span>
                  </button>
                  <button
                    onClick={() => setIsProvisionModalOpen(false)}
                    className="px-3.5 py-2 border border-border rounded-xl font-bold text-muted-foreground hover:text-foreground"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
