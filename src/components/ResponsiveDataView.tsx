import React, { useState } from 'react';
import { Table, LayoutGrid } from 'lucide-react';

export interface DataColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface ResponsiveDataViewProps<T> {
  data: T[];
  columns: DataColumn<T>[];
  renderCard?: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  defaultView?: 'auto' | 'table' | 'cards';
  emptyMessage?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function ResponsiveDataView<T>({
  data,
  columns,
  renderCard,
  keyExtractor = (_item, idx) => String(idx),
  defaultView = 'auto',
  emptyMessage = 'No records available to display.',
  title,
  subtitle,
  actions,
  className = '',
}: ResponsiveDataViewProps<T>) {
  const [viewMode, setViewMode] = useState<'auto' | 'table' | 'cards'>(defaultView);

  const isTableActive = viewMode === 'table';
  const isCardsActive = viewMode === 'cards';

  // Default card renderer if custom not provided
  const defaultCardRenderer = (item: T, index: number) => {
    return (
      <div
        key={keyExtractor(item, index)}
        className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
        data-testid="responsive-card-item"
      >
        <div className="space-y-2">
          {columns.map((col) => {
            const val = (item as any)[col.key];
            const renderedVal = col.render ? col.render(item, index) : String(val ?? '—');
            return (
              <div
                key={String(col.key)}
                className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40 last:border-b-0"
              >
                <span className="text-slate-400 font-medium">{col.label}</span>
                <span className="text-slate-100 font-semibold text-right">{renderedVal}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`} data-testid="responsive-data-view">
      {/* View Header with Title, Actions, and View Toggle Buttons */}
      {(title || actions || defaultView !== 'auto') && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {title && (
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
              {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>
          )}

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {actions}

            {/* Layout Switcher buttons */}
            <div
              className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-0.5"
              role="group"
              aria-label="View mode toggle"
            >
              <button
                type="button"
                onClick={() => setViewMode('table')}
                data-testid="toggle-view-table"
                className={`touch-target-sm px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isTableActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
                aria-pressed={isTableActive}
              >
                <Table className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('cards')}
                data-testid="toggle-view-cards"
                className={`touch-target-sm px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isCardsActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Cards View"
                aria-pressed={isCardsActive}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {data.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-slate-400 text-xs border border-slate-800">
          {emptyMessage}
        </div>
      ) : (
        <>
          {/* 1. Mobile Cards Container (Visible on < md in 'auto' mode OR when 'cards' is selected) */}
          <div
            className={`space-y-3 ${
              viewMode === 'cards'
                ? 'block'
                : viewMode === 'table'
                ? 'hidden'
                : 'block md:hidden'
            }`}
            data-testid="mobile-cards-view"
          >
            {data.map((item, index) =>
              renderCard ? renderCard(item, index) : defaultCardRenderer(item, index)
            )}
          </div>

          {/* 2. Desktop Table Container (Visible on >= md in 'auto' mode OR when 'table' is selected) */}
          <div
            className={`glass-card rounded-2xl border border-slate-800 overflow-hidden ${
              viewMode === 'table'
                ? 'block'
                : viewMode === 'cards'
                ? 'hidden'
                : 'hidden md:block'
            }`}
            data-testid="desktop-table-view"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                    {columns.map((col) => (
                      <th
                        key={String(col.key)}
                        className={`py-3 px-4 font-semibold ${col.className || ''}`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {data.map((item, index) => (
                    <tr
                      key={keyExtractor(item, index)}
                      className="hover:bg-slate-800/30 transition-colors"
                      data-testid={`responsive-table-row-${index}`}
                    >
                      {columns.map((col) => {
                        const val = (item as any)[col.key];
                        return (
                          <td
                            key={String(col.key)}
                            className={`py-3 px-4 ${col.className || ''}`}
                          >
                            {col.render ? col.render(item, index) : String(val ?? '—')}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ResponsiveDataView;
