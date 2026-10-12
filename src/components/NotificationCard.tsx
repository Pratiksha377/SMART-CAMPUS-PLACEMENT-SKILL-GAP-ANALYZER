import React from 'react';
import { Link } from 'react-router-dom';
import { Notification, NotificationType } from '@/types/notification';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Briefcase,
  FileCheck,
  BookOpen,
  Users,
  Bell,
  Check,
  Trash2,
  Clock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  compact?: boolean;
  className?: string;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onDismiss,
  compact = false,
  className = '',
}) => {
  const getTypeConfig = (type: NotificationType) => {
    switch (type) {
      case 'opportunity_match':
        return {
          icon: Sparkles,
          color: 'text-violet-400',
          bg: 'bg-violet-600/15 border-violet-500/25',
          label: 'Opportunity Match',
        };
      case 'status_update':
        return {
          icon: FileCheck,
          color: 'text-emerald-400',
          bg: 'bg-emerald-600/15 border-emerald-500/25',
          label: 'Application Update',
        };
      case 'assessment_reminder':
        return {
          icon: BookOpen,
          color: 'text-amber-400',
          bg: 'bg-amber-600/15 border-amber-500/25',
          label: 'Assessment',
        };
      case 'recruiter_alert':
        return {
          icon: Users,
          color: 'text-blue-400',
          bg: 'bg-blue-600/15 border-blue-500/25',
          label: 'Recruiter Alert',
        };
      default:
        return {
          icon: Bell,
          color: 'text-indigo-400',
          bg: 'bg-indigo-600/15 border-indigo-500/25',
          label: 'System Notice',
        };
    }
  };

  const config = getTypeConfig(notification.type);
  const Icon = config.icon;

  const timeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formattedTime = timeAgo(notification.createdAt);

  return (
    <Card
      className={`glass-card transition-all duration-200 relative overflow-hidden group font-sans ${
        !notification.read
          ? 'border-violet-500/30 bg-slate-900/90 shadow-md shadow-violet-500/5'
          : 'border-slate-800/80 bg-slate-950/60 opacity-85'
      } ${compact ? 'p-3' : 'p-4 sm:p-5'} ${className}`}
      data-testid={`notification-card-${notification.id}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Type Icon */}
        <div
          className={`rounded-xl border p-2 shrink-0 ${config.bg} ${config.color}`}
        >
          <Icon className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <h4
                className={`text-xs sm:text-sm font-bold truncate ${
                  !notification.read ? 'text-white' : 'text-slate-300'
                }`}
              >
                {notification.title}
              </h4>
              {!notification.read && (
                <span
                  className="h-2 w-2 rounded-full bg-violet-400 ring-2 ring-violet-400/20 shrink-0"
                  title="Unread"
                  data-testid="unread-indicator"
                />
              )}
            </div>

            <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
              <Clock className="h-3 w-3" />
              {formattedTime}
            </span>
          </div>

          <p
            className={`text-xs text-slate-400 leading-relaxed ${
              compact ? 'line-clamp-2' : ''
            }`}
          >
            {notification.message}
          </p>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                {config.label}
              </span>

              {notification.link && (
                <Link
                  to={notification.link}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <span>View Details</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>

            {/* Quick Actions: Mark as Read & Dismiss */}
            <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.read && onMarkAsRead && (
                <button
                  type="button"
                  onClick={() => onMarkAsRead(notification.id)}
                  aria-label="Mark notification as read"
                  className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span>Mark read</span>
                </button>
              )}

              {onDismiss && (
                <button
                  type="button"
                  onClick={() => onDismiss(notification.id)}
                  aria-label="Dismiss notification"
                  className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationCard;
