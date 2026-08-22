'use client';

import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-xs animate-pulse space-y-3 font-sans">
      <div className="flex justify-between items-center">
        <div className="h-3 w-28 bg-muted rounded-md" />
        <div className="h-4 w-12 bg-muted rounded-full" />
      </div>
      <div className="h-8 w-36 bg-muted rounded-lg" />
      <div className="h-2.5 w-48 bg-muted rounded-md" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="animate-pulse border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-3.5 bg-muted rounded-md w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 4, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-xs">
      <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center animate-pulse">
        <div className="h-4 w-32 bg-muted rounded-md" />
        <div className="h-4 w-20 bg-muted rounded-md" />
      </div>
      <table className="w-full text-left">
        <tbody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
