import React from 'react';
import { ApplicationStatus } from '@/types/opportunity';
import { Badge } from './ui/Badge';
import {
  Send,
  Eye,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';

export interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'applied':
        return {
          variant: 'primary' as const,
          label: 'Application Submitted',
          icon: <Send className="w-3 h-3" />,
        };
      case 'reviewed':
        return {
          variant: 'info' as const,
          label: 'Under Review',
          icon: <Eye className="w-3 h-3 text-sky-400" />,
        };
      case 'shortlisted':
        return {
          variant: 'warning' as const,
          label: 'Shortlisted for Interview',
          icon: <Award className="w-3 h-3 text-amber-400" />,
        };
      case 'selected':
        return {
          variant: 'success' as const,
          label: 'Selected / Offer Extended',
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
        };
      case 'rejected':
        return {
          variant: 'danger' as const,
          label: 'Not Selected',
          icon: <XCircle className="w-3 h-3 text-rose-400" />,
        };
      case 'withdrawn':
        return {
          variant: 'neutral' as const,
          label: 'Withdrawn',
          icon: <RotateCcw className="w-3 h-3 text-slate-400" />,
        };
    }
  };

  const { variant, label, icon } = getBadgeConfig();

  return (
    <Badge
      variant={variant}
      size={size}
      className={`inline-flex items-center gap-1.5 font-medium ${className}`}
      data-testid={`status-badge-${status}`}
    >
      {icon}
      <span>{label}</span>
    </Badge>
  );
};

export default StatusBadge;
