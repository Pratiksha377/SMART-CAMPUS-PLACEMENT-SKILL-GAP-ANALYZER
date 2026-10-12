import React from 'react';
import { ApplicationTimelineEvent, ApplicationStatus } from '@/types/opportunity';
import { Check, Clock, AlertCircle } from 'lucide-react';

export interface ApplicationTimelineProps {
  timeline: ApplicationTimelineEvent[];
  currentStatus: ApplicationStatus;
  className?: string;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  timeline,
  currentStatus,
  className = '',
}) => {
  return (
    <div className={`space-y-4 font-sans ${className}`} data-testid="application-timeline">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.map((event, idx) => {
          const isLatest = idx === timeline.length - 1;
          const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div key={`${event.status}-${idx}`} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-slate-950 transition-colors ${
                  isLatest
                    ? event.status === 'rejected'
                      ? 'bg-rose-500 text-white'
                      : event.status === 'selected'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {isLatest ? (
                  <Check className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                )}
              </div>

              {/* Event Content */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-200 capitalize">
                    {event.status.replace('_', ' ')}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {formattedDate}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {event.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationTimeline;
