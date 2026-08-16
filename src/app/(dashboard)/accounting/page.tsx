'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportAccountingToExcel } from '@/lib/excel';

export default function AccountingPage() {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    try {
      // Mock data for accounting
      const mockData = [
        { 'Invoice#': 'INV-001', 'Issue Date': '2023-10-01', 'Due Date': '2023-10-31', 'Total Amount': 1500.00, 'Payment Status': 'Paid' },
        { 'Invoice#': 'INV-002', 'Issue Date': '2023-10-05', 'Due Date': '2023-11-04', 'Total Amount': 2300.50, 'Payment Status': 'Pending' },
      ];
      exportAccountingToExcel(mockData);
    } finally {
      setTimeout(() => setExporting(false), 500); // UI feel
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Accounting & Invoices</h1>
        <Button
          variant="outline"
          className="bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          onClick={handleExport}
          disabled={exporting}
        >
          <Download className="w-4 h-4 mr-2" />
          {exporting ? 'Exporting...' : 'Export to Excel'}
        </Button>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg text-zinc-400 text-center py-20">
        Accounting tables will go here
      </div>
    </div>
  );
}
