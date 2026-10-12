import React from 'react';
import { Calendar, RotateCcw } from 'lucide-react';

export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (range: { startDate: string; endDate: string }) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  className = '',
}) => {
  const handlePreset = (preset: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (preset === 'all') {
      onChange({ startDate: '', endDate: '' });
    } else if (preset === 'last30') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      onChange({ startDate: d.toISOString().split('T')[0], endDate: today });
    } else if (preset === 'currentSemester') {
      onChange({ startDate: '2026-01-01', endDate: today });
    } else if (preset === 'academicYear') {
      onChange({ startDate: '2025-08-01', endDate: '2026-06-30' });
    }
  };

  const handleReset = () => {
    onChange({ startDate: '', endDate: '' });
  };

  return (
    <div
      className={`glass-card rounded-2xl p-4 border border-slate-800 space-y-3 ${className}`}
      data-testid="date-range-picker"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
          <span>Date Range Filter</span>
        </div>
        {(startDate || endDate) && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            data-testid="date-range-reset"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Preset range quick-select pills */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => handlePreset('all')}
          data-testid="preset-all"
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            !startDate && !endDate
              ? 'bg-indigo-600 text-white font-semibold shadow-sm'
              : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800'
          }`}
        >
          All Time
        </button>
        <button
          type="button"
          onClick={() => handlePreset('last30')}
          data-testid="preset-last30"
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800 transition-all"
        >
          Last 30 Days
        </button>
        <button
          type="button"
          onClick={() => handlePreset('currentSemester')}
          data-testid="preset-semester"
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800 transition-all"
        >
          Current Semester
        </button>
        <button
          type="button"
          onClick={() => handlePreset('academicYear')}
          data-testid="preset-ay"
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800 transition-all"
        >
          AY 2025-26
        </button>
      </div>

      {/* Custom Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1">
          <label
            htmlFor="admin-start-date"
            className="text-[11px] font-medium text-slate-400"
          >
            Start Date
          </label>
          <input
            id="admin-start-date"
            type="date"
            value={startDate}
            onChange={(e) =>
              onChange({ startDate: e.target.value, endDate })
            }
            data-testid="input-start-date"
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="admin-end-date"
            className="text-[11px] font-medium text-slate-400"
          >
            End Date
          </label>
          <input
            id="admin-end-date"
            type="date"
            value={endDate}
            onChange={(e) =>
              onChange({ startDate, endDate: e.target.value })
            }
            data-testid="input-end-date"
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
