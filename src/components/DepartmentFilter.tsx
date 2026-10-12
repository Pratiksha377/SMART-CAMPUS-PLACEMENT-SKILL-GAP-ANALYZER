import React from 'react';
import { Filter } from 'lucide-react';

export interface DepartmentFilterProps {
  selectedDepartment: string;
  onChange: (dept: string) => void;
  departments?: string[];
  departmentCounts?: Record<string, number>;
  className?: string;
}

const DEFAULT_DEPARTMENTS = [
  'CSE',
  'IT',
  'ECE',
  'Mechanical',
  'Civil',
  'Electrical',
];

export const DepartmentFilter: React.FC<DepartmentFilterProps> = ({
  selectedDepartment,
  onChange,
  departments = DEFAULT_DEPARTMENTS,
  departmentCounts,
  className = '',
}) => {
  const allDepts = ['all', ...departments];

  return (
    <div className={`space-y-2 ${className}`} data-testid="department-filter">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
        <Filter className="h-3.5 w-3.5 text-emerald-400" />
        <span>Filter by Department</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {allDepts.map((dept) => {
          const isSelected =
            selectedDepartment.toLowerCase() === dept.toLowerCase();
          const count =
            dept === 'all'
              ? departmentCounts
                ? Object.values(departmentCounts).reduce((a, b) => a + b, 0)
                : undefined
              : departmentCounts?.[dept];

          return (
            <button
              key={dept}
              type="button"
              onClick={() => onChange(dept)}
              data-testid={`dept-filter-${dept.toLowerCase()}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{dept === 'all' ? 'All Departments' : dept}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-emerald-700/60 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentFilter;
