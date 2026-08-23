import * as XLSX from 'xlsx';

export interface ExcelExportOptions {
  sheetName?: string;
  autoWidth?: boolean;
}

/**
 * Universal Excel exporter with formatting and auto-width calculations
 */
export function exportToExcel(
  data: Record<string, any>[],
  filename: string,
  options: ExcelExportOptions = {}
) {
  const { sheetName = 'Sheet1', autoWidth = true } = options;
  const worksheet = XLSX.utils.json_to_sheet(data);

  if (autoWidth && data.length > 0) {
    const keys = Object.keys(data[0]);
    worksheet['!cols'] = keys.map((key) => {
      let maxLen = key.length;
      data.forEach((row) => {
        const valStr = row[key] ? String(row[key]) : '';
        if (valStr.length > maxLen) {
          maxLen = valStr.length;
        }
      });
      return { wch: Math.min(Math.max(maxLen + 3, 12), 50) };
    });
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const cleanFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  XLSX.writeFile(workbook, cleanFilename);
}
