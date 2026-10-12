import { JobOpportunity, OpportunityType } from './opportunity';

export type SearchSortOption =
  | 'relevance'
  | 'dateDesc'
  | 'matchDesc'
  | 'titleAsc'
  | 'deadlineAsc';

export interface SearchFilterState {
  searchTerm: string;
  types: OpportunityType[];
  workplaceTypes: string[];
  locations: string[];
  companies: string[];
  minMatchScore?: number;
  sortBy: SearchSortOption;
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number; // 1-indexed for display: e.g. 1
  endIndex: number;   // 1-indexed for display: e.g. 10
}

export interface FilterChipItem {
  id: string;
  key: keyof SearchFilterState;
  label: string;
  value: string;
}
