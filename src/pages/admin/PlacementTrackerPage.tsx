import React, { useState, useMemo } from 'react';
import {
  PlacementRecord,
  PlacementStatus,
} from '@/types/admin';
import {
  getMockPlacementRecords,
  filterPlacementRecords,
} from '@/services/adminService';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  ArrowUpDown,
  Download,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { DepartmentFilter } from '@/components/DepartmentFilter';

const ALL_STATUSES: ('all' | PlacementStatus)[] = [
  'all',
  'Applied',
  'Shortlisted',
  'Interview',
  'Offered',
  'Accepted',
  'Rejected',
];

export const PlacementTrackerPage: React.FC = () => {
  const [records, setRecords] = useState<PlacementRecord[]>(() =>
    getMockPlacementRecords()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | PlacementStatus>(
    'all'
  );
  const [sortBy, setSortBy] = useState<'date' | 'package' | 'cgpa' | 'name'>(
    'date'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // Department counts
  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach((r) => {
      counts[r.department] = (counts[r.department] || 0) + 1;
    });
    return counts;
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    const filtered = filterPlacementRecords(records, {
      department: selectedDepartment,
      status: selectedStatus,
      searchQuery,
    });

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'package') {
        comparison = a.packageLPA - b.packageLPA;
      } else if (sortBy === 'cgpa') {
        comparison = a.cgpa - b.cgpa;
      } else if (sortBy === 'name') {
        comparison = a.studentName.localeCompare(b.studentName);
      } else {
        comparison = a.driveDate.localeCompare(b.driveDate);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [records, selectedDepartment, selectedStatus, searchQuery, sortBy, sortOrder]);

  // Handle status update
  const handleStatusChange = (recordId: string, newStatus: PlacementStatus) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            status: newStatus,
            packageLPA:
              (newStatus === 'Offered' || newStatus === 'Accepted') &&
              r.packageLPA === 0
                ? 12.0
                : r.packageLPA,
          };
        }
        return r;
      })
    );
    setEditingRecordId(null);
  };

  const statusColor = (status: PlacementStatus) => {
    switch (status) {
      case 'Accepted':
      case 'Offered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Interview':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Shortlisted':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Applied':
        return 'bg-slate-500/10 text-slate-300 border-slate-700';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  const totalAccepted = records.filter(
    (r) => r.status === 'Accepted' || r.status === 'Offered'
  ).length;
  const inProgress = records.filter(
    (r) => r.status === 'Interview' || r.status === 'Shortlisted'
  ).length;

  return (
    <div className="space-y-6" data-testid="placement-tracker-page">
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="h-3 w-3" />
          Drive & Application Lifecycle
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          University Placement Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Real-time tracking of candidate status across recruitment stages, drive interviews, and final employment offers.
        </p>

        {/* Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-slate-400">Total Tracked</span>
            <p className="text-lg font-bold text-white" data-testid="total-tracked-count">
              {records.length} Students
            </p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-emerald-400">Offers & Accepted</span>
            <p className="text-lg font-bold text-emerald-400" data-testid="total-offers-count">
              {totalAccepted} ({records.length > 0 ? Math.round((totalAccepted / records.length) * 100) : 0}%)
            </p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-amber-400">In Interview Pipeline</span>
            <p className="text-lg font-bold text-amber-400">
              {inProgress} Active
            </p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-blue-400">Matches Showing</span>
            <p className="text-lg font-bold text-white">
              {filteredRecords.length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by student name, roll no, company, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="tracker-search-input"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                data-testid="tracker-sort-select"
                className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
              >
                <option value="date" className="bg-slate-900">Date</option>
                <option value="package" className="bg-slate-900">CTC Package</option>
                <option value="cgpa" className="bg-slate-900">CGPA</option>
                <option value="name" className="bg-slate-900">Name</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              data-testid="tracker-sort-order-btn"
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
              title="Toggle Sort Order"
            >
              {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
          </div>
        </div>

        {/* Department Filter */}
        <DepartmentFilter
          selectedDepartment={selectedDepartment}
          onChange={setSelectedDepartment}
          departmentCounts={departmentCounts}
        />

        {/* Status Filter Tabs */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Filter className="h-3 w-3 text-emerald-400" /> Filter by Application Stage
          </span>
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((st) => {
              const count =
                st === 'all'
                  ? records.length
                  : records.filter((r) => r.status === st).length;
              const isSelected = selectedStatus === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  data-testid={`status-filter-${st.toLowerCase()}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  <span>{st === 'all' ? 'All Stages' : st}</span>
                  <span
                    className={`text-[10px] px-1.5 rounded-full ${
                      isSelected
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tracker Records Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-slate-500 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No placement records found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No student records matched your current search and filter criteria. Try resetting filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" data-testid="placement-tracker-table">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4 font-semibold">Student Name</th>
                  <th className="py-3 px-4 font-semibold">Roll No</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">CGPA</th>
                  <th className="py-3 px-4 font-semibold">Company & Role</th>
                  <th className="py-3 px-4 font-semibold">Package</th>
                  <th className="py-3 px-4 font-semibold">Drive Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-800/30 transition-colors"
                    data-testid={`record-row-${record.id}`}
                  >
                    <td className="py-3 px-4 font-medium text-white">
                      {record.studentName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {record.rollNo}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                        {record.department}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {record.cgpa}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-white">
                        <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                        {record.company}
                      </div>
                      <div className="text-[11px] text-slate-400">{record.role}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-400">
                      {record.packageLPA > 0 ? `₹${record.packageLPA} LPA` : '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {record.driveDate}
                    </td>
                    <td className="py-3 px-4">
                      {editingRecordId === record.id ? (
                        <select
                          value={record.status}
                          onChange={(e) =>
                            handleStatusChange(
                              record.id,
                              e.target.value as PlacementStatus
                            )
                          }
                          data-testid={`select-status-${record.id}`}
                          className="bg-slate-900 border border-emerald-500 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Offered">Offered</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor(
                            record.status
                          )}`}
                          data-testid={`status-badge-${record.id}`}
                        >
                          {record.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingRecordId === record.id ? (
                        <button
                          type="button"
                          onClick={() => setEditingRecordId(null)}
                          className="text-[11px] text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditingRecordId(record.id)}
                          data-testid={`btn-edit-${record.id}`}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium"
                        >
                          Update Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementTrackerPage;
