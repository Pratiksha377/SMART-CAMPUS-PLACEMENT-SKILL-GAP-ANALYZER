export type OpportunityType = 'Full-time' | 'Internship' | 'Part-time' | 'Contract';

export type OpportunityStatus = 'open' | 'closed' | 'filled';

export type ApplicationStatus =
  | 'applied'
  | 'reviewed'
  | 'shortlisted'
  | 'rejected'
  | 'selected'
  | 'withdrawn';

export interface RequiredSkill {
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface JobOpportunity {
  id: string;
  recruiterId: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workplaceType?: 'On-site' | 'Remote' | 'Hybrid';
  type: OpportunityType;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  requiredSkills: string[];
  salaryRange?: string;
  deadline: string; // ISO date string
  postedAt: string; // ISO date string
  applicants?: string[];
  status: OpportunityStatus;
  matchScore?: number; // 0 - 100 percentage match
}

export interface ApplicationTimelineEvent {
  status: ApplicationStatus;
  date: string;
  message: string;
}

export interface Application {
  id: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  location: string;
  type: OpportunityType;
  status: ApplicationStatus;
  appliedAt: string; // ISO date string
  lastUpdated: string; // ISO date string
  skillMatchPercentage: number;
  notes?: string;
  resumeFileName?: string;
  withdrawalReason?: string;
  timeline: ApplicationTimelineEvent[];
}

export interface OpportunityFilterCriteria {
  searchTerm: string;
  locations: string[];
  companies: string[];
  types: OpportunityType[];
  workplaceTypes: string[];
  minMatchScore?: number;
}
