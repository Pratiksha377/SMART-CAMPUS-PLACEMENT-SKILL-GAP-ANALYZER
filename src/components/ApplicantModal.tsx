import React, { useState } from 'react';
import { ApplicantCandidate } from '@/types/recruiter';
import { ApplicationStatus } from '@/types/opportunity';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from './StatusBadge';
import {
  User,
  Mail,
  GraduationCap,
  Award,
  Calendar,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export interface ApplicantModalProps {
  applicant: ApplicantCandidate | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (applicationId: string, status: ApplicationStatus, notes?: string) => void;
}

export const ApplicantModal: React.FC<ApplicantModalProps> = ({
  applicant,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!applicant) return null;

  const appliedDate = new Date(applicant.appliedAt).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleAction = async (status: ApplicationStatus) => {
    if (!onStatusChange) return;
    setIsUpdating(true);
    try {
      await onStatusChange(applicant.applicationId, status, recruiterNotes);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Profile & Skill Evaluation"
      size="xl"
    >
      <div className="space-y-6 font-sans" data-testid="applicant-modal-content">
        {/* Top Header Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-violet-600/30">
              {applicant.studentName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">{applicant.studentName}</h2>
                <StatusBadge status={applicant.status} size="sm" />
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-300">{applicant.studentEmail}</span>
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-300 font-extrabold text-sm flex items-center gap-2 self-start sm:self-auto">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span>{applicant.skillMatchPercentage}% Skill Match</span>
          </div>
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-violet-400" /> Department
            </span>
            <p className="text-xs font-semibold text-white">{applicant.department}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-emerald-400" /> Academic CGPA
            </span>
            <p className="text-xs font-semibold text-emerald-400">
              {applicant.cgpa.toFixed(2)} / 10.0
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-blue-400" /> Graduation Cohort
            </span>
            <p className="text-xs font-semibold text-white">Class of {applicant.graduationYear}</p>
          </div>
        </div>

        {/* Verified Student Skills & Proficiencies */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Student Skill Portfolio & Verified Proficiencies
          </h3>
          <div className="flex flex-wrap gap-2">
            {applicant.studentSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
              >
                <span>{skill.name}</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-violet-600/20 text-violet-300 border border-violet-500/30">
                  {skill.proficiency}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Job Match Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Matched Skills ({applicant.matchedSkills.length})
            </h4>
            <div className="space-y-1">
              {applicant.matchedSkills.length > 0 ? (
                applicant.matchedSkills.map((skill, idx) => (
                  <div key={idx} className="text-xs text-emerald-300 flex items-center gap-1.5">
                    <span>✓</span>
                    <span>{skill}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No skills met target proficiency</p>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> Identified Skill Gaps ({applicant.missingSkills.length})
            </h4>
            <div className="space-y-1">
              {applicant.missingSkills.length > 0 ? (
                applicant.missingSkills.map((gap, idx) => (
                  <div key={idx} className="text-xs text-amber-300 flex items-center gap-1.5">
                    <span>•</span>
                    <span>{gap}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-emerald-400 font-medium">
                  Zero skill gaps! Candidate fully meets or exceeds all criteria.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Candidate Cover / Notes & Resume */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
              <FileText className="h-4 w-4 text-violet-400" />
              <span>Resume File: {applicant.resumeFileName || 'Resume.pdf'}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="h-3.5 w-3.5" />}
              onClick={() => alert(`Downloading resume: ${applicant.resumeFileName || 'Resume.pdf'}`)}
              className="text-xs"
            >
              Download Resume
            </Button>
          </div>

          {applicant.notes && (
            <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                Applicant Statement:
              </span>
              <p className="italic">"{applicant.notes}"</p>
            </div>
          )}
        </div>

        {/* Recruiter Evaluation Notes & Fast Actions */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5 text-violet-400" /> Recruiter Evaluation Feedback
            </label>
            <textarea
              rows={2}
              value={recruiterNotes}
              onChange={(e) => setRecruiterNotes(e.target.value)}
              placeholder="Add optional notes, interview schedule details, or placement remarks..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
            <span className="text-[11px] text-slate-400">
              Applied on <strong className="text-slate-300">{appliedDate}</strong>
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction('reviewed')}
                disabled={isUpdating}
                className="text-xs"
              >
                Mark Reviewed
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAction('shortlisted')}
                disabled={isUpdating}
                className="text-xs bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50"
              >
                Shortlist Candidate
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAction('selected')}
                disabled={isUpdating}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Select / Offer
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleAction('rejected')}
                disabled={isUpdating}
                className="text-xs"
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ApplicantModal;
