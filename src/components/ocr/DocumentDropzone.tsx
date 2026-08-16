import { UploadCloud } from 'lucide-react';

export default function DocumentDropzone() {
  return (
    <div className="border-2 border-dashed border-zinc-700 rounded-xl p-12 text-center hover:bg-zinc-800/30 transition-colors cursor-pointer bg-zinc-900/50 flex flex-col items-center justify-center">
      <UploadCloud className="h-10 w-10 text-zinc-400 mb-4" />
      <h3 className="text-lg font-medium text-white mb-2">Drop BOLs or Invoices here</h3>
      <p className="text-sm text-zinc-500">Supports PDF, JPG, PNG (Max 10MB)</p>
      <button className="mt-6 bg-white text-zinc-950 px-4 py-2 rounded font-medium text-sm hover:bg-zinc-200 transition-colors">
        Browse Files
      </button>
    </div>
  );
}
