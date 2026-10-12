import {
  OpportunityType,
  OpportunityStatus,
  ApplicationStatus,
  JobOpportunity,
} from './opportunity';
import { SkillProficiency } from './profile';

export type SkillProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface RequiredSkillInput {
  skill: string;
  level: SkillProficiencyLevel;
}

export interface JobPostingFormData {
  title: string;
  company: string;
  location: string;
  workplaceType: 'On-site' | 'Remote' | 'Hybrid';
  type: OpportunityType;
  salaryRange?: string;
  deadline: string; // YYYY-MM-DD or ISO
  description: string;
  requirements?: string;
  responsibilities?: string;
  skills: RequiredSkillInput[];
  status?: OpportunityStatus;
}

export interface ApplicantCandidate {
  id: string; // student user id
  applicationId: string;
  opportunityId: string;
  opportunityTitle?: string;
  studentName: string;
  studentEmail: string;
  department: string;
  cgpa: number;
  graduationYear: number;
  resumeFileName?: string;
  resumeUrl?: string;
  appliedAt: string;
  status: ApplicationStatus;
  skillMatchPercentage: number;
  studentSkills: {
    name: string;
    proficiency: SkillProficiency;
  }[];
  matchedSkills: string[];
  missingSkills: string[];
  notes?: string;
}

export interface ApplicantFilterCriteria {
  searchQuery?: string;
  minMatchScore?: number;
  status?: ApplicationStatus | 'all';
  sortBy?: 'matchDesc' | 'matchAsc' | 'dateDesc' | 'nameAsc';
  requireAllSkills?: boolean;
}

export interface RecruiterMetrics {
  activePostingsCount: number;
  totalPostingsCount: number;
  totalApplicantsCount: number;
  shortlistedCount: number;
  filledPostingsCount: number;
  averageMatchScore: number;
}
