import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { notificationService } from '@/services/notificationService';
import {
  Notification,
  NotificationType,
  NotificationPreferences,
} from '@/types/notification';
import { JobOpportunity } from '@/types/opportunity';

describe('Notification Center - Property-Based Tests (Properties 18-21)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const opportunityArbitrary: fc.Arbitrary<JobOpportunity> = fc.record({
    id: fc.uuid(),
    recruiterId: fc.constant('rec-test'),
    title: fc.constantFrom('Frontend Engineer', 'Backend Architect', 'DevOps Specialist'),
    company: fc.constantFrom('Google', 'Microsoft', 'Amazon', 'Meta'),
    location: fc.constantFrom('Bengaluru, India', 'Hyderabad, India', 'Remote'),
    type: fc.constant('Full-time'),
    description: fc.constant('Great software engineering opportunity.'),
    requiredSkills: fc.constant(['React', 'TypeScript']),
    deadline: fc.constant('2026-12-31T23:59:59Z'),
    postedAt: fc.constant(new Date().toISOString()),
    status: fc.constant('open'),
  });

  const preferencesArbitrary: fc.Arbitrary<NotificationPreferences> = fc.record({
    emailNotifications: fc.boolean(),
    opportunityMatches: fc.boolean(),
    applicationStatusUpdates: fc.boolean(),
    assessmentReminders: fc.boolean(),
    recruiterMessages: fc.boolean(),
  });

  /**
   * Property 18: Notification Trigger Accuracy
   * For any opportunity matching a student's profile criteria, the system SHALL send
   * a notification within 5 minutes of the opportunity being posted.
   * Validates: Requirements 8.1
   */
  it('Property 18: Notification Trigger Accuracy - matched opportunities trigger a notification with accurate latency', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        opportunityArbitrary,
        fc.integer({ min: 80, max: 100 }),
        async (userId, opp, matchScore) => {
          // Ensure preference is enabled for trigger accuracy testing
          await notificationService.updatePreferences(userId, {
            opportunityMatches: true,
          });

          const startTime = Date.now();
          const notif = await notificationService.triggerOpportunityMatchNotification(
            userId,
            opp,
            matchScore
          );

          expect(notif).not.toBeNull();
          expect(notif?.userId).toBe(userId);
          expect(notif?.type).toBe('opportunity_match');
          expect(notif?.opportunityId).toBe(opp.id);
          expect(notif?.read).toBe(false);

          // Timestamp within 5 minutes (< 300,000 ms) of triggering
          const notifTime = new Date(notif!.createdAt).getTime();
          expect(Math.abs(notifTime - startTime)).toBeLessThan(300000);

          // Present in notification center
          const userNotifications = await notificationService.getNotifications(userId);
          expect(userNotifications.some((n) => n.id === notif!.id)).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property 19: Application Status Update Notifications
   * For any change in application status, the student SHALL receive a notification
   * reflecting that status change within 1 minute.
   * Validates: Requirements 8.2
   */
  it('Property 19: Application Status Update Notifications - status updates reflect promptly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.uuid(),
        fc.constantFrom('Reviewed', 'Shortlisted', 'Selected', 'Rejected'),
        async (userId, applicationId, newStatus) => {
          await notificationService.updatePreferences(userId, {
            applicationStatusUpdates: true,
          });

          const startTime = Date.now();
          const notif = await notificationService.triggerStatusUpdateNotification(
            userId,
            applicationId,
            'Associate Software Engineer',
            'Google',
            newStatus
          );

          expect(notif).not.toBeNull();
          expect(notif?.userId).toBe(userId);
          expect(notif?.type).toBe('status_update');
          expect(notif?.applicationId).toBe(applicationId);
          expect(notif?.message).toContain(newStatus.toUpperCase());

          // Latency within 1 minute (< 60,000 ms)
          const notifTime = new Date(notif!.createdAt).getTime();
          expect(Math.abs(notifTime - startTime)).toBeLessThan(60000);

          // Present in notification center
          const all = await notificationService.getNotifications(userId);
          expect(all.some((n) => n.id === notif!.id)).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property 20: Notification Preference Enforcement
   * For any user with specific notification preferences, only notifications matching
   * those preferences SHALL be sent to that user.
   * Validates: Requirements 8.4
   */
  it('Property 20: Notification Preference Enforcement - disabled categories are never delivered', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        preferencesArbitrary,
        opportunityArbitrary,
        async (userId, prefs, opp) => {
          // Set user preferences
          await notificationService.updatePreferences(userId, prefs);

          // 1. Test Opportunity Match
          const matchNotif = await notificationService.triggerOpportunityMatchNotification(
            userId,
            opp,
            90
          );

          if (!prefs.opportunityMatches) {
            expect(matchNotif).toBeNull();
          } else {
            expect(matchNotif).not.toBeNull();
          }

          // 2. Test Application Status Update
          const statusNotif = await notificationService.triggerStatusUpdateNotification(
            userId,
            'app-test-id',
            'Frontend Engineer',
            'Microsoft',
            'Shortlisted'
          );

          if (!prefs.applicationStatusUpdates) {
            expect(statusNotif).toBeNull();
          } else {
            expect(statusNotif).not.toBeNull();
          }

          // Invariant: No notification in storage has a type disabled by preferences
          const stored = await notificationService.getNotifications(userId);
          for (const item of stored) {
            if (item.type === 'opportunity_match') {
              expect(prefs.opportunityMatches).toBe(true);
            }
            if (item.type === 'status_update') {
              expect(prefs.applicationStatusUpdates).toBe(true);
            }
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property 21: Notification Persistence
   * For any notification sent to a user, that notification SHALL appear in the user's
   * notification center until explicitly dismissed or marked as read.
   * Validates: Requirements 8.5
   */
  it('Property 21: Notification Persistence - notifications persist until dismissed or marked as read', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        opportunityArbitrary,
        async (userId, opp) => {
          await notificationService.updatePreferences(userId, {
            opportunityMatches: true,
          });

          // 1. Send notification
          const notif = await notificationService.triggerOpportunityMatchNotification(
            userId,
            opp,
            95
          );
          expect(notif).not.toBeNull();
          const notifId = notif!.id;

          // 2. Persistence check: Repeated queries across page reloads return the notification
          let list = await notificationService.getNotifications(userId);
          let found = list.find((n) => n.id === notifId);
          expect(found).toBeDefined();
          expect(found?.read).toBe(false);

          // 3. Mark as read
          const updated = await notificationService.markAsRead(notifId);
          expect(updated.read).toBe(true);

          list = await notificationService.getNotifications(userId);
          found = list.find((n) => n.id === notifId);
          expect(found).toBeDefined();
          expect(found?.read).toBe(true);

          // 4. Explicit dismissal
          const dismissed = await notificationService.deleteNotification(notifId);
          expect(dismissed).toBe(true);

          list = await notificationService.getNotifications(userId);
          found = list.find((n) => n.id === notifId);
          expect(found).toBeUndefined();
        }
      ),
      { numRuns: 20 }
    );
  });
});
