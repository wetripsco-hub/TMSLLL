import React from 'react';
import { LoadStatus } from '@/types/tms';
import { cn } from '@/lib/utils';

interface DispatchBadgeProps {
  status: LoadStatus;
  className?: string;
}

export function DispatchBadge({ status, className }: DispatchBadgeProps) {
  const configs: Record<LoadStatus, { label: string; dotColor: string; bg: string; text: string; border: string }> = {
    available: { label: 'Available', dotColor: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20' },
    booked: { label: 'Booked', dotColor: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/20' },
    dispatched: { label: 'Dispatched', dotColor: 'bg-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-500/20' },
    loaded: { label: 'Loaded', dotColor: 'bg-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-500/20' },
    in_transit: { label: 'In Transit', dotColor: 'bg-orange-500 animate-pulse', bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-500/30' },
    delivered: { label: 'Delivered', dotColor: 'bg-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/20' },
    invoiced: { label: 'Invoiced', dotColor: 'bg-teal-500', bg: 'bg-teal-50 dark:bg-teal-500/10', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-500/20' },
    paid: { label: 'Paid', dotColor: 'bg-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' },
    cancelled: { label: 'Cancelled', dotColor: 'bg-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-500/20' },
  };

  const config = configs[status] || configs.available;

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border', config.bg, config.text, config.border, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
      {config.label}
    </span>
  );
}
