import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OpportunityCard } from '@/components/OpportunityCard';
import { FilterPanel } from '@/components/FilterPanel';
import { OpportunityListing } from '@/components/OpportunityListing';
import { ApplyModal } from '@/components/ApplyModal';
import { OpportunityDetailsPage } from '@/pages/Opportunities/OpportunityDetailsPage';
import { JobOpportunity } from '@/types/opportunity';

const sampleOpportunity: JobOpportunity = {
  id: 'opp-sample-01',
  recruiterId: 'rec-1',
  title: 'Full Stack Engineer - Cloud UX',
  company: 'Google',
  location: 'Bengaluru, India',
  workplaceType: 'Hybrid',
  type: 'Full-time',
  description: 'Design and deliver production cloud features with modern web interfaces.',
  requirements: ['B.Tech in Computer Science', 'Strong TypeScript and React skills'],
  responsibilities: ['Write clean, tested UI code', 'Collaborate with API teams'],
  requiredSkills: ['React & UI Frameworks', 'TypeScript & JavaScript', 'SQL'],
  salaryRange: '$90,000 - $115,000 / yr',
  deadline: '2026-12-01T23:59:59Z',
  postedAt: '2026-10-01T09:00:00Z',
  status: 'open',
  matchScore: 92,
};

describe('Opportunity Discovery UI Components (Phase FE8)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('OpportunityCard', () => {
    it('renders company, title, skills, match badge, and triggers actions', () => {
      const handleDetails = vi.fn();
      const handleApply = vi.fn();

      render(
        <OpportunityCard
          opportunity={sampleOpportunity}
          onViewDetails={handleDetails}
          onApply={handleApply}
        />
      );

      expect(screen.getByText('Google')).toBeInTheDocument();
      expect(screen.getByText('Full Stack Engineer - Cloud UX')).toBeInTheDocument();
      expect(screen.getByText('92% Match')).toBeInTheDocument();
      expect(screen.getByText('Bengaluru, India')).toBeInTheDocument();
      expect(screen.getByText('React & UI Frameworks')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /view details/i }));
      expect(handleDetails).toHaveBeenCalledWith(sampleOpportunity);

      fireEvent.click(screen.getByRole('button', { name: /apply now/i }));
      expect(handleApply).toHaveBeenCalledWith(sampleOpportunity);
    });

    it('renders Applied badge when isApplied is true', () => {
      render(
        <OpportunityCard
          opportunity={sampleOpportunity}
          isApplied={true}
          onViewDetails={vi.fn()}
          onApply={vi.fn()}
        />
      );

      expect(screen.getByText('Applied')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /apply now/i })).not.toBeInTheDocument();
    });
  });

  describe('FilterPanel', () => {
    it('renders search input, filter checkboxes, and responds to user selection', async () => {
      const handleChange = vi.fn();
      render(
        <FilterPanel
          availableLocations={['Bengaluru', 'Remote']}
          availableCompanies={['Google', 'Microsoft']}
          onChange={handleChange}
        />
      );

      expect(screen.getByPlaceholderText(/Title, skill, or keyword/i)).toBeInTheDocument();
      expect(screen.getByText('Google')).toBeInTheDocument();
      expect(screen.getByText('Bengaluru')).toBeInTheDocument();

      // Check location
      const bglCheckbox = screen.getByLabelText('Bengaluru');
      fireEvent.click(bglCheckbox);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });
  });

  describe('OpportunityListing', () => {
    it('renders list with view mode toggle and empty state', () => {
      const handleReset = vi.fn();
      const { rerender } = render(
        <OpportunityListing
          opportunities={[sampleOpportunity]}
          onViewDetails={vi.fn()}
          onApply={vi.fn()}
        />
      );

      expect(screen.getByText(/Showing/i)).toBeInTheDocument();
      expect(screen.getByLabelText('Grid View')).toBeInTheDocument();
      expect(screen.getByLabelText('List View')).toBeInTheDocument();

      // Switch to List View
      fireEvent.click(screen.getByLabelText('List View'));
      expect(screen.getByText('Full Stack Engineer - Cloud UX')).toBeInTheDocument();

      // Empty State
      rerender(
        <OpportunityListing
          opportunities={[]}
          onViewDetails={vi.fn()}
          onApply={vi.fn()}
          onResetFilters={handleReset}
        />
      );

      expect(screen.getByText(/No Opportunities Match Your Criteria/i)).toBeInTheDocument();
      const resetBtn = screen.getByRole('button', { name: /reset all filters/i });
      fireEvent.click(resetBtn);
      expect(handleReset).toHaveBeenCalled();
    });
  });

  describe('ApplyModal', () => {
    it('renders application modal and handles submit', async () => {
      const handleConfirm = vi.fn();
      const handleClose = vi.fn();

      render(
        <ApplyModal
          opportunity={sampleOpportunity}
          isOpen={true}
          onClose={handleClose}
          onConfirmApply={handleConfirm}
        />
      );

      expect(screen.getByText(/Apply to Google/i)).toBeInTheDocument();
      expect(screen.getByText(/Confirm & Submit Application/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /confirm & submit application/i }));
      await waitFor(() => {
        expect(handleConfirm).toHaveBeenCalled();
      });
    });

    it('renders duplicate application warning and disables submit when isDuplicate is true', () => {
      render(
        <ApplyModal
          opportunity={sampleOpportunity}
          isOpen={true}
          onClose={vi.fn()}
          onConfirmApply={vi.fn()}
          isDuplicate={true}
        />
      );

      expect(screen.getByTestId('duplicate-application-alert')).toBeInTheDocument();
      expect(screen.getByText(/Application Already Active/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirm & submit application/i })).toBeDisabled();
    });
  });

  describe('OpportunityDetailsPage', () => {
    it('renders full job details, required skills, and back button', () => {
      const handleBack = vi.fn();
      const handleApply = vi.fn();

      render(
        <OpportunityDetailsPage
          opportunity={sampleOpportunity}
          onBack={handleBack}
          onApply={handleApply}
        />
      );

      expect(screen.getByText('Role Overview')).toBeInTheDocument();
      expect(screen.getByText('Required Core Skills & Competencies')).toBeInTheDocument();
      expect(screen.getByText('Candidate Qualifications & Requirements')).toBeInTheDocument();
      expect(screen.getByText('Key Responsibilities')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /back to placement opportunities/i }));
      expect(handleBack).toHaveBeenCalled();
    });
  });
});
