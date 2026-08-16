import * as XLSX from 'xlsx';
import { LoadRow } from '@/types/database.types';

export function exportLoadsToExcel(loads: LoadRow[]) {
  const formattedData = loads.map(load => ({
    'Load #': load.reference_number,
    'Status': load.status.toUpperCase(),
    'Shipper': load.shipper_id,
    'Carrier': load.carrier_id || 'Unassigned',
    'Equipment': load.equipment_type,
    'Weight (lbs)': load.weight,
    'Shipper Rate ($)': load.shipper_rate,
    'Carrier Rate ($)': load.carrier_rate || 0,
    'Margin ($)': load.margin_amount || 0,
    'Margin (%)': load.margin_percentage ? `${load.margin_percentage.toFixed(1)}%` : '0%',
    'Created At': new Date(load.created_at).toLocaleDateString()
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Set column widths
  const colWidths = [
    { wch: 15 }, // Load #
    { wch: 15 }, // Status
    { wch: 20 }, // Shipper
    { wch: 20 }, // Carrier
    { wch: 15 }, // Equipment
    { wch: 12 }, // Weight
    { wch: 15 }, // Shipper Rate
    { wch: 15 }, // Carrier Rate
    { wch: 12 }, // Margin $
    { wch: 12 }, // Margin %
    { wch: 15 }, // Created
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Active Loads');

  XLSX.writeFile(workbook, `TMS_Loads_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportAccountingToExcel(data: any[]) {
  // Placeholder for accounting data export matching the requirements
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  const colWidths = [
    { wch: 15 }, // Invoice#
    { wch: 15 }, // Issue Date
    { wch: 15 }, // Due Date
    { wch: 15 }, // Total Amount
    { wch: 15 }, // Payment Status
  ];
  worksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Accounting Ledger');
  XLSX.writeFile(workbook, `TMS_Accounting_${new Date().toISOString().split('T')[0]}.xlsx`);
}
