'use client'

import { useState, useEffect } from 'react';
import LoadTable from '@/components/loads/LoadTable';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportLoadsToExcel } from '@/lib/excel';
import { createClient } from '@/lib/supabase/client';
import { LoadRow } from '@/types/database.types';

export default function LoadsPage() {
  const [exporting, setExporting] = useState(false);
  const supabase = createClient();

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data, error } = await supabase.from('loads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      exportLoadsToExcel(data as LoadRow[]);
    } catch (err) {
      console.error('Failed to export loads', err);
      alert('Failed to export data to Excel.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Loads</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            onClick={handleExport}
            disabled={exporting}
          >
            <Download className="w-4 h-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export to Excel'}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
            + New Load
          </Button>
        </div>
      </div>
      <LoadTable />
    </div>
  );
}
