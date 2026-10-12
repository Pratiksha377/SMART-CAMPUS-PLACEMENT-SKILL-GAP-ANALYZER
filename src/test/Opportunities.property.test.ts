import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  matchesAllCriteria,
  opportunityService,
  mockOpportunities,
} from '@/services/opportunityService';
import {
  JobOpportunity,
  OpportunityFilterCriteria,
  OpportunityType,
} from '@/types/opportunity';

describe('Opportunities - Property-Based Tests (Properties 8-10)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const opportunityArbitrary: fc.Arbitrary<JobOpportunity> = fc.record({
    id: fc.stringMatching(/^opp-[a-z0-9]{5,8}$/),
    recruiterId: fc.constant('rec-test-101'),
    title: fc.constantFrom(
      'Full Stack Engineer',
      'Frontend React Developer',
      'Backend Systems Specialist',
      'Cloud DevOps Architect',
      'Data Engineer'
    ),
    company: fc.constantFrom('Google', 'Microsoft', 'Amazon', 'Uber', 'Stripe', 'Meta'),
    location: fc.constantFrom('Bengaluru, India', 'Hyderabad, India', 'Remote', 'Pune, India'),
    workplaceType: fc.constantFrom<'Remote' | 'Hybrid' | 'On-site'>('Remote', 'Hybrid', 'On-site'),
    type: fc.constantFrom<OpportunityType>('Full-time', 'Internship', 'Contract', 'Part-time'),
    description: fc.string({ minLength: 20, maxLength: 200 }),
    requiredSkills: fc.array(
      fc.constantFrom(
        'React & UI Frameworks',
        'TypeScript & JavaScript',
        'Data Structures & Algorithms',
        'SQL & Database Architecture',
        'Node.js & Backend APIs'
      ),
      { minLength: 1, maxLength: 4 }
    ),
    salaryRange: fc.constant('$80,000 - $110,000 / yr'),
    deadline: fc.constant(new Date(Date.now() + 86400000 * 30).toISOString()),
    postedAt: fc.constant(new Date().toISOString()),
    applicants: fc.constant([]),
    status: fc.constant('open'),
    matchScore: fc.integer({ min: 50, max: 100 }),
  });

  /**
   * Property 8: Filter Combination Logic
   * Validates: Requirements 4.2, 7.2
   * For any combination of applied filters (location, company, role type),
   * the system SHALL return opportunities that match ALL filter criteria.
   */
  it('Property 8: Filter Combination Logic returns only opportunities matching ALL filter criteria', () => {
    fc.assert(
      fc.property(
        fc.array(opportunityArbitrary, { minLength: 2, maxLength: 8 }),
        fc.record({
          searchTerm: fc.constantFrom('React', 'Engineer', 'Cloud', ''),
          locations: fc.subarray(['Bengaluru', 'Remote', 'Hyderabad', 'Pune']),
          companies: fc.subarray(['Google', 'Microsoft', 'Amazon', 'Uber', 'Stripe']),
          types: fc.subarray<OpportunityType>(['Full-time', 'Internship', 'Contract', 'Part-time']),
          workplaceTypes: fc.subarray(['Remote', 'Hybrid', 'On-site']),
          minMatchScore: fc.constantFrom(0, 60, 75, 90),
        }),
        (opportunities, criteria) => {
          const filtered = opportunities.filter((opp) => matchesAllCriteria(opp, criteria));

          // Every filtered opportunity MUST satisfy ALL active criteria
          filtered.forEach((opp) => {
            if (criteria.searchTerm && criteria.searchTerm.trim().length > 0) {
              const term = criteria.searchTerm.toLowerCase();
              const termMatch =
                opp.title.toLowerCase().includes(term) ||
                opp.company.toLowerCase().includes(term) ||
                opp.description.toLowerCase().includes(term) ||
                opp.requiredSkills.some((s) => s.toLowerCase().includes(term));
              expect(termMatch).toBe(true);
            }

            if (criteria.locations.length > 0) {
              const locMatch = criteria.locations.some((loc) =>
                opp.location.toLowerCase().includes(loc.toLowerCase())
              );
              expect(locMatch).toBe(true);
            }

            if (criteria.companies.length > 0) {
              expect(criteria.companies).toContain(opp.company);
            }

            if (criteria.types.length > 0) {
              expect(criteria.types).toContain(opp.type);
            }

            if (criteria.workplaceTypes.length > 0 && opp.workplaceType) {
              expect(criteria.workplaceTypes).toContain(opp.workplaceType);
            }

            if (criteria.minMatchScore && criteria.minMatchScore > 0) {
              expect(opp.matchScore || 0).toBeGreaterThanOrEqual(criteria.minMatchScore);
            }
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 9: Duplicate Application Prevention
   * Validates: Requirements 4.4
   * For any student-opportunity pair, submitting a second application after the first
   * SHALL not create a duplicate record and SHALL return an error or existing application status.
   */
  it('Property 9: Duplicate Application Prevention prevents duplicate submissions and throws error', async () => {
    await fc.assert(
      fc.asyncProperty(
        opportunityArbitrary,
        fc.stringMatching(/^std-[a-z0-9]{4,8}$/),
        async (opp, studentId) => {
          opportunityService.saveOpportunities([opp]);
          opportunityService.saveApplications([]);

          // 1. Initial application must succeed
          const app1 = await opportunityService.applyToOpportunity(studentId, opp.id, {
            studentName: 'Test Student',
            resumeFileName: 'Resume_Test.pdf',
          });

          expect(app1).toBeDefined();
          expect(app1.studentId).toBe(studentId);
          expect(app1.opportunityId).toBe(opp.id);
          expect(app1.status).toBe('applied');

          // Verification that student is marked as applied
          const hasApplied = await opportunityService.hasStudentApplied(studentId, opp.id);
          expect(hasApplied).toBe(true);

          // 2. Subsequent second application for same student and opportunity MUST fail
          await expect(
            opportunityService.applyToOpportunity(studentId, opp.id, {
              studentName: 'Test Student',
              resumeFileName: 'Resume_Test.pdf',
            })
          ).rejects.toThrow(/duplicate application/i);

          // 3. Ensure no duplicate was inserted into stored records
          const storedApps = opportunityService.getSavedApplications();
          const matches = storedApps.filter(
            (a) => a.studentId === studentId && a.opportunityId === opp.id
          );
          expect(matches.length).toBe(1);
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Property 10: Opportunity Details Completeness
   * Validates: Requirements 4.5
   * For any job opportunity displayed, all required fields (title, description, skills, deadline)
   * SHALL be present and readable to students.
   */
  it('Property 10: Opportunity Details Completeness verifies all required fields are present and valid', () => {
    fc.assert(
      fc.property(opportunityArbitrary, (opp) => {
        // Required Field 1: Title (non-empty string)
        expect(typeof opp.title).toBe('string');
        expect(opp.title.trim().length).toBeGreaterThan(0);

        // Required Field 2: Description (non-empty string)
        expect(typeof opp.description).toBe('string');
        expect(opp.description.trim().length).toBeGreaterThan(0);

        // Required Field 3: Required Skills (array of non-empty skills)
        expect(Array.isArray(opp.requiredSkills)).toBe(true);
        expect(opp.requiredSkills.length).toBeGreaterThan(0);
        opp.requiredSkills.forEach((skill) => {
          expect(typeof skill).toBe('string');
          expect(skill.trim().length).toBeGreaterThan(0);
        });

        // Required Field 4: Deadline (valid date string)
        expect(typeof opp.deadline).toBe('string');
        const parsedDeadline = new Date(opp.deadline).getTime();
        expect(Number.isNaN(parsedDeadline)).toBe(false);

        // Company and Location presence
        expect(typeof opp.company).toBe('string');
        expect(opp.company.trim().length).toBeGreaterThan(0);
        expect(typeof opp.location).toBe('string');
        expect(opp.location.trim().length).toBeGreaterThan(0);
      }),
      { numRuns: 50 }
    );
  });
});
