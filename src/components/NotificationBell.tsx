import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';

export interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismiss,
  } = useNotifications();

  return (
    <div className={`relative font-sans ${className}`} data-testid="notification-bell-container">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`View notifications, ${unreadCount} unread`}
        aria-expanded={isOpen}
        className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        <Bell className="h-4 w-4" />

        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-violet-600 border border-slate-950 text-white font-extrabold text-[10px] flex items-center justify-center shadow-lg shadow-violet-600/40 animate-pulse"
            data-testid="notification-unread-badge"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Embedded Dropdown Menu */}
      <NotificationDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDismiss={dismiss}
      />
    </div>
  );
};

export default NotificationBell;
