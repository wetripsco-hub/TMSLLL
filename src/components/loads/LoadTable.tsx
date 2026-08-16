export default function LoadTable() {
  return (
    <div className="w-full bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
      <table className="w-full text-sm text-left text-zinc-300">
        <thead className="text-xs text-zinc-400 uppercase bg-zinc-950 border-b border-zinc-800">
          <tr>
            <th className="px-6 py-3">Reference #</th>
            <th className="px-6 py-3">Origin</th>
            <th className="px-6 py-3">Destination</th>
            <th className="px-6 py-3">Carrier</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-zinc-800 hover:bg-zinc-800/50">
            <td className="px-6 py-4 font-medium text-white">LD-10042</td>
            <td className="px-6 py-4">Chicago, IL</td>
            <td className="px-6 py-4">Dallas, TX</td>
            <td className="px-6 py-4">Swift Logistics</td>
            <td className="px-6 py-4">In Transit</td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="text-blue-500 hover:underline">View</a>
            </td>
          </tr>
          <tr className="border-b border-zinc-800 hover:bg-zinc-800/50">
            <td className="px-6 py-4 font-medium text-white">LD-10043</td>
            <td className="px-6 py-4">Atlanta, GA</td>
            <td className="px-6 py-4">Miami, FL</td>
            <td className="px-6 py-4">Pending Assignment</td>
            <td className="px-6 py-4">Pending</td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="text-blue-500 hover:underline">View</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
