import { v4 as uuidv4 } from 'uuid';
import {
  Notification,
  NotificationType,
  NotificationPreferences,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from '@/types/notification';
import { JobOpportunity } from '@/types/opportunity';

const NOTIFICATIONS_STORAGE_KEY = 'smart_campus_notifications_v1';
const NOTIFICATION_PREFS_KEY = 'smart_campus_notification_prefs_v1';

export const initialMockNotifications: Notification[] = [
  {
    id: 'notif-opp-001',
    userId: 'std-user-01',
    title: 'High Skill Match Opportunity: Google SWE',
    message: 'Google posted "Associate Software Engineer - Full Stack" matching 92% of your verified skills profile.',
    type: 'opportunity_match',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    link: '/student/opportunities',
    opportunityId: 'opp-google-swe-01',
    actionUrl: '/student/opportunities',
    priority: 'high',
  },
  {
    id: 'notif-status-002',
    userId: 'std-user-01',
    title: 'Application Shortlisted: Microsoft 365 UX',
    message: 'Your application for Frontend Engineer has been shortlisted for Technical Screening Round 1.',
    type: 'status_update',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    link: '/student/applications',
    applicationId: 'app-msft-01',
    actionUrl: '/student/applications',
    priority: 'high',
  },
  {
    id: 'notif-remind-003',
    userId: 'std-user-01',
    title: 'Adaptive Assessment Reminder',
    message: 'Complete the "Node.js & Backend Architecture" adaptive skill assessment to unlock Tier-1 placements.',
    type: 'assessment_reminder',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    link: '/student/assessments',
    actionUrl: '/student/assessments',
    priority: 'normal',
  },
  {
    id: 'notif-rec-004',
    userId: 'std-user-01',
    title: 'Recruiter Profile Review',
    message: 'A recruiter from Amazon Web Services viewed your verified academic and skill gap portfolio.',
    type: 'recruiter_alert',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    link: '/student/profile',
    actionUrl: '/student/profile',
    priority: 'low',
  },
];

export const notificationService = {
  // Persistence Helpers (Property 21)
  getSavedNotifications(): Notification[] {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return initialMockNotifications;
  },

  saveNotifications(notifications: Notification[]): void {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  },

  getSavedPreferences(userId: string = 'std-user-01'): NotificationPreferences {
    try {
      const raw = localStorage.getItem(`${NOTIFICATION_PREFS_KEY}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return { ...DEFAULT_NOTIFICATION_PREFERENCES };
  },

  savePreferences(userId: string = 'std-user-01', prefs: NotificationPreferences): void {
    try {
      localStorage.setItem(`${NOTIFICATION_PREFS_KEY}_${userId}`, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  },

  /**
   * Retrieves notifications for a given user.
   * Validates Property 21: Notifications persist until explicitly dismissed.
   */
  async getNotifications(userId: string = 'std-user-01'): Promise<Notification[]> {
    const all = this.getSavedNotifications();
    return all.filter((n) => !n.userId || n.userId === userId);
  },

  /**
   * Mark a notification as read (FE12.10).
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    const all = this.getSavedNotifications();
    const item = all.find((n) => n.id === notificationId);
    if (!item) {
      throw new Error(`Notification with ID ${notificationId} not found`);
    }

    item.read = true;
    this.saveNotifications(all);
    return item;
  },

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId: string = 'std-user-01'): Promise<void> {
    const all = this.getSavedNotifications();
    all.forEach((n) => {
      if (!n.userId || n.userId === userId) {
        n.read = true;
      }
    });
    this.saveNotifications(all);
  },

  /**
   * Dismiss / Delete a single notification (FE12.11).
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    const all = this.getSavedNotifications();
    const filtered = all.filter((n) => n.id !== notificationId);
    if (filtered.length === all.length) return false;

    this.saveNotifications(filtered);
    return true;
  },

  /**
   * Clear all notifications for user.
   */
  async clearAllNotifications(userId: string = 'std-user-01'): Promise<void> {
    const all = this.getSavedNotifications();
    const remaining = all.filter((n) => n.userId && n.userId !== userId);
    this.saveNotifications(remaining);
  },

  /**
   * Retrieves user preferences.
   */
  async getPreferences(userId: string = 'std-user-01'): Promise<NotificationPreferences> {
    return this.getSavedPreferences(userId);
  },

  /**
   * Updates user preferences.
   * Validates Property 20: Notification Preference Enforcement.
   */
  async updatePreferences(
    userId: string = 'std-user-01',
    prefs: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const current = this.getSavedPreferences(userId);
    const updated: NotificationPreferences = {
      ...current,
      ...prefs,
    };
    this.savePreferences(userId, updated);
    return updated;
  },

  /**
   * Evaluates if a notification is permitted based on user preferences.
   * Validates Property 20: Notification Preference Enforcement.
   */
  isNotificationAllowed(userId: string, type: NotificationType): boolean {
    const prefs = this.getSavedPreferences(userId);
    switch (type) {
      case 'opportunity_match':
        return prefs.opportunityMatches;
      case 'status_update':
        return prefs.applicationStatusUpdates;
      case 'assessment_reminder':
        return prefs.assessmentReminders;
      case 'recruiter_alert':
        return prefs.recruiterMessages;
      case 'system':
        return true;
      default:
        return true;
    }
  },

  /**
   * Triggers an opportunity match notification.
   * Validates Property 18: Notification Trigger Accuracy within 5 minutes.
   * Validates Property 20: Notification Preference Enforcement.
   */
  async triggerOpportunityMatchNotification(
    userId: string,
    opportunity: JobOpportunity,
    matchScore: number = 90
  ): Promise<Notification | null> {
    if (!this.isNotificationAllowed(userId, 'opportunity_match')) {
      return null;
    }

    const notif: Notification = {
      id: `notif-match-${uuidv4().slice(0, 8)}`,
      userId,
      title: `New High-Match Job Opening: ${opportunity.title}`,
      message: `${opportunity.company} posted a new position in ${opportunity.location} matching ${matchScore}% of your skill profile.`,
      type: 'opportunity_match',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/student/opportunities',
      opportunityId: opportunity.id,
      actionUrl: '/student/opportunities',
      priority: 'high',
    };

    const all = this.getSavedNotifications();
    all.unshift(notif);
    this.saveNotifications(all);

    return notif;
  },

  /**
   * Triggers an application status update notification.
   * Validates Property 19: Application Status Update Notifications within 1 minute.
   * Validates Property 20: Notification Preference Enforcement.
   */
  async triggerStatusUpdateNotification(
    userId: string,
    applicationId: string,
    roleTitle: string,
    company: string,
    newStatus: string
  ): Promise<Notification | null> {
    if (!this.isNotificationAllowed(userId, 'status_update')) {
      return null;
    }

    const notif: Notification = {
      id: `notif-status-${uuidv4().slice(0, 8)}`,
      userId,
      title: `Application Status Updated: ${company}`,
      message: `Your application for "${roleTitle}" has moved to status: "${newStatus.toUpperCase()}".`,
      type: 'status_update',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/student/applications',
      applicationId,
      actionUrl: '/student/applications',
      priority: 'high',
    };

    const all = this.getSavedNotifications();
    all.unshift(notif);
    this.saveNotifications(all);

    return notif;
  },
};

export default notificationService;
