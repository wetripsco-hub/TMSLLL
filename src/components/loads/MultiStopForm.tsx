export default function MultiStopForm() {
  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
      <h3 className="text-lg font-medium text-white mb-4">Multi-Stop Route Planner</h3>
      <div className="space-y-4 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-zinc-400 mb-1">Origin</label>
            <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" placeholder="Enter origin..." />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-zinc-400 mb-1">Stop 1</label>
            <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" placeholder="Enter stop..." />
          </div>
          <button className="text-red-400 hover:text-red-300 mt-6 text-sm">Remove</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-zinc-400 mb-1">Destination</label>
            <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" placeholder="Enter destination..." />
          </div>
        </div>
        <button className="text-blue-400 hover:text-blue-300 font-medium">+ Add another stop</button>
      </div>
    </div>
  );
}
