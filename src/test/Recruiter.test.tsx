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

import { JobPostingForm } from '@/components/JobPostingForm';
import { PostingCard } from '@/components/PostingCard';
import { ApplicantCard } from '@/components/ApplicantCard';
import { ApplicantModal } from '@/components/ApplicantModal';
import { PostingManagementPage } from '@/pages/Recruiter/PostingManagementPage';
import { ApplicantListPage } from '@/pages/Recruiter/ApplicantListPage';
import { RecruiterDashboardPage } from '@/pages/Recruiter/RecruiterDashboardPage';

import { JobOpportunity } from '@/types/opportunity';
import { ApplicantCandidate } from '@/types/recruiter';
import { recruiterService } from '@/services/recruiterService';

const samplePosting: JobOpportunity = {
  id: 'opp-test-101',
  recruiterId: 'rec-test-01',
  title: 'Full Stack Cloud Engineer',
  company: 'CloudScale Technologies',
  location: 'Bengaluru, India',
  workplaceType: 'Hybrid',
  type: 'Full-time',
  description: 'Building robust scalable distributed backend and web interfaces.',
  requirements: ["Bachelor's in CS or IT"],
  responsibilities: ['Architect microservices'],
  requiredSkills: ['React & UI Frameworks', 'TypeScript & JavaScript'],
  detailedSkills: [
    { skill: 'React & UI Frameworks', level: 'intermediate' },
    { skill: 'TypeScript & JavaScript', level: 'advanced' },
  ],
  salaryRange: '$90,000 - $110,000 / yr',
  deadline: '2026-12-31T23:59:59Z',
  postedAt: '2026-10-01T10:00:00Z',
  applicants: ['std-candidate-001'],
  status: 'open',
  matchScore: 92,
};

const sampleApplicant: ApplicantCandidate = {
  id: 'std-candidate-001',
  applicationId: 'app-test-202',
  opportunityId: 'opp-test-101',
  opportunityTitle: 'Full Stack Cloud Engineer',
  studentName: 'Aarav Sharma',
  studentEmail: 'aarav.sharma@campus.edu',
  department: 'Computer Science & Engineering',
  cgpa: 8.9,
  graduationYear: 2026,
  resumeFileName: 'Aarav_Sharma_Resume.pdf',
  appliedAt: '2026-10-05T12:00:00Z',
  status: 'applied',
  skillMatchPercentage: 88,
  studentSkills: [
    { name: 'React & UI Frameworks', proficiency: 'Advanced' },
    { name: 'TypeScript & JavaScript', proficiency: 'Advanced' },
  ],
  matchedSkills: ['React & UI Frameworks', 'TypeScript & JavaScript'],
  missingSkills: [],
  notes: 'Extensive coursework in distributed computing.',
};

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
          id: 'rec-test-01',
          name: 'Jane Recruiter',
          email: 'recruiter@tech.com',
          role: 'recruiter',
          createdAt: new Date().toISOString(),
        },
        token: 'mock-recruiter-token',
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

describe('Recruiter Portal UI Components (Phase FE10)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('JobPostingForm (FE10.2 - FE10.4)', () => {
    it('renders form inputs, dynamic skills section, and handles submission', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();

      renderWithProviders(
        <JobPostingForm onSubmit={handleSubmit} onCancel={vi.fn()} />
      );

      // Verify form fields exist
      expect(screen.getByLabelText(/Job Title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Hiring Company/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Application Deadline/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Role Overview & Mission/i)).toBeInTheDocument();

      // Dynamic skill input button
      expect(screen.getByRole('button', { name: /Add Skill/i })).toBeInTheDocument();

      // Fill in required fields
      await user.type(screen.getByPlaceholderText(/Frontend Software Engineer/i), 'Senior Frontend Architect');
      await user.type(screen.getByPlaceholderText(/Describe the opportunity/i), 'Exciting role building cloud user interfaces at scale.');

      // Click Publish
      await user.click(screen.getByRole('button', { name: /Publish Opportunity/i }));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
        const submittedData = handleSubmit.mock.calls[0][0];
        expect(submittedData.title).toBe('Senior Frontend Architect');
        expect(submittedData.skills.length).toBeGreaterThan(0);
      });
    });

    it('validates missing required title and shows error', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();

      renderWithProviders(
        <JobPostingForm onSubmit={handleSubmit} />
      );

      // Clear default title if any
      const titleInput = screen.getByPlaceholderText(/Frontend Software Engineer/i);
      await user.clear(titleInput);

      await user.click(screen.getByRole('button', { name: /Publish Opportunity/i }));

      await waitFor(() => {
        expect(screen.getByText(/Job title is required/i)).toBeInTheDocument();
        expect(handleSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('PostingCard (FE10.6, FE10.7)', () => {
    it('renders role title, company, skills, and triggers status change', async () => {
      const handleStatusChange = vi.fn();
      const handleEdit = vi.fn();
      const handleDelete = vi.fn();
      const handleViewApplicants = vi.fn();

      renderWithProviders(
        <PostingCard
          posting={samplePosting}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewApplicants={handleViewApplicants}
        />
      );

      expect(screen.getByText('Full Stack Cloud Engineer')).toBeInTheDocument();
      expect(screen.getByText('CloudScale Technologies')).toBeInTheDocument();
      expect(screen.getByText('React & UI Frameworks')).toBeInTheDocument();

      // Trigger status switch
      const statusSelect = screen.getByLabelText(/Change posting status/i);
      fireEvent.change(statusSelect, { target: { value: 'closed' } });
      expect(handleStatusChange).toHaveBeenCalledWith('opp-test-101', 'closed');

      // Click Edit
      fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
      expect(handleEdit).toHaveBeenCalledWith(samplePosting);

      // Click Applicants
      fireEvent.click(screen.getByRole('button', { name: /Applicants/i }));
      expect(handleViewApplicants).toHaveBeenCalledWith('opp-test-101');
    });
  });

  describe('ApplicantCard & ApplicantModal (FE10.9, FE10.10)', () => {
    it('renders applicant summary and opens full profile modal', async () => {
      const handleViewProfile = vi.fn();
      const handleStatusChange = vi.fn();

      renderWithProviders(
        <ApplicantCard
          applicant={sampleApplicant}
          onViewProfile={handleViewProfile}
          onStatusChange={handleStatusChange}
        />
      );

      expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
      expect(screen.getByText('Computer Science & Engineering')).toBeInTheDocument();
      expect(screen.getByText(/88% Match/i)).toBeInTheDocument();

      // Click View Full Profile
      fireEvent.click(screen.getByRole('button', { name: /View Full Profile/i }));
      expect(handleViewProfile).toHaveBeenCalledWith(sampleApplicant);
    });

    it('renders modal details and triggers recruiter shortlist action', async () => {
      const handleStatusAction = vi.fn();
      const handleClose = vi.fn();

      renderWithProviders(
        <ApplicantModal
          applicant={sampleApplicant}
          isOpen={true}
          onClose={handleClose}
          onStatusChange={handleStatusAction}
        />
      );

      expect(screen.getByText('Candidate Profile & Skill Evaluation')).toBeInTheDocument();
      expect(screen.getByText('aarav.sharma@campus.edu')).toBeInTheDocument();
      expect(screen.getByText('8.90 / 10.0')).toBeInTheDocument();

      // Click Shortlist Candidate
      const shortlistBtn = screen.getByRole('button', { name: /Shortlist Candidate/i });
      fireEvent.click(shortlistBtn);

      await waitFor(() => {
        expect(handleStatusAction).toHaveBeenCalledWith(
          sampleApplicant.applicationId,
          'shortlisted',
          ''
        );
      });
    });
  });

  describe('PostingManagementPage (FE10.5)', () => {
    it('renders postings list, handles status filter tab switching', async () => {
      renderWithProviders(<PostingManagementPage />);

      await waitFor(() => {
        expect(screen.getByText(/Manage Campus Job Postings/i)).toBeInTheDocument();
      });

      // Filter tabs exist
      expect(screen.getByRole('button', { name: /All Statuses/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^open$/i })).toBeInTheDocument();
    });
  });

  describe('ApplicantListPage (FE10.8, FE10.11)', () => {
    it('renders candidate applicant pool and filter controls', async () => {
      renderWithProviders(<ApplicantListPage />);

      await waitFor(() => {
        expect(screen.getByText(/Candidate Applicant Pool/i)).toBeInTheDocument();
      });

      expect(
        screen.getByPlaceholderText(/Search candidate name, email, department/i)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Filter by minimum match score/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Sort applicants/i)).toBeInTheDocument();
    });
  });

  describe('RecruiterDashboardPage (FE10.1)', () => {
    it('renders KPI metrics grid, welcome banner, and quick actions', async () => {
      renderWithProviders(<RecruiterDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/Recruiter Workspace/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/Active Openings/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Applicants/i)).toBeInTheDocument();
      expect(screen.getByText(/Shortlisted Talent/i)).toBeInTheDocument();
      expect(screen.getByText(/Avg Match Score/i)).toBeInTheDocument();
    });
  });
});
