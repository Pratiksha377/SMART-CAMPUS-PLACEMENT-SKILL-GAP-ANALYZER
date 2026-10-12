import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type?: ToastType;
  title?: React.ReactNode;
  message: React.ReactNode;
  duration?: number;
  onDismiss: (id: string) => void;
  className?: string;
}

const typeStyles: Record<
  ToastType,
  {
    icon: React.ComponentType<{ className?: string }>;
    container: string;
    iconColor: string;
    progressBar: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    container: 'border-emerald-500/30 bg-slate-900/95 text-emerald-200 shadow-emerald-950/40',
    iconColor: 'text-emerald-400',
    progressBar: 'bg-emerald-500',
  },
  error: {
    icon: AlertCircle,
    container: 'border-rose-500/30 bg-slate-900/95 text-rose-200 shadow-rose-950/40',
    iconColor: 'text-rose-400',
    progressBar: 'bg-rose-500',
  },
  warning: {
    icon: AlertTriangle,
    container: 'border-amber-500/30 bg-slate-900/95 text-amber-200 shadow-amber-950/40',
    iconColor: 'text-amber-400',
    progressBar: 'bg-amber-500',
  },
  info: {
    icon: Info,
    container: 'border-indigo-500/30 bg-slate-900/95 text-indigo-200 shadow-indigo-950/40',
    iconColor: 'text-indigo-400',
    progressBar: 'bg-indigo-500',
  },
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onDismiss,
  className = '',
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(duration);

  const config = typeStyles[type];
  const IconComponent = config.icon;

  useEffect(() => {
    if (duration <= 0 || isPaused) return;

    const startTime = Date.now();
    const timer = setTimeout(() => {
      onDismiss(id);
    }, remainingTime);

    return () => {
      clearTimeout(timer);
      const elapsed = Date.now() - startTime;
      setRemainingTime((prev) => Math.max(0, prev - elapsed));
    };
  }, [id, duration, isPaused, remainingTime, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid={`toast-${id}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`
        relative overflow-hidden flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-xl
        transition-all duration-300 w-full max-w-sm sm:max-w-md
        ${config.container}
        ${className}
      `}
    >
      <div className={`shrink-0 mt-0.5 ${config.iconColor}`}>
        <IconComponent className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0 pr-2">
        {title && (
          <h4 className="text-sm font-semibold text-slate-100 tracking-tight leading-snug">
            {title}
          </h4>
        )}
        <div className="text-xs text-slate-300 leading-relaxed break-words mt-0.5">
          {message}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="shrink-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 p-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/30"
      >
        <X className="w-4 h-4" />
      </button>

      {duration > 0 && (
        <div
          className={`absolute bottom-0 left-0 h-0.5 ${config.progressBar} opacity-60 transition-all`}
          style={{
            animation: `toast-progress ${duration}ms linear forwards`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      )}
    </div>
  );
};

export const ToastContainer: React.FC<{
  toasts: ToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}> = ({ toasts, position = 'top-right', className = '' }) => {
  const positionClasses: Record<string, string> = {
    'top-right': 'top-4 right-4 items-end',
    'top-left': 'top-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  };

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className={`fixed z-50 flex flex-col gap-2.5 pointer-events-none p-4 max-h-screen overflow-hidden ${positionClasses[position]} ${className}`}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
};

export default Toast;
