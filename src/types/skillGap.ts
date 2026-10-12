export type SkillPriority = 'high' | 'medium' | 'low';

export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Algorithms'
  | 'DevOps'
  | 'General';

export interface SkillProficiency {
  skill: string;
  category: SkillCategory;
  currentLevel: number; // 0 - 100
  requiredLevel: number; // 0 - 100
  gap: number; // Math.max(0, requiredLevel - currentLevel)
  priority: SkillPriority;
  assessmentScore?: number;
  assessmentCount?: number;
}

export interface LearningResource {
  id: string;
  skill: string;
  title: string;
  type: 'Course' | 'Documentation' | 'Practice' | 'Video' | 'Project';
  provider: string;
  url: string;
  estimatedHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Recommendation {
  id: string;
  skill: string;
  category: SkillCategory;
  currentScore: number;
  targetScore: number;
  priority: SkillPriority;
  actionableAdvice: string;
  estimatedTimeToClose: string;
  resources: LearningResource[];
}

export interface BenchmarkRoleRequirement {
  roleId: string;
  roleName: string;
  description: string;
  benchmarkSkills: {
    skill: string;
    category: SkillCategory;
    requiredLevel: number; // 0 - 100
  }[];
}

export interface SkillGapAnalysis {
  studentId: string;
  targetRole: string;
  overallReadinessPercentage: number;
  skills: SkillProficiency[];
  recommendations: Recommendation[];
  assessedAt: string;
  totalAssessmentsCount: number;
}
