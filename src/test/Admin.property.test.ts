import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  PlacementRecord,
  PlacementStatus,
  ExportColumn,
} from '@/types/admin';
import {
  calculateMetrics,
  calculateDepartmentStats,
  filterPlacementRecords,
  exportToCsv,
  parseCsv,
  isPlaced,
} from '@/services/adminService';

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'Mechanical', 'Civil', 'Electrical'];
const STATUSES: PlacementStatus[] = [
  'Applied',
  'Shortlisted',
  'Interview',
  'Offered',
  'Accepted',
  'Rejected',
];

// Generator for PlacementRecord
const placementRecordArbitrary: fc.Arbitrary<PlacementRecord> = fc.record({
  id: fc.uuid(),
  studentId: fc.uuid(),
  studentName: fc.stringMatching(/^[A-Za-z ]{3,20}$/),
  rollNo: fc.stringMatching(/^202[0-5][A-Z]{2,3}[0-9]{4}$/),
  department: fc.constantFrom(...DEPARTMENTS),
  company: fc.stringMatching(/^[A-Za-z0-9 ]{3,15}$/),
  role: fc.stringMatching(/^[A-Za-z0-9 ]{3,20}$/),
  status: fc.constantFrom(...STATUSES),
  packageLPA: fc.float({ min: 0, max: 60, noNaN: true }).map((val) => Number(val.toFixed(2))),
  cgpa: fc.float({ min: 4.0, max: 10.0, noNaN: true }).map((val) => Number(val.toFixed(2))),
  driveDate: fc
    .integer({ min: 1735689600000, max: 1767225600000 })
    .map((ts) => new Date(ts).toISOString().split('T')[0]),
  appliedAt: fc.constant('2025-08-01'),
});

describe('Phase FE13 Property-Based Tests: Admin Analytics & Data Export', () => {
  /**
   * Property 14: Report Data Accuracy
   * For any generated analytics report, computed metrics (placement rate, average scores,
   * department stats) SHALL be consistent with underlying records.
   * Validates: Requirements 6.3, 6.4
   */
  describe('Property 14: Report Data Accuracy', () => {
    it('computed metrics (placement rate, counts, average package) match raw record arithmetic', () => {
      fc.assert(
        fc.property(fc.array(placementRecordArbitrary, { minLength: 0, maxLength: 50 }), (records) => {
          const metrics = calculateMetrics(records);

          // 1. Total counts consistency
          expect(metrics.totalStudents).toBe(records.length);
          const eligibleCount = records.filter((r) => r.cgpa >= 6.0).length;
          expect(metrics.eligibleStudents).toBe(eligibleCount);

          // 2. Placed counts
          const placedRecords = records.filter((r) => isPlaced(r.status));
          expect(metrics.totalPlaced).toBe(placedRecords.length);

          // 3. Placement rate in [0, 100] and matches formula
          if (records.length === 0) {
            expect(metrics.placementRate).toBe(0);
          } else {
            const expectedRate = Number(((placedRecords.length / records.length) * 100).toFixed(1));
            expect(metrics.placementRate).toBe(expectedRate);
            expect(metrics.placementRate).toBeGreaterThanOrEqual(0);
            expect(metrics.placementRate).toBeLessThanOrEqual(100);
          }

          // 4. Average package calculation
          const placedWithPkg = placedRecords.filter((r) => r.packageLPA > 0);
          if (placedWithPkg.length === 0) {
            expect(metrics.averagePackageLPA).toBe(0);
            expect(metrics.highestPackageLPA).toBe(0);
          } else {
            const sumPkg = placedWithPkg.reduce((acc, r) => acc + r.packageLPA, 0);
            const expectedAvg = Number((sumPkg / placedWithPkg.length).toFixed(2));
            expect(metrics.averagePackageLPA).toBe(expectedAvg);
            const expectedMax = Math.max(...placedWithPkg.map((r) => r.packageLPA));
            expect(metrics.highestPackageLPA).toBe(expectedMax);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('department breakdown metrics aggregate consistently with overall dataset', () => {
      fc.assert(
        fc.property(fc.array(placementRecordArbitrary, { minLength: 1, maxLength: 50 }), (records) => {
          const deptStats = calculateDepartmentStats(records);
          const overallMetrics = calculateMetrics(records);

          // Sum of total students across all departments equals total students
          const totalDeptStudents = deptStats.reduce((sum, d) => sum + d.totalStudents, 0);
          expect(totalDeptStudents).toBe(records.length);

          // Sum of placed students across departments equals total placed
          const totalDeptPlaced = deptStats.reduce((sum, d) => sum + d.placedStudents, 0);
          expect(totalDeptPlaced).toBe(overallMetrics.totalPlaced);

          // Each department rate is bounded [0, 100]
          deptStats.forEach((d) => {
            expect(d.placementRate).toBeGreaterThanOrEqual(0);
            expect(d.placementRate).toBeLessThanOrEqual(100);
            expect(d.placedStudents).toBeLessThanOrEqual(d.totalStudents);
          });
        }),
        { numRuns: 50 }
      );
    });

    it('filtering by department and date range retains only matching records', () => {
      fc.assert(
        fc.property(
          fc.array(placementRecordArbitrary, { minLength: 5, maxLength: 30 }),
          fc.constantFrom('all', ...DEPARTMENTS),
          fc.constantFrom('all', ...STATUSES),
          (records, filterDept, filterStatus) => {
            const filtered = filterPlacementRecords(records, {
              department: filterDept,
              status: filterStatus,
            });

            // Every filtered record must satisfy the department criterion
            if (filterDept !== 'all') {
              filtered.forEach((r) => {
                expect(r.department.toLowerCase()).toBe(filterDept.toLowerCase());
              });
            }

            // Every filtered record must satisfy status criterion
            if (filterStatus !== 'all') {
              filtered.forEach((r) => {
                expect(r.status.toLowerCase()).toBe(filterStatus.toLowerCase());
              });
            }

            // Filtered count must not exceed original count
            expect(filtered.length).toBeLessThanOrEqual(records.length);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property 15: Data Export Integrity
   * For any exported data in CSV or Excel format, parsing the exported file
   * SHALL yield the exact same data that was exported.
   * Validates: Requirements 6.5
   */
  describe('Property 15: Data Export Integrity', () => {
    it('round-trip CSV export and parse yields identical row count and field values', () => {
      const columns: ExportColumn<PlacementRecord>[] = [
        { key: 'studentName', label: 'Student Name' },
        { key: 'rollNo', label: 'Roll Number' },
        { key: 'department', label: 'Department' },
        { key: 'company', label: 'Company' },
        { key: 'role', label: 'Role' },
        { key: 'status', label: 'Status' },
        { key: 'packageLPA', label: 'Package LPA', format: (val: number) => String(val) },
        { key: 'driveDate', label: 'Date' },
      ];

      fc.assert(
        fc.property(fc.array(placementRecordArbitrary, { minLength: 1, maxLength: 25 }), (records) => {
          const csvString = exportToCsv(records, columns);
          const parsed = parseCsv(csvString);

          // 1. Parsed row count must equal original records count
          expect(parsed.length).toBe(records.length);

          // 2. Each record's fields must match
          records.forEach((record, index) => {
            const parsedRow = parsed[index];
            expect(parsedRow['Student Name']).toBe(record.studentName);
            expect(parsedRow['Roll Number']).toBe(record.rollNo);
            expect(parsedRow['Department']).toBe(record.department);
            expect(parsedRow['Company']).toBe(record.company);
            expect(parsedRow['Role']).toBe(record.role);
            expect(parsedRow['Status']).toBe(record.status);
            expect(parsedRow['Package LPA']).toBe(String(record.packageLPA));
            expect(parsedRow['Date']).toBe(record.driveDate);
          });
        }),
        { numRuns: 50 }
      );
    });

    it('RFC 4180 CSV escaping correctly preserves strings containing commas, quotes, and whitespace', () => {
      // Arbitrary test objects with arbitrary text including commas and quotes
      const complexRecordArb = fc.record({
        name: fc.stringMatching(/^[A-Za-z0-9 ,"-]{1,30}$/),
        notes: fc.stringMatching(/^[A-Za-z0-9 ,"-]{1,40}$/),
        code: fc.stringMatching(/^[A-Z0-9]{3,8}$/),
      });

      const cols: ExportColumn<any>[] = [
        { key: 'name', label: 'Full Name' },
        { key: 'notes', label: 'Notes' },
        { key: 'code', label: 'Code' },
      ];

      fc.assert(
        fc.property(fc.array(complexRecordArb, { minLength: 1, maxLength: 20 }), (items) => {
          const csv = exportToCsv(items, cols);
          const parsed = parseCsv(csv);

          expect(parsed.length).toBe(items.length);
          items.forEach((item, idx) => {
            expect(parsed[idx]['Full Name']).toBe(item.name);
            expect(parsed[idx]['Notes']).toBe(item.notes);
            expect(parsed[idx]['Code']).toBe(item.code);
          });
        }),
        { numRuns: 40 }
      );
    });
  });
});
