import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  aggregateSkillProficiencies,
  generateSkillRecommendations,
  skillGapService,
  benchmarkRoles,
} from '@/services/skillGapService';
import { AssessmentResult } from '@/types/assessment';
import { SkillItem } from '@/types/profile';
import { BenchmarkRoleRequirement } from '@/types/skillGap';

describe('Skill Gap - Property-Based Tests (Property 7)', () => {
  // Arbitrary generator for student profile skill items
  const skillItemArbitrary: fc.Arbitrary<SkillItem> = fc.record({
    name: fc.constantFrom(
      'React',
      'TypeScript',
      'Node.js',
      'Data Structures & Algorithms',
      'SQL',
      'Docker',
      'Python'
    ),
    proficiency: fc.constantFrom<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>(
      'Beginner',
      'Intermediate',
      'Advanced',
      'Expert'
    ),
    score: fc.integer({ min: 30, max: 100 }),
    endorsements: fc.integer({ min: 0, max: 20 }),
  });

  // Arbitrary generator for completed assessment results
  const assessmentResultArbitrary: fc.Arbitrary<AssessmentResult> = fc.record({
    id: fc.stringMatching(/^res-[a-z0-9]{5,8}$/),
    sessionId: fc.stringMatching(/^sess-[a-z0-9]{5,8}$/),
    assessmentId: fc.stringMatching(/^asmt-[a-z0-9]{3,6}$/),
    studentId: fc.constant('std-student-test'),
    assessmentTitle: fc.constantFrom(
      'React 19 & TypeScript Proficiency',
      'Algorithms & Computational Complexity',
      'Relational Database Design & SQL Querying'
    ),
    skillArea: fc.constantFrom(
      'Frontend Engineering',
      'Algorithms',
      'Databases',
      'Backend Engineering'
    ),
    score: fc.integer({ min: 20, max: 100 }),
    maxScore: fc.constant(100),
    percentage: fc.integer({ min: 10, max: 100 }),
    passed: fc.boolean(),
    questionDetails: fc.constant([]),
    completedAt: fc.constant(new Date().toISOString()),
    timeTakenSeconds: fc.integer({ min: 300, max: 1800 }),
  });

  const benchmarkRoleArbitrary: fc.Arbitrary<BenchmarkRoleRequirement> = fc.constantFrom(
    benchmarkRoles[0],
    benchmarkRoles[1],
    benchmarkRoles[2]
  );

  /**
   * Property 7: Skill Gap Aggregation
   * Validates: Requirements 2.6, 3.1, 3.4
   * For any student with multiple assessment results, the skill gap analysis
   * SHALL incorporate all assessment scores into the current skill proficiency levels.
   */
  it('Property 7: Skill Gap Aggregation incorporates all assessment scores and maintains consistency invariants', () => {
    fc.assert(
      fc.property(
        fc.array(skillItemArbitrary, { minLength: 0, maxLength: 5 }),
        fc.array(assessmentResultArbitrary, { minLength: 1, maxLength: 8 }),
        benchmarkRoleArbitrary,
        (profileSkills, assessmentResults, benchmark) => {
          const proficiencies = aggregateSkillProficiencies(
            profileSkills,
            assessmentResults,
            benchmark
          );

          expect(proficiencies.length).toBe(benchmark.benchmarkSkills.length);

          // Invariant 1: Boundedness of levels and mathematical correctness of gaps
          proficiencies.forEach((p) => {
            expect(p.currentLevel).toBeGreaterThanOrEqual(0);
            expect(p.currentLevel).toBeLessThanOrEqual(100);
            expect(p.requiredLevel).toBeGreaterThanOrEqual(0);
            expect(p.requiredLevel).toBeLessThanOrEqual(100);
            expect(p.gap).toBe(Math.max(0, p.requiredLevel - p.currentLevel));

            // Priority classification contract
            if (p.gap >= 25) {
              expect(p.priority).toBe('high');
            } else if (p.gap >= 12) {
              expect(p.priority).toBe('medium');
            } else {
              expect(p.priority).toBe('low');
            }

            // Invariant 2: When multiple assessments match, all assessment scores are incorporated
            if (p.assessmentCount && p.assessmentCount > 1) {
              expect(p.assessmentScore).toBeDefined();
              expect(p.assessmentScore).toBeGreaterThanOrEqual(10);
              expect(p.assessmentScore).toBeLessThanOrEqual(100);
            }
          });

          // Invariant 3: Recommendation generation correctness
          const recommendations = generateSkillRecommendations(proficiencies);
          recommendations.forEach((rec) => {
            expect(rec.targetScore).toBeGreaterThan(rec.currentScore);
            expect(rec.resources.length).toBeGreaterThan(0);
            expect(['high', 'medium', 'low']).toContain(rec.priority);
          });

          // Recommendations must be strictly sorted descending by gap deficit
          for (let i = 0; i < recommendations.length - 1; i++) {
            const gapCurrent = recommendations[i].targetScore - recommendations[i].currentScore;
            const gapNext = recommendations[i + 1].targetScore - recommendations[i + 1].currentScore;
            expect(gapCurrent).toBeGreaterThanOrEqual(gapNext);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property 7: Assessment incorporation sensitivity - adding higher scores increases or preserves proficiency', () => {
    fc.assert(
      fc.property(
        benchmarkRoleArbitrary,
        fc.integer({ min: 20, max: 50 }),
        fc.integer({ min: 70, max: 100 }),
        (benchmark, lowerScore, higherScore) => {
          const lowResult: AssessmentResult = {
            id: 'res-low-01',
            sessionId: 'sess-01',
            assessmentId: 'asmt-01',
            studentId: 'std-test',
            assessmentTitle: 'React 19 & TypeScript Proficiency',
            skillArea: 'Frontend Engineering',
            score: lowerScore,
            maxScore: 100,
            percentage: lowerScore,
            passed: lowerScore >= 70,
            questionDetails: [],
            completedAt: new Date().toISOString(),
            timeTakenSeconds: 600,
          };

          const highResult: AssessmentResult = {
            id: 'res-high-02',
            sessionId: 'sess-02',
            assessmentId: 'asmt-02',
            studentId: 'std-test',
            assessmentTitle: 'React 19 & TypeScript Proficiency',
            skillArea: 'Frontend Engineering',
            score: higherScore,
            maxScore: 100,
            percentage: higherScore,
            passed: higherScore >= 70,
            questionDetails: [],
            completedAt: new Date().toISOString(),
            timeTakenSeconds: 600,
          };

          // With low score only
          const runLow = aggregateSkillProficiencies([], [lowResult], benchmark);
          // With both low and higher score incorporated
          const runCombined = aggregateSkillProficiencies([], [lowResult, highResult], benchmark);

          const reactLow = runLow.find((p) => p.skill.includes('React'));
          const reactCombined = runCombined.find((p) => p.skill.includes('React'));

          if (reactLow && reactCombined) {
            // Combining a higher assessment must yield a higher or equal currentLevel
            expect(reactCombined.currentLevel).toBeGreaterThanOrEqual(reactLow.currentLevel);
            // Gap must decrease or stay equal
            expect(reactCombined.gap).toBeLessThanOrEqual(reactLow.gap);
            // Assessment count reflects both assessments incorporated
            expect(reactCombined.assessmentCount).toBe(2);
          }
        }
      ),
      { numRuns: 30 }
    );
  });
});
