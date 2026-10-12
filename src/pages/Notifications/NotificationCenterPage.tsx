import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NotificationType, NotificationFilterType } from '@/types/notification';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationCard } from '@/components/NotificationCard';
import { Button } from '@/components/ui/Button';
import {
  Bell,
  CheckCheck,
  Trash2,
  Settings,
  Search,
  Filter,
  Sparkles,
  Inbox,
  ArrowRight,
} from 'lucide-react';

export const NotificationCenterPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismiss,
    isLoading,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<NotificationFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirmingClearAll, setIsConfirmingClearAll] = useState(false);

  // Filter and search logic
  const filteredNotifications = notifications.filter((item) => {
    // Tab filter (FE12.8)
    if (activeFilter === 'unread' && item.read) return false;
    if (
      activeFilter !== 'all' &&
      activeFilter !== 'unread' &&
      item.type !== activeFilter
    ) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchMsg = item.message.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg) return false;
    }

    return true;
  });

  const filterTabs: { id: NotificationFilterType; label: string; count?: number }[] = [
    { id: 'all', label: 'All Updates', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    {
      id: 'opportunity_match',
      label: 'Opportunities',
      count: notifications.filter((n) => n.type === 'opportunity_match').length,
    },
    {
      id: 'status_update',
      label: 'Applications',
      count: notifications.filter((n) => n.type === 'status_update').length,
    },
    {
      id: 'assessment_reminder',
      label: 'Assessments',
      count: notifications.filter((n) => n.type === 'assessment_reminder').length,
    },
    {
      id: 'recruiter_alert',
      label: 'Recruiter Desk',
      count: notifications.filter((n) => n.type === 'recruiter_alert').length,
    },
  ];

  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans"
      data-testid="notification-center-page"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <Bell className="h-6 w-6" />
            </span>
            Campus Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stay up to date with new job opportunity matches, application progress, and placement drives.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          <Link
            to="/settings/notifications"
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span>Preferences</span>
          </Link>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              leftIcon={<CheckCheck className="h-4 w-4 text-emerald-400" />}
              className="text-xs"
            >
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar Controls (FE12.8) */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications by keyword, company, or message..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <span className="text-xs text-slate-400 px-2">
            Showing <strong className="text-white">{filteredNotifications.length}</strong> updates
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-800/80 pt-3">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeFilter === tab.id
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeFilter === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div
          className="glass-card rounded-3xl p-12 text-center border border-slate-800 space-y-4"
          data-testid="no-notifications-state"
        >
          <div className="h-16 w-16 mx-auto rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Notifications to Display</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {searchQuery || activeFilter !== 'all'
              ? 'No notifications match your current filter and search query. Try switching tabs or resetting keywords.'
              : 'You are all caught up! New placement opportunities, assessment reminders, and application stage updates will appear here.'}
          </p>
          {(searchQuery || activeFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3" data-testid="notifications-list">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDismiss={dismiss}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenterPage;
