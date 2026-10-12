import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  NotificationPreferences,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from '@/types/notification';
import { notificationService } from '@/services/notificationService';
import { useAppDispatch } from '@/store';
import { setPreferences as setReduxPreferences } from '@/store/slices/notificationSlice';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Settings,
  Bell,
  Mail,
  Briefcase,
  FileCheck,
  BookOpen,
  Users,
  Save,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export const NotificationPreferencesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAuth();

  const userId = user?.id || 'std-user-01';

  const [prefs, setPrefs] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        const data = await notificationService.getPreferences(userId);
        setPrefs(data);
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    };
    loadPreferences();
  }, [userId]);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await notificationService.updatePreferences(userId, prefs);
      dispatch(setReduxPreferences(updated));
      toast.success(
        'Your notification delivery preferences have been updated.',
        'Preferences Saved'
      );
    } catch {
      toast.error('Failed to update notification preferences', 'Error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans animate-fadeIn"
      data-testid="notification-preferences-page"
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/notifications')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          className="text-xs"
        >
          Back to Notification Center
        </Button>
      </div>

      <Card className="glass-card shadow-2xl border-slate-800">
        <CardHeader className="border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                Notification Delivery Preferences
              </CardTitle>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Configure which events trigger notifications in your portal and inbox. (Enforces Property 20)
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Preference 1: Opportunity Matches */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-violet-600/15 text-violet-400 shrink-0 mt-0.5">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <label
                    htmlFor="pref-opportunity-matches"
                    className="text-sm font-bold text-white cursor-pointer"
                  >
                    Job Opportunity Match Alerts
                  </label>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Trigger real-time alerts when newly published requisitions match your verified skills and campus department profile.
                  </p>
                </div>
              </div>

              <input
                id="pref-opportunity-matches"
                type="checkbox"
                checked={prefs.opportunityMatches}
                onChange={() => handleToggle('opportunityMatches')}
                className="mt-1 h-5 w-5 rounded bg-slate-900 border-slate-800 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>

            {/* Preference 2: Application Status Updates */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-600/15 text-emerald-400 shrink-0 mt-0.5">
                  <FileCheck className="h-4 w-4" />
                </div>
                <div>
                  <label
                    htmlFor="pref-status-updates"
                    className="text-sm font-bold text-white cursor-pointer"
                  >
                    Application Status Milestones
                  </label>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Receive instant notifications whenever your application transitions to Reviewed, Shortlisted, Selected, or Rejected.
                  </p>
                </div>
              </div>

              <input
                id="pref-status-updates"
                type="checkbox"
                checked={prefs.applicationStatusUpdates}
                onChange={() => handleToggle('applicationStatusUpdates')}
                className="mt-1 h-5 w-5 rounded bg-slate-900 border-slate-800 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>

            {/* Preference 3: Assessment Reminders */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-600/15 text-amber-400 shrink-0 mt-0.5">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <label
                    htmlFor="pref-assessments"
                    className="text-sm font-bold text-white cursor-pointer"
                  >
                    Adaptive Skill Assessment Reminders
                  </label>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Reminders for pending adaptive test certifications required to satisfy university placement eligibility benchmarks.
                  </p>
                </div>
              </div>

              <input
                id="pref-assessments"
                type="checkbox"
                checked={prefs.assessmentReminders}
                onChange={() => handleToggle('assessmentReminders')}
                className="mt-1 h-5 w-5 rounded bg-slate-900 border-slate-800 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>

            {/* Preference 4: Recruiter Messages & Alerts */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-600/15 text-blue-400 shrink-0 mt-0.5">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <label
                    htmlFor="pref-recruiter"
                    className="text-sm font-bold text-white cursor-pointer"
                  >
                    Recruiter Profile Inquiries
                  </label>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Alerts when campus placement recruiters view your profile, request updated transcripts, or release interview invites.
                  </p>
                </div>
              </div>

              <input
                id="pref-recruiter"
                type="checkbox"
                checked={prefs.recruiterMessages}
                onChange={() => handleToggle('recruiterMessages')}
                className="mt-1 h-5 w-5 rounded bg-slate-900 border-slate-800 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>

            {/* Preference 5: Email Digest */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-600/15 text-indigo-400 shrink-0 mt-0.5">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <label
                    htmlFor="pref-email"
                    className="text-sm font-bold text-white cursor-pointer"
                  >
                    Institutional Email Digests
                  </label>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Send daily summary summaries and high-priority placement updates to your registered campus email address.
                  </p>
                </div>
              </div>

              <input
                id="pref-email"
                type="checkbox"
                checked={prefs.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                className="mt-1 h-5 w-5 rounded bg-slate-900 border-slate-800 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => navigate('/notifications')}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                leftIcon={<Save className="h-4 w-4" />}
              >
                Save Preferences
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPreferencesPage;
