import React from 'react';
import { Assessment, AssessmentSession } from '@/types/assessment';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Clock, HelpCircle, Award, Play, RotateCcw } from 'lucide-react';

export interface AssessmentCardProps {
  assessment: Assessment;
  activeSession?: AssessmentSession | null;
  onStart: (assessment: Assessment) => void;
  onResume?: (assessment: Assessment, session: AssessmentSession) => void;
  className?: string;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
  activeSession,
  onStart,
  onResume,
  className = '',
}) => {
  const isResumeable = activeSession && activeSession.status === 'in_progress';

  const getDifficultyBadge = () => {
    switch (assessment.difficulty) {
      case 'Beginner':
        return <Badge variant="success" size="sm">{assessment.difficulty}</Badge>;
      case 'Intermediate':
        return <Badge variant="primary" size="sm">{assessment.difficulty}</Badge>;
      case 'Advanced':
        return <Badge variant="warning" size="sm">{assessment.difficulty}</Badge>;
    }
  };

  return (
    <Card
      variant="glass"
      padding="md"
      className={`flex flex-col justify-between transition-all duration-200 hover:border-indigo-500/40 hover:-translate-y-1 ${className}`}
      data-testid={`assessment-card-${assessment.id}`}
    >
      <div>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
              {assessment.category}
            </span>
            {getDifficultyBadge()}
          </div>
          <CardTitle className="text-base font-bold text-slate-100 mt-1">
            {assessment.title}
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 line-clamp-2 mt-1">
            {assessment.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 text-center">
            <div className="flex flex-col items-center">
              <span className="flex items-center text-xs text-slate-300 font-semibold gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {assessment.durationMinutes}m
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Duration</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="flex items-center text-xs text-slate-300 font-semibold gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                {assessment.questions.length}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Questions</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="flex items-center text-xs text-slate-300 font-semibold gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                {assessment.passingScore}%
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Passing</span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-4 border-t-0 mt-2">
        {isResumeable && onResume ? (
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => onResume(assessment, activeSession)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Resume Test
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => onStart(assessment)}
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            Start Assessment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AssessmentCard;
