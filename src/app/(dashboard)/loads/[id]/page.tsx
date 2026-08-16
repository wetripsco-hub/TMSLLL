import LoadStatusBadge from '@/components/loads/LoadStatusBadge';

export default function LoadDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Load {params.id}
            <LoadStatusBadge status="in_transit" />
          </h1>
          <p className="text-zinc-400 mt-1">Carrier: Swift Logistics | MC-123456</p>
        </div>
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors border border-zinc-700">
          Edit Load
        </button>
      </div>
    </div>
  );
}
