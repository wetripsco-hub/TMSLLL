'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/authService';

export default function LoadsRedirect() {
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user?.role === 'dispatcher') {
      router.replace('/dispatcher/loads');
    } else {
      router.replace('/broker/loads');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground font-semibold">Loading dispatch board...</span>
      </div>
    </div>
  );
}
