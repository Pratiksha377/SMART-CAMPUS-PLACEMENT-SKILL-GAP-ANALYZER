import {
  PlacementRecord,
  AdminMetrics,
  DepartmentStat,
  SkillGapAuditMetric,
  PlacementTrendPoint,
  ReportFilterCriteria,
  ExportColumn,
  PlacementStatus,
} from '@/types/admin';

export const isPlaced = (status: PlacementStatus): boolean => {
  return status === 'Offered' || status === 'Accepted';
};

/**
 * Calculates high-level admin metrics from placement records.
 */
export const calculateMetrics = (
  records: PlacementRecord[],
  totalOpportunities = 48,
  activeDrives = 14
): AdminMetrics => {
  const totalStudents = records.length;
  const eligibleStudents = records.filter((r) => r.cgpa >= 6.0).length;
  const placedRecords = records.filter((r) => isPlaced(r.status));
  const totalPlaced = placedRecords.length;

  const placementRate =
    totalStudents > 0
      ? Number(((totalPlaced / totalStudents) * 100).toFixed(1))
      : 0;

  const placedWithPackage = placedRecords.filter((r) => r.packageLPA > 0);
  const averagePackageLPA =
    placedWithPackage.length > 0
      ? Number(
          (
            placedWithPackage.reduce((acc, r) => acc + r.packageLPA, 0) /
            placedWithPackage.length
          ).toFixed(2)
        )
      : 0;

  const highestPackageLPA =
    placedWithPackage.length > 0
      ? Math.max(...placedWithPackage.map((r) => r.packageLPA))
      : 0;

  return {
    totalStudents,
    eligibleStudents,
    totalOpportunities,
    activeDrives,
    totalPlaced,
    placementRate,
    averagePackageLPA,
    highestPackageLPA,
    totalOffers: totalPlaced,
  };
};

/**
 * Aggregates statistics grouped by department.
 */
export const calculateDepartmentStats = (
  records: PlacementRecord[]
): DepartmentStat[] => {
  const departmentMap = new Map<string, PlacementRecord[]>();

  records.forEach((record) => {
    const dept = record.department;
    if (!departmentMap.has(dept)) {
      departmentMap.set(dept, []);
    }
    departmentMap.get(dept)!.push(record);
  });

  const stats: DepartmentStat[] = [];

  departmentMap.forEach((deptRecords, dept) => {
    const totalStudents = deptRecords.length;
    const placedRecords = deptRecords.filter((r) => isPlaced(r.status));
    const placedStudents = placedRecords.length;
    const placementRate =
      totalStudents > 0
        ? Number(((placedStudents / totalStudents) * 100).toFixed(1))
        : 0;

    const placedWithPkg = placedRecords.filter((r) => r.packageLPA > 0);
    const averagePackageLPA =
      placedWithPkg.length > 0
        ? Number(
            (
              placedWithPkg.reduce((acc, r) => acc + r.packageLPA, 0) /
              placedWithPkg.length
            ).toFixed(2)
          )
        : 0;

    stats.push({
      department: dept,
      totalStudents,
      placedStudents,
      placementRate,
      averagePackageLPA,
      offersCount: placedStudents,
    });
  });

  // Sort descending by total students
  return stats.sort((a, b) => b.totalStudents - a.totalStudents);
};

/**
 * Institutional skill gap audit data.
 */
export const calculateSkillDistribution = (
  _records?: PlacementRecord[]
): SkillGapAuditMetric[] => {
  return [
    {
      skill: 'Data Structures & Algorithms',
      category: 'Technical',
      avgProficiency: 74,
      requiredProficiency: 85,
      gap: 11,
      studentsAssessed: 310,
    },
    {
      skill: 'Cloud & System Design',
      category: 'Technical',
      avgProficiency: 58,
      requiredProficiency: 80,
      gap: 22,
      studentsAssessed: 280,
    },
    {
      skill: 'React / Frontend Architecture',
      category: 'Technical',
      avgProficiency: 82,
      requiredProficiency: 75,
      gap: -7,
      studentsAssessed: 295,
    },
    {
      skill: 'Database Design & SQL',
      category: 'Technical',
      avgProficiency: 76,
      requiredProficiency: 80,
      gap: 4,
      studentsAssessed: 320,
    },
    {
      skill: 'Machine Learning & Data Science',
      category: 'Domain',
      avgProficiency: 62,
      requiredProficiency: 78,
      gap: 16,
      studentsAssessed: 210,
    },
    {
      skill: 'Communication & Problem Presentation',
      category: 'Soft Skills',
      avgProficiency: 80,
      requiredProficiency: 85,
      gap: 5,
      studentsAssessed: 340,
    },
  ];
};

/**
 * Monthly placement trends for academic calendar.
 */
export const calculatePlacementTrends = (
  _records?: PlacementRecord[]
): PlacementTrendPoint[] => {
  return [
    { period: 'Aug 2025', placedStudents: 42, offers: 48, companiesVisiting: 8 },
    { period: 'Sep 2025', placedStudents: 85, offers: 96, companiesVisiting: 16 },
    { period: 'Oct 2025', placedStudents: 140, offers: 162, companiesVisiting: 22 },
    { period: 'Nov 2025', placedStudents: 195, offers: 224, companiesVisiting: 28 },
    { period: 'Dec 2025', placedStudents: 220, offers: 258, companiesVisiting: 14 },
    { period: 'Jan 2026', placedStudents: 265, offers: 310, companiesVisiting: 20 },
    { period: 'Feb 2026', placedStudents: 310, offers: 368, companiesVisiting: 24 },
  ];
};

/**
 * Filters placement records by department, status, date range, and query.
 */
export const filterPlacementRecords = (
  records: PlacementRecord[],
  criteria: ReportFilterCriteria
): PlacementRecord[] => {
  return records.filter((r) => {
    // Department filter
    if (
      criteria.department &&
      criteria.department !== 'all' &&
      r.department.toLowerCase() !== criteria.department.toLowerCase()
    ) {
      return false;
    }

    // Status filter
    if (
      criteria.status &&
      criteria.status !== 'all' &&
      r.status.toLowerCase() !== criteria.status.toLowerCase()
    ) {
      return false;
    }

    // Date range filter
    if (criteria.dateRange?.startDate) {
      if (r.driveDate < criteria.dateRange.startDate) {
        return false;
      }
    }
    if (criteria.dateRange?.endDate) {
      if (r.driveDate > criteria.dateRange.endDate) {
        return false;
      }
    }

    // Search query
    if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
      const q = criteria.searchQuery.toLowerCase().trim();
      const match =
        r.studentName.toLowerCase().includes(q) ||
        r.rollNo.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
};

/**
 * RFC 4180 Compliant CSV cell escaper.
 */
export const escapeCsvCell = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  // If string contains comma, quote, or newline, escape quotes and wrap in quotes
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Exports data to RFC 4180 CSV string.
 */
export const exportToCsv = <T>(
  data: T[],
  columns: ExportColumn<T>[]
): string => {
  const header = columns.map((col) => escapeCsvCell(col.label)).join(',');
  const rows = data.map((item) =>
    columns
      .map((col) => {
        const rawValue = (item as any)[col.key];
        const formatted = col.format ? col.format(rawValue, item) : rawValue;
        return escapeCsvCell(formatted);
      })
      .join(',')
  );

  return [header, ...rows].join('\r\n');
};

/**
 * Parses RFC 4180 CSV string back into array of objects.
 * Accurately parses quoted fields containing commas, double quotes, and newlines.
 */
export const parseCsv = (csvContent: string): Record<string, string>[] => {
  if (!csvContent || !csvContent.trim()) {
    return [];
  }

  // Tokenize CSV into rows and fields
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < csvContent.length) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i += 2;
        continue;
      } else if (char === '"') {
        // End of quoted field
        inQuotes = false;
        i++;
        continue;
      } else {
        currentField += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
        i++;
        continue;
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentField);
        currentField = '';
        rows.push(currentRow);
        currentRow = [];
        i += 2;
        continue;
      } else if (char === '\n' || char === '\r') {
        currentRow.push(currentField);
        currentField = '';
        rows.push(currentRow);
        currentRow = [];
        i++;
        continue;
      } else {
        currentField += char;
        i++;
        continue;
      }
    }
  }

  // Push last field and row if any
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  if (rows.length === 0) return [];

  const headers = rows[0];
  const dataRows = rows.slice(1);

  return dataRows
    .filter((row) => row.length > 1 || (row.length === 1 && row[0] !== ''))
    .map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] !== undefined ? row[index] : '';
      });
      return obj;
    });
};

/**
 * Triggers file download in the browser.
 */
export const downloadFile = (
  content: string,
  filename: string,
  mimeType: string
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

/**
 * Comprehensive mock placement records for tests and UI demo.
 */
export const getMockPlacementRecords = (): PlacementRecord[] => {
  return [
    {
      id: 'pr-1',
      studentId: 'stu-101',
      studentName: 'Aarav Sharma',
      rollNo: '2022CS0142',
      department: 'CSE',
      company: 'Google',
      role: 'Software Engineer',
      status: 'Accepted',
      packageLPA: 32.5,
      cgpa: 9.2,
      driveDate: '2025-09-15',
      appliedAt: '2025-08-20',
    },
    {
      id: 'pr-2',
      studentId: 'stu-102',
      studentName: 'Priya Patel',
      rollNo: '2022CS0188',
      department: 'CSE',
      company: 'Microsoft',
      role: 'Cloud Solutions Architect',
      status: 'Offered',
      packageLPA: 28.0,
      cgpa: 8.9,
      driveDate: '2025-09-22',
      appliedAt: '2025-08-24',
    },
    {
      id: 'pr-3',
      studentId: 'stu-103',
      studentName: 'Rohan Verma',
      rollNo: '2022IT0045',
      department: 'IT',
      company: 'Amazon AWS',
      role: 'SDE-1',
      status: 'Offered',
      packageLPA: 26.5,
      cgpa: 8.7,
      driveDate: '2025-10-04',
      appliedAt: '2025-09-02',
    },
    {
      id: 'pr-4',
      studentId: 'stu-104',
      studentName: 'Ananya Iyer',
      rollNo: '2022ECE0091',
      department: 'ECE',
      company: 'Texas Instruments',
      role: 'Embedded Systems Engineer',
      status: 'Accepted',
      packageLPA: 21.0,
      cgpa: 8.5,
      driveDate: '2025-10-12',
      appliedAt: '2025-09-10',
    },
    {
      id: 'pr-5',
      studentId: 'stu-105',
      studentName: 'Devansh Kulkarni',
      rollNo: '2022ME0032',
      department: 'Mechanical',
      company: 'Larsen & Toubro',
      role: 'Graduate Trainee Engineer',
      status: 'Accepted',
      packageLPA: 9.5,
      cgpa: 7.8,
      driveDate: '2025-11-05',
      appliedAt: '2025-10-01',
    },
    {
      id: 'pr-6',
      studentId: 'stu-106',
      studentName: 'Sneha Reddy',
      rollNo: '2022IT0112',
      department: 'IT',
      company: 'Salesforce',
      role: 'Full Stack Developer',
      status: 'Interview',
      packageLPA: 0,
      cgpa: 8.2,
      driveDate: '2025-11-18',
      appliedAt: '2025-10-15',
    },
    {
      id: 'pr-7',
      studentId: 'stu-107',
      studentName: 'Vikram Sengupta',
      rollNo: '2022EE0054',
      department: 'Electrical',
      company: 'Schneider Electric',
      role: 'Power Systems Specialist',
      status: 'Offered',
      packageLPA: 12.0,
      cgpa: 7.9,
      driveDate: '2025-12-02',
      appliedAt: '2025-11-01',
    },
    {
      id: 'pr-8',
      studentId: 'stu-108',
      studentName: 'Kavya Nair',
      rollNo: '2022CE0019',
      department: 'Civil',
      company: 'Tata Projects',
      role: 'Structural Design Associate',
      status: 'Shortlisted',
      packageLPA: 0,
      cgpa: 7.4,
      driveDate: '2025-12-14',
      appliedAt: '2025-11-10',
    },
    {
      id: 'pr-9',
      studentId: 'stu-109',
      studentName: 'Kabir Das',
      rollNo: '2022CS0210',
      department: 'CSE',
      company: 'Atlassian',
      role: 'Backend Engineer',
      status: 'Accepted',
      packageLPA: 35.0,
      cgpa: 9.4,
      driveDate: '2026-01-10',
      appliedAt: '2025-12-05',
    },
    {
      id: 'pr-10',
      studentId: 'stu-110',
      studentName: 'Tanvi Joshi',
      rollNo: '2022ECE0134',
      department: 'ECE',
      company: 'Qualcomm',
      role: 'Hardware Verification Engineer',
      status: 'Offered',
      packageLPA: 24.0,
      cgpa: 8.6,
      driveDate: '2026-01-20',
      appliedAt: '2025-12-18',
    },
    {
      id: 'pr-11',
      studentId: 'stu-111',
      studentName: 'Arjun Mehta',
      rollNo: '2022ME0078',
      department: 'Mechanical',
      company: 'Tata Motors',
      role: 'Automotive Design Analyst',
      status: 'Rejected',
      packageLPA: 0,
      cgpa: 6.9,
      driveDate: '2026-02-01',
      appliedAt: '2026-01-05',
    },
    {
      id: 'pr-12',
      studentId: 'stu-112',
      studentName: 'Meera Rao',
      rollNo: '2022CS0089',
      department: 'CSE',
      company: 'Uber',
      role: 'Frontend Engineer',
      status: 'Offered',
      packageLPA: 30.0,
      cgpa: 9.0,
      driveDate: '2026-02-10',
      appliedAt: '2026-01-12',
    },
  ];
};
