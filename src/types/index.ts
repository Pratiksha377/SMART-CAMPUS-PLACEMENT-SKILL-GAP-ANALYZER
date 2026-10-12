export * from './auth';
export * from './profile';
export * from './assessment';
export * from './skillGap';
export * from './opportunity';
export * from './notification';

// Backward compatibility alias
export type NotificationItem = import('./notification').Notification;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}
