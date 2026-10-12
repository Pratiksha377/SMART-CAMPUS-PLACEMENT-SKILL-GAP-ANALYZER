import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { POPULAR_SEARCH_TERMS } from '@/services/searchService';

export interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  showSuggestions?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value: controlledValue,
  defaultValue = '',
  onChange,
  onSearch,
  placeholder = 'Search by role title, technology skill, company, or location...',
  size = 'md',
  showSuggestions = false,
  autoFocus = false,
  className = '',
}) => {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentValue = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    if (!isControlled && defaultValue !== internalValue) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChange?.('');
    onSearch?.('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(currentValue);
    setIsFocused(false);
  };

  const handleSelectSuggestion = (term: string) => {
    if (!isControlled) {
      setInternalValue(term);
    }
    onChange?.(term);
    onSearch?.(term);
    setIsFocused(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: 'h-9 text-xs pl-8 pr-16',
    md: 'h-11 text-xs sm:text-sm pl-10 pr-20',
    lg: 'h-14 text-sm sm:text-base pl-12 pr-28 rounded-2xl',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5 left-2.5',
    md: 'h-4 w-4 left-3.5',
    lg: 'h-5 w-5 left-4',
  };

  const suggestions = POPULAR_SEARCH_TERMS.filter(
    (term) =>
      !currentValue ||
      term.toLowerCase().includes(currentValue.toLowerCase())
  ).slice(0, 5);

  return (
    <div
      ref={containerRef}
      className={`relative w-full font-sans ${className}`}
      data-testid="search-bar-container"
    >
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search
          className={`absolute text-slate-400 pointer-events-none transition-colors ${
            iconSizes[size]
          } ${isFocused ? 'text-violet-400' : ''}`}
        />

        <input
          type="text"
          value={currentValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Search opportunities"
          className={`w-full bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 shadow-inner ${sizeClasses[size]}`}
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          {currentValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            type="submit"
            aria-label="Submit search"
            className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-1 shadow-md shadow-violet-600/30 transition-all"
          >
            <span className="hidden sm:inline">Search</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </form>

      {/* Autocomplete / Suggestions Dropdown */}
      {showSuggestions && isFocused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 p-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 animate-fadeIn backdrop-blur-xl">
          <p className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-violet-400" /> Suggested Keywords
          </p>
          <div className="space-y-0.5">
            {suggestions.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSelectSuggestion(term)}
                className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-between transition-colors"
              >
                <span>{term}</span>
                <span className="text-[10px] text-slate-500">Keyword</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
