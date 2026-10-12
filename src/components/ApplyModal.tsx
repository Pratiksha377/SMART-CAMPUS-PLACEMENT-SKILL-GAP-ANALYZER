import React, { useState } from 'react';
import { JobOpportunity } from '@/types/opportunity';
import { DocumentMetadata as Document } from '@/types/profile';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { AlertCircle, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export interface ApplyModalProps {
  opportunity: JobOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmApply: (
    opportunity: JobOpportunity,
    details: { resumeFileName: string; notes?: string }
  ) => Promise<void>;
  isDuplicate?: boolean;
  availableResumes?: Document[];
  isSubmitting?: boolean;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onConfirmApply,
  isDuplicate = false,
  availableResumes = [],
  isSubmitting = false,
}) => {
  const [selectedResume, setSelectedResume] = useState<string>(
    availableResumes[0]?.name || 'Verified_Profile_Resume.pdf'
  );
  const [notes, setNotes] = useState<string>('');

  if (!opportunity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDuplicate) return;
    await onConfirmApply(opportunity, {
      resumeFileName: selectedResume,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply to ${opportunity.company}`}
      description={`${opportunity.title} • ${opportunity.location}`}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Submitting..."
            disabled={isDuplicate}
          >
            Confirm & Submit Application
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        {/* Duplicate Application Alert (Property 9) */}
        {isDuplicate && (
          <div
            className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start gap-2.5 animate-fadeIn"
            data-testid="duplicate-application-alert"
          >
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="space-y-0.5">
              <strong className="font-semibold block">Application Already Active</strong>
              <p className="text-[11px] text-rose-200">
                You have already submitted an active application for this role. The system prevents duplicate submissions to protect hiring pipeline integrity.
              </p>
            </div>
          </div>
        )}

        {/* Opportunity Overview Pill */}
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Match Compatibility:</span>
            <span className="font-bold text-emerald-400">{opportunity.matchScore || 85}% match</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Role Type:</span>
            <span className="text-slate-200 font-medium">{opportunity.type} ({opportunity.workplaceType || 'On-site'})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Application Deadline:</span>
            <span className="text-amber-400 font-mono">
              {new Date(opportunity.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Resume Selection */}
        <div className="space-y-1.5">
          <label htmlFor="resume-select" className="font-medium text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            Attached Resume / Profile Document:
          </label>
          {availableResumes.length > 0 ? (
            <select
              id="resume-select"
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              disabled={isDuplicate || isSubmitting}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {availableResumes.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name} (Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          ) : (
            <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300 flex items-center justify-between">
              <span>Standard Verified Profile Resume</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
            </div>
          )}
        </div>

        {/* Notes / Candidate Pitch */}
        <div className="space-y-1.5">
          <label htmlFor="candidate-notes" className="font-medium text-slate-300">
            Note for Campus Placement Coordinator (Optional):
          </label>
          <textarea
            id="candidate-notes"
            rows={3}
            placeholder="Highlight key project achievements or assessment percentiles relevant to this job..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isDuplicate || isSubmitting}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </form>
    </Modal>
  );
};

export default ApplyModal;
