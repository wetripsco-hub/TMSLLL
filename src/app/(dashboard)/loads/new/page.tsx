import MultiStopForm from '@/components/loads/MultiStopForm';

export default function NewLoadPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Create New Load</h1>
      <MultiStopForm />
      <div className="mt-6 flex justify-end gap-4">
        <button className="px-4 py-2 text-zinc-400 hover:text-white transition-colors">Cancel</button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors">
          Create Load
        </button>
      </div>
    </div>
  );
}
