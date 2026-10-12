export type QuestionType = 'mcq' | 'coding' | 'essay';

export type AssessmentDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // For MCQ
  correctAnswer?: string; // For MCQ deterministic scoring
  sampleCode?: string; // For coding questions starter template
  rubric?: string; // Evaluation rubric or hints
  points: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  skillArea: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Algorithms' | 'General';
  difficulty: AssessmentDifficulty;
  durationMinutes: number;
  passingScore: number; // percentage (e.g. 70)
  questions: Question[];
  totalPoints: number;
}

export interface AssessmentSession {
  sessionId: string;
  assessmentId: string;
  studentId: string;
  currentQuestionIndex: number;
  timeRemainingSeconds: number;
  answers: Record<string, string>; // questionId -> studentAnswer
  status: 'in_progress' | 'paused' | 'completed' | 'timed_out';
  startedAt: string;
  lastSavedAt: string;
}

export interface QuestionResultDetail {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer?: string;
  isCorrect: boolean;
  pointsAwarded: number;
  maxPoints: number;
  explanation?: string;
}

export interface AssessmentResult {
  id: string;
  sessionId: string;
  assessmentId: string;
  studentId: string;
  assessmentTitle: string;
  skillArea: string;
  score: number; // points earned
  maxScore: number; // points possible
  percentage: number; // 0-100
  passed: boolean;
  questionDetails: QuestionResultDetail[];
  completedAt: string;
  timeTakenSeconds: number;
}
