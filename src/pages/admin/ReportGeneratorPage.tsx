import React, { useState, useMemo } from 'react';
import {
  PlacementRecord,
  DepartmentStat,
  SkillGapAuditMetric,
  AdminMetrics,
} from '@/types/admin';
import {
  getMockPlacementRecords,
  filterPlacementRecords,
  calculateMetrics,
  calculateDepartmentStats,
  calculateSkillDistribution,
  exportToCsv,
  downloadFile,
} from '@/services/adminService';
import { DepartmentFilter } from '@/components/DepartmentFilter';
import { DateRangePicker } from '@/components/DateRangePicker';
import { MetricsWidget } from '@/components/MetricsWidget';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  Building2,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const ReportGeneratorPage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [reportTitle, setReportTitle] = useState(
    'University Placement & Skill Gap Institutional Audit Report'
  );

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

  // Calculated metrics consistent with records (Property 14)
  const metrics: AdminMetrics = useMemo(() => {
    return calculateMetrics(filteredRecords);
  }, [filteredRecords]);

  // Departmental breakdown
  const departmentStats: DepartmentStat[] = useMemo(() => {
    return calculateDepartmentStats(filteredRecords);
  }, [filteredRecords]);

  // Skill audit metrics
  const skillMetrics: SkillGapAuditMetric[] = useMemo(() => {
    return calculateSkillDistribution(filteredRecords);
  }, [filteredRecords]);

  const handleExportCsv = () => {
    const columns = [
      { key: 'department', label: 'Department' },
      { key: 'totalStudents', label: 'Total Students' },
      { key: 'placedStudents', label: 'Placed Students' },
      {
        key: 'placementRate',
        label: 'Placement Rate (%)',
        format: (val: number) => `${val}%`,
      },
      {
        key: 'averagePackageLPA',
        label: 'Average Package (LPA)',
        format: (val: number) => `₹${val} LPA`,
      },
      { key: 'offersCount', label: 'Total Offers' },
    ];

    const csvData = exportToCsv(departmentStats, columns);
    downloadFile(
      csvData,
      `Placement_Report_${selectedDepartment}_${new Date().toISOString().split('T')[0]}.csv`,
      'text/csv;charset=utf-8;'
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" data-testid="report-generator-page">
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="h-3 w-3" />
              Accreditation & Analytics Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Institutional Report Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Synthesize institutional skill gap benchmarks, branch-wise placement percentages, and accreditation-ready tables.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              data-testid="btn-report-export-csv"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              data-testid="btn-report-print"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panels: Department & Date Range */}
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

      {/* Key Metrics calculated consistently */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-400" />
          <span>Executive Summary Metrics ({selectedDepartment === 'all' ? 'All Departments' : selectedDepartment})</span>
        </h2>
        <MetricsWidget metrics={metrics} />
      </div>

      {/* Department Breakdown Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Departmental Placement Performance</h3>
            <p className="text-xs text-slate-400">Branch-wise audit of eligible students, offers, and salary packages</p>
          </div>
          <span className="text-xs font-medium text-slate-400">
            {departmentStats.length} Academic Departments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" data-testid="department-stats-table">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold text-center">Total Students</th>
                <th className="pb-3 font-semibold text-center">Placed</th>
                <th className="pb-3 font-semibold text-center">Placement Rate</th>
                <th className="pb-3 font-semibold text-right">Avg Package</th>
                <th className="pb-3 font-semibold text-right">Confirmed Offers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {departmentStats.map((stat) => (
                <tr key={stat.department} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-semibold text-white flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                    {stat.department}
                  </td>
                  <td className="py-3 text-center">{stat.totalStudents}</td>
                  <td className="py-3 text-center font-medium text-emerald-400">{stat.placedStudents}</td>
                  <td className="py-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-semibold text-white">{stat.placementRate}%</span>
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, stat.placementRate))}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right font-semibold text-emerald-400">
                    {stat.averagePackageLPA > 0 ? `₹${stat.averagePackageLPA} LPA` : '—'}
                  </td>
                  <td className="py-3 text-right font-medium text-white">{stat.offersCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Skill Gap Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Institutional Skill Gap Analysis</h3>
            <p className="text-xs text-slate-400">Comparing verified student performance with industry hiring thresholds</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" data-testid="skill-gap-report-table">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Skill Competency</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold text-center">Avg Student Score</th>
                <th className="pb-3 font-semibold text-center">Industry Benchmark</th>
                <th className="pb-3 font-semibold text-center">Skill Deficit / Gap</th>
                <th className="pb-3 font-semibold text-right">Students Tested</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {skillMetrics.map((skill) => (
                <tr key={skill.skill} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-medium text-white">{skill.skill}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px]">
                      {skill.category}
                    </span>
                  </td>
                  <td className="py-3 text-center font-semibold text-sky-400">
                    {skill.avgProficiency}%
                  </td>
                  <td className="py-3 text-center text-slate-300">
                    {skill.requiredProficiency}%
                  </td>
                  <td className="py-3 text-center">
                    {skill.gap > 0 ? (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-full text-[10px]">
                        <AlertTriangle className="h-3 w-3" />
                        -{skill.gap}% Deficit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">
                        <CheckCircle className="h-3 w-3" />
                        +{Math.abs(skill.gap)}% Exceeds
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right text-slate-400">
                    {skill.studentsAssessed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneratorPage;
