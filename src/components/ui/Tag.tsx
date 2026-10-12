import React from 'react';
import { X } from 'lucide-react';

export type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple';
export type TagSize = 'sm' | 'md';

export interface TagProps {
  label: string;
  variant?: TagVariant;
  size?: TagSize;
  selected?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

const variantStyles: Record<TagVariant, { default: string; selected: string }> = {
  default: {
    default: 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600 hover:bg-slate-700/80',
    selected: 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20',
  },
  primary: {
    default: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40 hover:bg-indigo-900/60 hover:border-indigo-400',
    selected: 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/30',
  },
  success: {
    default: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60 hover:border-emerald-400',
    selected: 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-500/30',
  },
  warning: {
    default: 'bg-amber-950/60 text-amber-300 border-amber-500/40 hover:bg-amber-900/60 hover:border-amber-400',
    selected: 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-500/30',
  },
  danger: {
    default: 'bg-rose-950/60 text-rose-300 border-rose-500/40 hover:bg-rose-900/60 hover:border-rose-400',
    selected: 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-500/30',
  },
  purple: {
    default: 'bg-purple-950/60 text-purple-300 border-purple-500/40 hover:bg-purple-900/60 hover:border-purple-400',
    selected: 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/30',
  },
};

const sizeStyles: Record<TagSize, { container: string; icon: string; remove: string }> = {
  sm: {
    container: 'text-xs px-2.5 py-1 gap-1.5 rounded-lg',
    icon: 'w-3 h-3',
    remove: 'w-3 h-3 -mr-1 p-0.5',
  },
  md: {
    container: 'text-sm px-3.5 py-1.5 gap-2 rounded-xl',
    icon: 'w-4 h-4',
    remove: 'w-3.5 h-3.5 -mr-1 p-0.5',
  },
};

export const Tag: React.FC<TagProps> = ({
  label,
  variant = 'default',
  size = 'md',
  selected = false,
  disabled = false,
  icon,
  onRemove,
  onClick,
  className = '',
}) => {
  const currentStyles = variantStyles[variant];
  const sizeConfig = sizeStyles[size];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onRemove) {
      onRemove();
    }
  };

  const isClickable = !!onClick && !disabled;

  return (
    <span
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      aria-pressed={isClickable ? selected : undefined}
      aria-disabled={disabled}
      className={`
        inline-flex items-center font-medium border transition-all duration-200 select-none
        ${sizeConfig.container}
        ${selected ? currentStyles.selected : currentStyles.default}
        ${isClickable ? 'cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
    >
      {icon && (
        <span className={`shrink-0 flex items-center ${sizeConfig.icon}`} aria-hidden="true">
          {icon}
        </span>
      )}

      <span className="truncate">{label}</span>

      {onRemove && (
        <button
          type="button"
          onClick={handleRemoveClick}
          disabled={disabled}
          aria-label={`Remove ${label}`}
          className={`
            shrink-0 rounded-full hover:bg-black/30 text-current opacity-70 hover:opacity-100 transition-opacity
            focus:outline-none focus:ring-1 focus:ring-current
            ${sizeConfig.remove}
          `}
        >
          <X className="w-full h-full" />
        </button>
      )}
    </span>
  );
};

export default Tag;
