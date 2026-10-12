import React, { useState, useMemo } from 'react';
import {
  PlacementRecord,
  ExportFormat,
  ExportColumn,
} from '@/types/admin';
import {
  getMockPlacementRecords,
  filterPlacementRecords,
  calculateDepartmentStats,
  calculateSkillDistribution,
  exportToCsv,
  downloadFile,
} from '@/services/adminService';
import { DepartmentFilter } from '@/components/DepartmentFilter';
import { DateRangePicker } from '@/components/DateRangePicker';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Check,
  Sparkles,
  Layers,
  Settings2,
} from 'lucide-react';

type DatasetType = 'placements' | 'departments' | 'skills';

interface ColumnOption {
  key: string;
  label: string;
  selected: boolean;
}

const PLACEMENT_COLUMNS: ColumnOption[] = [
  { key: 'studentName', label: 'Student Name', selected: true },
  { key: 'rollNo', label: 'Roll Number', selected: true },
  { key: 'department', label: 'Department', selected: true },
  { key: 'cgpa', label: 'CGPA', selected: true },
  { key: 'company', label: 'Company', selected: true },
  { key: 'role', label: 'Role', selected: true },
  { key: 'packageLPA', label: 'Package (LPA)', selected: true },
  { key: 'status', label: 'Placement Status', selected: true },
  { key: 'driveDate', label: 'Drive Date', selected: true },
];

export const DataExportPage: React.FC = () => {
  const [dataset, setDataset] = useState<DatasetType>('placements');
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [columns, setColumns] = useState<ColumnOption[]>(PLACEMENT_COLUMNS);
  const [isExporting, setIsExporting] = useState(false);
  const [lastExported, setLastExported] = useState<string | null>(null);

  const allRecords = useMemo(() => getMockPlacementRecords(), []);

  // Department counts
  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allRecords.forEach((r) => {
      counts[r.department] = (counts[r.department] || 0) + 1;
    });
    return counts;
  }, [allRecords]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return filterPlacementRecords(allRecords, {
      department: selectedDepartment,
      dateRange,
    });
  }, [allRecords, selectedDepartment, dateRange]);

  // Toggle column selection
  const toggleColumn = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, selected: !col.selected } : col
      )
    );
  };

  const handleExport = () => {
    setIsExporting(true);

    try {
      const activeCols: ExportColumn<PlacementRecord>[] = columns
        .filter((c) => c.selected)
        .map((c) => ({
          key: c.key,
          label: c.label,
        }));

      if (activeCols.length === 0) {
        alert('Please select at least one column to export.');
        setIsExporting(false);
        return;
      }

      const csvContent = exportToCsv(filteredRecords, activeCols);
      const timestamp = new Date().toISOString().split('T')[0];

      if (format === 'csv') {
        const filename = `Placement_Export_${dataset}_${timestamp}.csv`;
        downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
      } else {
        // Tab-delimited format for Excel (.xls / .xlsx compatible)
        const tsvContent = csvContent.replace(/,/g, '\t');
        const filename = `Placement_Export_${dataset}_${timestamp}.xls`;
        downloadFile(tsvContent, filename, 'application/vnd.ms-excel;charset=utf-8;');
      }

      setLastExported(`${filteredRecords.length} records exported (${format.toUpperCase()})`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="data-export-page">
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="h-3 w-3" />
              Institutional Data Export Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Data Export & Compliance Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Export comprehensive placement records, student demographics, and corporate hiring history in CSV and Excel formats for accreditation.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            data-testid="btn-trigger-export"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all shrink-0"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Generating...' : `Export Now (${format.toUpperCase()})`}</span>
          </button>
        </div>

        {lastExported && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
            <Check className="h-3.5 w-3.5" />
            <span>Success: {lastExported}</span>
          </div>
        )}
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Format & Dataset Selector */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span>Select Export Format</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                data-testid="format-csv-btn"
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  format === 'csv'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white font-semibold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="h-5 w-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white">CSV Format</div>
                  <div className="text-[10px] text-slate-400">RFC 4180 standard</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('excel')}
                data-testid="format-excel-btn"
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  format === 'excel'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white font-semibold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="h-5 w-5 text-indigo-400" />
                <div>
                  <div className="text-xs font-bold text-white">Excel Format</div>
                  <div className="text-[10px] text-slate-400">.xls / .xlsx compatible</div>
                </div>
              </button>
            </div>
          </div>

          {/* Dataset Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-indigo-400" />
              <span>Select Target Dataset</span>
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  dataset === 'placements'
                    ? 'bg-indigo-500/10 border-indigo-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="dataset"
                  checked={dataset === 'placements'}
                  onChange={() => setDataset('placements')}
                  data-testid="dataset-placements"
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="text-xs font-semibold text-white">Individual Student Placements</div>
                  <div className="text-[11px] text-slate-400">Student names, roll numbers, companies, offers, and package CTC</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  dataset === 'departments'
                    ? 'bg-indigo-500/10 border-indigo-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="dataset"
                  checked={dataset === 'departments'}
                  onChange={() => setDataset('departments')}
                  data-testid="dataset-departments"
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="text-xs font-semibold text-white">Department Aggregate Statistics</div>
                  <div className="text-[11px] text-slate-400">Branch placement percentages, total intake, and average packages</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* 2. Column Selection */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-sky-400" />
              <span>Fields / Columns to Include</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {columns.filter((c) => c.selected).length} of {columns.length} selected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {columns.map((col) => (
              <label
                key={col.key}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 cursor-pointer text-xs text-slate-300"
              >
                <input
                  type="checkbox"
                  checked={col.selected}
                  onChange={() => toggleColumn(col.key)}
                  data-testid={`col-checkbox-${col.key}`}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                />
                <span className={col.selected ? 'text-white font-medium' : 'text-slate-500'}>
                  {col.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-2xl p-4 border border-slate-800">
          <DepartmentFilter
            selectedDepartment={selectedDepartment}
            onChange={setSelectedDepartment}
            departmentCounts={departmentCounts}
          />
        </div>
        <div className="glass-card rounded-2xl border border-slate-800">
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChange={setDateRange}
          />
        </div>
      </div>

      {/* Live Data Preview */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Export Dataset Live Preview</h3>
            <p className="text-xs text-slate-400">
              Showing {filteredRecords.length} records ready for download
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {filteredRecords.length} Rows
          </span>
        </div>

        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs" data-testid="export-preview-table">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 sticky top-0">
                {columns
                  .filter((c) => c.selected)
                  .map((col) => (
                    <th key={col.key} className="py-2.5 px-3 font-semibold">
                      {col.label}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-800/30">
                  {columns
                    .filter((c) => c.selected)
                    .map((col) => (
                      <td key={col.key} className="py-2.5 px-3">
                        {col.key === 'packageLPA'
                          ? record.packageLPA > 0
                            ? `₹${record.packageLPA} LPA`
                            : '—'
                          : String((record as any)[col.key] ?? '')}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataExportPage;
