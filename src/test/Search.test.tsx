import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import authReducer from '@/store/authSlice';
import profileReducer from '@/store/profileSlice';
import opportunityReducer from '@/store/slices/opportunitySlice';
import { ToastProvider } from '@/context/ToastContext';

import { SearchBar } from '@/components/SearchBar';
import { FilterChips } from '@/components/FilterChips';
import { Pagination } from '@/components/Pagination';
import { AdvancedFilter } from '@/components/AdvancedFilter';
import { SearchResultsPage } from '@/pages/Search/SearchResultsPage';
import { FilterChipItem } from '@/types/search';
import { mockOpportunities, opportunityService } from '@/services/opportunityService';

const renderWithProviders = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      profile: profileReducer,
      opportunity: opportunityReducer,
    },
    preloadedState: {
      auth: {
        user: {
          id: 'std-user-01',
          name: 'Alex Student',
          email: 'alex@campus.edu',
          role: 'student',
          createdAt: new Date().toISOString(),
        },
        token: 'mock-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>{ui}</ToastProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('Search & Advanced Filtering UI Components (Phase FE11)', () => {
  beforeEach(() => {
    localStorage.clear();
    opportunityService.saveOpportunities([...mockOpportunities]);
    vi.clearAllMocks();
  });

  describe('SearchBar (FE11.1)', () => {
    it('renders input, handles typing, clear, and form submission', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const handleSearch = vi.fn();

      renderWithProviders(
        <SearchBar
          onChange={handleChange}
          onSearch={handleSearch}
          placeholder="Search test jobs"
        />
      );

      const input = screen.getByPlaceholderText('Search test jobs');
      expect(input).toBeInTheDocument();

      // Type in search bar
      await user.type(input, 'React');
      expect(handleChange).toHaveBeenCalledWith('React');

      // Submit search
      await user.click(screen.getByRole('button', { name: /Submit search/i }));
      expect(handleSearch).toHaveBeenCalledWith('React');

      // Clear search
      const clearBtn = screen.getByRole('button', { name: /Clear search/i });
      await user.click(clearBtn);
      expect(handleChange).toHaveBeenCalledWith('');
      expect(handleSearch).toHaveBeenCalledWith('');
    });
  });

  describe('FilterChips (FE11.5)', () => {
    it('renders active filter chips and handles individual removal and clear all', () => {
      const handleRemoveChip = vi.fn();
      const handleClearAll = vi.fn();

      const activeState = {
        searchTerm: 'Kubernetes',
        types: ['Full-time' as const],
        minMatchScore: 80,
      };

      renderWithProviders(
        <FilterChips
          filterState={activeState}
          onRemoveChip={handleRemoveChip}
          onClearAll={handleClearAll}
        />
      );

      expect(screen.getByText('Kubernetes')).toBeInTheDocument();
      expect(screen.getByText('Full-time')).toBeInTheDocument();
      expect(screen.getByText('≥80%')).toBeInTheDocument();

      // Remove single chip
      const removeKubernetes = screen.getByRole('button', {
        name: /Remove filter Kubernetes/i,
      });
      fireEvent.click(removeKubernetes);
      expect(handleRemoveChip).toHaveBeenCalledTimes(1);

      // Clear all
      const clearAllBtn = screen.getByRole('button', { name: /Clear All/i });
      fireEvent.click(clearAllBtn);
      expect(handleClearAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Pagination (FE11.6)', () => {
    it('renders page numbers, handles page change, and page size selection', () => {
      const handlePageChange = vi.fn();
      const handlePageSizeChange = vi.fn();

      renderWithProviders(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={30}
          pageSize={6}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      );

      expect(screen.getByText(/Showing/i)).toBeInTheDocument();
      expect(screen.getByText(/of/i)).toBeInTheDocument();

      // Previous button should be disabled on page 1
      const prevBtn = screen.getByRole('button', { name: /Previous Page/i });
      expect(prevBtn).toBeDisabled();

      // Click page 3
      const page3Btn = screen.getByRole('button', { name: 'Page 3' });
      fireEvent.click(page3Btn);
      expect(handlePageChange).toHaveBeenCalledWith(3);

      // Next button should be enabled
      const nextBtn = screen.getByRole('button', { name: /Next Page/i });
      expect(nextBtn).not.toBeDisabled();
      fireEvent.click(nextBtn);
      expect(handlePageChange).toHaveBeenCalledWith(2);

      // Change page size
      const sizeSelect = screen.getByLabelText(/Items per page/i);
      fireEvent.change(sizeSelect, { target: { value: '12' } });
      expect(handlePageSizeChange).toHaveBeenCalledWith(12);
    });
  });

  describe('AdvancedFilter (FE11.4)', () => {
    it('renders filter checkboxes and triggers onChange and onReset', () => {
      const handleChange = vi.fn();
      const handleReset = vi.fn();

      renderWithProviders(
        <AdvancedFilter
          filterState={{ types: [], minMatchScore: 0 }}
          onChange={handleChange}
          onReset={handleReset}
        />
      );

      expect(screen.getByText(/Advanced Filters/i)).toBeInTheDocument();
      expect(screen.getByText(/Minimum Skill Match/i)).toBeInTheDocument();
      expect(screen.getByText(/Employment Type/i)).toBeInTheDocument();

      // Click a match score preset (≥ 75% Match)
      const scorePreset = screen.getByRole('button', { name: /≥ 75% Match/i });
      fireEvent.click(scorePreset);
      expect(handleChange).toHaveBeenCalledWith({ minMatchScore: 75 });

      // Click Reset
      const resetBtn = screen.getByRole('button', { name: /Reset/i });
      fireEvent.click(resetBtn);
      expect(handleReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('SearchResultsPage (FE11.2, FE11.3, FE11.7, FE11.8)', () => {
    it('renders search results page layout and handles sorting and search input', async () => {
      renderWithProviders(<SearchResultsPage />);

      await waitFor(() => {
        expect(
          screen.getByText(/Explore Campus Placement Opportunities/i)
        ).toBeInTheDocument();
      });

      // Filter controls exist
      expect(screen.getByLabelText(/Sort search results/i)).toBeInTheDocument();

      // Search input exists
      expect(
        screen.getByPlaceholderText(
          /Search by role title, technology skill, company, or location.../i
        )
      ).toBeInTheDocument();
    });
  });
});
