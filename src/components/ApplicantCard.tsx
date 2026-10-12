import React from 'react';
import { ApplicantCandidate } from '@/types/recruiter';
import { ApplicationStatus } from '@/types/opportunity';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from './StatusBadge';
import {
  GraduationCap,
  Calendar,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export interface ApplicantCardProps {
  applicant: ApplicantCandidate;
  onViewProfile: (applicant: ApplicantCandidate) => void;
  onStatusChange?: (applicantId: string, status: ApplicationStatus) => void;
  className?: string;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({
  applicant,
  onViewProfile,
  onStatusChange,
  className = '',
}) => {
  const matchColor =
    applicant.skillMatchPercentage >= 80
      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
      : applicant.skillMatchPercentage >= 60
      ? 'text-blue-400 border-blue-500/30 bg-blue-500/10'
      : 'text-amber-400 border-amber-500/30 bg-amber-500/10';

  const appliedDate = new Date(applicant.appliedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card
      className={`glass-card hover:border-violet-500/40 transition-all duration-300 relative overflow-hidden group ${className}`}
      data-testid={`applicant-card-${applicant.id}`}
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Header: Student Info, Status, Match Score */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-violet-600/20 shrink-0">
              {applicant.studentName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                  {applicant.studentName}
                </h3>
                <StatusBadge status={applicant.status} size="sm" />
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1 text-slate-300">
                  <GraduationCap className="h-3.5 w-3.5 text-violet-400" />
                  {applicant.department}
                </span>
                <span>•</span>
                <span>Graduating {applicant.graduationYear}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Award className="h-3 w-3" /> CGPA: {applicant.cgpa.toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          {/* Skill Match % Pill (FE10.9) */}
          <div
            className={`px-3 py-1.5 rounded-2xl border font-bold text-xs flex items-center gap-1.5 ${matchColor}`}
            data-testid={`match-score-${applicant.id}`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{applicant.skillMatchPercentage}% Match</span>
          </div>
        </div>

        {/* Skill Match Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Matched Skills */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Matched Skills ({applicant.matchedSkills.length})
            </span>
            <div className="flex flex-wrap gap-1">
              {applicant.matchedSkills.length > 0 ? (
                applicant.matchedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-500 italic">No skills met threshold</span>
              )}
            </div>
          </div>

          {/* Missing / Gap Skills */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Skill Gaps ({applicant.missingSkills.length})
            </span>
            <div className="flex flex-wrap gap-1">
              {applicant.missingSkills.length > 0 ? (
                applicant.missingSkills.map((gap, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300"
                  >
                    {gap}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-emerald-400 font-medium">
                  Zero skill gaps! Meets all criteria.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Date, Resume info, Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1 text-[11px]">
              <Calendar className="h-3 w-3" /> Applied {appliedDate}
            </span>
            {applicant.resumeFileName && (
              <span className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                <FileText className="h-3 w-3 text-violet-400" />
                {applicant.resumeFileName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Quick Status Action Dropdown */}
            {onStatusChange && (
              <select
                aria-label={`Change status for ${applicant.studentName}`}
                value={applicant.status}
                onChange={(e) =>
                  onStatusChange(applicant.applicationId, e.target.value as ApplicationStatus)
                }
                className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-white font-medium focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
              >
                <option value="applied">Applied</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(applicant)}
              leftIcon={<User className="h-3.5 w-3.5 text-violet-400" />}
              className="text-xs"
            >
              View Full Profile
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ApplicantCard;
