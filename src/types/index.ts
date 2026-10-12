export * from './auth';
export * from './profile';
export * from './assessment';
export type {
  SkillPriority,
  SkillCategory,
  LearningResource,
  Recommendation,
  BenchmarkRoleRequirement,
  SkillGapAnalysis,
} from './skillGap';
export type { SkillProficiency as SkillProficiencyMetric } from './skillGap';
export * from './opportunity';
export * from './notification';

// Backward compatibility alias
export type NotificationItem = import('./notification').Notification;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}
