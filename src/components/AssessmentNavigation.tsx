import React from 'react';
import { Button } from './ui/Button';
import { ArrowLeft, ArrowRight, Pause, CheckCircle2 } from 'lucide-react';

export interface AssessmentNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestionIds: string[];
  questionIds: string[];
  onPrev: () => void;
  onNext: () => void;
  onSelectQuestion: (index: number) => void;
  onPause: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export const AssessmentNavigation: React.FC<AssessmentNavigationProps> = ({
  currentIndex,
  totalQuestions,
  answeredQuestionIds,
  questionIds,
  onPrev,
  onNext,
  onSelectQuestion,
  onPause,
  onSubmit,
  isSubmitting = false,
  className = '',
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const allAnswered = answeredQuestionIds.length === totalQuestions;

  return (
    <div className={`space-y-5 font-sans ${className}`} data-testid="assessment-navigation">
      {/* Question Indicators Grid */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
        <span className="text-xs text-slate-400 mr-2 font-medium">Questions:</span>
        {questionIds.map((qId, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answeredQuestionIds.includes(qId);

          return (
            <button
              key={qId}
              type="button"
              onClick={() => onSelectQuestion(idx)}
              aria-label={`Go to question ${idx + 1}`}
              className={`
                w-8 h-8 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center
                ${
                  isCurrent
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950 shadow-md'
                    : isAnswered
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white'
                }
              `}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onPrev}
            disabled={isFirst}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Previous
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onPause}
            leftIcon={<Pause className="w-3.5 h-3.5" />}
          >
            Pause Test
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {!isLast && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Next Question
            </Button>
          )}

          <Button
            variant={allAnswered ? 'primary' : 'outline'}
            size="sm"
            onClick={onSubmit}
            isLoading={isSubmitting}
            loadingText="Submitting Answers..."
            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            {isLast ? 'Complete & Submit' : 'Submit Test'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentNavigation;
