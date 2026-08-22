import React from 'react';
import { DollarSign, TrendingUp, Truck, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { DispatchLoad } from '@/types/tms';
import { cn } from '@/lib/utils';

interface DispatchStatsProps {
  loads: DispatchLoad[];
}

export function DispatchStats({ loads }: DispatchStatsProps) {
  const activeLoads = loads.filter((l) => ['dispatched', 'loaded', 'in_transit'].includes(l.status)).length;
  const deliveredLoads = loads.filter((l) => l.status === 'delivered').length;
  
  const totalGrossRevenue = loads.reduce((acc, l) => acc + l.financials.shipperRate, 0);
  const totalMargin = loads.reduce((acc, l) => acc + l.financials.margin, 0);
  const avgMarginPercent = totalGrossRevenue > 0 ? (totalMargin / totalGrossRevenue) * 100 : 0;

  const stats = [
    {
      title: 'Active In-Transit',
      value: `${activeLoads} Units`,
      subtext: `${loads.length} Total Loads Tracked`,
      icon: Truck,
      iconBg: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
      badge: 'Live GPS',
      badgeColor: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300 border-orange-200 dark:border-orange-500/30',
    },
    {
      title: 'Total Gross Revenue',
      value: `$${totalGrossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtext: '+18.4% vs last month',
      icon: DollarSign,
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
      badge: '+18.4%',
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    },
    {
      title: 'Net Spread Margin',
      value: `$${totalMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtext: `${avgMarginPercent.toFixed(1)}% Average Spread`,
      icon: TrendingUp,
      iconBg: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
      badge: 'Margin Guard',
      badgeColor: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300 border-orange-200 dark:border-orange-500/30',
    },
    {
      title: 'Delivered (Uninvoiced)',
      value: `${deliveredLoads} Loads`,
      subtext: 'Pending billing audit',
      icon: CheckCircle2,
      iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
      badge: 'Action req',
      badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div 
            key={i} 
            className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all hover:border-orange-200 dark:hover:border-orange-500/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</span>
              <span className={cn('text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border font-mono', stat.badgeColor)}>
                {stat.badge}
              </span>
            </div>
            <div className="my-3 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold tracking-tight text-foreground font-mono">{stat.value}</span>
              <div className={cn("p-2.5 rounded-xl", stat.iconBg)}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{stat.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
