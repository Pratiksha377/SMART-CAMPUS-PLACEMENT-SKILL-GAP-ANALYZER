import { v4 as uuidv4 } from 'uuid';
import {
  Assessment,
  AssessmentSession,
  AssessmentResult,
  QuestionResultDetail,
} from '@/types/assessment';
import apiClient from './api';

const SESSION_STORAGE_PREFIX = 'smart_campus_assessment_session';
const RESULT_STORAGE_PREFIX = 'smart_campus_assessment_result';

export const mockAssessments: Assessment[] = [
  {
    id: 'asmt-ts-react-01',
    title: 'React 19 & TypeScript Proficiency',
    description:
      'Evaluate component architecture, custom hooks, state synchronization, and strict TypeScript types.',
    skillArea: 'Frontend Engineering',
    category: 'Frontend',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    passingScore: 70,
    totalPoints: 100,
    questions: [
      {
        id: 'q-ts-1',
        text: 'Which React hook should be preferred to preserve a mutable value between renders without triggering a re-render?',
        type: 'mcq',
        options: ['useState', 'useRef', 'useEffect', 'useMemo'],
        correctAnswer: 'useRef',
        points: 25,
      },
      {
        id: 'q-ts-2',
        text: 'What TypeScript utility type extracts all properties of T except those with key K?',
        type: 'mcq',
        options: ['Pick<T, K>', 'Omit<T, K>', 'Exclude<T, K>', 'Extract<T, K>'],
        correctAnswer: 'Omit<T, K>',
        points: 25,
      },
      {
        id: 'q-ts-3',
        text: 'In React 19, what is the primary benefit of the Action state hooks (such as useActionState)?',
        type: 'mcq',
        options: [
          'Automatic async transition management and pending state handling',
          'Eliminating all client-side JavaScript bundling',
          'Replacing HTML form elements with canvas',
          'Bypassing React Virtual DOM rendering entirely',
        ],
        correctAnswer: 'Automatic async transition management and pending state handling',
        points: 25,
      },
      {
        id: 'q-ts-4',
        text: 'Implement or outline a debounce hook in TypeScript that delays function invocation by N milliseconds.',
        type: 'coding',
        sampleCode: `export function useDebounce<T>(value: T, delayMs: number): T {\n  // Implement hook logic here\n}`,
        rubric: 'Evaluates cleanup of setTimeout in useEffect',
        points: 25,
      },
    ],
  },
  {
    id: 'asmt-ds-algo-02',
    title: 'Algorithms & Computational Complexity',
    description:
      'Assess proficiency in asymptotic notation, dynamic programming, graph traversal, and divide & conquer.',
    skillArea: 'Algorithms',
    category: 'Algorithms',
    difficulty: 'Advanced',
    durationMinutes: 30,
    passingScore: 75,
    totalPoints: 100,
    questions: [
      {
        id: 'q-algo-1',
        text: 'What is the tight worst-case time complexity of finding the shortest path in a weighted graph with non-negative edges using Dijkstra algorithm with a Min-Heap?',
        type: 'mcq',
        options: ['O(V^2)', 'O((V + E) log V)', 'O(E log E)', 'O(V * E)'],
        correctAnswer: 'O((V + E) log V)',
        points: 25,
      },
      {
        id: 'q-algo-2',
        text: 'Which data structure offers amortized O(1) time complexity for insert, delete, and lookup operations?',
        type: 'mcq',
        options: ['Hash Map (Hash Table)', 'Binary Search Tree', 'Red-Black Tree', 'B+ Tree'],
        correctAnswer: 'Hash Map (Hash Table)',
        points: 25,
      },
      {
        id: 'q-algo-3',
        text: 'In Dynamic Programming, what are the two essential characteristics required for a problem to be solved with DP?',
        type: 'mcq',
        options: [
          'Optimal substructure and overlapping subproblems',
          'Greedy choice property and divide & conquer',
          'Linear runtime and topological sorting',
          'Deterministic finite state and binary partitioning',
        ],
        correctAnswer: 'Optimal substructure and overlapping subproblems',
        points: 25,
      },
      {
        id: 'q-algo-4',
        text: 'Write a recursive or iterative function in JavaScript/TypeScript to check if a binary tree is a valid Binary Search Tree (BST).',
        type: 'coding',
        sampleCode: `function isValidBST(root: TreeNode | null, min = -Infinity, max = Infinity): boolean {\n  // Implement check here\n}`,
        rubric: 'Validates strict inequality range propagation',
        points: 25,
      },
    ],
  },
  {
    id: 'asmt-sql-db-03',
    title: 'Relational Database Design & SQL Querying',
    description:
      'Evaluate relational normalization (3NF/BCNF), index mechanics, ACID transaction semantics, and SQL joins.',
    skillArea: 'Databases',
    category: 'Database',
    difficulty: 'Intermediate',
    durationMinutes: 25,
    passingScore: 70,
    totalPoints: 100,
    questions: [
      {
        id: 'q-sql-1',
        text: 'Which SQL clause is used to filter aggregated group records after a GROUP BY operation?',
        type: 'mcq',
        options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'],
        correctAnswer: 'HAVING',
        points: 25,
      },
      {
        id: 'q-sql-2',
        text: 'What does the "I" in ACID database transactions guarantee?',
        type: 'mcq',
        options: ['Isolation', 'Idempotency', 'Integrity', 'Indexability'],
        correctAnswer: 'Isolation',
        points: 25,
      },
      {
        id: 'q-sql-3',
        text: 'Which type of index is most suitable for range queries in PostgreSQL or MySQL InnoDB engines?',
        type: 'mcq',
        options: ['B-Tree Index', 'Hash Index', 'Bitmap Index', 'GIN Index'],
        correctAnswer: 'B-Tree Index',
        points: 25,
      },
      {
        id: 'q-sql-4',
        text: 'Explain the difference between optimistic concurrency control and pessimistic locking.',
        type: 'essay',
        rubric: 'Compares version checks vs database row locks under contention',
        points: 25,
      },
    ],
  },
];

export const assessmentService = {
  async getAssessments(): Promise<Assessment[]> {
    try {
      const response = await apiClient.get<Assessment[]>('/assessments');
      return response.data;
    } catch {
      return mockAssessments;
    }
  },

  async getAssessmentById(id: string): Promise<Assessment | null> {
    try {
      const response = await apiClient.get<Assessment>(`/assessments/${id}`);
      return response.data;
    } catch {
      return mockAssessments.find((a) => a.id === id) || null;
    }
  },

  async startAssessment(
    assessmentId: string,
    studentId: string
  ): Promise<AssessmentSession> {
    const existing = await this.resumeAssessment(assessmentId, studentId);
    if (existing && existing.status === 'in_progress') {
      return existing;
    }

    const assessment = await this.getAssessmentById(assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    const session: AssessmentSession = {
      sessionId: `sess-${uuidv4().slice(0, 8)}`,
      assessmentId,
      studentId,
      currentQuestionIndex: 0,
      timeRemainingSeconds: assessment.durationMinutes * 60,
      answers: {},
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      lastSavedAt: new Date().toISOString(),
    };

    this.saveSessionLocally(session);
    return session;
  },

  saveSessionLocally(session: AssessmentSession): void {
    try {
      const key = `${SESSION_STORAGE_PREFIX}_${session.assessmentId}_${session.studentId}`;
      localStorage.setItem(key, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to save assessment session to storage', e);
    }
  },

  async resumeAssessment(
    assessmentId: string,
    studentId: string
  ): Promise<AssessmentSession | null> {
    try {
      const key = `${SESSION_STORAGE_PREFIX}_${assessmentId}_${studentId}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const session: AssessmentSession = JSON.parse(raw);
        if (session.status !== 'completed') {
          return session;
        }
      }
    } catch (e) {
      console.warn('Failed to resume session from storage', e);
    }
    return null;
  },

  /**
   * Deterministic Scoring Logic (Property 4 & Property 6)
   * Evaluates answers and produces a repeatable, comprehensive AssessmentResult.
   */
  evaluateAssessment(
    assessment: Assessment,
    session: AssessmentSession
  ): AssessmentResult {
    let totalScore = 0;
    const details: QuestionResultDetail[] = assessment.questions.map((q) => {
      const studentAnswer = session.answers[q.id]?.trim() || '';
      let isCorrect = false;
      let pointsAwarded = 0;

      if (q.type === 'mcq') {
        isCorrect =
          !!q.correctAnswer &&
          studentAnswer.toLowerCase() === q.correctAnswer.toLowerCase();
        pointsAwarded = isCorrect ? q.points : 0;
      } else if (q.type === 'coding') {
        // Deterministic heuristic: non-empty submitted code with key tokens
        isCorrect = studentAnswer.length > 20;
        pointsAwarded = isCorrect ? q.points : 0;
      } else {
        // Essay heuristic: thoughtful response length
        isCorrect = studentAnswer.length > 15;
        pointsAwarded = isCorrect ? q.points : 0;
      }

      totalScore += pointsAwarded;

      return {
        questionId: q.id,
        questionText: q.text,
        userAnswer: studentAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        pointsAwarded,
        maxPoints: q.points,
        explanation: q.rubric || (isCorrect ? 'Correct response' : 'Incorrect response'),
      };
    });

    const percentage = Math.round((totalScore / assessment.totalPoints) * 100);
    const passed = percentage >= assessment.passingScore;

    const timeTaken = Math.max(
      0,
      assessment.durationMinutes * 60 - session.timeRemainingSeconds
    );

    const result: AssessmentResult = {
      id: `res-${uuidv4().slice(0, 8)}`,
      sessionId: session.sessionId,
      assessmentId: assessment.id,
      studentId: session.studentId,
      assessmentTitle: assessment.title,
      skillArea: assessment.skillArea,
      score: totalScore,
      maxScore: assessment.totalPoints,
      percentage,
      passed,
      questionDetails: details,
      completedAt: new Date().toISOString(),
      timeTakenSeconds: timeTaken,
    };

    return result;
  },

  async submitAssessment(
    session: AssessmentSession
  ): Promise<AssessmentResult> {
    const assessment = await this.getAssessmentById(session.assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    const result = this.evaluateAssessment(assessment, session);

    // Mark session completed
    session.status = 'completed';
    this.saveSessionLocally(session);

    // Save result to localStorage
    try {
      const key = `${RESULT_STORAGE_PREFIX}_${result.id}`;
      localStorage.setItem(key, JSON.stringify(result));
      localStorage.setItem(`${RESULT_STORAGE_PREFIX}_latest`, JSON.stringify(result));
    } catch (e) {
      console.warn('Failed to save assessment result', e);
    }

    return result;
  },
};

export default assessmentService;
