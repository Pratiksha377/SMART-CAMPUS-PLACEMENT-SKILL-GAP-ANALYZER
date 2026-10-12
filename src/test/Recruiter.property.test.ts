import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { recruiterService, normalizeProficiency } from '@/services/recruiterService';
import { opportunityService, mockOpportunities } from '@/services/opportunityService';
import {
  OpportunityType,
  OpportunityStatus,
  RequiredSkill,
} from '@/types/opportunity';
import {
  JobPostingFormData,
  RequiredSkillInput,
  SkillProficiencyLevel,
} from '@/types/recruiter';
import { SkillProficiency } from '@/types/profile';

describe('Recruiter Portal - Property-Based Tests (Properties 11-13)', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset initial dataset
    opportunityService.saveOpportunities([...mockOpportunities]);
  });

  const opportunityTypeArbitrary = fc.constantFrom<OpportunityType>(
    'Full-time',
    'Internship',
    'Part-time',
    'Contract'
  );

  const proficiencyLevelArbitrary = fc.constantFrom<SkillProficiencyLevel>(
    'beginner',
    'intermediate',
    'advanced',
    'expert'
  );

  const skillNameArbitrary = fc.constantFrom(
    'React & UI Frameworks',
    'TypeScript & JavaScript',
    'Data Structures & Algorithms',
    'Node.js & Backend APIs',
    'SQL & Database Architecture',
    'DevOps, Git & CI/CD',
    'Python & Machine Learning'
  );

  const requiredSkillArbitrary: fc.Arbitrary<RequiredSkillInput> = fc.record({
    skill: skillNameArbitrary,
    level: proficiencyLevelArbitrary,
  });

  const jobPostingFormDataArbitrary: fc.Arbitrary<JobPostingFormData> = fc.record({
    title: fc.string({ minLength: 3, maxLength: 30 }).filter((s) => s.trim().length >= 3),
    company: fc.string({ minLength: 2, maxLength: 25 }).filter((s) => s.trim().length >= 2),
    location: fc.constantFrom('Bengaluru, India', 'Hyderabad, India', 'Remote', 'Pune, India'),
    workplaceType: fc.constantFrom('Hybrid', 'Remote', 'On-site'),
    type: opportunityTypeArbitrary,
    salaryRange: fc.constantFrom('$80k - $100k', '$60k - $80k', 'Competitive'),
    deadline: fc.constant('2026-12-31T23:59:59Z'),
    description: fc.string({ minLength: 10, maxLength: 100 }).filter((s) => s.trim().length >= 10),
    requirements: fc.constant('Degree in CS\nAnalytical thinking'),
    responsibilities: fc.constant('Build features\nCollaborate with team'),
    skills: fc.array(requiredSkillArbitrary, { minLength: 1, maxLength: 4 }),
    status: fc.constantFrom<OpportunityStatus>('open', 'closed', 'filled'),
  });

  /**
   * Property 11: Job Posting Round-trip
   * For any job posting submitted by a recruiter, querying the opportunities list
   * with appropriate filters SHALL return that posting within one second.
   * Validates: Requirements 5.2
   */
  it('Property 11: Job Posting Round-trip - any submitted job posting is immediately queryable and consistent', async () => {
    await fc.assert(
      fc.asyncProperty(jobPostingFormDataArbitrary, async (formData) => {
        // 1. Recruiter creates posting
        const created = await recruiterService.createPosting(formData, 'rec-test-roundtrip');

        expect(created).toBeDefined();
        expect(created.id).toBeDefined();
        expect(created.title).toBe(formData.title.trim());
        expect(created.company).toBe(formData.company.trim());
        expect(created.location).toBe(formData.location);
        expect(created.type).toBe(formData.type);

        // 2. Querying opportunities immediately returns the created posting
        const directLookup = await opportunityService.getOpportunityById(created.id);
        expect(directLookup).not.toBeNull();
        expect(directLookup?.id).toBe(created.id);
        expect(directLookup?.title).toBe(formData.title.trim());

        // 3. Querying with filters (e.g. by role type and company) returns the posting
        const filteredResults = await opportunityService.getOpportunities({
          types: [formData.type],
          companies: [formData.company.trim()],
        });

        const foundInFiltered = filteredResults.some((opp) => opp.id === created.id);
        expect(foundInFiltered).toBe(true);
      }),
      { numRuns: 20 }
    );
  });

  /**
   * Property 12: Posting Update Propagation
   * For any updates to a job posting, those updates SHALL be visible to all users
   * within the subsequent page load or refresh.
   * Validates: Requirements 5.4
   */
  it('Property 12: Posting Update Propagation - updates to any posting propagate immediately to persistent storage', async () => {
    await fc.assert(
      fc.asyncProperty(
        jobPostingFormDataArbitrary,
        fc.record({
          newTitle: fc.string({ minLength: 3, maxLength: 30 }).filter((s) => s.trim().length >= 3),
          newDescription: fc.string({ minLength: 10, maxLength: 80 }).filter((s) => s.trim().length >= 10),
          newStatus: fc.constantFrom<OpportunityStatus>('open', 'closed', 'filled'),
        }),
        async (initialData, updates) => {
          // 1. Create baseline posting
          const created = await recruiterService.createPosting(initialData, 'rec-prop12');

          // 2. Apply updates
          const updatedPosting = await recruiterService.updatePosting(created.id, {
            title: updates.newTitle.trim(),
            description: updates.newDescription.trim(),
            status: updates.newStatus,
          });

          expect(updatedPosting.id).toBe(created.id);
          expect(updatedPosting.title).toBe(updates.newTitle.trim());
          expect(updatedPosting.description).toBe(updates.newDescription.trim());
          expect(updatedPosting.status).toBe(updates.newStatus);

          // 3. Immediately re-query from storage (subsequent page refresh)
          const refreshed = await opportunityService.getOpportunityById(created.id);
          expect(refreshed).not.toBeNull();
          expect(refreshed?.title).toBe(updates.newTitle.trim());
          expect(refreshed?.description).toBe(updates.newDescription.trim());
          expect(refreshed?.status).toBe(updates.newStatus);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property 13: Applicant Filtering Accuracy
   * For any recruiter viewing applicants for a posting, all returned student profiles
   * SHALL match the skill requirements of that posting at the specified proficiency levels.
   * Validates: Requirements 5.5
   */
  it('Property 13: Applicant Filtering Accuracy - when requireAllSkills is enabled, all returned profiles match every skill at or above required proficiency', async () => {
    await fc.assert(
      fc.asyncProperty(
        jobPostingFormDataArbitrary,
        fc.integer({ min: 0, max: 90 }),
        async (formData, minScore) => {
          // 1. Create a posting with target skill requirements
          const posting = await recruiterService.createPosting(formData, 'rec-prop13');

          // 2. Query applicants with requireAllSkills = true and minMatchScore filter
          const applicants = await recruiterService.getApplicantsForPosting(posting.id, {
            requireAllSkills: true,
            minMatchScore: minScore,
          });

          // 3. Invariant: EVERY applicant returned MUST meet all required skills at or above proficiency
          const requiredSkills = posting.detailedSkills || [];

          for (const applicant of applicants) {
            // Match score must be >= threshold
            expect(applicant.skillMatchPercentage).toBeGreaterThanOrEqual(minScore);

            // Each required skill must be present in student's verified skills
            for (const req of requiredSkills) {
              const reqWeight = normalizeProficiency(req.level);
              const studentSkill = applicant.studentSkills.find((candSkill) => {
                const candName = candSkill.name.toLowerCase().trim();
                const reqName = req.skill.toLowerCase().trim();
                return candName === reqName || candName.includes(reqName) || reqName.includes(candName);
              });

              expect(studentSkill).toBeDefined();
              if (studentSkill) {
                const studentWeight = normalizeProficiency(studentSkill.proficiency);
                expect(studentWeight).toBeGreaterThanOrEqual(reqWeight);
              }
            }
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});
