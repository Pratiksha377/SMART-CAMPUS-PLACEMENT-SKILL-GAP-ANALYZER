import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ToastProvider } from '@/context/ToastContext';
import { StatusBadge } from '@/components/StatusBadge';
import { ApplicationTimeline } from '@/components/ApplicationTimeline';
import { ApplicationCard } from '@/components/ApplicationCard';
import { ApplicationHistoryPage } from '@/pages/Applications/ApplicationHistoryPage';
import { Application } from '@/types/opportunity';

const sampleApplication: Application = {
  id: 'app-sample-101',
  studentId: 'prof-std-1001',
  opportunityId: 'opp-msft-01',
  opportunityTitle: 'Frontend Engineer - Teams UX',
  company: 'Microsoft',
  location: 'Hyderabad, India',
  type: 'Full-time',
  status: 'shortlisted',
  appliedAt: '2026-10-02T10:00:00Z',
  lastUpdated: '2026-10-06T12:00:00Z',
  skillMatchPercentage: 88,
  notes: 'Submitted portfolio highlighting React 19 tests.',
  resumeFileName: 'Resume_Alex_2026.pdf',
  timeline: [
    {
      status: 'applied',
      date: '2026-10-02T10:00:00Z',
      message: 'Application registered.',
    },
    {
      status: 'shortlisted',
      date: '2026-10-06T12:00:00Z',
      message: 'Shortlisted for Round 1 technical interview.',
    },
  ],
};

describe('Application History UI Components (Phase FE9)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('StatusBadge', () => {
    it('renders labels and icons for all application statuses', () => {
      const { rerender } = render(<StatusBadge status="applied" />);
      expect(screen.getByText('Application Submitted')).toBeInTheDocument();

      rerender(<StatusBadge status="reviewed" />);
      expect(screen.getByText('Under Review')).toBeInTheDocument();

      rerender(<StatusBadge status="shortlisted" />);
      expect(screen.getByText('Shortlisted for Interview')).toBeInTheDocument();

      rerender(<StatusBadge status="selected" />);
      expect(screen.getByText('Selected / Offer Extended')).toBeInTheDocument();

      rerender(<StatusBadge status="rejected" />);
      expect(screen.getByText('Not Selected')).toBeInTheDocument();

      rerender(<StatusBadge status="withdrawn" />);
      expect(screen.getByText('Withdrawn')).toBeInTheDocument();
    });
  });

  describe('ApplicationTimeline', () => {
    it('renders timeline milestones and descriptions', () => {
      render(
        <ApplicationTimeline
          timeline={sampleApplication.timeline}
          currentStatus={sampleApplication.status}
        />
      );

      expect(screen.getByText('Application registered.')).toBeInTheDocument();
      expect(screen.getByText('Shortlisted for Round 1 technical interview.')).toBeInTheDocument();
    });
  });

  describe('ApplicationCard', () => {
    it('renders card with company, title, status, and timeline toggle', () => {
      const handleWithdraw = vi.fn();
      render(
        <ApplicationCard
          application={sampleApplication}
          onRequestWithdraw={handleWithdraw}
        />
      );

      expect(screen.getByText('Microsoft')).toBeInTheDocument();
      expect(screen.getByText('Frontend Engineer - Teams UX')).toBeInTheDocument();
      expect(screen.getByText('88% Match')).toBeInTheDocument();
      expect(screen.getByText('Shortlisted for Interview')).toBeInTheDocument();

      // Toggle timeline
      const toggleTimeline = screen.getByRole('button', { name: /view history timeline/i });
      fireEvent.click(toggleTimeline);
      expect(screen.getByText('Application Milestone History')).toBeInTheDocument();

      // Trigger withdraw modal
      const withdrawButton = screen.getByRole('button', { name: /withdraw application/i });
      fireEvent.click(withdrawButton);
      expect(handleWithdraw).toHaveBeenCalledWith(sampleApplication);
    });
  });

  describe('ApplicationHistoryPage', () => {
    it('renders application history page, status filter tabs, and sort selector', async () => {
      render(
        <Provider store={store}>
          <ToastProvider>
            <BrowserRouter>
              <ApplicationHistoryPage />
            </BrowserRouter>
          </ToastProvider>
        </Provider>
      );

      expect(screen.getByText(/Student Application History & Tracking/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Sort By:/i)).toBeInTheDocument();

      // Change status filter tab
      const shortlistedTab = screen.getByRole('button', { name: 'shortlisted' });
      fireEvent.click(shortlistedTab);
      expect(shortlistedTab.className).toContain('bg-indigo-600');
    });
  });
});
