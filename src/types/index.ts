export * from './auth';
export * from './profile';
export * from './assessment';
export * from './skillGap';
export * from './opportunity';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'opportunity' | 'status';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}
