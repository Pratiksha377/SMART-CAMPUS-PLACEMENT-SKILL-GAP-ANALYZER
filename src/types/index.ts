export * from './auth';
export * from './profile';
export * from './assessment';
export * from './skillGap';

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Part-time' | 'Contract';
  description: string;
  requiredSkills: string[];
  salaryRange?: string;
  deadline: string;
  recruiterId: string;
  createdAt: string;
  status: 'open' | 'closed' | 'filled';
  matchScore?: number;
}

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
