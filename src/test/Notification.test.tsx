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
import notificationReducer from '@/store/slices/notificationSlice';
import { ToastProvider } from '@/context/ToastContext';

import { NotificationCard } from '@/components/NotificationCard';
import { NotificationBell } from '@/components/NotificationBell';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { NotificationCenterPage } from '@/pages/Notifications/NotificationCenterPage';
import { NotificationPreferencesPage } from '@/pages/Settings/NotificationPreferencesPage';

import { Notification } from '@/types/notification';
import { notificationService, initialMockNotifications } from '@/services/notificationService';

const sampleNotification: Notification = {
  id: 'notif-test-101',
  userId: 'std-user-01',
  title: 'High Skill Match: Google SWE',
  message: 'Google posted Associate Software Engineer matching 92% of your profile.',
  type: 'opportunity_match',
  read: false,
  createdAt: new Date().toISOString(),
  link: '/student/opportunities',
};

const renderWithProviders = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      profile: profileReducer,
      opportunity: opportunityReducer,
      notifications: notificationReducer,
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
      notifications: {
        items: [sampleNotification],
        unreadCount: 1,
        preferences: {
          emailNotifications: true,
          opportunityMatches: true,
          applicationStatusUpdates: true,
          assessmentReminders: true,
          recruiterMessages: true,
        },
        filterType: 'all',
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

describe('Notification Center UI Components (Phase FE12)', () => {
  beforeEach(() => {
    localStorage.clear();
    notificationService.saveNotifications([sampleNotification]);
    vi.clearAllMocks();
  });

  describe('NotificationCard (FE12.7, FE12.10, FE12.11)', () => {
    it('renders title, message, unread dot, and handles mark as read and dismiss', () => {
      const handleMarkAsRead = vi.fn();
      const handleDismiss = vi.fn();

      renderWithProviders(
        <NotificationCard
          notification={sampleNotification}
          onMarkAsRead={handleMarkAsRead}
          onDismiss={handleDismiss}
        />
      );

      expect(screen.getByText('High Skill Match: Google SWE')).toBeInTheDocument();
      expect(
        screen.getByText(/matching 92% of your profile/i)
      ).toBeInTheDocument();
      expect(screen.getByTestId('unread-indicator')).toBeInTheDocument();

      // Mark as read action
      const markBtn = screen.getByRole('button', {
        name: /Mark notification as read/i,
      });
      fireEvent.click(markBtn);
      expect(handleMarkAsRead).toHaveBeenCalledWith('notif-test-101');

      // Dismiss action
      const dismissBtn = screen.getByRole('button', {
        name: /Dismiss notification/i,
      });
      fireEvent.click(dismissBtn);
      expect(handleDismiss).toHaveBeenCalledWith('notif-test-101');
    });
  });

  describe('NotificationBell & NotificationDropdown (FE12.4, FE12.5)', () => {
    it('renders bell with unread badge and opens dropdown menu on click', () => {
      renderWithProviders(<NotificationBell />);

      // Verify unread badge counter
      expect(screen.getByTestId('notification-unread-badge')).toHaveTextContent('1');

      // Click bell to open dropdown
      const bellBtn = screen.getByRole('button', {
        name: /View notifications, 1 unread/i,
      });
      fireEvent.click(bellBtn);

      // Verify dropdown appears
      expect(screen.getByTestId('notification-dropdown')).toBeInTheDocument();
      expect(screen.getByText('1 unread updates')).toBeInTheDocument();
      expect(screen.getByText(/View Notification Center/i)).toBeInTheDocument();
    });

    it('renders dropdown items and triggers mark all as read', () => {
      const handleMarkRead = vi.fn();
      const handleMarkAll = vi.fn();
      const handleDismiss = vi.fn();
      const handleClose = vi.fn();

      renderWithProviders(
        <NotificationDropdown
          isOpen={true}
          onClose={handleClose}
          notifications={[sampleNotification]}
          unreadCount={1}
          onMarkAsRead={handleMarkRead}
          onMarkAllAsRead={handleMarkAll}
          onDismiss={handleDismiss}
        />
      );

      expect(screen.getByText('Notifications')).toBeInTheDocument();
      const markAllBtn = screen.getByRole('button', {
        name: /Mark all read/i,
      });
      fireEvent.click(markAllBtn);
      expect(handleMarkAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('NotificationCenterPage (FE12.6, FE12.8)', () => {
    it('renders full notification center layout, filter tabs, and search bar', async () => {
      renderWithProviders(<NotificationCenterPage />);

      await waitFor(() => {
        expect(
          screen.getByText(/Campus Notification Center/i)
        ).toBeInTheDocument();
      });

      // Filter tabs exist
      expect(screen.getByRole('button', { name: /All Updates/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Unread/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Opportunities/i })).toBeInTheDocument();

      // Search input exists
      expect(
        screen.getByPlaceholderText(
          /Search notifications by keyword, company, or message/i
        )
      ).toBeInTheDocument();
    });
  });

  describe('NotificationPreferencesPage (FE12.9)', () => {
    it('renders notification checkboxes and allows saving updated preferences', async () => {
      const user = userEvent.setup();

      renderWithProviders(<NotificationPreferencesPage />);

      await waitFor(() => {
        expect(
          screen.getByText(/Notification Delivery Preferences/i)
        ).toBeInTheDocument();
      });

      // Verify category checkboxes exist
      const oppCheckbox = screen.getByLabelText(/Job Opportunity Match Alerts/i);
      const statusCheckbox = screen.getByLabelText(/Application Status Milestones/i);
      expect(oppCheckbox).toBeInTheDocument();
      expect(statusCheckbox).toBeInTheDocument();

      // Toggle a checkbox
      await user.click(oppCheckbox);

      // Submit form
      const saveBtn = screen.getByRole('button', { name: /Save Preferences/i });
      await user.click(saveBtn);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Save Preferences/i })).toBeInTheDocument();
      });
    });
  });
});
