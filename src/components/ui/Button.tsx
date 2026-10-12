import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/25 focus-visible:ring-indigo-500 active:from-indigo-700 active:to-indigo-600',
  secondary:
    'bg-slate-800 hover:bg-slate-700/90 text-slate-100 border border-slate-700/80 shadow-sm hover:border-slate-600 focus-visible:ring-slate-400 active:bg-slate-900',
  danger:
    'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-600/25 border border-rose-500/25 focus-visible:ring-rose-500 active:from-rose-800 active:to-rose-700',
  outline:
    'bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700 hover:border-indigo-400/50 hover:text-white focus-visible:ring-indigo-500 active:bg-slate-800',
  ghost:
    'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white focus-visible:ring-slate-400 active:bg-slate-800/80',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8',
  md: 'text-sm px-4 py-2.5 rounded-xl gap-2 h-10',
  lg: 'text-base px-6 py-3 rounded-xl gap-2.5 h-12',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      children,
      className = '',
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={`
          inline-flex items-center justify-center font-medium font-sans
          transition-all duration-200 select-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none
          active:scale-[0.98]
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...rest}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
