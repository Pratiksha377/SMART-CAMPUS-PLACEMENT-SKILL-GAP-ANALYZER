import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JobOpportunity, ApplicationStatus } from '@/types/opportunity';
import {
  ApplicantCandidate,
  ApplicantFilterCriteria,
} from '@/types/recruiter';
import { recruiterService } from '@/services/recruiterService';
import { ApplicantCard } from '@/components/ApplicantCard';
import { ApplicantModal } from '@/components/ApplicantModal';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { useToast } from '@/hooks';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Briefcase,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

export const ApplicantListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [postings, setPostings] = useState<JobOpportunity[]>([]);
  const [selectedPostingId, setSelectedPostingId] = useState<string>('');
  const [applicants, setApplicants] = useState<ApplicantCandidate[]>([]);
  const [isLoadingPostings, setIsLoadingPostings] = useState(true);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [requireAllSkills, setRequireAllSkills] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'matchDesc' | 'matchAsc' | 'dateDesc' | 'nameAsc'>('matchDesc');

  // Modal state
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantCandidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load postings list
  useEffect(() => {
    const fetchPostings = async () => {
      setIsLoadingPostings(true);
      try {
        const data = await recruiterService.getRecruiterPostings();
        setPostings(data);

        // Pre-select posting from query param if available
        const paramId = searchParams.get('postingId');
        if (paramId && data.some((p) => p.id === paramId)) {
          setSelectedPostingId(paramId);
        } else if (data.length > 0) {
          setSelectedPostingId(data[0].id);
        }
      } catch {
        toast.error('Failed to load job postings', 'Error');
      } finally {
        setIsLoadingPostings(false);
      }
    };
    fetchPostings();
  }, []);

  // Fetch applicants when selected posting or filters change
  const loadApplicants = async () => {
    if (!selectedPostingId) return;
    setIsLoadingApplicants(true);
    try {
      const criteria: ApplicantFilterCriteria = {
        searchQuery,
        status: statusFilter,
        minMatchScore,
        requireAllSkills,
        sortBy,
      };
      const list = await recruiterService.getApplicantsForPosting(
        selectedPostingId,
        criteria
      );
      setApplicants(list);
    } catch {
      toast.error('Failed to load applicants', 'Error');
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  useEffect(() => {
    if (selectedPostingId) {
      loadApplicants();
    }
  }, [
    selectedPostingId,
    searchQuery,
    statusFilter,
    minMatchScore,
    requireAllSkills,
    sortBy,
  ]);

  const handlePostingChange = (postingId: string) => {
    setSelectedPostingId(postingId);
    setSearchParams({ postingId });
  };

  const handleStatusChange = async (
    applicationId: string,
    status: ApplicationStatus,
    notes?: string
  ) => {
    try {
      await recruiterService.updateApplicantStatus(applicationId, status, notes);
      toast.success(`Candidate status updated to ${status}`, 'Status Updated');
      // Refresh current list and active modal
      loadApplicants();
      if (selectedApplicant && selectedApplicant.applicationId === applicationId) {
        setSelectedApplicant((prev) => (prev ? { ...prev, status, notes } : null));
      }
    } catch {
      toast.error('Failed to update candidate status', 'Update Error');
    }
  };

  const currentPosting = postings.find((p) => p.id === selectedPostingId);

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans"
      data-testid="applicant-list-page"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Users className="h-6 w-6" />
            </span>
            Candidate Applicant Pool
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review student candidates ranked by skill proficiency matching, inspect credentials, and manage recruitment decisions.
          </p>
        </div>

        {/* Opportunity Selector Dropdown */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Briefcase className="h-4 w-4 text-violet-400 hidden sm:inline" />
          <select
            aria-label="Select opportunity"
            value={selectedPostingId}
            onChange={(e) => handlePostingChange(e.target.value)}
            disabled={isLoadingPostings || postings.length === 0}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {postings.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.company})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posting Context Banner */}
      {currentPosting && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-violet-400">
              Active Evaluation Posting
            </span>
            <h2 className="text-lg font-bold text-white">{currentPosting.title}</h2>
            <p className="text-xs text-slate-400">
              Target Skills:{' '}
              <span className="text-slate-200">
                {currentPosting.requiredSkills.join(', ')}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              Total Applicants:{' '}
              <strong className="text-white">{applicants.length}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              Qualified (&ge;80%):{' '}
              <strong>
                {applicants.filter((a) => a.skillMatchPercentage >= 80).length}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filter Panel (FE10.11) */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, email, department..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Minimum Match Score Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" /> Min Match:
            </span>
            <select
              aria-label="Filter by minimum match score"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value={0}>Any Match %</option>
              <option value={60}>60% and above</option>
              <option value={75}>75% and above</option>
              <option value={85}>85% and above (Top Tier)</option>
              <option value={100}>100% (Perfect Match)</option>
            </select>
          </div>

          {/* Sort Order Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5 text-indigo-400" /> Sort By:
            </span>
            <select
              aria-label="Sort applicants"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as 'matchDesc' | 'matchAsc' | 'dateDesc' | 'nameAsc'
                )
              }
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="matchDesc">Skill Match: High to Low</option>
              <option value="matchAsc">Skill Match: Low to High</option>
              <option value="dateDesc">Application Date: Most Recent</option>
              <option value="nameAsc">Candidate Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Second Row: Status Tabs & Strict Match Toggle (Property 13) */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(
              [
                'all',
                'applied',
                'reviewed',
                'shortlisted',
                'selected',
                'rejected',
              ] as const
            ).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                  statusFilter === status
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {status === 'all' ? 'All Candidates' : status}
              </button>
            ))}
          </div>

          {/* Strict Match Toggle (Property 13: Applicant Filtering Accuracy) */}
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={requireAllSkills}
              onChange={(e) => setRequireAllSkills(e.target.checked)}
              className="rounded bg-slate-900 border-slate-800 text-violet-600 focus:ring-violet-500 h-4 w-4"
            />
            <span className="font-semibold text-violet-300">
              Require All Skills at Target Proficiency
            </span>
          </label>
        </div>
      </div>

      {/* Applicant Cards Listing */}
      {isLoadingApplicants ? (
        <div className="space-y-4">
          <SkeletonLoader height="180px" count={3} />
        </div>
      ) : applicants.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 space-y-4">
          <div className="h-16 w-16 mx-auto rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Matching Applicants</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No candidates matched the current skill threshold, search keywords, or status filter. Try lowering the match score or toggling strict skill requirements.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setMinMatchScore(0);
              setRequireAllSkills(false);
            }}
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4" data-testid="applicant-cards-list">
          {applicants.map((cand) => (
            <ApplicantCard
              key={cand.id}
              applicant={cand}
              onViewProfile={(c) => {
                setSelectedApplicant(c);
                setIsModalOpen(true);
              }}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Full Profile Modal (FE10.10) */}
      <ApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplicant(null);
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default ApplicantListPage;
