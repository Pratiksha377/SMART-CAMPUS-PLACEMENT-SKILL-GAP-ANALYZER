import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { assessmentService, mockAssessments } from '@/services/assessmentService';
import { Assessment, AssessmentSession, Question } from '@/types/assessment';

describe('Assessment - Property-Based Tests (Properties 4-6)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Generator for valid assessment questions
  const questionArbitrary: fc.Arbitrary<Question> = fc.record({
    id: fc.stringMatching(/^q-[a-z0-9]{3,6}$/),
    text: fc.string({ minLength: 5, maxLength: 80 }),
    type: fc.constantFrom<'mcq' | 'coding' | 'essay'>('mcq', 'coding', 'essay'),
    options: fc.constant(['Option A', 'Option B', 'Option C', 'Option D']),
    correctAnswer: fc.constant('Option A'),
    rubric: fc.constant('Test rubric note'),
    points: fc.integer({ min: 10, max: 50 }),
  });

  // Generator for arbitrary assessment
  const assessmentArbitrary: fc.Arbitrary<Assessment> = fc
    .array(questionArbitrary, { minLength: 2, maxLength: 6 })
    .map((questions) => {
      // Ensure unique question IDs
      const uniqueQuestions = questions.map((q, idx) => ({
        ...q,
        id: `q-${idx}-${q.id}`,
      }));
      const totalPoints = uniqueQuestions.reduce((sum, q) => sum + q.points, 0);

      return {
        id: `asmt-${Math.random().toString(36).substring(2, 8)}`,
        title: 'Full Stack Engineering Evaluation',
        description: 'Automated skill and proficiency evaluation',
        skillArea: 'Software Engineering',
        category: 'Frontend' as const,
        difficulty: 'Intermediate' as const,
        durationMinutes: 30,
        passingScore: 70,
        questions: uniqueQuestions,
        totalPoints,
      };
    });

  // Generator for student answer map
  const answersArbitrary = (questions: Question[]) =>
    fc.record(
      questions.reduce<Record<string, fc.Arbitrary<string>>>((acc, q) => {
        if (q.type === 'mcq') {
          acc[q.id] = fc.constantFrom('Option A', 'Option B', 'Option C', 'Wrong Answer', '');
        } else if (q.type === 'coding') {
          acc[q.id] = fc.constantFrom(
            'function solve() { return true; } // long implementation answer',
            'empty',
            ''
          );
        } else {
          acc[q.id] = fc.constantFrom(
            'This is a comprehensive response addressing core principles and mechanisms.',
            'short',
            ''
          );
        }
        return acc;
      }, {})
    );

  /**
   * Property 4: Assessment Score Determinism
   * Validates: Requirements 2.3
   * For any given set of answers to an assessment, the scoring algorithm SHALL produce
   * the same score consistently, ensuring fair and reliable assessment results.
   */
  it('Property 4: Assessment Score Determinism', () => {
    fc.assert(
      fc.property(
        assessmentArbitrary,
        (assessment) => {
          // Generate answer set
          const sampleAnswers: Record<string, string> = {};
          assessment.questions.forEach((q, idx) => {
            if (idx % 2 === 0 && q.correctAnswer) {
              sampleAnswers[q.id] = q.correctAnswer;
            } else {
              sampleAnswers[q.id] = 'Alternative user input';
            }
          });

          const session: AssessmentSession = {
            sessionId: 'sess-determ-01',
            assessmentId: assessment.id,
            studentId: 'std-user-01',
            currentQuestionIndex: 0,
            timeRemainingSeconds: 1200,
            answers: sampleAnswers,
            status: 'in_progress',
            startedAt: new Date().toISOString(),
            lastSavedAt: new Date().toISOString(),
          };

          // Evaluate twice
          const run1 = assessmentService.evaluateAssessment(assessment, session);
          const run2 = assessmentService.evaluateAssessment(assessment, session);

          // Deterministic consistency
          expect(run1.score).toBe(run2.score);
          expect(run1.percentage).toBe(run2.percentage);
          expect(run1.passed).toBe(run2.passed);
          expect(run1.maxScore).toBe(assessment.totalPoints);
          expect(run1.questionDetails.length).toBe(assessment.questions.length);

          // Bounds guarantee
          expect(run1.score).toBeGreaterThanOrEqual(0);
          expect(run1.score).toBeLessThanOrEqual(assessment.totalPoints);
          expect(run1.percentage).toBeGreaterThanOrEqual(0);
          expect(run1.percentage).toBeLessThanOrEqual(100);

          for (let i = 0; i < run1.questionDetails.length; i++) {
            expect(run1.questionDetails[i].isCorrect).toBe(run2.questionDetails[i].isCorrect);
            expect(run1.questionDetails[i].pointsAwarded).toBe(run2.questionDetails[i].pointsAwarded);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 5: Incomplete Assessment Recovery
   * Validates: Requirements 2.4
   * For any assessment interrupted before completion, resuming that assessment SHALL restore
   * the exact state including current question, time remaining, and answered questions.
   */
  it('Property 5: Incomplete Assessment Recovery', async () => {
    await fc.assert(
      fc.asyncProperty(
        assessmentArbitrary,
        fc.integer({ min: 0, max: 5 }),
        fc.integer({ min: 10, max: 1800 }),
        async (assessment, rawIndex, timeRemaining) => {
          const validIndex = rawIndex % assessment.questions.length;
          const sampleAnswers: Record<string, string> = {};
          assessment.questions.slice(0, validIndex + 1).forEach((q) => {
            sampleAnswers[q.id] = 'Recorded student answer';
          });

          const originalSession: AssessmentSession = {
            sessionId: `sess-${Math.random().toString(36).substring(2, 8)}`,
            assessmentId: assessment.id,
            studentId: 'std-recovery-01',
            currentQuestionIndex: validIndex,
            timeRemainingSeconds: timeRemaining,
            answers: sampleAnswers,
            status: 'in_progress',
            startedAt: new Date().toISOString(),
            lastSavedAt: new Date().toISOString(),
          };

          // Save partial state to storage
          assessmentService.saveSessionLocally(originalSession);

          // Resume interrupted session
          const recovered = await assessmentService.resumeAssessment(
            originalSession.assessmentId,
            originalSession.studentId
          );

          expect(recovered).not.toBeNull();
          expect(recovered?.sessionId).toBe(originalSession.sessionId);
          expect(recovered?.assessmentId).toBe(originalSession.assessmentId);
          expect(recovered?.studentId).toBe(originalSession.studentId);
          expect(recovered?.currentQuestionIndex).toBe(originalSession.currentQuestionIndex);
          expect(recovered?.timeRemainingSeconds).toBe(originalSession.timeRemainingSeconds);
          expect(recovered?.answers).toEqual(originalSession.answers);
          expect(recovered?.status).toBe('in_progress');
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 6: Assessment Result Completeness
   * Validates: Requirements 2.5
   * For any completed assessment, the result record SHALL contain all required fields
   * including score, percentage, answers, and timestamp.
   */
  it('Property 6: Assessment Result Completeness', () => {
    fc.assert(
      fc.property(
        assessmentArbitrary,
        fc.integer({ min: 0, max: 1800 }),
        (assessment, timeRemaining) => {
          const answers: Record<string, string> = {};
          assessment.questions.forEach((q) => {
            answers[q.id] = q.type === 'mcq' ? (q.correctAnswer || 'Option A') : 'Detailed technical response exceeding minimum length';
          });

          const session: AssessmentSession = {
            sessionId: 'sess-complete-01',
            assessmentId: assessment.id,
            studentId: 'std-complete-99',
            currentQuestionIndex: assessment.questions.length - 1,
            timeRemainingSeconds: Math.min(timeRemaining, assessment.durationMinutes * 60),
            answers,
            status: 'completed',
            startedAt: new Date().toISOString(),
            lastSavedAt: new Date().toISOString(),
          };

          const result = assessmentService.evaluateAssessment(assessment, session);

          // Verify result completeness
          expect(result).toBeDefined();
          expect(typeof result.id).toBe('string');
          expect(result.id.startsWith('res-')).toBe(true);
          expect(result.sessionId).toBe(session.sessionId);
          expect(result.assessmentId).toBe(assessment.id);
          expect(result.studentId).toBe(session.studentId);
          expect(result.assessmentTitle).toBe(assessment.title);
          expect(result.skillArea).toBe(assessment.skillArea);
          expect(typeof result.score).toBe('number');
          expect(result.maxScore).toBe(assessment.totalPoints);
          expect(typeof result.percentage).toBe('number');
          expect(result.percentage).toBeGreaterThanOrEqual(0);
          expect(result.percentage).toBeLessThanOrEqual(100);
          expect(result.passed).toBe(result.percentage >= assessment.passingScore);
          expect(typeof result.completedAt).toBe('string');
          expect(new Date(result.completedAt).getTime()).not.toBeNaN();
          expect(result.timeTakenSeconds).toBeGreaterThanOrEqual(0);

          // Details breakdown completeness
          expect(result.questionDetails).toBeInstanceOf(Array);
          expect(result.questionDetails.length).toBe(assessment.questions.length);

          result.questionDetails.forEach((detail, index) => {
            const correspondingQuestion = assessment.questions[index];
            expect(detail.questionId).toBe(correspondingQuestion.id);
            expect(detail.questionText).toBe(correspondingQuestion.text);
            expect(detail.userAnswer).toBe(answers[correspondingQuestion.id] || '');
            expect(typeof detail.isCorrect).toBe('boolean');
            expect(typeof detail.pointsAwarded).toBe('number');
            expect(detail.maxPoints).toBe(correspondingQuestion.points);
            expect(detail.pointsAwarded).toBeLessThanOrEqual(detail.maxPoints);
          });
        }
      ),
      { numRuns: 50 }
    );
  });
});
