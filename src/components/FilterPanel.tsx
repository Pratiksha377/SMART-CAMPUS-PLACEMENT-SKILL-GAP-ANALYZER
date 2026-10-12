import React, { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { OpportunityFilterCriteria, OpportunityType } from '@/types/opportunity';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Search, Filter, RotateCcw, MapPin, Building, Briefcase, Sliders } from 'lucide-react';

export interface FilterPanelProps {
  initialCriteria?: Partial<OpportunityFilterCriteria>;
  availableLocations: string[];
  availableCompanies: string[];
  onChange: (criteria: OpportunityFilterCriteria) => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  initialCriteria,
  availableLocations,
  availableCompanies,
  onChange,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialCriteria?.searchTerm || '');
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialCriteria?.locations || []
  );
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(
    initialCriteria?.companies || []
  );
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>(
    initialCriteria?.types || []
  );
  const [selectedWorkplace, setSelectedWorkplace] = useState<string[]>(
    initialCriteria?.workplaceTypes || []
  );
  const [minMatch, setMinMatch] = useState<number>(initialCriteria?.minMatchScore || 0);

  // Debounced notification of criteria changes (FE8.7)
  const debouncedNotify = useMemo(
    () =>
      debounce((criteria: OpportunityFilterCriteria) => {
        onChange(criteria);
      }, 300),
    [onChange]
  );

  useEffect(() => {
    debouncedNotify({
      searchTerm,
      locations: selectedLocations,
      companies: selectedCompanies,
      types: selectedTypes,
      workplaceTypes: selectedWorkplace,
      minMatchScore: minMatch > 0 ? minMatch : undefined,
    });
  }, [
    searchTerm,
    selectedLocations,
    selectedCompanies,
    selectedTypes,
    selectedWorkplace,
    minMatch,
    debouncedNotify,
  ]);

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((item) => item !== loc) : [...prev, loc]
    );
  };

  const toggleCompany = (comp: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(comp) ? prev.filter((item) => item !== comp) : [...prev, comp]
    );
  };

  const toggleType = (t: OpportunityType) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const toggleWorkplace = (w: string) => {
    setSelectedWorkplace((prev) =>
      prev.includes(w) ? prev.filter((item) => item !== w) : [...prev, w]
    );
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedLocations([]);
    setSelectedCompanies([]);
    setSelectedTypes([]);
    setSelectedWorkplace([]);
    setMinMatch(0);
  };

  const hasActiveFilters =
    searchTerm.length > 0 ||
    selectedLocations.length > 0 ||
    selectedCompanies.length > 0 ||
    selectedTypes.length > 0 ||
    selectedWorkplace.length > 0 ||
    minMatch > 0;

  return (
    <Card
      variant="glass"
      padding="md"
      className={`font-sans space-y-5 ${className}`}
      data-testid="filter-panel"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          Filter Opportunities
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-[11px] h-7 px-2 text-slate-400 hover:text-white"
            leftIcon={<RotateCcw className="w-3 h-3" />}
          >
            Reset
          </Button>
        )}
      </div>

      {/* 1. Search Keyword */}
      <div className="space-y-1.5">
        <label htmlFor="search-input" className="text-xs font-medium text-slate-300">Search Roles or Keywords</label>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-input"
            type="text"
            placeholder="Title, skill, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* 2. Employment Role Type */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
          Opportunity Type
        </span>
        <div className="space-y-1.5">
          {(['Full-time', 'Internship', 'Contract', 'Part-time'] as OpportunityType[]).map((type) => (
            <label
              key={type}
              className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none hover:text-white"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleType(type)}
                className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Workplace Setup */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          Workplace Model
        </span>
        <div className="space-y-1.5">
          {['Remote', 'Hybrid', 'On-site'].map((wp) => (
            <label
              key={wp}
              className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none hover:text-white"
            >
              <input
                type="checkbox"
                checked={selectedWorkplace.includes(wp)}
                onChange={() => toggleWorkplace(wp)}
                className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>{wp}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Company */}
      {availableCompanies.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-emerald-400" />
            Company
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {availableCompanies.map((comp) => (
              <label
                key={comp}
                className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={selectedCompanies.includes(comp)}
                  onChange={() => toggleCompany(comp)}
                  className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="truncate">{comp}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 5. Location */}
      {availableLocations.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Location
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {availableLocations.map((loc) => (
              <label
                key={loc}
                className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(loc)}
                  onChange={() => toggleLocation(loc)}
                  className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="truncate">{loc}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default FilterPanel;
