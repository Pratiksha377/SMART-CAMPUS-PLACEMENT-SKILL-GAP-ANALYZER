import React from 'react';
import { LearningResource } from '@/types/skillGap';
import { ExternalLink, Clock, BookOpen, Code, PlayCircle, FileText } from 'lucide-react';
import { Badge } from './ui/Badge';

export interface LearningResourcesProps {
  resources: LearningResource[];
  className?: string;
}

export const LearningResources: React.FC<LearningResourcesProps> = ({
  resources,
  className = '',
}) => {
  const getTypeIcon = (type: LearningResource['type']) => {
    switch (type) {
      case 'Course':
        return <BookOpen className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Practice':
        return <Code className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Video':
        return <PlayCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 'Documentation':
      default:
        return <FileText className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  const getDifficultyBadge = (difficulty: LearningResource['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return <Badge variant="success" size="sm">{difficulty}</Badge>;
      case 'Intermediate':
        return <Badge variant="primary" size="sm">{difficulty}</Badge>;
      case 'Advanced':
        return <Badge variant="warning" size="sm">{difficulty}</Badge>;
    }
  };

  if (resources.length === 0) {
    return (
      <div className="text-xs text-slate-500 italic py-2">
        No curated resources listed for this topic.
      </div>
    );
  }

  return (
    <div className={`space-y-2 font-sans ${className}`} data-testid="learning-resources-list">
      {resources.map((res) => (
        <a
          key={res.id}
          href={res.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/50 transition-all duration-150 group"
        >
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
              {getTypeIcon(res.type)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  {res.title}
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                </h4>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <span>{res.provider}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  ~{res.estimatedHours} hrs
                </span>
                <span>•</span>
                <span>{res.type}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            {getDifficultyBadge(res.difficulty)}
          </div>
        </a>
      ))}
    </div>
  );
};

export default LearningResources;
