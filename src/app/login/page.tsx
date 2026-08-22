'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Truck, Briefcase, Lock, Mail, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2, User, KeyRound
} from 'lucide-react';
import { authService } from '@/lib/services/authService';
import { UserRole } from '@/types/database.types';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await authService.signIn(email, password);
    setIsLoading(false);

    if (res.success && res.user) {
      if (res.user.role === 'dispatcher') {
        router.push('/dispatcher/dashboard');
      } else {
        router.push('/broker/dashboard');
      }
    } else {
      setError(res.error || 'Invalid login credentials. Please try again.');
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    const user = authService.setDemoSession(role);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'dispatcher') {
        router.push('/dispatcher/dashboard');
      } else {
        router.push('/broker/dashboard');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 font-sans selection:bg-orange-500 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-orange-500/15 via-amber-400/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo Header */}
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
            Sign in to your TMS workspace
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Enter your credentials or choose a 1-click test persona below.
          </p>
        </div>

        {/* 1-Click Instant Demo Persona Selector */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Instant Demo Login
            </span>
            <span className="text-[10px] bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 px-2 py-0.5 rounded-full font-mono">
              Fast Track
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleDemoLogin('broker')}
              className="p-2.5 rounded-xl border border-orange-200 dark:border-orange-500/30 bg-orange-50/50 hover:bg-orange-50 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <Briefcase className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="font-bold text-[11px] text-foreground">Broker (3PL)</div>
              <div className="text-[9px] text-muted-foreground font-medium truncate">Shipper CRM</div>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleDemoLogin('dispatcher')}
              className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <Truck className="w-3.5 h-3.5 text-orange-500" />
                <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="font-bold text-[11px] text-foreground">Dispatcher</div>
              <div className="text-[9px] text-muted-foreground font-medium truncate">Fleet Roster</div>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleDemoLogin('admin')}
              className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-500/30 bg-purple-50/50 hover:bg-purple-50 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <ArrowRight className="w-3 h-3 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="font-bold text-[11px] text-foreground">Super Admin</div>
              <div className="text-[9px] text-muted-foreground font-medium truncate">Platform Cockpit</div>
            </button>
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-xl text-xs font-semibold flex items-center gap-2">
              <KeyRound className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-foreground mb-1">Work Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  type="email"
                  placeholder="broker@apexlogistics.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-foreground">Password</label>
                <span className="text-[11px] text-muted-foreground">Default: password123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Authenticating with Supabase...' : 'Sign In to Workspace'}</span>
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-muted-foreground font-medium">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
            Create an Account $\rightarrow$
          </Link>
        </div>
      </div>
    </div>
  );
}
