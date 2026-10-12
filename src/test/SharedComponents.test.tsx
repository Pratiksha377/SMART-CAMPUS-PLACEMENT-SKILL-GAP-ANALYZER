import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterChips } from '@/components/FilterChips';
import { Pagination } from '@/components/Pagination';
import { StatusBadge } from '@/components/StatusBadge';
import { ApplicationTimeline } from '@/components/ApplicationTimeline';
import { ApplicationStatus } from '@/types/opportunity';

describe('Shared UI Components Unit Tests (Phase FE15.3)', () => {
  describe('FilterChips Component', () => {
    it('renders active filter chips and handles individual removal and clear all', () => {
      const handleRemove = vi.fn();
      const handleClearAll = vi.fn();

      render(
        <FilterChips
          filterState={{
            searchTerm: 'Frontend Developer',
            types: ['Full-time'],
            locations: ['Remote'],
            minMatchScore: 80,
          }}
          onRemoveChip={handleRemove}
          onClearAll={handleClearAll}
        />
      );

      expect(screen.getByTestId('filter-chips-container')).toBeInTheDocument();
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Full-time')).toBeInTheDocument();
      expect(screen.getByText('Remote')).toBeInTheDocument();
      expect(screen.getByText('≥80%')).toBeInTheDocument();

      // Remove single chip
      const removeBtn = screen.getByLabelText('Remove filter Frontend Developer');
      fireEvent.click(removeBtn);
      expect(handleRemove).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'Frontend Developer' })
      );

      // Clear all
      const clearBtn = screen.getByText('Clear All');
      fireEvent.click(clearBtn);
      expect(handleClearAll).toHaveBeenCalledTimes(1);
    });

    it('returns null when no active filters exist', () => {
      const { container } = render(
        <FilterChips
          filterState={{}}
          onRemoveChip={vi.fn()}
          onClearAll={vi.fn()}
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Pagination Component', () => {
    it('renders pagination controls, page numbers, and handles page switching', () => {
      const handlePageChange = vi.fn();
      const handlePageSizeChange = vi.fn();

      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={30}
          pageSize={6}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      );

      expect(screen.getByTestId('pagination-container')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument(); // startRecord = (2-1)*6 + 1 = 7
      expect(screen.getAllByText('12')[0]).toBeInTheDocument(); // endRecord = 12
      expect(screen.getByText('30')).toBeInTheDocument(); // totalItems

      // Next page
      const nextBtn = screen.getByLabelText('Next Page');
      fireEvent.click(nextBtn);
      expect(handlePageChange).toHaveBeenCalledWith(3);

      // Previous page
      const prevBtn = screen.getByLabelText('Previous Page');
      fireEvent.click(prevBtn);
      expect(handlePageChange).toHaveBeenCalledWith(1);

      // Specific page button
      const page3Btn = screen.getByLabelText('Page 3');
      fireEvent.click(page3Btn);
      expect(handlePageChange).toHaveBeenCalledWith(3);

      // Page size change
      const select = screen.getByLabelText('Items per page');
      fireEvent.change(select, { target: { value: '12' } });
      expect(handlePageSizeChange).toHaveBeenCalledWith(12);
    });

    it('returns null when totalItems is 0', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={0}
          totalItems={0}
          pageSize={10}
          onPageChange={vi.fn()}
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('StatusBadge Component', () => {
    const statuses: ApplicationStatus[] = [
      'applied',
      'reviewed',
      'shortlisted',
      'selected',
      'rejected',
      'withdrawn',
    ];

    it.each(statuses)('renders correctly for status %s', (status) => {
      render(<StatusBadge status={status} />);
      expect(screen.getByTestId(`status-badge-${status}`)).toBeInTheDocument();
    });
  });

  describe('ApplicationTimeline Component', () => {
    it('renders chronological timeline steps with status labels and messages', () => {
      const mockTimeline = [
        {
          status: 'applied' as const,
          date: '2026-02-01T10:00:00Z',
          message: 'Application submitted successfully.',
        },
        {
          status: 'shortlisted' as const,
          date: '2026-02-05T14:30:00Z',
          message: 'Shortlisted for technical interview.',
        },
      ];

      render(
        <ApplicationTimeline
          timeline={mockTimeline}
          currentStatus="shortlisted"
        />
      );

      expect(screen.getByTestId('application-timeline')).toBeInTheDocument();
      expect(screen.getByText('Application submitted successfully.')).toBeInTheDocument();
      expect(screen.getByText('Shortlisted for technical interview.')).toBeInTheDocument();
      expect(screen.getByText('applied')).toBeInTheDocument();
      expect(screen.getByText('shortlisted')).toBeInTheDocument();
    });
  });
});
