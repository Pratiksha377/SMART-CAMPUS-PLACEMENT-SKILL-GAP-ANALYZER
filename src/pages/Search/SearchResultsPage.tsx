import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { JobOpportunity } from '@/types/opportunity';
import {
  SearchFilterState,
  SearchSortOption,
  PaginatedResult,
  FilterChipItem,
} from '@/types/search';
import { searchService, POPULAR_SEARCH_TERMS } from '@/services/searchService';
import { opportunityService } from '@/services/opportunityService';
import { useAppSelector } from '@/store';
import { SearchBar } from '@/components/SearchBar';
import { AdvancedFilter } from '@/components/AdvancedFilter';
import { FilterChips } from '@/components/FilterChips';
import { Pagination } from '@/components/Pagination';
import { OpportunityCard } from '@/components/OpportunityCard';
import { ApplyModal } from '@/components/ApplyModal';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  HelpCircle,
  Briefcase,
  Layers,
} from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { profile } = useAppSelector((state) => state.profile);

  const initialQuery = searchParams.get('q') || '';

  // Main filter state
  const [filterState, setFilterState] = useState<SearchFilterState>({
    searchTerm: initialQuery,
    types: [],
    workplaceTypes: [],
    locations: [],
    companies: [],
    minMatchScore: 0,
    sortBy: 'relevance',
    page: 1,
    pageSize: 6,
  });

  const [results, setResults] = useState<PaginatedResult<JobOpportunity>>({
    items: [],
    totalItems: 0,
    currentPage: 1,
    pageSize: 6,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    startIndex: 0,
    endIndex: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  // Apply modal state
  const [applyModalOpp, setApplyModalOpp] = useState<JobOpportunity | null>(null);
  const [isDuplicateApp, setIsDuplicateApp] = useState(false);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  const studentId = profile?.id || 'prof-std-1001';

  // Load applied jobs for student
  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const apps = await opportunityService.getStudentApplications(studentId);
        setAppliedJobIds(
          apps.filter((a) => a.status !== 'withdrawn').map((a) => a.opportunityId)
        );
      } catch {
        // Ignore fallback
      }
    };
    fetchApplied();
  }, [studentId]);

  // Synchronize state when URL param 'q' changes externally
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null && qParam !== filterState.searchTerm) {
      setFilterState((prev) => ({ ...prev, searchTerm: qParam, page: 1 }));
    }
  }, [searchParams]);

  // Debounced search runner (FE11.8)
  const executeSearch = useCallback(
    async (stateToRun: SearchFilterState) => {
      setIsLoading(true);
      try {
        const res = await searchService.searchOpportunities(stateToRun);
        setResults(res);
      } catch {
        toast.error('Search execution failed', 'Query Error');
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((stateToRun: SearchFilterState) => {
        executeSearch(stateToRun);
      }, 250),
    [executeSearch]
  );

  useEffect(() => {
    debouncedSearch(filterState);
    return () => {
      debouncedSearch.cancel();
    };
  }, [filterState, debouncedSearch]);

  const handleSearchSubmit = (term: string) => {
    setSearchParams(term ? { q: term } : {});
    setFilterState((prev) => ({
      ...prev,
      searchTerm: term,
      page: 1,
    }));
  };

  const handleFilterUpdate = (updates: Partial<SearchFilterState>) => {
    setFilterState((prev) => ({
      ...prev,
      ...updates,
      page: 1, // reset to page 1 on filter changes
    }));
  };

  const handleRemoveChip = (chip: FilterChipItem) => {
    setFilterState((prev) => {
      const copy = { ...prev, page: 1 };
      if (chip.key === 'searchTerm') {
        copy.searchTerm = '';
        setSearchParams({});
      } else if (chip.key === 'minMatchScore') {
        copy.minMatchScore = 0;
      } else if (Array.isArray(copy[chip.key])) {
        const arr = (copy[chip.key] as string[]).filter((v) => v !== chip.value);
        (copy as Record<string, unknown>)[chip.key] = arr;
      }
      return copy;
    });
  };

  const handleClearAllFilters = () => {
    setSearchParams({});
    setFilterState({
      searchTerm: '',
      types: [],
      workplaceTypes: [],
      locations: [],
      companies: [],
      minMatchScore: 0,
      sortBy: 'relevance',
      page: 1,
      pageSize: 6,
    });
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

      setAppliedJobIds((prev) => [...prev, opp.id]);
      setApplyModalOpp(null);
      toast.success(
        `Application submitted to ${opp.company} for ${opp.title}!`,
        'Application Sent'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      toast.error(msg, 'Error');
    } finally {
      setIsSubmittingApp(false);
    }
  };

  const relatedSuggestions = searchService.getRelatedSearches(filterState.searchTerm);

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans"
      data-testid="search-results-page"
    >
      {/* Top Hero Search Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <Search className="h-6 w-6" />
            </span>
            Explore Campus Placement Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search cross-platform opportunities by keywords, technology proficiencies, role type, and skill alignment match scores.
          </p>
        </div>

        <SearchBar
          value={filterState.searchTerm}
          onChange={(val) => setFilterState((prev) => ({ ...prev, searchTerm: val }))}
          onSearch={handleSearchSubmit}
          size="lg"
          showSuggestions={true}
        />

        {/* Popular Tags Fast Selector */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-slate-500 text-[11px] font-semibold flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-violet-400" /> Popular:
          </span>
          {POPULAR_SEARCH_TERMS.slice(0, 6).map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleSearchSubmit(term)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-violet-500/50 hover:bg-violet-950/30 text-[11px] text-slate-300 transition-all"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Advanced Filters (Desktop) */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <AdvancedFilter
            filterState={filterState}
            onChange={handleFilterUpdate}
            onReset={handleClearAllFilters}
          />
        </div>

        {/* Right Column: Search Results & Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Mobile toggle, sort, count */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters((prev) => !prev)}
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
                className="lg:hidden text-xs"
              >
                Filters
              </Button>

              <span className="text-xs text-slate-300 font-semibold" data-testid="results-count">
                {isLoading ? (
                  'Searching...'
                ) : (
                  <>
                    <strong className="text-white">{results.totalItems}</strong> opportunities found
                  </>
                )}
              </span>
            </div>

            {/* Sort Dropdown (FE11.7) */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
                <ArrowUpDown className="h-3.5 w-3.5 text-violet-400" /> Sort by:
              </span>
              <select
                aria-label="Sort search results"
                value={filterState.sortBy}
                onChange={(e) =>
                  handleFilterUpdate({
                    sortBy: e.target.value as SearchSortOption,
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
              >
                <option value="relevance">Best Match & Relevance</option>
                <option value="matchDesc">Skill Match % (High to Low)</option>
                <option value="dateDesc">Date Posted (Newest First)</option>
                <option value="titleAsc">Role Title (A to Z)</option>
                <option value="deadlineAsc">Application Deadline (Closest)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips (FE11.5) */}
          <FilterChips
            filterState={filterState}
            onRemoveChip={handleRemoveChip}
            onClearAll={handleClearAllFilters}
          />

          {/* Mobile Collapsible Filter Drawer */}
          {showMobileFilters && (
            <div className="lg:hidden animate-fadeIn">
              <AdvancedFilter
                filterState={filterState}
                onChange={handleFilterUpdate}
                onReset={handleClearAllFilters}
              />
            </div>
          )}

          {/* Results Grid / List */}
          {isLoading ? (
            <div className="space-y-4">
              <SkeletonLoader height="160px" count={3} />
            </div>
          ) : results.items.length === 0 ? (
            /* Empty State with Suggestions (Requirement 7.4) */
            <div
              className="glass-card rounded-3xl p-10 sm:p-14 text-center border border-slate-800 space-y-5 animate-fadeIn"
              data-testid="no-search-results"
            >
              <div className="h-16 w-16 mx-auto rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <HelpCircle className="h-8 w-8" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-white">No Matching Opportunities Found</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We couldn’t find any job requisitions matching "{filterState.searchTerm}". Try adjusting your keywords, loosening location or type filters, or explore related technologies below.
                </p>
              </div>

              {/* Related Search Suggestions */}
              {relatedSuggestions.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-slate-400 mb-2">
                    Try searching for related placement streams:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {relatedSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSearchSubmit(suggestion)}
                        className="px-3 py-1.5 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-300 hover:text-white hover:bg-violet-600/30 text-xs font-semibold transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAllFilters}
                >
                  Clear All Filters & Reset
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4" data-testid="search-results-list">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.items.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    isApplied={appliedJobIds.includes(opp.id)}
                    onViewDetails={() => navigate('/student/opportunities')}
                    onApply={handleApplyClick}
                  />
                ))}
              </div>

              {/* Pagination Controls (FE11.6) */}
              <Pagination
                currentPage={results.currentPage}
                totalPages={results.totalPages}
                totalItems={results.totalItems}
                pageSize={results.pageSize}
                onPageChange={(p) => setFilterState((prev) => ({ ...prev, page: p }))}
                onPageSizeChange={(s) =>
                  setFilterState((prev) => ({ ...prev, pageSize: s, page: 1 }))
                }
              />
            </div>
          )}
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

export default SearchResultsPage;
