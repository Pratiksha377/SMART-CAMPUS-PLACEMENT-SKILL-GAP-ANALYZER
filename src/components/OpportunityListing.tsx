import React, { useState } from 'react';
import { JobOpportunity } from '@/types/opportunity';
import { OpportunityCard } from './OpportunityCard';
import { SkeletonLoader } from './ui/SkeletonLoader';
import { LayoutGrid, List, SearchX, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

export interface OpportunityListingProps {
  opportunities: JobOpportunity[];
  appliedOpportunityIds?: string[];
  isLoading?: boolean;
  onViewDetails: (opportunity: JobOpportunity) => void;
  onApply: (opportunity: JobOpportunity) => void;
  onResetFilters?: () => void;
  className?: string;
}

export const OpportunityListing: React.FC<OpportunityListingProps> = ({
  opportunities,
  appliedOpportunityIds = [],
  isLoading = false,
  onViewDetails,
  onApply,
  onResetFilters,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`} data-testid="opportunity-listing-loading">
        <div className="flex justify-end gap-2 mb-4">
          <SkeletonLoader variant="rectangular" width="80px" height="32px" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonLoader variant="card" height="240px" />
          <SkeletonLoader variant="card" height="240px" />
          <SkeletonLoader variant="card" height="240px" />
          <SkeletonLoader variant="card" height="240px" />
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div
        className={`p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 font-sans ${className}`}
        data-testid="opportunity-no-results"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
          <SearchX className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-100">No Opportunities Match Your Criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            We couldn't find active placements matching all of your applied filters. Try relaxing location constraints or search keywords.
          </p>
        </div>

        {onResetFilters && (
          <Button variant="secondary" size="sm" onClick={onResetFilters}>
            Reset All Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 font-sans ${className}`} data-testid="opportunity-listing">
      {/* View Mode Toggle Header */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-slate-400 font-medium">
          Showing <strong>{opportunities.length}</strong> matching opportunities
        </span>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label="Grid View"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label="List View"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid or List Layout */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
            : 'space-y-3'
        }
      >
        {opportunities.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            isApplied={appliedOpportunityIds.includes(opp.id)}
            variant={viewMode}
            onViewDetails={onViewDetails}
            onApply={onApply}
          />
        ))}
      </div>
    </div>
  );
};

export default OpportunityListing;
