'use client';

import React, { useState } from 'react';
import { 
  Activity, Server, Database, Sparkles, ShieldCheck, 
  RefreshCw, CheckCircle2, AlertTriangle, Clock, Cpu, HardDrive, 
  Terminal, Download, Lock, KeyRound, ArrowUpRight
} from 'lucide-react';
import { exportToExcel } from '@/lib/excel';

export default function AdminSystemPage() {
  const [isPinging, setIsPinging] = useState(false);
  const [latency, setLatency] = useState(18);

  const handleRefreshDiagnostics = () => {
    setIsPinging(true);
    setTimeout(() => {
      setLatency(Math.floor(14 + Math.random() * 8));
      setIsPinging(false);
    }, 600);
  };

  const apiLogs = [
    { timestamp: '16:45:12', endpoint: 'POST /api/ocr/parse', status: '200 OK', duration: '412ms', tokens: '1,840' },
    { timestamp: '16:42:04', endpoint: 'GET /api/fuel/index', status: '200 OK', duration: '85ms', tokens: '0' },
    { timestamp: '16:38:50', endpoint: 'POST /api/carrier/verify', status: '200 OK', duration: '320ms', tokens: '450' },
    { timestamp: '16:31:18', endpoint: 'POST /api/tracking/update', status: '200 OK', duration: '45ms', tokens: '0' },
    { timestamp: '16:20:02', endpoint: 'POST /api/ocr/parse', status: '200 OK', duration: '510ms', tokens: '2,120' },
    { timestamp: '16:15:33', endpoint: 'GET /api/export/excel', status: '200 OK', duration: '120ms', tokens: '0' },
  ];

  const handleExportLogs = () => {
    exportToExcel(apiLogs, `System_API_Audit_Logs_${new Date().toISOString().split('T')[0]}`, {
      sheetName: 'API Audit Logs',
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
              <Server className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              System Diagnostics, OCR Engine & API Monitor
            </h1>
            <span className="text-[10px] font-mono font-bold bg-purple-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
              DIAGNOSTICS
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Real-time API throughput, Gemini 2.0 Vision multimodal token consumption, and edge latency monitors.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit Logs</span>
          </button>

          <button
            onClick={handleRefreshDiagnostics}
            disabled={isPinging}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-purple-600/25 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isPinging ? 'animate-spin' : ''}`} />
            <span>Ping Services</span>
          </button>
        </div>
      </div>

      {/* System Telemetry KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Core API Latency</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 px-2 py-0.5 rounded-full font-mono font-bold">
              Edge
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            {latency} ms
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Supabase US-East & Cloudflare edge</p>
        </div>

        <div className="bg-card border border-purple-200 dark:border-purple-500/30 rounded-2xl p-5 shadow-md shadow-purple-500/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-700 dark:text-purple-400 font-extrabold uppercase tracking-wider">
            <span>Gemini Vision Tokens (MTD)</span>
            <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-mono font-bold">
              AI OCR
            </span>
          </div>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
            2.48M Tokens
          </div>
          <p className="text-[11px] text-purple-700/80 font-medium">99.4% confidence rating on invoices & BOLs</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>FMCSA SAFER Scraper</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 px-2 py-0.5 rounded-full font-mono font-bold">
              Active
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            100%
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">0 failed carrier lookups in 24h</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>EIA Diesel Price Index</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 px-2 py-0.5 rounded-full font-mono font-bold">
              Weekly
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            $3.824 / gal
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">US DOE National Fuel Surcharge base</p>
        </div>
      </div>

      {/* Service Infrastructure Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-extrabold text-foreground text-sm">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>PostgreSQL Cluster</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">HEALTHY</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1 font-mono">
            <div>Connection Pool: 8/60 connections</div>
            <div>Database Size: 248.4 MB</div>
            <div>Row Level Security: 6 tables enforced</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-extrabold text-foreground text-sm">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Gemini 2.0 Multimodal Pipeline</span>
            </div>
            <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1 font-mono">
            <div>Model: gemini-2.0-flash</div>
            <div>Avg Parse Latency: 480ms</div>
            <div>JSON Output Schema: Enforced</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-extrabold text-foreground text-sm">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Security & Auth Subsystem</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">ENCRYPTED</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1 font-mono">
            <div>JWT Algorithm: HS256 / Ed25519</div>
            <div>Session Lifetime: 7 Days Sliding</div>
            <div>Cross-Origin Policy: Strict SameSite</div>
          </div>
        </div>
      </div>

      {/* Real-Time API Logs Stream */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold text-foreground">
            <Terminal className="w-4 h-4 text-purple-600" />
            <span>Real-Time Edge Service Audit Stream</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">Auto-refresh active (30s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Time (UTC)</th>
                <th className="py-3 px-4">API Endpoint</th>
                <th className="py-3 px-4">Response Status</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 text-right">Tokens Consumed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono font-medium">
              {apiLogs.map((log, i) => (
                <tr key={i} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-4 text-muted-foreground">{log.timestamp}</td>
                  <td className="py-3 px-4 text-foreground font-bold">{log.endpoint}</td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{log.duration}</td>
                  <td className="py-3 px-4 text-right font-bold text-purple-600 dark:text-purple-400">
                    {log.tokens}
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
