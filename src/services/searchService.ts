import { JobOpportunity } from '@/types/opportunity';
import {
  SearchFilterState,
  SearchSortOption,
  PaginatedResult,
} from '@/types/search';
import { opportunityService } from './opportunityService';

export const POPULAR_SEARCH_TERMS = [
  'React',
  'TypeScript',
  'Full Stack',
  'Remote',
  'Cloud Engineer',
  'Data Structures',
  'Python',
  'Google',
  'Microsoft',
  'Amazon',
];

/**
 * Pure pagination algorithm validating Property 17 (Pagination Correctness).
 * Given a list of items of length L, page N (1-indexed), and pageSize S:
 * - When page N is valid (1 <= N <= ceil(L/S)), returns items from index (N - 1) * S to min(N * S, L).
 * - There are zero overlapping items between consecutive pages, and zero gaps.
 * - Concatenating pages 1 through totalPages reconstructs the exact original list.
 */
export function paginate<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResult<T> {
  const totalItems = items.length;
  const validPageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalItems / validPageSize));
  const validPage = Math.max(1, Math.min(page, totalPages));

  const startOffset = (validPage - 1) * validPageSize;
  const endOffset = Math.min(startOffset + validPageSize, totalItems);

  const pageItems = totalItems === 0 ? [] : items.slice(startOffset, endOffset);

  return {
    items: pageItems,
    totalItems,
    currentPage: validPage,
    pageSize: validPageSize,
    totalPages,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
    startIndex: totalItems === 0 ? 0 : startOffset + 1,
    endIndex: endOffset,
  };
}

/**
 * Keyword matching validator adhering to Property 16 (Search Keyword Matching).
 * Validates that an opportunity matches a search keyword in its title, description, or skills.
 */
export function matchesSearchKeywords(
  opp: JobOpportunity,
  keyword: string
): boolean {
  if (!keyword || keyword.trim().length === 0) return true;
  const q = keyword.toLowerCase().trim();

  // Primary criteria: title, description, or skills (Requirements 7.1 & Property 16)
  const titleMatch = opp.title.toLowerCase().includes(q);
  const descMatch = opp.description.toLowerCase().includes(q);
  const skillsMatch = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
  const companyMatch = opp.company.toLowerCase().includes(q);

  return titleMatch || descMatch || skillsMatch || companyMatch;
}

export const searchService = {
  /**
   * Sorts opportunities based on selected sort option.
   */
  sortOpportunities(
    items: JobOpportunity[],
    sortBy: SearchSortOption = 'relevance',
    query: string = ''
  ): JobOpportunity[] {
    const list = [...items];
    const q = query.toLowerCase().trim();

    switch (sortBy) {
      case 'relevance':
        if (!q) {
          // If no query, sort by match score desc then date desc
          return list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        }
        return list.sort((a, b) => {
          let scoreA = a.matchScore || 50;
          let scoreB = b.matchScore || 50;

          // Title match carries highest relevance boost
          if (a.title.toLowerCase().includes(q)) scoreA += 40;
          if (b.title.toLowerCase().includes(q)) scoreB += 40;

          // Skills match carries secondary relevance boost
          if (a.requiredSkills.some((s) => s.toLowerCase().includes(q))) scoreA += 25;
          if (b.requiredSkills.some((s) => s.toLowerCase().includes(q))) scoreB += 25;

          // Company match
          if (a.company.toLowerCase().includes(q)) scoreA += 15;
          if (b.company.toLowerCase().includes(q)) scoreB += 15;

          return scoreB - scoreA;
        });

      case 'dateDesc':
        return list.sort(
          (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        );

      case 'matchDesc':
        return list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

      case 'titleAsc':
        return list.sort((a, b) => a.title.localeCompare(b.title));

      case 'deadlineAsc':
        return list.sort(
          (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );

      default:
        return list;
    }
  },

  /**
   * Executes full search and filtering query.
   * Satisfies:
   * - Property 16: Search Keyword Matching
   * - Property 17: Pagination Correctness
   */
  async searchOpportunities(
    filterState: Partial<SearchFilterState>
  ): Promise<PaginatedResult<JobOpportunity>> {
    const all = opportunityService.getSavedOpportunities();

    let filtered = all.filter((opp) => {
      // 1. Keyword search (Property 16)
      if (filterState.searchTerm?.trim()) {
        if (!matchesSearchKeywords(opp, filterState.searchTerm)) {
          return false;
        }
      }

      // 2. Types filter
      if (filterState.types && filterState.types.length > 0) {
        if (!filterState.types.includes(opp.type)) return false;
      }

      // 3. Workplace types (Remote, Hybrid, On-site)
      if (filterState.workplaceTypes && filterState.workplaceTypes.length > 0) {
        if (!opp.workplaceType || !filterState.workplaceTypes.includes(opp.workplaceType)) {
          return false;
        }
      }

      // 4. Locations filter
      if (filterState.locations && filterState.locations.length > 0) {
        const match = filterState.locations.some((loc) =>
          opp.location.toLowerCase().includes(loc.toLowerCase())
        );
        if (!match) return false;
      }

      // 5. Companies filter
      if (filterState.companies && filterState.companies.length > 0) {
        const match = filterState.companies.some(
          (comp) => opp.company.toLowerCase() === comp.toLowerCase()
        );
        if (!match) return false;
      }

      // 6. Minimum match score
      if (
        typeof filterState.minMatchScore === 'number' &&
        filterState.minMatchScore > 0
      ) {
        if ((opp.matchScore || 0) < filterState.minMatchScore) {
          return false;
        }
      }

      return true;
    });

    // Sort results
    const sorted = this.sortOpportunities(
      filtered,
      filterState.sortBy || 'relevance',
      filterState.searchTerm || ''
    );

    // Paginate results (Property 17)
    return paginate(
      sorted,
      filterState.page || 1,
      filterState.pageSize || 6
    );
  },

  /**
   * Provides related search suggestions based on the search query.
   */
  getRelatedSearches(query: string): string[] {
    if (!query) return POPULAR_SEARCH_TERMS.slice(0, 5);
    const q = query.toLowerCase().trim();

    const related = POPULAR_SEARCH_TERMS.filter(
      (term) => !term.toLowerCase().includes(q)
    );

    return related.slice(0, 4);
  },
};

export default searchService;
