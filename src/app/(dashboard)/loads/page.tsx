import LoadTable from '@/components/loads/LoadTable';

export default function LoadsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Loads</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors text-sm">
          + New Load
        </button>
      </div>
      <LoadTable />
    </div>
  );
}
