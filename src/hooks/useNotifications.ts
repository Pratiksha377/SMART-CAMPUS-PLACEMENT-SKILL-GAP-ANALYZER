import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setNotifications,
  markAsRead as markAsReadAction,
  markAllAsRead as markAllAsReadAction,
  removeNotification as removeNotificationAction,
  setLoading,
} from '@/store/slices/notificationSlice';
import { notificationService } from '@/services/notificationService';
import { useAuth } from './useAuth';

export const useNotifications = (pollIntervalMs: number = 30000) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { items, unreadCount, preferences, filterType, isLoading } =
    useAppSelector((state) => state.notifications);

  const userId = user?.id || 'std-user-01';

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getNotifications(userId);
      dispatch(setNotifications(data));
    } catch {
      // Fallback
    }
  }, [dispatch, userId]);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Auto-refresh hook polling (FE12.12)
  useEffect(() => {
    if (pollIntervalMs <= 0) return;
    const timer = setInterval(() => {
      fetchNotifications();
    }, pollIntervalMs);

    return () => clearInterval(timer);
  }, [fetchNotifications, pollIntervalMs]);

  const markNotificationAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      dispatch(markAsReadAction(id));
    } catch {
      // ignore
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId);
      dispatch(markAllAsReadAction());
    } catch {
      // ignore
    }
  };

  const dismissNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      dispatch(removeNotificationAction(id));
    } catch {
      // ignore
    }
  };

  return {
    notifications: items,
    unreadCount,
    preferences,
    filterType,
    isLoading,
    refresh: fetchNotifications,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    dismiss: dismissNotification,
  };
};

export default useNotifications;
