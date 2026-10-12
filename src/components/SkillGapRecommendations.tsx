import React, { useState } from 'react';
import { Recommendation } from '@/types/skillGap';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { SkillPriorityIndicator } from './SkillPriorityIndicator';
import { LearningResources } from './LearningResources';
import { ChevronDown, ChevronUp, Sparkles, Clock, Target } from 'lucide-react';
import { Button } from './ui/Button';

export interface SkillGapRecommendationsProps {
  recommendations: Recommendation[];
  className?: string;
}

export const SkillGapRecommendations: React.FC<SkillGapRecommendationsProps> = ({
  recommendations,
  className = '',
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    recommendations[0]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (recommendations.length === 0) {
    return (
      <Card variant="glass" padding="md" className="text-center py-8">
        <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-200">Outstanding Mastery!</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          All skills currently meet or exceed the required industry benchmarks for your selected target role.
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 font-sans ${className}`} data-testid="skill-gap-recommendations">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Prioritized Action Recommendations ({recommendations.length})
        </h3>
        <span className="text-xs text-slate-400">
          Ranked by deficit impact
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => {
          const isExpanded = expandedId === rec.id;
          const gap = rec.targetScore - rec.currentScore;

          return (
            <Card
              key={rec.id}
              variant="default"
              padding="md"
              className={`transition-all duration-200 border-l-4 ${
                rec.priority === 'high'
                  ? 'border-l-rose-500 hover:border-l-rose-400'
                  : rec.priority === 'medium'
                  ? 'border-l-amber-500 hover:border-l-amber-400'
                  : 'border-l-emerald-500 hover:border-l-emerald-400'
              }`}
              data-testid={`recommendation-card-${rec.id}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h4 className="text-sm font-bold text-slate-100">{rec.skill}</h4>
                    <SkillPriorityIndicator priority={rec.priority} gap={gap} size="sm" />
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                    {rec.actionableAdvice}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Target className="w-3.5 h-3.5 text-indigo-400" />
                      {rec.currentScore}% → <strong>{rec.targetScore}%</strong>
                    </span>

                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {rec.estimatedTimeToClose}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(rec.id)}
                    aria-label={`Toggle learning resources for ${rec.skill}`}
                    rightIcon={isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  >
                    {isExpanded ? 'Hide Resources' : 'View Resources'}
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 animate-fadeIn">
                  <h5 className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                    Curated Mitigation Resources:
                  </h5>
                  <LearningResources resources={rec.resources} />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SkillGapRecommendations;
