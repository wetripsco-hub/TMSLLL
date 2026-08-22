'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyLoadDetailsRedirect({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/broker/loads/${resolvedParams.id}`);
  }, [router, resolvedParams.id]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground font-semibold">Loading load dossier...</span>
      </div>
    </div>
  );
}
