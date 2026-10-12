import React, { useState } from 'react';
import { Application } from '@/types/opportunity';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { StatusBadge } from './StatusBadge';
import { ApplicationTimeline } from './ApplicationTimeline';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import {
  Calendar,
  Building,
  MapPin,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  FileText,
} from 'lucide-react';

export interface ApplicationCardProps {
  application: Application;
  onRequestWithdraw: (application: Application) => void;
  className?: string;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onRequestWithdraw,
  className = '',
}) => {
  const [showTimeline, setShowTimeline] = useState(false);

  const appliedDate = new Date(application.appliedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const canWithdraw =
    application.status !== 'withdrawn' &&
    application.status !== 'rejected' &&
    application.status !== 'selected';

  return (
    <Card
      variant="glass"
      padding="md"
      className={`font-sans space-y-4 transition-all duration-200 hover:border-indigo-500/30 ${className}`}
      data-testid={`application-card-${application.id}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              {application.company}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">{application.type}</span>
            <Badge variant="success" size="sm" dot>
              {application.skillMatchPercentage}% Match
            </Badge>
          </div>

          <CardTitle className="text-base font-bold text-slate-100 mt-1">
            {application.opportunityTitle}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {application.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Applied: {appliedDate}
            </span>
            {application.resumeFileName && (
              <span className="flex items-center gap-1 text-slate-400">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                {application.resumeFileName}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 self-start sm:self-center">
          <StatusBadge status={application.status} size="md" />
        </div>
      </div>

      {application.notes && (
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-300">
          <span className="text-slate-400 font-medium">Candidate Note: </span>
          {application.notes}
        </div>
      )}

      {/* Action Row */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTimeline(!showTimeline)}
          rightIcon={
            showTimeline ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )
          }
        >
          {showTimeline ? 'Hide History Timeline' : 'View History Timeline'}
        </Button>

        {canWithdraw && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRequestWithdraw(application)}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Withdraw Application
          </Button>
        )}
      </div>

      {/* Expanded Progression Timeline (FE9.7) */}
      {showTimeline && (
        <div className="pt-4 border-t border-slate-800 animate-fadeIn">
          <h4 className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-3">
            Application Milestone History
          </h4>
          <ApplicationTimeline
            timeline={application.timeline}
            currentStatus={application.status}
          />
        </div>
      )}
    </Card>
  );
};

export default ApplicationCard;
