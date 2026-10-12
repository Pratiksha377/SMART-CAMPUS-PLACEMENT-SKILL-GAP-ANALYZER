import React from 'react';
import { FilterChipItem, SearchFilterState } from '@/types/search';
import { X, Trash2 } from 'lucide-react';

export interface FilterChipsProps {
  filterState: Partial<SearchFilterState>;
  onRemoveChip: (chip: FilterChipItem) => void;
  onClearAll: () => void;
  className?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filterState,
  onRemoveChip,
  onClearAll,
  className = '',
}) => {
  const chips: FilterChipItem[] = [];

  // Search term chip
  if (filterState.searchTerm?.trim()) {
    chips.push({
      id: `term-${filterState.searchTerm}`,
      key: 'searchTerm',
      label: 'Keyword',
      value: filterState.searchTerm.trim(),
    });
  }

  // Types chips
  if (filterState.types && filterState.types.length > 0) {
    filterState.types.forEach((t) => {
      chips.push({
        id: `type-${t}`,
        key: 'types',
        label: 'Type',
        value: t,
      });
    });
  }

  // Workplace types
  if (filterState.workplaceTypes && filterState.workplaceTypes.length > 0) {
    filterState.workplaceTypes.forEach((wt) => {
      chips.push({
        id: `workplace-${wt}`,
        key: 'workplaceTypes',
        label: 'Arrangement',
        value: wt,
      });
    });
  }

  // Locations
  if (filterState.locations && filterState.locations.length > 0) {
    filterState.locations.forEach((loc) => {
      chips.push({
        id: `loc-${loc}`,
        key: 'locations',
        label: 'Location',
        value: loc,
      });
    });
  }

  // Companies
  if (filterState.companies && filterState.companies.length > 0) {
    filterState.companies.forEach((comp) => {
      chips.push({
        id: `comp-${comp}`,
        key: 'companies',
        label: 'Company',
        value: comp,
      });
    });
  }

  // Minimum Match Score
  if (
    typeof filterState.minMatchScore === 'number' &&
    filterState.minMatchScore > 0
  ) {
    chips.push({
      id: `score-${filterState.minMatchScore}`,
      key: 'minMatchScore',
      label: 'Min Match',
      value: `≥${filterState.minMatchScore}%`,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      className={`flex items-center flex-wrap gap-2 text-xs font-sans ${className}`}
      data-testid="filter-chips-container"
    >
      <span className="text-slate-400 font-medium text-[11px]">
        Active Filters:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-300 text-xs font-medium animate-fadeIn"
          data-testid={`filter-chip-${chip.id}`}
        >
          <span className="text-slate-400 text-[10px] uppercase font-bold">
            {chip.label}:
          </span>
          <span className="font-semibold text-white">{chip.value}</span>
          <button
            type="button"
            onClick={() => onRemoveChip(chip)}
            aria-label={`Remove filter ${chip.value}`}
            className="p-0.5 rounded-md hover:bg-violet-500/30 text-violet-300 hover:text-white transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center gap-1"
      >
        <Trash2 className="h-3 w-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
};

export default FilterChips;
