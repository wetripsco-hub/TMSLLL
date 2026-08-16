import { Bell, Search, UserCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 text-white">
      <div className="flex items-center bg-zinc-900 rounded-md px-3 py-1.5 border border-zinc-800 w-96">
        <Search className="h-4 w-4 text-zinc-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search loads, carriers, documents..." 
          className="bg-transparent border-none outline-none text-sm w-full text-zinc-200"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <button className="flex items-center gap-2 text-sm font-medium hover:text-zinc-300 transition-colors">
          <UserCircle className="h-6 w-6" />
          Admin User
        </button>
      </div>
    </header>
  );
}
