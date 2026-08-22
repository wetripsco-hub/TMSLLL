'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Truck, Briefcase, Lock, Mail, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2, User, Building, Phone
} from 'lucide-react';
import { authService } from '@/lib/services/authService';
import { UserRole } from '@/types/database.types';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('broker');
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await authService.signUp({
      email: formData.email,
      fullName: formData.fullName,
      companyName: formData.companyName,
      role,
      phone: formData.phone,
    });

    setIsLoading(false);

    if (res.success && res.user) {
      if (role === 'dispatcher') {
        router.push('/dispatcher/dashboard');
      } else {
        router.push('/broker/dashboard');
      }
    } else {
      setError(res.error || 'Failed to create workspace. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 font-sans selection:bg-orange-500 selection:text-white py-12">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-orange-500/15 via-amber-400/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25">
              <Truck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              Freight<span className="text-orange-500">Flow</span> AI
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Create your FreightFlow AI workspace
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Select your operational role to configure your dedicated tools and workflows.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
            Step 1: Choose Your Primary Operations Mode
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('broker')}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                role === 'broker'
                  ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-500/15 text-foreground shadow-sm'
                  : 'border-border bg-card hover:bg-muted text-muted-foreground'
              }`}
            >
              {role === 'broker' && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
              <Briefcase className={`w-5 h-5 mb-2 ${role === 'broker' ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'}`} />
              <div className="font-extrabold text-xs text-foreground">Freight Broker (3PL)</div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Manage shippers, credit limits, carrier compliance, margins, and accounting.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole('dispatcher')}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                role === 'dispatcher'
                  ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-500/15 text-foreground shadow-sm'
                  : 'border-border bg-card hover:bg-muted text-muted-foreground'
              }`}
            >
              {role === 'dispatcher' && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
              <Truck className={`w-5 h-5 mb-2 ${role === 'dispatcher' ? 'text-orange-500' : 'text-muted-foreground'}`} />
              <div className="font-extrabold text-xs text-foreground">Independent Dispatcher</div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Manage fleet trucks, driver check-ins, RPM yields, and driver tracking links.
              </p>
            </button>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
            Step 2: Account & Company Details
          </label>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-foreground mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    required
                    type="text"
                    placeholder="Marcus Sterling"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Company / DBA Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    required
                    type="text"
                    placeholder="Apex Global Freight LLC"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-foreground mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    required
                    type="email"
                    placeholder="marcus@apexlogistics.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Direct Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  type="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Creating Workspace...' : `Launch ${role === 'broker' ? 'Brokerage' : 'Dispatcher'} Workspace`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
            Sign In Here $\rightarrow$
          </Link>
        </div>
      </div>
    </div>
  );
}
