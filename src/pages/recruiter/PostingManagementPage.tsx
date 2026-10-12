import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { JobOpportunity, OpportunityStatus } from '@/types/opportunity';
import { recruiterService } from '@/services/recruiterService';
import { PostingCard } from '@/components/PostingCard';
import { JobPostingForm } from '@/components/JobPostingForm';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { useToast } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';
import {
  Briefcase,
  PlusCircle,
  Search,
  Filter,
  Layers,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { JobPostingFormData } from '@/types/recruiter';

export const PostingManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const { user } = useAuth();

  const [postings, setPostings] = useState<JobOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OpportunityStatus>('all');
  const [editingPosting, setEditingPosting] = useState<JobOpportunity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recruiterId = user?.id || 'rec-default-01';

  const loadPostings = async () => {
    setIsLoading(true);
    try {
      const data = await recruiterService.getRecruiterPostings();
      setPostings(data);
    } catch {
      toast.error('Failed to load job postings', 'Data Error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPostings();
  }, [recruiterId]);

  const handleStatusChange = async (postingId: string, status: OpportunityStatus) => {
    try {
      await recruiterService.updatePostingStatus(postingId, status);
      setPostings((prev) =>
        prev.map((p) => (p.id === postingId ? { ...p, status } : p))
      );
      toast.success(`Posting status updated to "${status}"`, 'Status Changed');
    } catch {
      toast.error('Failed to update posting status', 'Update Error');
    }
  };

  const handleDelete = async (postingId: string) => {
    try {
      await recruiterService.deletePosting(postingId);
      setPostings((prev) => prev.filter((p) => p.id !== postingId));
      toast.success('Job posting removed successfully', 'Deleted');
    } catch {
      toast.error('Failed to delete job posting', 'Delete Error');
    }
  };

  const handleEditSubmit = async (formData: JobPostingFormData) => {
    if (!editingPosting) return;
    setIsSubmitting(true);
    try {
      const updated = await recruiterService.updatePosting(editingPosting.id, {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        workplaceType: formData.workplaceType,
        type: formData.type,
        salaryRange: formData.salaryRange,
        deadline: formData.deadline.includes('T')
          ? formData.deadline
          : `${formData.deadline}T23:59:59Z`,
        description: formData.description,
        requirements: formData.requirements
          ? formData.requirements.split('\n').filter((l) => l.trim().length > 0)
          : [],
        responsibilities: formData.responsibilities
          ? formData.responsibilities.split('\n').filter((l) => l.trim().length > 0)
          : [],
        detailedSkills: formData.skills.map((s) => ({ skill: s.skill, level: s.level })),
        requiredSkills: formData.skills.map((s) => s.skill),
      });

      setPostings((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingPosting(null);
      toast.success('Job posting updated successfully', 'Saved');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update job posting';
      toast.error(msg, 'Update Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter postings
  const filteredPostings = postings.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchComp = p.company.toLowerCase().includes(q);
      const matchSkills = p.requiredSkills?.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchComp && !matchSkills) return false;
    }
    return true;
  });

  if (editingPosting) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        <JobPostingForm
          initialData={editingPosting}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingPosting(null)}
          isLoading={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans"
      data-testid="posting-management-page"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <Briefcase className="h-6 w-6" />
            </span>
            Manage Campus Job Postings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review active postings, modify skill proficiency requirements, toggle application status, and track candidate applicant pools.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/recruiter/postings/new')}
          leftIcon={<PlusCircle className="h-4 w-4" />}
          className="shadow-lg shadow-violet-600/20 shrink-0"
        >
          Create New Job Opening
        </Button>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by role title, company, or required skill..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'open', 'filled', 'closed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                statusFilter === status
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {status === 'all' ? 'All Statuses' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Postings Listing */}
      {isLoading ? (
        <div className="space-y-4">
          <SkeletonLoader height="160px" count={3} />
        </div>
      ) : filteredPostings.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 space-y-4">
          <div className="h-16 w-16 mx-auto rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Layers className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Postings Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'No job openings matched your search and status filter criteria. Try resetting filters.'
              : 'You have not published any campus job postings yet. Publish your first hiring requisition to discover top talent.'}
          </p>
          {searchTerm || statusFilter !== 'all' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              Reset Filters
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/recruiter/postings/new')}
              leftIcon={<PlusCircle className="h-4 w-4" />}
            >
              Create First Posting
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4" data-testid="postings-list">
          {filteredPostings.map((posting) => (
            <PostingCard
              key={posting.id}
              posting={posting}
              onEdit={(p) => setEditingPosting(p)}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onViewApplicants={(id) => navigate(`/recruiter/applicants?postingId=${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostingManagementPage;
