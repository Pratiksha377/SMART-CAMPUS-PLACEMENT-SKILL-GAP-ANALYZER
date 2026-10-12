import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  TrendingUp,
  BarChart3,
  Download,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
} from 'lucide-react';
import { MetricsWidget } from '@/components/MetricsWidget';
import {
  SkillDistributionChart,
  PlacementTrendsChart,
  DepartmentBreakdownChart,
} from '@/components/AnalyticsChart';
import { DepartmentFilter } from '@/components/DepartmentFilter';
import {
  getMockPlacementRecords,
  calculateMetrics,
  calculateDepartmentStats,
  calculateSkillDistribution,
  calculatePlacementTrends,
  filterPlacementRecords,
} from '@/services/adminService';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Load records
  const allRecords = useMemo(() => getMockPlacementRecords(), []);

  // Department counts
  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allRecords.forEach((r) => {
      counts[r.department] = (counts[r.department] || 0) + 1;
    });
    return counts;
  }, [allRecords]);

  // Filtered records based on selected department
  const filteredRecords = useMemo(() => {
    return filterPlacementRecords(allRecords, {
      department: selectedDepartment,
    });
  }, [allRecords, selectedDepartment]);

  // Computed metrics
  const metrics = useMemo(() => {
    return calculateMetrics(filteredRecords);
  }, [filteredRecords]);

  // Stats for charts
  const departmentStats = useMemo(() => {
    return calculateDepartmentStats(allRecords);
  }, [allRecords]);

  const skillMetrics = useMemo(() => {
    return calculateSkillDistribution(filteredRecords);
  }, [filteredRecords]);

  const trends = useMemo(() => {
    return calculatePlacementTrends(filteredRecords);
  }, [filteredRecords]);

  return (
    <div className="space-y-8" data-testid="admin-dashboard-page">
      {/* Welcome & Navigation Banner */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-emerald-500/20 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="h-3 w-3" />
              University Placement Operations
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Institutional Placement Intelligence — {user?.name || 'Administrator'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Real-time analytics across academic branches, verified student conversion rates, and institutional accreditation compliance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/admin/reports"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Audit Reports</span>
            </Link>
            <Link
              to="/admin/export"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV/Excel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Department Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800">
        <DepartmentFilter
          selectedDepartment={selectedDepartment}
          onChange={setSelectedDepartment}
          departmentCounts={departmentCounts}
        />
      </div>

      {/* Dynamic Key Performance Metrics */}
      <MetricsWidget metrics={metrics} />

      {/* Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlacementTrendsChart trends={trends} />
        <DepartmentBreakdownChart stats={departmentStats} />
      </div>

      {/* Institutional Skill Gap Distribution */}
      <SkillDistributionChart skills={skillMetrics} />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/placements"
          className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 block group"
        >
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Placement Tracker</h3>
          <p className="text-xs text-slate-400 mb-4">
            Live pipeline tracking of student offers, interview stages, and company drive status.
          </p>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            Open Tracker <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/reports"
          className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 block group"
        >
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Report Generator</h3>
          <p className="text-xs text-slate-400 mb-4">
            Custom date range and departmental audit reports with instant calculation and export.
          </p>
          <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
            Generate Reports <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/export"
          className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 block group"
        >
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Download className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Data Export Center</h3>
          <p className="text-xs text-slate-400 mb-4">
            Customizable data exports for NAAC, NIRF accreditations in RFC 4180 CSV & Excel formats.
          </p>
          <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
            Export Center <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>

      {/* Recent Drive Activity Table Preview */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Placement Conversions</h3>
            <p className="text-xs text-slate-400">Latest company offers and recruitment decisions</p>
          </div>
          <Link
            to="/admin/placements"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            View All ({filteredRecords.length}) <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Student Name</th>
                <th className="pb-3 font-semibold">Roll No</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Company</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Package (LPA)</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRecords.slice(0, 5).map((record) => (
                <tr key={record.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-medium text-white">{record.studentName}</td>
                  <td className="py-3 font-mono text-slate-400">{record.rollNo}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                      {record.department}
                    </span>
                  </td>
                  <td className="py-3 font-medium flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                    {record.company}
                  </td>
                  <td className="py-3 text-slate-400">{record.role}</td>
                  <td className="py-3 font-semibold text-emerald-400">
                    {record.packageLPA > 0 ? `₹${record.packageLPA} LPA` : '—'}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        record.status === 'Accepted' || record.status === 'Offered'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : record.status === 'Interview'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : record.status === 'Shortlisted'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {record.status}
                    </span>
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

export default AdminDashboard;
