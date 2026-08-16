import DocumentDropzone from '@/components/ocr/DocumentDropzone';
import VerifyInvoiceForm from '@/components/ocr/VerifyInvoiceForm';

export default function DocumentsPage() {
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-6">AI Document Scanner</h1>
      <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
        <div className="h-full bg-zinc-950 border border-zinc-800 rounded-lg p-6 flex flex-col">
          <DocumentDropzone />
          <div className="mt-6 flex-1 bg-zinc-900 rounded border border-zinc-800 flex items-center justify-center text-zinc-500">
            Document Preview
          </div>
        </div>
        <div className="h-full overflow-y-auto">
          <VerifyInvoiceForm />
        </div>
      </div>
    </div>
  );
}
