export type NotificationType =
  | 'opportunity_match'
  | 'status_update'
  | 'recruiter_alert'
  | 'assessment_reminder'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string; // ISO date string
  link?: string;
  opportunityId?: string;
  applicationId?: string;
  actionUrl?: string;
  priority?: 'low' | 'normal' | 'high';
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  opportunityMatches: boolean;
  applicationStatusUpdates: boolean;
  assessmentReminders: boolean;
  recruiterMessages: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  emailNotifications: true,
  opportunityMatches: true,
  applicationStatusUpdates: true,
  assessmentReminders: true,
  recruiterMessages: true,
};

export type NotificationFilterType = 'all' | NotificationType | 'unread';
