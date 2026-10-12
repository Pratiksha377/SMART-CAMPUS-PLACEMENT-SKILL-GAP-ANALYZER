import React, { useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export interface AssessmentTimerProps {
  timeRemainingSeconds: number;
  totalDurationSeconds: number;
  onTick: (newTime: number) => void;
  onTimeOut: () => void;
  isPaused?: boolean;
  className?: string;
}

export const AssessmentTimer: React.FC<AssessmentTimerProps> = ({
  timeRemainingSeconds,
  totalDurationSeconds,
  onTick,
  onTimeOut,
  isPaused = false,
  className = '',
}) => {
  useEffect(() => {
    if (isPaused || timeRemainingSeconds <= 0) return;

    const timer = setInterval(() => {
      if (timeRemainingSeconds <= 1) {
        clearInterval(timer);
        onTick(0);
        onTimeOut();
      } else {
        onTick(timeRemainingSeconds - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemainingSeconds, isPaused, onTick, onTimeOut]);

  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isLowTime = timeRemainingSeconds <= 300 && timeRemainingSeconds > 0; // Less than 5 mins
  const isCritical = timeRemainingSeconds <= 60 && timeRemainingSeconds > 0; // Less than 1 min

  const percentage = Math.max(
    0,
    Math.min(100, (timeRemainingSeconds / totalDurationSeconds) * 100)
  );

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining: ${formattedTime}`}
      className={`font-sans flex items-center gap-3 px-3.5 py-1.5 rounded-xl border transition-all ${
        isCritical
          ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
          : isLowTime
          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
          : 'bg-slate-900/80 border-slate-700/80 text-slate-200'
      } ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {isCritical ? (
          <AlertTriangle className="w-4 h-4 text-rose-400" />
        ) : (
          <Clock className={`w-4 h-4 ${isLowTime ? 'text-amber-400' : 'text-indigo-400'}`} />
        )}
        <span className="font-mono text-sm font-bold tracking-wider">
          {formattedTime}
        </span>
      </div>

      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
        <div
          className={`h-full transition-all duration-300 ${
            isCritical ? 'bg-rose-500' : isLowTime ? 'bg-amber-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default AssessmentTimer;
