import React, { useState } from 'react';
import { JobOpportunity, OpportunityStatus } from '@/types/opportunity';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Edit3,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export interface PostingCardProps {
  posting: JobOpportunity;
  onEdit?: (posting: JobOpportunity) => void;
  onDelete?: (postingId: string) => void;
  onStatusChange?: (postingId: string, status: OpportunityStatus) => void;
  onViewApplicants?: (postingId: string) => void;
  className?: string;
}

export const PostingCard: React.FC<PostingCardProps> = ({
  posting,
  onEdit,
  onDelete,
  onStatusChange,
  onViewApplicants,
  className = '',
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const deadlineFormatted = new Date(posting.deadline).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getStatusBadge = (status: OpportunityStatus) => {
    switch (status) {
      case 'open':
        return (
          <Badge variant="success" size="sm" className="font-semibold gap-1">
            <CheckCircle2 className="h-3 w-3" /> Open for Applications
          </Badge>
        );
      case 'filled':
        return (
          <Badge variant="primary" size="sm" className="font-semibold gap-1">
            <Sparkles className="h-3 w-3" /> Position Filled
          </Badge>
        );
      case 'closed':
        return (
          <Badge variant="neutral" size="sm" className="font-semibold gap-1">
            <XCircle className="h-3 w-3" /> Applications Closed
          </Badge>
        );
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const applicantCount = posting.applicants?.length || 0;

  return (
    <Card
      className={`glass-card hover:border-violet-500/40 transition-all duration-300 relative overflow-hidden group ${className}`}
      data-testid={`posting-card-${posting.id}`}
    >
      <div className="p-5 sm:p-6 space-y-5">
        {/* Top Header: Title, Status and Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(posting.status)}
              <span className="text-[11px] text-slate-400 font-medium">
                Type: <span className="text-slate-200">{posting.type}</span>
              </span>
              {posting.workplaceType && (
                <span className="text-[11px] text-slate-400 font-medium">
                  • <span className="text-slate-200">{posting.workplaceType}</span>
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
              {posting.title}
            </h3>

            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-violet-400" />
              <span className="font-semibold text-slate-300">{posting.company}</span>
              <span>•</span>
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{posting.location}</span>
            </p>
          </div>

          {/* Status Switcher Dropdown (FE10.7) */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <label className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Status:
            </label>
            <select
              aria-label="Change posting status"
              value={posting.status}
              onChange={(e) =>
                onStatusChange?.(posting.id, e.target.value as OpportunityStatus)
              }
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="filled">Filled</option>
            </select>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {posting.description}
        </p>

        {/* Skill Requirements list */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Target Skill Criteria:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {posting.detailedSkills && posting.detailedSkills.length > 0 ? (
              posting.detailedSkills.map((req, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300"
                >
                  <span className="font-medium">{req.skill}</span>
                  <span className="text-[9px] uppercase font-bold text-violet-400 px-1 py-0.2 rounded bg-violet-500/10 border border-violet-500/20">
                    {req.level}
                  </span>
                </span>
              ))
            ) : posting.requiredSkills && posting.requiredSkills.length > 0 ? (
              posting.requiredSkills.map((skill, idx) => (
                <Tag key={idx} label={skill} variant="default" size="sm" />
              ))
            ) : (
              <span className="text-[11px] text-slate-500 italic">No specific skills specified</span>
            )}
          </div>
        </div>

        {/* Key Metrics and Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Deadline: <strong className="text-slate-300">{deadlineFormatted}</strong>
            </span>
            {posting.salaryRange && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-slate-300">{posting.salaryRange}</span>
              </span>
            )}
          </div>

          {/* Action Buttons: View Applicants, Edit, Delete */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onViewApplicants && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewApplicants(posting.id)}
                leftIcon={<Users className="h-3.5 w-3.5 text-violet-400" />}
                className="hover:border-violet-500/50"
              >
                <span>Applicants</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-violet-600/30 text-violet-300 text-[10px] font-bold">
                  {applicantCount}
                </span>
              </Button>
            )}

            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(posting)}
                leftIcon={<Edit3 className="h-3.5 w-3.5 text-slate-400" />}
                className="text-slate-300 hover:text-white"
                aria-label="Edit posting"
              >
                Edit
              </Button>
            )}

            {onDelete && (
              <>
                {isConfirmingDelete ? (
                  <div className="flex items-center gap-1 bg-red-950/40 p-1 rounded-xl border border-red-500/30">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(posting.id)}
                      className="px-2 py-1 text-xs"
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsConfirmingDelete(false)}
                      className="px-2 py-1 text-xs text-slate-400"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="text-slate-500 hover:text-red-400 p-2"
                    aria-label="Delete posting"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostingCard;
