export type PlacementStatus =
  | 'Applied'
  | 'Shortlisted'
  | 'Interview'
  | 'Offered'
  | 'Accepted'
  | 'Rejected';

export interface PlacementRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  company: string;
  role: string;
  status: PlacementStatus;
  packageLPA: number;
  cgpa: number;
  driveDate: string; // YYYY-MM-DD
  appliedAt: string;
}

export interface AdminMetrics {
  totalStudents: number;
  eligibleStudents: number;
  totalOpportunities: number;
  activeDrives: number;
  totalPlaced: number;
  placementRate: number; // 0 - 100
  averagePackageLPA: number;
  highestPackageLPA: number;
  totalOffers: number;
}

export interface DepartmentStat {
  department: string;
  totalStudents: number;
  placedStudents: number;
  placementRate: number; // 0 - 100
  averagePackageLPA: number;
  offersCount: number;
}

export interface SkillGapAuditMetric {
  skill: string;
  category: 'Technical' | 'Soft Skills' | 'Domain';
  avgProficiency: number; // 0 - 100
  requiredProficiency: number; // 0 - 100
  gap: number;
  studentsAssessed: number;
}

export interface PlacementTrendPoint {
  period: string; // e.g. "Aug 2025"
  placedStudents: number;
  offers: number;
  companiesVisiting: number;
}

export interface ReportFilterCriteria {
  department?: string; // 'all' or specific e.g. 'CSE'
  status?: string; // 'all' or specific status
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
  searchQuery?: string;
}

export type ExportFormat = 'csv' | 'excel';

export interface ExportColumn<T> {
  key: keyof T | string;
  label: string;
  format?: (value: any, item: T) => string;
}
