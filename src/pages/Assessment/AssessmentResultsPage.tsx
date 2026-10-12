import React from 'react';
import { AssessmentResult } from '@/types/assessment';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export interface AssessmentResultsPageProps {
  result: AssessmentResult;
  onRetakeOrReturn: () => void;
  className?: string;
}

export const AssessmentResultsPage: React.FC<AssessmentResultsPageProps> = ({
  result,
  onRetakeOrReturn,
  className = '',
}) => {
  const minutes = Math.floor(result.timeTakenSeconds / 60);
  const seconds = result.timeTakenSeconds % 60;
  const timeTakenFormatted = `${minutes}m ${seconds}s`;

  return (
    <div
      className={`space-y-8 font-sans max-w-4xl mx-auto animate-fadeIn ${className}`}
      data-testid="assessment-results-page"
    >
      {/* 1. Results Summary Hero Card */}
      <Card variant="glass" padding="lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-5 text-center sm:text-left">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-xl shrink-0 ${
                result.passed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-emerald-950/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-rose-950/40'
              }`}
            >
              {result.percentage}%
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h2 className="text-2xl font-bold text-slate-100">{result.assessmentTitle}</h2>
                <Badge variant={result.passed ? 'success' : 'danger'} size="md" dot>
                  {result.passed ? 'Assessment Passed' : 'Needs Practice'}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Score: <strong>{result.score}</strong> / {result.maxScore} points
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Time Spent: <strong>{timeTakenFormatted}</strong>
                </span>
                <span>
                  Domain: <strong className="text-slate-300">{result.skillArea}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={onRetakeOrReturn}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Back to Catalog
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Question-by-Question Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Performance Breakdown by Question
          </h3>
          <span className="text-xs text-slate-400">
            {result.questionDetails.filter((q) => q.isCorrect).length} of{' '}
            {result.questionDetails.length} correct
          </span>
        </div>

        <div className="space-y-3.5">
          {result.questionDetails.map((detail, idx) => (
            <Card
              key={detail.questionId}
              variant="default"
              padding="md"
              className={`border-l-4 ${
                detail.isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Q{idx + 1}.</span>
                    <h4 className="text-sm font-semibold text-slate-200">{detail.questionText}</h4>
                  </div>

                  <div className="p-3 bg-slate-950/70 rounded-xl space-y-1 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 shrink-0 font-medium">Your Response:</span>
                      <span
                        className={`font-mono text-[11px] ${
                          detail.isCorrect ? 'text-emerald-300' : 'text-rose-300'
                        }`}
                      >
                        {detail.userAnswer || '(No answer recorded)'}
                      </span>
                    </div>

                    {!detail.isCorrect && detail.correctAnswer && (
                      <div className="flex items-start gap-2 pt-1 border-t border-slate-800">
                        <span className="text-slate-400 shrink-0 font-medium">Correct Answer:</span>
                        <span className="font-mono text-[11px] text-emerald-300">
                          {detail.correctAnswer}
                        </span>
                      </div>
                    )}

                    {detail.explanation && (
                      <p className="text-[11px] text-slate-400 pt-1 italic">
                        {detail.explanation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  {detail.isCorrect ? (
                    <Badge variant="success" size="sm" dot>
                      +{detail.pointsAwarded} pts
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="sm">
                      0 pts
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssessmentResultsPage;
