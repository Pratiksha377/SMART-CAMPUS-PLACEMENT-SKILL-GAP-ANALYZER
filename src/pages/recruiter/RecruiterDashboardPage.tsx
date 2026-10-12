import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { recruiterService } from '@/services/recruiterService';
import { JobOpportunity, OpportunityStatus } from '@/types/opportunity';
import { RecruiterMetrics, ApplicantCandidate } from '@/types/recruiter';
import { PostingCard } from '@/components/PostingCard';
import { ApplicantCard } from '@/components/ApplicantCard';
import { ApplicantModal } from '@/components/ApplicantModal';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { useToast } from '@/hooks';
import {
  Briefcase,
  Users,
  PlusCircle,
  FileCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const RecruiterDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [metrics, setMetrics] = useState<RecruiterMetrics | null>(null);
  const [recentPostings, setRecentPostings] = useState<JobOpportunity[]>([]);
  const [topCandidates, setTopCandidates] = useState<ApplicantCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal for top candidate inspection
  const [selectedCandidate, setSelectedCandidate] = useState<ApplicantCandidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recruiterId = user?.id || 'rec-default-01';

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [metricsData, postingsData] = await Promise.all([
        recruiterService.getRecruiterMetrics(recruiterId),
        recruiterService.getRecruiterPostings(recruiterId),
      ]);

      setMetrics(metricsData);
      setRecentPostings(postingsData.slice(0, 3));

      // Fetch sample top candidates from first posting if available
      if (postingsData.length > 0) {
        const applicants = await recruiterService.getApplicantsForPosting(postingsData[0].id, {
          sortBy: 'matchDesc',
        });
        setTopCandidates(applicants.slice(0, 2));
      }
    } catch {
      toast.error('Failed to load recruiter workspace metrics', 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [recruiterId]);

  const handleStatusChange = async (postingId: string, status: OpportunityStatus) => {
    try {
      await recruiterService.updatePostingStatus(postingId, status);
      setRecentPostings((prev) =>
        prev.map((p) => (p.id === postingId ? { ...p, status } : p))
      );
      toast.success(`Posting status updated to ${status}`, 'Status Updated');
    } catch {
      toast.error('Failed to update status', 'Error');
    }
  };

  const handleDeletePosting = async (postingId: string) => {
    try {
      await recruiterService.deletePosting(postingId);
      setRecentPostings((prev) => prev.filter((p) => p.id !== postingId));
      toast.success('Posting deleted successfully', 'Deleted');
    } catch {
      toast.error('Failed to delete posting', 'Error');
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans"
      data-testid="recruiter-dashboard-page"
    >
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-violet-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              Recruiter Desk Active • Campus Placement Season
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Recruiter Workspace — {user?.name || 'Recruiter'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Post job requisitions, configure required skill proficiencies, discover qualified campus applicants, and shortlist candidates using verified skill gap matching.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/recruiter/postings/new')}
              leftIcon={<PlusCircle className="h-4 w-4" />}
              className="shadow-lg shadow-violet-600/25"
            >
              Post New Opportunity
            </Button>
          </div>
        </div>
      </div>

      {/* Recruiter Metrics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active Openings</span>
            <Briefcase className="h-4 w-4 text-violet-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            {isLoading ? '...' : `${metrics?.activePostingsCount ?? 0} Active`}
          </p>
          <p className="text-[11px] text-slate-400">
            Total {metrics?.totalPostingsCount ?? 0} published requisitions
          </p>
        </div>

        {/* KPI 2 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Applicants</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            {isLoading ? '...' : `${metrics?.totalApplicantsCount ?? 0} Students`}
          </p>
          <p className="text-[11px] text-indigo-400 font-medium">
            Active candidate pool
          </p>
        </div>

        {/* KPI 3 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Shortlisted Talent</span>
            <FileCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            {isLoading ? '...' : `${metrics?.shortlistedCount ?? 0} Qualified`}
          </p>
          <p className="text-[11px] text-emerald-400 font-medium">
            Match score &ge; 80%
          </p>
        </div>

        {/* KPI 4 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Avg Match Score</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            {isLoading ? '...' : `${metrics?.averageMatchScore ?? 85}%`}
          </p>
          <p className="text-[11px] text-amber-400 font-medium">
            Skill proficiency alignment
          </p>
        </div>
      </div>

      {/* Quick Access Action Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/recruiter/postings"
          className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 block group"
        >
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Briefcase className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Manage Job Postings</h3>
          <p className="text-xs text-slate-400 mb-4">
            View active listings, update candidate skill criteria, and close completed recruitment drives.
          </p>
          <span className="text-xs text-violet-400 font-semibold flex items-center gap-1">
            Open Postings <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <Link
          to="/recruiter/postings/new"
          className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 block group"
        >
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <PlusCircle className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Post New Opportunity</h3>
          <p className="text-xs text-slate-400 mb-4">
            Configure role details, compensation, and dynamic skill proficiencies to target candidates.
          </p>
          <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
            Create Requisition <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <Link
          to="/recruiter/applicants"
          className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 block group"
        >
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Candidate Match Pool</h3>
          <p className="text-xs text-slate-400 mb-4">
            Review student applicants, filter by skill match percentages, and make shortlist decisions.
          </p>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            View Candidates <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>

      {/* Recent Postings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-violet-400" />
            Recent Job Postings
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/recruiter/postings')}
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            className="text-xs text-violet-400 hover:text-violet-300"
          >
            View All ({metrics?.totalPostingsCount ?? 0})
          </Button>
        </div>

        {isLoading ? (
          <SkeletonLoader height="140px" count={2} />
        ) : recentPostings.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center border border-slate-800 text-xs text-slate-400">
            No job postings published yet.
          </div>
        ) : (
          <div className="space-y-4">
            {recentPostings.map((p) => (
              <PostingCard
                key={p.id}
                posting={p}
                onEdit={() => navigate(`/recruiter/postings`)}
                onDelete={handleDeletePosting}
                onStatusChange={handleStatusChange}
                onViewApplicants={(id) => navigate(`/recruiter/applicants?postingId=${id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Top Matched Candidates Preview Section */}
      {topCandidates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              High-Match Candidates Spotlight
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/recruiter/applicants')}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Browse Applicant Pool
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topCandidates.map((c) => (
              <ApplicantCard
                key={c.id}
                applicant={c}
                onViewProfile={(candidate) => {
                  setSelectedCandidate(candidate);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Candidate Modal */}
      <ApplicantModal
        applicant={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCandidate(null);
        }}
      />
    </div>
  );
};

export default RecruiterDashboardPage;
