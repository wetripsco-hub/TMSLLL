import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LoadStatus } from '@/types/load';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function LoadStatusBadge({ status }: { status: LoadStatus }) {
  const statusConfig: Record<LoadStatus, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-zinc-800 text-zinc-300' },
    dispatched: { label: 'Dispatched', className: 'bg-blue-900/50 text-blue-400' },
    in_transit: { label: 'In Transit', className: 'bg-yellow-900/50 text-yellow-400' },
    delivered: { label: 'Delivered', className: 'bg-green-900/50 text-green-400' },
    invoiced: { label: 'Invoiced', className: 'bg-purple-900/50 text-purple-400' },
    cancelled: { label: 'Cancelled', className: 'bg-red-900/50 text-red-400' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent', config.className)}>
      {config.label}
    </span>
  );
}
