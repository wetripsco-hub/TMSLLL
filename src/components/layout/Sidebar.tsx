import Link from 'next/link';
import { LayoutDashboard, Truck, FileText, Users, Briefcase, DollarSign } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-zinc-950 text-white flex flex-col p-4 border-r border-zinc-800">
      <div className="text-xl font-bold mb-8 text-zinc-100 flex items-center gap-2">
        <Truck className="h-6 w-6" />
        Brokerage TMS
      </div>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 transition-colors">
          <LayoutDashboard className="h-5 w-5" /> Dashboard
        </Link>
        <Link href="/loads" className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 transition-colors">
          <Truck className="h-5 w-5" /> Loads
        </Link>
        <Link href="/documents" className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 transition-colors">
          <FileText className="h-5 w-5" /> Documents
        </Link>
        <Link href="/carriers" className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 transition-colors">
          <Briefcase className="h-5 w-5" /> Carriers
        </Link>
        <Link href="/shippers" className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 transition-colors">
          <Users className="h-5 w-5" /> Shippers
        </Link>
        <Link href="/accounting" className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 transition-colors">
          <DollarSign className="h-5 w-5" /> Accounting
        </Link>
      </nav>
    </div>
  );
}
