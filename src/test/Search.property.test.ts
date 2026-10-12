import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import {
  searchService,
  paginate,
  matchesSearchKeywords,
} from '@/services/searchService';
import { opportunityService } from '@/services/opportunityService';
import { JobOpportunity, OpportunityType } from '@/types/opportunity';

describe('Search & Filtering - Property-Based Tests (Properties 16-17)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const opportunityArbitrary: fc.Arbitrary<JobOpportunity> = fc.record({
    id: fc.uuid(),
    recruiterId: fc.constant('rec-test'),
    title: fc.constantFrom(
      'Senior React Developer',
      'Backend Distributed Engineer',
      'DevOps Cloud Architect',
      'Data Engineer',
      'Frontend Specialist',
      'Mobile Application Developer',
      'Machine Learning Specialist'
    ),
    company: fc.constantFrom('Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Uber'),
    location: fc.constantFrom('Bengaluru, India', 'Hyderabad, India', 'Remote', 'Pune, India'),
    type: fc.constantFrom<OpportunityType>('Full-time', 'Internship', 'Contract', 'Part-time'),
    workplaceType: fc.constantFrom('Hybrid', 'Remote', 'On-site'),
    description: fc.constantFrom(
      'Building scalable React user interfaces and enterprise web components.',
      'Developing low-latency Java backend microservices on AWS Cloud.',
      'Managing Kubernetes infrastructure and CI/CD automated deployments.',
      'Architecting data pipelines using Python, SQL, and Apache Spark.'
    ),
    requiredSkills: fc.subarray(
      [
        'React & UI Frameworks',
        'TypeScript & JavaScript',
        'Data Structures & Algorithms',
        'Node.js & Backend APIs',
        'SQL & Database Architecture',
        'Python & Machine Learning',
      ],
      { minLength: 1, maxLength: 4 }
    ),
    salaryRange: fc.constant('$80k - $100k'),
    deadline: fc.constant('2026-12-31T23:59:59Z'),
    postedAt: fc.constant('2026-10-01T09:00:00Z'),
    applicants: fc.constant([]),
    status: fc.constant('open'),
    matchScore: fc.integer({ min: 50, max: 100 }),
  });

  /**
   * Property 16: Search Keyword Matching
   * For any search query, the system SHALL return only opportunities whose
   * title, description, or skills contain or match the search keywords.
   * Validates: Requirements 7.1
   */
  it('Property 16: Search Keyword Matching - returned opportunities strictly contain the search keywords', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(opportunityArbitrary, { minLength: 5, maxLength: 20 }),
        fc.constantFrom(
          'React',
          'Python',
          'Cloud',
          'Data',
          'Backend',
          'Distributed',
          'SQL',
          'Java',
          'TypeScript',
          'NonExistentGibberishKeyword999'
        ),
        async (opportunities, searchTerm) => {
          // Store opportunities
          opportunityService.saveOpportunities(opportunities);

          // Perform keyword search
          const result = await searchService.searchOpportunities({
            searchTerm,
            pageSize: 100, // retrieve all matching items
          });

          // Invariant 1: EVERY returned opportunity MUST match the search term
          for (const opp of result.items) {
            const matches = matchesSearchKeywords(opp, searchTerm);
            expect(matches).toBe(true);

            const q = searchTerm.toLowerCase().trim();
            const inTitle = opp.title.toLowerCase().includes(q);
            const inDesc = opp.description.toLowerCase().includes(q);
            const inSkills = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
            const inCompany = opp.company.toLowerCase().includes(q);

            expect(inTitle || inDesc || inSkills || inCompany).toBe(true);
          }

          // Invariant 2: Any opportunity in the dataset that DOES NOT match MUST NOT appear
          const matchingIds = new Set(result.items.map((o) => o.id));
          for (const opp of opportunities) {
            if (!matchesSearchKeywords(opp, searchTerm)) {
              expect(matchingIds.has(opp.id)).toBe(false);
            }
          }
        }
      ),
      { numRuns: 25 }
    );
  });

  /**
   * Property 17: Pagination Correctness
   * For any result set with pagination, requesting page N SHALL return exactly
   * N*pageSize to (N+1)*pageSize records, with no overlaps or gaps.
   * Validates: Requirements 7.3
   */
  it('Property 17: Pagination Correctness - requesting page N returns exact slice boundaries with zero overlaps or gaps', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { minLength: 0, maxLength: 100 }),
        fc.integer({ min: 1, max: 25 }),
        (items, pageSize) => {
          const totalItems = items.length;
          const expectedTotalPages = Math.max(1, Math.ceil(totalItems / pageSize));

          const allCollectedItems: number[] = [];
          const seenItemsAcrossPages: number[][] = [];

          for (let page = 1; page <= expectedTotalPages; page++) {
            const result = paginate(items, page, pageSize);

            expect(result.currentPage).toBe(page);
            expect(result.pageSize).toBe(pageSize);
            expect(result.totalItems).toBe(totalItems);
            expect(result.totalPages).toBe(expectedTotalPages);

            // Slice boundary invariant: (page - 1) * pageSize to min(page * pageSize, totalItems)
            const expectedStart = (page - 1) * pageSize;
            const expectedEnd = Math.min(expectedStart + pageSize, totalItems);
            const expectedSlice = items.slice(expectedStart, expectedEnd);

            expect(result.items).toEqual(expectedSlice);

            // Record tracking for gap/overlap verification
            seenItemsAcrossPages.push(result.items);
            allCollectedItems.push(...result.items);
          }

          // Invariant: The concatenated sequence of all pages must equal the exact original items
          expect(allCollectedItems).toEqual(items);

          // Invariant: Zero overlaps across consecutive pages
          for (let i = 0; i < seenItemsAcrossPages.length - 1; i++) {
            const pageA = seenItemsAcrossPages[i];
            const pageB = seenItemsAcrossPages[i + 1];
            // Since elements in items are distinct slices of the original array:
            // the length sum must equal pageA.length + pageB.length
            expect(pageA.length + pageB.length).toBeLessThanOrEqual(pageSize * 2);
          }
        }
      ),
      { numRuns: 30 }
    );
  });
});
