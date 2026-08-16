export default function VerifyInvoiceForm() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-white mb-4">Extracted Invoice Data</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-zinc-400 text-sm mb-1">Invoice Number</label>
          <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" defaultValue="INV-2023-089" />
        </div>
        <div>
          <label className="block text-zinc-400 text-sm mb-1">Total Amount</label>
          <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" defaultValue="$1,250.00" />
        </div>
        <div className="col-span-2">
          <label className="block text-zinc-400 text-sm mb-1">Carrier Name</label>
          <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" defaultValue="Swift Logistics" />
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium w-full transition-colors">
          Verify & Approve
        </button>
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded text-sm font-medium w-full transition-colors">
          Needs Manual Review
        </button>
      </div>
    </div>
  );
}
