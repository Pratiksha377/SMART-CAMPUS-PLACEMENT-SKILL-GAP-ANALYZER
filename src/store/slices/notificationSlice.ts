import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Notification,
  NotificationPreferences,
  NotificationFilterType,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from '@/types/notification';

export interface NotificationState {
  items: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  filterType: NotificationFilterType;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  preferences: DEFAULT_NOTIFICATION_PREFERENCES,
  filterType: 'all',
  isLoading: false,
  error: null,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((item) => !item.read).length;
      state.isLoading = false;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Check if duplicate ID exists
      const existingIdx = state.items.findIndex((n) => n.id === action.payload.id);
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.unshift(action.payload);
        if (!action.payload.read) {
          state.unreadCount += 1;
        }
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((item) => {
        item.read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item && !item.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
    setPreferences: (state, action: PayloadAction<NotificationPreferences>) => {
      state.preferences = action.payload;
    },
    setFilterType: (state, action: PayloadAction<NotificationFilterType>) => {
      state.filterType = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  setPreferences,
  setFilterType,
  setLoading,
} = notificationSlice.actions;

export default notificationSlice.reducer;
