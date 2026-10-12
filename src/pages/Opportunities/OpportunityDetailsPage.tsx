import React from 'react';
import { JobOpportunity } from '@/types/opportunity';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Share2,
} from 'lucide-react';

export interface OpportunityDetailsPageProps {
  opportunity: JobOpportunity;
  isApplied?: boolean;
  onBack: () => void;
  onApply: (opportunity: JobOpportunity) => void;
  className?: string;
}

export const OpportunityDetailsPage: React.FC<OpportunityDetailsPageProps> = ({
  opportunity,
  isApplied = false,
  onBack,
  onApply,
  className = '',
}) => {
  const deadlineDate = new Date(opportunity.deadline).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const postedDate = new Date(opportunity.postedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`space-y-6 font-sans max-w-4xl mx-auto animate-fadeIn ${className}`}
      data-testid="opportunity-details-page"
    >
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Placement Opportunities
        </Button>
      </div>

      {/* Hero Header Card */}
      <Card variant="glass" padding="lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {opportunity.company}
              </span>
              <span className="text-slate-600">•</span>
              <Badge variant="neutral" size="sm">{opportunity.type}</Badge>
              {opportunity.workplaceType && (
                <Badge variant="neutral" outline size="sm">{opportunity.workplaceType}</Badge>
              )}
              {opportunity.matchScore && (
                <Badge variant="success" size="sm" dot>
                  {opportunity.matchScore}% Skill Match
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              {opportunity.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {opportunity.location}
              </span>
              {opportunity.salaryRange && (
                <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  {opportunity.salaryRange}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Posted: {postedDate}
              </span>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            {isApplied ? (
              <Badge variant="success" size="lg">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Application Submitted
              </Badge>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => onApply(opportunity)}
              >
                Apply for Position
              </Button>
            )}
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 pt-6 text-xs text-slate-300 leading-relaxed">
          {/* Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider text-[11px] text-indigo-400">
              Role Overview
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {opportunity.description}
            </p>
          </div>

          {/* Required Skills (Property 10) */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider text-[11px] text-indigo-400">
              Required Core Skills & Competencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {opportunity.requiredSkills.map((skill) => (
                <Tag key={skill} label={skill} variant="primary" size="md" />
              ))}
            </div>
          </div>

          {/* Key Responsibilities */}
          {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider text-[11px] text-indigo-400">
                Key Responsibilities
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {opportunity.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Hiring Requirements */}
          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider text-[11px] text-indigo-400">
                Candidate Qualifications & Requirements
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {opportunity.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Important Deadline Box */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-between gap-4">
            <div>
              <span className="font-semibold block text-xs">Application Deadline:</span>
              <span className="text-[11px] text-amber-200">{deadlineDate}</span>
            </div>

            {!isApplied && (
              <Button variant="secondary" size="sm" onClick={() => onApply(opportunity)}>
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OpportunityDetailsPage;
