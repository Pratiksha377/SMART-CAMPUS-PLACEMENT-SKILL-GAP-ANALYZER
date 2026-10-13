import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import NotFound from '@/pages/NotFound';
import { renderWithProviders } from './test-utils';

describe('Header & Navigation Components', () => {
  it('renders Header brand logo and title', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Skill Studio')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders user details and role in Header when authenticated', () => {
    const preloadedState = {
      auth: {
        user: {
          id: 'test-user-1',
          name: 'Sarah Connor',
          email: 'sarah@campus.edu',
          role: 'student' as const,
        },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    };

    renderWithProviders(<Header />, { preloadedState });

    expect(screen.getByText('Sarah Connor')).toBeInTheDocument();
    expect(screen.getAllByText(/student/i).length).toBeGreaterThan(0);
  });

  it('renders guest menu links when unauthenticated in Navigation', () => {
    renderWithProviders(<Navigation orientation="vertical" />);
    expect(screen.getByRole('link', { name: /explore/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  it('renders student navigation items for student role', () => {
    const preloadedState = {
      auth: {
        user: {
          id: 'student-1',
          name: 'Alex Student',
          email: 'alex@campus.edu',
          role: 'student' as const,
        },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    };

    renderWithProviders(<Navigation orientation="vertical" />, { preloadedState });

    expect(screen.getByRole('link', { name: /my profile/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /assessments/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /skill gap/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /opportunities/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /applications/i })).toBeInTheDocument();
  });

  it('renders recruiter navigation items for recruiter role', () => {
    const preloadedState = {
      auth: {
        user: {
          id: 'recruiter-1',
          name: 'Rachel Recruiter',
          email: 'rachel@hiring.com',
          role: 'recruiter' as const,
        },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    };

    renderWithProviders(<Navigation orientation="vertical" />, { preloadedState });

    expect(screen.getByRole('link', { name: /post job/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /manage postings/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /applicants/i })).toBeInTheDocument();
  });

  it('renders admin navigation items for admin role', () => {
    const preloadedState = {
      auth: {
        user: {
          id: 'admin-1',
          name: 'Arthur Admin',
          email: 'admin@campus.edu',
          role: 'admin' as const,
        },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    };

    renderWithProviders(<Navigation orientation="vertical" />, { preloadedState });

    expect(screen.getByRole('link', { name: /placements/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /analytics/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /data export/i })).toBeInTheDocument();
  });

  it('renders NotFound 404 page correctly', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /return to portal/i })).toBeInTheDocument();
  });
});
