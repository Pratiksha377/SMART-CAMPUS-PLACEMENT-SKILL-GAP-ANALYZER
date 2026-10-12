import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AssessmentCard } from '@/components/AssessmentCard';
import { AssessmentStartModal } from '@/components/AssessmentStartModal';
import { AssessmentTimer } from '@/components/AssessmentTimer';
import { QuestionRenderer } from '@/components/QuestionRenderer';
import { AssessmentNavigation } from '@/components/AssessmentNavigation';
import { AssessmentViewer } from '@/components/AssessmentViewer';
import { AssessmentResultsPage } from '@/pages/Assessment/AssessmentResultsPage';
import { Assessment, AssessmentSession, AssessmentResult, Question } from '@/types/assessment';

const sampleAssessment: Assessment = {
  id: 'asmt-sample-01',
  title: 'TypeScript & Algorithms Core',
  description: 'A comprehensive evaluation of data structures and TypeScript generics.',
  skillArea: 'Frontend Engineering',
  category: 'Frontend',
  difficulty: 'Intermediate',
  durationMinutes: 15,
  passingScore: 70,
  totalPoints: 100,
  questions: [
    {
      id: 'q-mcq-1',
      text: 'Which TypeScript keyword creates a union type?',
      type: 'mcq',
      options: ['&', '|', 'instanceof', 'typeof'],
      correctAnswer: '|',
      points: 50,
    },
    {
      id: 'q-code-2',
      text: 'Write a generic identity function.',
      type: 'coding',
      sampleCode: 'function identity<T>(arg: T): T { return arg; }',
      points: 50,
    },
  ],
};

const sampleSession: AssessmentSession = {
  sessionId: 'sess-test-123',
  assessmentId: sampleAssessment.id,
  studentId: 'std-user-01',
  currentQuestionIndex: 0,
  timeRemainingSeconds: 900,
  answers: {
    'q-mcq-1': '|',
  },
  status: 'in_progress',
  startedAt: new Date().toISOString(),
  lastSavedAt: new Date().toISOString(),
};

describe('Assessment UI Components', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('AssessmentCard', () => {
    it('renders assessment metadata, difficulty badge, and start button', () => {
      const handleStart = vi.fn();
      render(
        <AssessmentCard
          assessment={sampleAssessment}
          onStart={handleStart}
        />
      );

      expect(screen.getByText('TypeScript & Algorithms Core')).toBeInTheDocument();
      expect(screen.getByText('Frontend')).toBeInTheDocument();
      expect(screen.getByText('Intermediate')).toBeInTheDocument();
      expect(screen.getByText('15m')).toBeInTheDocument();
      expect(screen.getByText('70%')).toBeInTheDocument();

      const startButton = screen.getByRole('button', { name: /start assessment/i });
      fireEvent.click(startButton);
      expect(handleStart).toHaveBeenCalledWith(sampleAssessment);
    });

    it('renders resume button when activeSession is in progress', () => {
      const handleStart = vi.fn();
      const handleResume = vi.fn();

      render(
        <AssessmentCard
          assessment={sampleAssessment}
          activeSession={sampleSession}
          onStart={handleStart}
          onResume={handleResume}
        />
      );

      const resumeButton = screen.getByRole('button', { name: /resume test/i });
      expect(resumeButton).toBeInTheDocument();

      fireEvent.click(resumeButton);
      expect(handleResume).toHaveBeenCalledWith(sampleAssessment, sampleSession);
    });
  });

  describe('AssessmentStartModal', () => {
    it('renders assessment details and triggers confirm start', () => {
      const handleClose = vi.fn();
      const handleConfirm = vi.fn();

      render(
        <AssessmentStartModal
          assessment={sampleAssessment}
          isOpen={true}
          onClose={handleClose}
          onConfirmStart={handleConfirm}
        />
      );

      expect(screen.getByText(/I'm Ready, Begin Test/i)).toBeInTheDocument();
      expect(screen.getByText(/15 minutes/i)).toBeInTheDocument();
      expect(screen.getByText(/2 total/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /I'm Ready, Begin Test/i }));
      expect(handleConfirm).toHaveBeenCalledWith(sampleAssessment);
    });
  });

  describe('AssessmentTimer', () => {
    it('formats countdown time and alerts under low time', () => {
      render(
        <AssessmentTimer
          timeRemainingSeconds={45} // Under 60 seconds critical
          totalDurationSeconds={900}
          onTick={vi.fn()}
          onTimeOut={vi.fn()}
        />
      );

      expect(screen.getByText('00:45')).toBeInTheDocument();
      const timerElement = screen.getByRole('timer');
      expect(timerElement.className).toContain('text-rose-300');
    });
  });

  describe('QuestionRenderer', () => {
    it('renders MCQ options and allows selection', () => {
      const handleAnswer = vi.fn();
      render(
        <QuestionRenderer
          question={sampleAssessment.questions[0]}
          currentAnswer="|"
          onAnswerChange={handleAnswer}
        />
      );

      expect(screen.getByText('Which TypeScript keyword creates a union type?')).toBeInTheDocument();
      expect(screen.getByText('|')).toBeInTheDocument();
      expect(screen.getByText('&')).toBeInTheDocument();

      fireEvent.click(screen.getByText('&'));
      expect(handleAnswer).toHaveBeenCalledWith('&');
    });

    it('renders coding editor and triggers change', () => {
      const handleAnswer = vi.fn();
      render(
        <QuestionRenderer
          question={sampleAssessment.questions[1]}
          currentAnswer=""
          onAnswerChange={handleAnswer}
        />
      );

      const textarea = screen.getByPlaceholderText(/\/\/ Write your code implementation here/i);
      expect(textarea).toBeInTheDocument();

      fireEvent.change(textarea, { target: { value: 'const x = 10;' } });
      expect(handleAnswer).toHaveBeenCalledWith('const x = 10;');
    });

    it('renders essay response textarea for essay type questions', () => {
      const essayQuestion: Question = {
        id: 'q-essay-1',
        text: 'Discuss CAP theorem tradeoffs.',
        type: 'essay',
        points: 20,
      };
      const handleAnswer = vi.fn();

      render(
        <QuestionRenderer
          question={essayQuestion}
          currentAnswer="Consistency vs Availability"
          onAnswerChange={handleAnswer}
        />
      );

      const essayTextarea = screen.getByPlaceholderText(/Provide a clear, detailed technical explanation/i);
      expect(essayTextarea).toBeInTheDocument();
      expect(essayTextarea).toHaveValue('Consistency vs Availability');
    });
  });

  describe('AssessmentNavigation', () => {
    it('handles next, previous, pause and direct question jump', () => {
      const onPrev = vi.fn();
      const onNext = vi.fn();
      const onSelect = vi.fn();
      const onPause = vi.fn();
      const onSubmit = vi.fn();

      render(
        <AssessmentNavigation
          currentIndex={0}
          totalQuestions={2}
          answeredQuestionIds={['q-mcq-1']}
          questionIds={['q-mcq-1', 'q-code-2']}
          onPrev={onPrev}
          onNext={onNext}
          onSelectQuestion={onSelect}
          onPause={onPause}
          onSubmit={onSubmit}
        />
      );

      // Previous button should be disabled on first question
      const prevButton = screen.getByRole('button', { name: /previous/i });
      expect(prevButton).toBeDisabled();

      // Next button
      const nextButton = screen.getByRole('button', { name: /next question/i });
      fireEvent.click(nextButton);
      expect(onNext).toHaveBeenCalled();

      // Direct question select
      const q2Button = screen.getByRole('button', { name: /go to question 2/i });
      fireEvent.click(q2Button);
      expect(onSelect).toHaveBeenCalledWith(1);

      // Pause button
      const pauseButton = screen.getByRole('button', { name: /pause test/i });
      fireEvent.click(pauseButton);
      expect(onPause).toHaveBeenCalled();
    });
  });

  describe('AssessmentResultsPage', () => {
    it('renders result percentage, score, and performance breakdown', () => {
      const sampleResult: AssessmentResult = {
        id: 'res-abc-001',
        sessionId: 'sess-001',
        assessmentId: sampleAssessment.id,
        studentId: 'std-101',
        assessmentTitle: 'TypeScript & Algorithms Core',
        skillArea: 'Frontend Engineering',
        score: 100,
        maxScore: 100,
        percentage: 100,
        passed: true,
        questionDetails: [
          {
            questionId: 'q-mcq-1',
            questionText: 'Which TypeScript keyword creates a union type?',
            userAnswer: '|',
            correctAnswer: '|',
            isCorrect: true,
            pointsAwarded: 50,
            maxPoints: 50,
            explanation: 'Correct response',
          },
        ],
        completedAt: new Date().toISOString(),
        timeTakenSeconds: 320,
      };

      const handleReturn = vi.fn();
      render(
        <AssessmentResultsPage
          result={sampleResult}
          onRetakeOrReturn={handleReturn}
        />
      );

      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('Assessment Passed')).toBeInTheDocument();
      expect(screen.getByText(/Score:/i)).toBeInTheDocument();
      expect(screen.getByText('+50 pts')).toBeInTheDocument();

      const backButton = screen.getByRole('button', { name: /back to catalog/i });
      fireEvent.click(backButton);
      expect(handleReturn).toHaveBeenCalled();
    });
  });
});
