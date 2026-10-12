import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Notification } from '@/types/notification';
import { NotificationCard } from './NotificationCard';
import { Button } from '@/components/ui/Button';
import { Bell, CheckCheck, Settings, ExternalLink, Sparkles } from 'lucide-react';

export interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  className?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  className = '',
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const previewNotifications = notifications.slice(0, 5);

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl glass-card border border-slate-700/80 shadow-2xl p-0 z-50 animate-fadeIn backdrop-blur-2xl overflow-hidden font-sans ${className}`}
      data-testid="notification-dropdown"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-600/20 text-violet-400">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Notifications</h3>
            <p className="text-[10px] text-slate-400">
              {unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up'}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto p-2 space-y-1.5 divide-y divide-slate-800/40">
        {previewNotifications.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <Bell className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No notifications yet.</p>
          </div>
        ) : (
          previewNotifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              compact={true}
              onMarkAsRead={onMarkAsRead}
              onDismiss={onDismiss}
            />
          ))
        )}
      </div>

      {/* Dropdown Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/70 flex items-center justify-between text-xs">
        <Link
          to="/notifications"
          onClick={onClose}
          className="font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
        >
          <span>View Notification Center</span>
          <ExternalLink className="h-3 w-3" />
        </Link>

        <Link
          to="/settings/notifications"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          title="Notification Preferences"
          aria-label="Notification Preferences"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
