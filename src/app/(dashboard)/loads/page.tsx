import { DispatchBoard } from '@/components/dispatch/DispatchBoard';
import { initialMockLoads } from '@/lib/mock-data';

export default function LoadsPage() {
  return <DispatchBoard initialLoads={initialMockLoads} />;
}
