import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { opportunityService } from '@/services/opportunityService';
import { Application, ApplicationStatus } from '@/types/opportunity';
import { ApplicationCard } from '@/components/ApplicationCard';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks';
import {
  FileText,
  Filter,
  ArrowUpDown,
  SearchX,
  AlertTriangle,
  Briefcase,
  Sparkles,
} from 'lucide-react';

export const ApplicationHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAppSelector((state) => state.profile);
  const toast = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'company-asc'>('date-desc');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Withdrawal modal state
  const [withdrawalTarget, setWithdrawalTarget] = useState<Application | null>(null);
  const [withdrawalReason, setWithdrawalReason] = useState<string>('');
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

  const studentId = profile?.id || 'prof-std-1001';

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await opportunityService.getStudentApplications(studentId);
      setApplications(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [studentId]);

  // Status Filter options
  const statusOptions = ['All', 'applied', 'reviewed', 'shortlisted', 'selected', 'rejected', 'withdrawn'];

  // Filter logic (FE9.4)
  const filtered = applications.filter((app) => {
    if (selectedStatus === 'All') return true;
    return app.status === selectedStatus;
  });

  // Sort logic (FE9.5)
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
    }
    if (sortBy === 'date-asc') {
      return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
    }
    if (sortBy === 'company-asc') {
      return a.company.localeCompare(b.company);
    }
    return 0;
  });

  // Handle Withdrawal
  const handleConfirmWithdrawal = async () => {
    if (!withdrawalTarget) return;
    setIsWithdrawing(true);
    try {
      const updated = await opportunityService.withdrawApplication(
        withdrawalTarget.id,
        withdrawalReason.trim() || undefined
      );

      setApplications((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      toast.info(
        `Application to ${withdrawalTarget.company} has been withdrawn.`,
        'Application Withdrawn'
      );
      setWithdrawalTarget(null);
      setWithdrawalReason('');
    } catch {
      toast.error('Failed to withdraw application', 'Error');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn"
      data-testid="application-history-page"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-indigo-400" />
            Student Application History & Tracking
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time application pipelines, status milestones, and interview shortlists.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/student/opportunities')}
          leftIcon={<Briefcase className="w-3.5 h-3.5" />}
        >
          Explore Placements
        </Button>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Tabs (FE9.4) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {statusOptions.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap capitalize
                ${
                  selectedStatus === st
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:text-white'
                }
              `}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Sort Dropdown (FE9.5) */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <label htmlFor="sort-applications" className="text-xs text-slate-400 font-medium">Sort By:</label>
          <select
            id="sort-applications"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-sans"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="company-asc">Company (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Loading state (FE9.8) */}
      {isLoading ? (
        <div className="space-y-4" data-testid="application-history-loading">
          <SkeletonLoader variant="card" height="120px" />
          <SkeletonLoader variant="card" height="120px" />
          <SkeletonLoader variant="card" height="120px" />
        </div>
      ) : sorted.length === 0 ? (
        /* Empty State (FE9.8) */
        <div
          className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4"
          data-testid="application-history-empty"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
            <SearchX className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-100">No Applications Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {selectedStatus === 'All'
                ? "You haven't submitted any placement applications yet. Start exploring active job postings to submit your profile."
                : `No applications found with status "${selectedStatus}".`}
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/student/opportunities')}
          >
            Browse Open Opportunities
          </Button>
        </div>
      ) : (
        /* Applications List */
        <div className="space-y-4" data-testid="application-history-list">
          {sorted.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onRequestWithdraw={(target) => setWithdrawalTarget(target)}
            />
          ))}
        </div>
      )}

      {/* Withdrawal Confirmation Modal (FE9.6) */}
      <Modal
        isOpen={!!withdrawalTarget}
        onClose={() => setWithdrawalTarget(null)}
        title="Confirm Application Withdrawal"
        description={
          withdrawalTarget
            ? `Withdraw application for ${withdrawalTarget.opportunityTitle} at ${withdrawalTarget.company}?`
            : ''
        }
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setWithdrawalTarget(null)}
              disabled={isWithdrawing}
            >
              Keep Active
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmWithdrawal}
              isLoading={isWithdrawing}
              loadingText="Withdrawing..."
            >
              Confirm Withdrawal
            </Button>
          </>
        }
      >
        <div className="space-y-3 font-sans text-xs">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <p className="leading-relaxed">
              Withdrawing your application will notify the placement recruitment cell and permanently remove your candidacy from this selection cycle.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="withdrawal-reason" className="font-medium text-slate-300">
              Reason for Withdrawal (Optional):
            </label>
            <input
              id="withdrawal-reason"
              type="text"
              placeholder="e.g., Accepted alternative offer, scheduling conflict..."
              value={withdrawalReason}
              onChange={(e) => setWithdrawalReason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApplicationHistoryPage;
