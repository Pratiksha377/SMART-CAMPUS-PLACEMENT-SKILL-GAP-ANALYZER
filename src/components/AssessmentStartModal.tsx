import React from 'react';
import { Assessment } from '@/types/assessment';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Clock, ShieldCheck, Award, HelpCircle } from 'lucide-react';

export interface AssessmentStartModalProps {
  assessment: Assessment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmStart: (assessment: Assessment) => void;
}

export const AssessmentStartModal: React.FC<AssessmentStartModalProps> = ({
  assessment,
  isOpen,
  onClose,
  onConfirmStart,
}) => {
  if (!assessment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assessment.title}
      description={`Category: ${assessment.category} • Target Skill: ${assessment.skillArea}`}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => onConfirmStart(assessment)}
          >
            I'm Ready, Begin Test
          </Button>
        </>
      }
    >
      <div className="space-y-4 font-sans text-xs">
        <p className="text-slate-300 leading-relaxed text-sm">
          {assessment.description}
        </p>

        <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2 text-slate-300">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Time Limit: <strong>{assessment.durationMinutes} minutes</strong></span>
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Questions: <strong>{assessment.questions.length} total</strong></span>
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Passing Mark: <strong>{assessment.passingScore}%</strong></span>
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Auto-Save: <strong>Enabled</strong></span>
          </div>
        </div>

        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 space-y-1">
          <p className="font-semibold text-xs">Assessment Guidelines & Honor Code:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
            <li>You can pause and resume your test before the time runs out.</li>
            <li>Answers are automatically preserved in local session storage.</li>
            <li>Scores immediately update your campus placement skill gap analytics.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default AssessmentStartModal;
