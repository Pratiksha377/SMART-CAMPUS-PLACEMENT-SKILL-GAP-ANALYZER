import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { opportunityService } from '@/services/opportunityService';
import {
  JobOpportunity,
  OpportunityFilterCriteria,
} from '@/types/opportunity';
import { FilterPanel } from '@/components/FilterPanel';
import { OpportunityListing } from '@/components/OpportunityListing';
import { ApplyModal } from '@/components/ApplyModal';
import { OpportunityDetailsPage } from './OpportunityDetailsPage';
import { useToast } from '@/hooks';
import { Briefcase, Sparkles } from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const { profile } = useAppSelector((state) => state.profile);
  const toast = useToast();

  const [opportunities, setOpportunities] = useState<JobOpportunity[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<JobOpportunity | null>(null);
  const [applyModalOpp, setApplyModalOpp] = useState<JobOpportunity | null>(null);
  const [isDuplicateApp, setIsDuplicateApp] = useState(false);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const studentId = profile?.id || 'prof-std-1001';

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const opps = await opportunityService.getOpportunities();
        const apps = await opportunityService.getStudentApplications(studentId);
        setOpportunities(opps);
        setAppliedIds(
          apps.filter((a) => a.status !== 'withdrawn').map((a) => a.opportunityId)
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [studentId]);

  // Extract unique locations and companies for filters
  const allLocations = Array.from(
    new Set(opportunities.map((o) => o.location.split(',')[0].trim()))
  );
  const allCompanies = Array.from(new Set(opportunities.map((o) => o.company)));

  // Filter change handler
  const handleFilterChange = async (criteria: OpportunityFilterCriteria) => {
    setIsLoading(true);
    try {
      const filtered = await opportunityService.getOpportunities(criteria);
      setOpportunities(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyClick = async (opp: JobOpportunity) => {
    const isAlready = await opportunityService.hasStudentApplied(studentId, opp.id);
    setIsDuplicateApp(isAlready);
    setApplyModalOpp(opp);
  };

  const handleConfirmApply = async (
    opp: JobOpportunity,
    details: { resumeFileName: string; notes?: string }
  ) => {
    setIsSubmittingApp(true);
    try {
      await opportunityService.applyToOpportunity(studentId, opp.id, {
        studentName: profile?.fullName,
        studentEmail: profile?.email,
        resumeFileName: details.resumeFileName,
        notes: details.notes,
      });

      setAppliedIds((prev) => [...prev, opp.id]);
      setApplyModalOpp(null);
      toast.success(
        `Application to ${opp.company} for ${opp.title} submitted successfully!`,
        'Application Sent'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit application';
      toast.error(msg, 'Submission Failed');
    } finally {
      setIsSubmittingApp(false);
    }
  };

  // If viewing details page
  if (selectedOpportunity) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OpportunityDetailsPage
          opportunity={selectedOpportunity}
          isApplied={appliedIds.includes(selectedOpportunity.id)}
          onBack={() => setSelectedOpportunity(null)}
          onApply={handleApplyClick}
        />
        <ApplyModal
          opportunity={applyModalOpp}
          isOpen={!!applyModalOpp}
          onClose={() => setApplyModalOpp(null)}
          onConfirmApply={handleConfirmApply}
          isDuplicate={isDuplicateApp}
          availableResumes={profile?.documents || []}
          isSubmitting={isSubmittingApp}
        />
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn"
      data-testid="opportunities-page"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            Placement Opportunities & Job Discovery
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover verified campus placement openings filtered by your skills, preferences, and benchmark matches.
          </p>
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filter + Opportunities Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1">
          <FilterPanel
            availableLocations={allLocations}
            availableCompanies={allCompanies}
            onChange={handleFilterChange}
          />
        </div>

        <div className="lg:col-span-3">
          <OpportunityListing
            opportunities={opportunities}
            appliedOpportunityIds={appliedIds}
            isLoading={isLoading}
            onViewDetails={(opp) => setSelectedOpportunity(opp)}
            onApply={handleApplyClick}
            onResetFilters={() => handleFilterChange({ searchTerm: '', locations: [], companies: [], types: [], workplaceTypes: [] })}
          />
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        opportunity={applyModalOpp}
        isOpen={!!applyModalOpp}
        onClose={() => setApplyModalOpp(null)}
        onConfirmApply={handleConfirmApply}
        isDuplicate={isDuplicateApp}
        availableResumes={profile?.documents || []}
        isSubmitting={isSubmittingApp}
      />
    </div>
  );
};

export default OpportunitiesPage;
