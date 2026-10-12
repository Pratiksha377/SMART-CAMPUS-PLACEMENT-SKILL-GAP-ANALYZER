import React from 'react';
import { OpportunityType } from '@/types/opportunity';
import { SearchFilterState } from '@/types/search';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Filter,
  RotateCcw,
  MapPin,
  Building,
  Briefcase,
  Laptop,
  Sparkles,
} from 'lucide-react';

export interface AdvancedFilterProps {
  filterState: Partial<SearchFilterState>;
  availableLocations?: string[];
  availableCompanies?: string[];
  onChange: (updates: Partial<SearchFilterState>) => void;
  onReset: () => void;
  className?: string;
}

const EMPLOYMENT_TYPES: OpportunityType[] = [
  'Full-time',
  'Internship',
  'Part-time',
  'Contract',
];

const WORKPLACE_TYPES = ['Remote', 'Hybrid', 'On-site'];

const MATCH_SCORE_PRESETS = [
  { label: 'Any Match', value: 0 },
  { label: '≥ 60% Match', value: 60 },
  { label: '≥ 75% Match', value: 75 },
  { label: '≥ 85% Top Match', value: 85 },
];

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  filterState,
  availableLocations = [
    'Bengaluru, India',
    'Hyderabad, India',
    'Remote',
    'Pune, India',
    'Mumbai, India',
  ],
  availableCompanies = [
    'Google',
    'Microsoft',
    'Amazon Web Services',
    'Meta',
    'Adobe',
    'Salesforce',
  ],
  onChange,
  onReset,
  className = '',
}) => {
  const currentTypes = filterState.types || [];
  const currentWorkplaces = filterState.workplaceTypes || [];
  const currentLocations = filterState.locations || [];
  const currentCompanies = filterState.companies || [];
  const currentMinScore = filterState.minMatchScore || 0;

  const toggleType = (type: OpportunityType) => {
    const updated = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    onChange({ types: updated });
  };

  const toggleWorkplace = (wp: string) => {
    const updated = currentWorkplaces.includes(wp)
      ? currentWorkplaces.filter((w) => w !== wp)
      : [...currentWorkplaces, wp];
    onChange({ workplaceTypes: updated });
  };

  const toggleLocation = (loc: string) => {
    const updated = currentLocations.includes(loc)
      ? currentLocations.filter((l) => l !== loc)
      : [...currentLocations, loc];
    onChange({ locations: updated });
  };

  const toggleCompany = (comp: string) => {
    const updated = currentCompanies.includes(comp)
      ? currentCompanies.filter((c) => c !== comp)
      : [...currentCompanies, comp];
    onChange({ companies: updated });
  };

  return (
    <Card
      className={`glass-card p-5 border-slate-800 space-y-6 font-sans select-none ${className}`}
      data-testid="advanced-filter-panel"
    >
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Filter className="h-4 w-4 text-violet-400" />
          <span>Advanced Filters</span>
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-[11px] text-slate-400 hover:text-white p-1"
          leftIcon={<RotateCcw className="h-3 w-3" />}
        >
          Reset
        </Button>
      </div>

      {/* 1. Minimum Skill Match Score */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-violet-400" /> Minimum Skill Match
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {MATCH_SCORE_PRESETS.map((preset) => {
            const isSelected = currentMinScore === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChange({ minMatchScore: preset.value })}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold text-center transition-all ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Employment Type */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 text-indigo-400" /> Employment Type
        </label>
        <div className="space-y-1.5">
          {EMPLOYMENT_TYPES.map((t) => (
            <label
              key={t}
              className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer py-0.5"
            >
              <input
                type="checkbox"
                checked={currentTypes.includes(t)}
                onChange={() => toggleType(t)}
                className="rounded bg-slate-900 border-slate-800 text-violet-600 focus:ring-violet-500 h-3.5 w-3.5"
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Workplace Arrangement */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Laptop className="h-3.5 w-3.5 text-blue-400" /> Workplace Type
        </label>
        <div className="space-y-1.5">
          {WORKPLACE_TYPES.map((wp) => (
            <label
              key={wp}
              className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer py-0.5"
            >
              <input
                type="checkbox"
                checked={currentWorkplaces.includes(wp)}
                onChange={() => toggleWorkplace(wp)}
                className="rounded bg-slate-900 border-slate-800 text-violet-600 focus:ring-violet-500 h-3.5 w-3.5"
              />
              <span>{wp}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Locations */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-emerald-400" /> Location Hub
        </label>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {availableLocations.map((loc) => (
            <label
              key={loc}
              className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer py-0.5"
            >
              <input
                type="checkbox"
                checked={currentLocations.includes(loc)}
                onChange={() => toggleLocation(loc)}
                className="rounded bg-slate-900 border-slate-800 text-violet-600 focus:ring-violet-500 h-3.5 w-3.5"
              />
              <span className="truncate">{loc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Companies */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Building className="h-3.5 w-3.5 text-amber-400" /> Hiring Companies
        </label>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {availableCompanies.map((comp) => (
            <label
              key={comp}
              className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer py-0.5"
            >
              <input
                type="checkbox"
                checked={currentCompanies.includes(comp)}
                onChange={() => toggleCompany(comp)}
                className="rounded bg-slate-900 border-slate-800 text-violet-600 focus:ring-violet-500 h-3.5 w-3.5"
              />
              <span className="truncate">{comp}</span>
            </label>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AdvancedFilter;
