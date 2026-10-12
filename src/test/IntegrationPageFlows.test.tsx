import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice';
import profileReducer from '@/store/slices/profileSlice';
import opportunityReducer from '@/store/slices/opportunitySlice';
import notificationReducer from '@/store/slices/notificationSlice';
import { OpportunitiesPage } from '@/pages/Opportunities/OpportunitiesPage';
import { ApplicationHistoryPage } from '@/pages/Applications/ApplicationHistoryPage';
import { NotificationCenterPage } from '@/pages/Notifications/NotificationCenterPage';
import { NotificationPreferencesPage } from '@/pages/Settings/NotificationPreferencesPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { PlacementTrackerPage } from '@/pages/admin/PlacementTrackerPage';
import { DataExportPage } from '@/pages/admin/DataExportPage';
import { ToastProvider } from '@/context/ToastContext';
import { mockUsers, mockNotifications } from '@/test/fixtures';

// Mock chart.js for admin pages
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart">Bar Chart</div>,
  Line: () => <div data-testid="mock-line-chart">Line Chart</div>,
  Doughnut: () => <div data-testid="mock-doughnut-chart">Doughnut Chart</div>,
}));

// Mock URL methods
window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
window.URL.revokeObjectURL = vi.fn();

function createTestStore(initialRole: 'student' | 'recruiter' | 'admin' = 'student') {
  return configureStore({
    reducer: {
      auth: authReducer,
      profile: profileReducer,
      opportunities: opportunityReducer,
      notifications: notificationReducer,
    },
    preloadedState: {
      auth: {
        user: mockUsers[initialRole],
        token: 'mock-jwt-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
      notifications: {
        items: mockNotifications,
        unreadCount: 1,
        isLoading: false,
        error: null,
        filter: 'all',
      },
    },
  });
}

describe('Frontend Integration Tests: End-to-End Page Flows (Phase FE15.4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Flow 1: Student Opportunities & Application Journey', () => {
    it('allows student to discover opportunities, search, filter, and view history', async () => {
      const store = createTestStore('student');

      const { unmount: unmountOpps } = render(
        <Provider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/opportunities']}>
              <OpportunitiesPage />
            </MemoryRouter>
          </ToastProvider>
        </Provider>
      );

      // Verify opportunities page renders
      expect(screen.getByTestId('opportunities-page')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Title, skill, or keyword/i)).toBeInTheDocument();

      // Wait for initial opportunities to load
      await waitFor(() => {
        expect(screen.getByText('Associate Software Engineer - Full Stack')).toBeInTheDocument();
      });

      // Search for Google
      const searchInput = screen.getByPlaceholderText(/Title, skill, or keyword/i);
      fireEvent.change(searchInput, { target: { value: 'Google' } });

      await waitFor(() => {
        expect(screen.getByText('Associate Software Engineer - Full Stack')).toBeInTheDocument();
      });

      unmountOpps();

      // Render Application History page
      const { unmount: unmountApps } = render(
        <Provider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/applications']}>
              <ApplicationHistoryPage />
            </MemoryRouter>
          </ToastProvider>
        </Provider>
      );

      expect(screen.getByTestId('application-history-page')).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByTestId('application-card-app-seed-01')).toBeInTheDocument();
      });
      unmountApps();
    });
  });

  describe('Flow 2: Admin Operations & Data Export Journey', () => {
    it('allows admin to view console metrics, filter departments, track drives, and export reports', () => {
      const store = createTestStore('admin');

      render(
        <Provider store={store}>
          <BrowserRouter>
            <AdminDashboard />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByTestId('admin-dashboard-page')).toBeInTheDocument();
      expect(screen.getByTestId('metrics-widget')).toBeInTheDocument();

      // Switch department filter
      const cseBtn = screen.getByTestId('dept-filter-cse');
      fireEvent.click(cseBtn);
      expect(cseBtn).toHaveClass('bg-emerald-600');

      // Visit Placement Tracker
      const { unmount } = render(
        <Provider store={store}>
          <BrowserRouter>
            <PlacementTrackerPage />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByTestId('placement-tracker-page')).toBeInTheDocument();
      expect(screen.getByTestId('total-tracked-count')).toBeInTheDocument();
      unmount();

      // Visit Data Export Center
      render(
        <Provider store={store}>
          <BrowserRouter>
            <DataExportPage />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByTestId('data-export-page')).toBeInTheDocument();
      const exportBtn = screen.getByTestId('btn-trigger-export');
      fireEvent.click(exportBtn);

      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('Flow 3: Notification Center & Preferences Journey', () => {
    it('allows user to review notifications, mark items as read, and update alert preferences', async () => {
      const store = createTestStore('student');

      const { unmount } = render(
        <Provider store={store}>
          <BrowserRouter>
            <NotificationCenterPage />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByTestId('notification-center-page')).toBeInTheDocument();
      expect(screen.getByText('High Match Opportunity')).toBeInTheDocument();

      // Mark as read button
      const markReadBtn = screen.getByRole('button', { name: /mark notification as read/i });
      fireEvent.click(markReadBtn);
      unmount();

      // Visit Preferences page
      render(
        <Provider store={store}>
          <ToastProvider>
            <BrowserRouter>
              <NotificationPreferencesPage />
            </BrowserRouter>
          </ToastProvider>
        </Provider>
      );

      expect(screen.getByTestId('notification-preferences-page')).toBeInTheDocument();
      const saveBtn = screen.getByRole('button', { name: /save preferences/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(screen.getByText(/Preferences Saved/i)).toBeInTheDocument();
      });
    });
  });
});
