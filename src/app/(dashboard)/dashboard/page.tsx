export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Active Loads</h3>
          <p className="text-3xl font-bold text-white">24</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Pending Invoices</h3>
          <p className="text-3xl font-bold text-white">12</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Total Revenue (MTD)</h3>
          <p className="text-3xl font-bold text-white">$142,500</p>
        </div>
      </div>
    </div>
  );
}
