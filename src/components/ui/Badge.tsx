import React from 'react';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  outline?: boolean;
  children: React.ReactNode;
}

const variantSolidStyles: Record<BadgeVariant, { badge: string; dot: string }> = {
  primary: {
    badge: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    dot: 'bg-indigo-400',
  },
  secondary: {
    badge: 'bg-slate-800 text-slate-300 border border-slate-700',
    dot: 'bg-slate-400',
  },
  success: {
    badge: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  warning: {
    badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    dot: 'bg-amber-400',
  },
  danger: {
    badge: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    dot: 'bg-rose-400',
  },
  info: {
    badge: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    dot: 'bg-sky-400',
  },
  neutral: {
    badge: 'bg-slate-700/30 text-slate-400 border border-slate-700/50',
    dot: 'bg-slate-400',
  },
};

const variantOutlineStyles: Record<BadgeVariant, { badge: string; dot: string }> = {
  primary: {
    badge: 'bg-transparent text-indigo-400 border border-indigo-500/60',
    dot: 'bg-indigo-400',
  },
  secondary: {
    badge: 'bg-transparent text-slate-300 border border-slate-600',
    dot: 'bg-slate-400',
  },
  success: {
    badge: 'bg-transparent text-emerald-400 border border-emerald-500/60',
    dot: 'bg-emerald-400',
  },
  warning: {
    badge: 'bg-transparent text-amber-400 border border-amber-500/60',
    dot: 'bg-amber-400',
  },
  danger: {
    badge: 'bg-transparent text-rose-400 border border-rose-500/60',
    dot: 'bg-rose-400',
  },
  info: {
    badge: 'bg-transparent text-sky-400 border border-sky-500/60',
    dot: 'bg-sky-400',
  },
  neutral: {
    badge: 'bg-transparent text-slate-400 border border-slate-600',
    dot: 'bg-slate-400',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-2 py-0.5 rounded-full font-medium',
  md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  lg: 'text-sm px-3 py-1.5 rounded-full font-medium',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  dot = false,
  outline = false,
  children,
  className = '',
  ...props
}) => {
  const styles = outline ? variantOutlineStyles[variant] : variantSolidStyles[variant];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-sans leading-none tracking-wide select-none
        ${styles.badge}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot} animate-pulse`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
