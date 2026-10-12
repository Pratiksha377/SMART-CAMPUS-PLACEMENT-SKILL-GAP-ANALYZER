import React from 'react';
import { SkillPriority } from '@/types/skillGap';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface SkillPriorityIndicatorProps {
  priority: SkillPriority;
  gap?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const SkillPriorityIndicator: React.FC<SkillPriorityIndicatorProps> = ({
  priority,
  gap,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const getStyles = () => {
    switch (priority) {
      case 'high':
        return {
          container: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400',
          icon: <AlertCircle className={size === 'sm' ? 'w-3 h-3 text-rose-400' : 'w-3.5 h-3.5 text-rose-400'} />,
          label: 'High Priority Gap',
        };
      case 'medium':
        return {
          container: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
          icon: <AlertTriangle className={size === 'sm' ? 'w-3 h-3 text-amber-400' : 'w-3.5 h-3.5 text-amber-400'} />,
          label: 'Medium Priority Gap',
        };
      case 'low':
      default:
        return {
          container: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
          icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3 text-emerald-400' : 'w-3.5 h-3.5 text-emerald-400'} />,
          label: gap && gap > 0 ? 'Low Priority Gap' : 'Target Met',
        };
    }
  };

  const { container, dot, icon, label } = getStyles();
  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border select-none ${container} ${paddingClass} ${className}`}
      data-testid={`priority-indicator-${priority}`}
    >
      {showIcon ? (
        icon
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
      )}
      <span>{label}</span>
      {typeof gap === 'number' && gap > 0 && (
        <span className="font-mono font-bold opacity-80">(-{gap}%)</span>
      )}
    </span>
  );
};

export default SkillPriorityIndicator;
