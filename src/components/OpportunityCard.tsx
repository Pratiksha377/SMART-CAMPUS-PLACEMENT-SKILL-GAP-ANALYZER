import React from 'react';
import { JobOpportunity } from '@/types/opportunity';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Tag } from './ui/Tag';
import { Button } from './ui/Button';
import {
  MapPin,
  Briefcase,
  Calendar,
  Sparkles,
  DollarSign,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export interface OpportunityCardProps {
  opportunity: JobOpportunity;
  isApplied?: boolean;
  onViewDetails: (opportunity: JobOpportunity) => void;
  onApply: (opportunity: JobOpportunity) => void;
  className?: string;
  variant?: 'grid' | 'list';
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  isApplied = false,
  onViewDetails,
  onApply,
  className = '',
  variant = 'grid',
}) => {
  const deadlineDate = new Date(opportunity.deadline).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getMatchScoreBadge = () => {
    const score = opportunity.matchScore || 70;
    const variantType = score >= 85 ? 'success' : score >= 70 ? 'primary' : 'warning';
    return (
      <Badge variant={variantType} size="sm" dot>
        {score}% Match
      </Badge>
    );
  };

  if (variant === 'list') {
    return (
      <Card
        variant="glass"
        padding="md"
        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:border-indigo-500/40 hover:-translate-y-0.5 ${className}`}
        data-testid={`opportunity-card-${opportunity.id}`}
      >
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              {opportunity.company}
            </span>
            <span className="text-slate-600">•</span>
            <Badge variant="neutral" size="sm">{opportunity.type}</Badge>
            {opportunity.workplaceType && (
              <Badge variant="neutral" outline size="sm">{opportunity.workplaceType}</Badge>
            )}
            {getMatchScoreBadge()}
          </div>

          <CardTitle className="text-base font-bold text-slate-100 hover:text-indigo-300 transition-colors cursor-pointer" onClick={() => onViewDetails(opportunity)}>
            {opportunity.title}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {opportunity.location}
            </span>
            {opportunity.salaryRange && (
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                {opportunity.salaryRange}
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Deadline: {deadlineDate}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {opportunity.requiredSkills.slice(0, 4).map((skill) => (
              <Tag key={skill} label={skill} variant="default" size="sm" />
            ))}
            {opportunity.requiredSkills.length > 4 && (
              <span className="text-[11px] text-slate-500 self-center">
                +{opportunity.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(opportunity)}
          >
            Details
          </Button>

          {isApplied ? (
            <Badge variant="success" size="md">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Applied
            </Badge>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onApply(opportunity)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Apply
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // Grid variant
  return (
    <Card
      variant="glass"
      padding="md"
      className={`flex flex-col justify-between transition-all duration-200 hover:border-indigo-500/40 hover:-translate-y-1 ${className}`}
      data-testid={`opportunity-card-${opportunity.id}`}
    >
      <div>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              {opportunity.company}
            </span>
            {getMatchScoreBadge()}
          </div>

          <CardTitle
            className="text-base font-bold text-slate-100 hover:text-indigo-300 transition-colors cursor-pointer mt-1 line-clamp-1"
            onClick={() => onViewDetails(opportunity)}
          >
            {opportunity.title}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="neutral" size="sm">{opportunity.type}</Badge>
            {opportunity.workplaceType && (
              <Badge variant="neutral" outline size="sm">{opportunity.workplaceType}</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          <p className="text-xs text-slate-400 line-clamp-2">
            {opportunity.description}
          </p>

          <div className="space-y-1.5 py-2.5 border-y border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {opportunity.location}
              </span>
              {opportunity.salaryRange && (
                <span className="text-slate-300 font-mono font-medium">
                  {opportunity.salaryRange}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-amber-500/80" />
              Deadline: <span className="text-slate-400">{deadlineDate}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {opportunity.requiredSkills.slice(0, 3).map((skill) => (
              <Tag key={skill} label={skill} variant="default" size="sm" />
            ))}
            {opportunity.requiredSkills.length > 3 && (
              <span className="text-[10px] text-slate-500 self-center">
                +{opportunity.requiredSkills.length - 3} more
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-4 border-t-0 flex items-center justify-between gap-2 mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(opportunity)}
        >
          View Details
        </Button>

        {isApplied ? (
          <Badge variant="success" size="md">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Applied
          </Badge>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onApply(opportunity)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Apply Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OpportunityCard;
