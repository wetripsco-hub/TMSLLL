'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, ShieldCheck, Search, Filter, Phone, Mail, 
  Building, UserCheck, CheckCircle2, Clock, Ban, ArrowUpRight, Plus, Download
} from 'lucide-react';
import { authService } from '@/lib/services/authService';
import { UserProfile, UserRole } from '@/types/database.types';
import * as XLSX from 'xlsx';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    authService.getUsers().then(setUsers);
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.companyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = async (userId: string) => {
    const updated = await authService.toggleUserStatus(userId);
    setUsers(updated);
  };

  const handleExportUsers = () => {
    const data = filteredUsers.map((u) => ({
      'User ID': u.id,
      'Full Name': u.fullName,
      'Work Email': u.email,
      'Company Name': u.companyName,
      'Role': u.role.toUpperCase(),
      'Status': (u.status || 'active').toUpperCase(),
      'Last Active': u.lastActiveAt || 'Unknown',
      'Created At': u.createdAt,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Platform Users');
    XLSX.writeFile(wb, `Platform_Users_Audit_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              User Directory & Multi-Tenant Access
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Manage Brokerage and Dispatcher tenancies, monitor last_active_at telemetry, and configure administrative roles.
          </p>
        </div>

        <button
          onClick={handleExportUsers}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export User Audit</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-1.5">
          {[
            { key: 'all', label: 'All Accounts' },
            { key: 'broker', label: 'Brokers (3PL)' },
            { key: 'dispatcher', label: 'Dispatchers' },
            { key: 'admin', label: 'Super Admins' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRoleFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                roleFilter === tab.key
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search User Name, Company, Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500 font-medium"
          />
        </div>
      </div>

      {/* Users Matrix */}
      <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">User & Contact</th>
                <th className="py-3 px-4">Organization Name</th>
                <th className="py-3 px-4">Role Permission</th>
                <th className="py-3 px-4">Last Active Timestamp</th>
                <th className="py-3 px-4 text-center">Account Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-purple-50/30 dark:hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                        {u.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{u.fullName}</div>
                        <span className="text-[10px] text-muted-foreground font-mono">{u.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground">{u.companyName}</div>
                    <span className="text-[10px] text-muted-foreground font-mono">ID: {u.id}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      u.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20'
                        : u.role === 'broker'
                        ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-foreground font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{u.lastActiveAt || 'Just now'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.status === 'suspended'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                    }`}>
                      {u.status || 'active'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                        u.status === 'suspended'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-muted text-muted-foreground border-border hover:text-rose-600 hover:border-rose-300'
                      }`}
                    >
                      {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                    </button>
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
