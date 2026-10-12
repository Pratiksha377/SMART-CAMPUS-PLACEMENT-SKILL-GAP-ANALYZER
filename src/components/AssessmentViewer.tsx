import React, { useState, useEffect } from 'react';
import { Assessment, AssessmentSession } from '@/types/assessment';
import { Card, CardHeader, CardContent } from './ui/Card';
import { AssessmentTimer } from './AssessmentTimer';
import { QuestionRenderer } from './QuestionRenderer';
import { AssessmentNavigation } from './AssessmentNavigation';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Check, PauseCircle } from 'lucide-react';
import { assessmentService } from '@/services/assessmentService';

export interface AssessmentViewerProps {
  assessment: Assessment;
  session: AssessmentSession;
  onUpdateAnswer: (questionId: string, answer: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectQuestion: (index: number) => void;
  onTimeUpdate: (remainingSeconds: number) => void;
  onPause: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const AssessmentViewer: React.FC<AssessmentViewerProps> = ({
  assessment,
  session,
  onUpdateAnswer,
  onNext,
  onPrev,
  onSelectQuestion,
  onTimeUpdate,
  onPause,
  onSubmit,
  isSubmitting = false,
}) => {
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<string>('Just now');

  const currentQuestion = assessment.questions[session.currentQuestionIndex];
  const questionIds = assessment.questions.map((q) => q.id);
  const answeredQuestionIds = Object.keys(session.answers).filter(
    (id) => !!session.answers[id] && session.answers[id].trim().length > 0
  );

  // Auto-save session periodically / on answer change (FE6.11)
  useEffect(() => {
    assessmentService.saveSessionLocally(session);
    setLastAutoSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [session]);

  const handlePauseClick = () => {
    setShowPauseModal(true);
  };

  const handleConfirmPause = () => {
    setShowPauseModal(false);
    onPause();
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto" data-testid="assessment-viewer">
      {/* Top Bar: Assessment Title & Timer & Auto-save status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div>
          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
            {assessment.skillArea}
          </span>
          <h2 className="text-base font-bold text-slate-100">{assessment.title}</h2>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] text-slate-400 hidden md:flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            Auto-saved ({lastAutoSaved})
          </span>

          <AssessmentTimer
            timeRemainingSeconds={session.timeRemainingSeconds}
            totalDurationSeconds={assessment.durationMinutes * 60}
            onTick={onTimeUpdate}
            onTimeOut={onSubmit}
            isPaused={showPauseModal}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <Card variant="glass" padding="lg">
        <CardContent>
          {currentQuestion && (
            <QuestionRenderer
              question={currentQuestion}
              currentAnswer={session.answers[currentQuestion.id] || ''}
              onAnswerChange={(ans) => onUpdateAnswer(currentQuestion.id, ans)}
            />
          )}
        </CardContent>
      </Card>

      {/* Bottom Navigation */}
      <AssessmentNavigation
        currentIndex={session.currentQuestionIndex}
        totalQuestions={assessment.questions.length}
        answeredQuestionIds={answeredQuestionIds}
        questionIds={questionIds}
        onPrev={onPrev}
        onNext={onNext}
        onSelectQuestion={onSelectQuestion}
        onPause={handlePauseClick}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Pause Confirmation Modal */}
      <Modal
        isOpen={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        title="Pause Assessment Session"
        description="Your timer will freeze and your responses are saved."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowPauseModal(false)}>
              Resume Assessment
            </Button>
            <Button variant="primary" onClick={handleConfirmPause}>
              Exit & Save Progress
            </Button>
          </>
        }
      >
        <div className="flex items-start space-x-3 text-xs text-slate-300">
          <PauseCircle className="w-8 h-8 text-indigo-400 shrink-0" />
          <p className="leading-relaxed">
            You can return at any time before the test deadline. When you return, you will resume with the exact question and remaining time intact.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default AssessmentViewer;
