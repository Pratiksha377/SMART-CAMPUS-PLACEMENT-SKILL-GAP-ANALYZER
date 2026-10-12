import React, { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';

export type TextInputSize = 'sm' | 'md' | 'lg';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  helperText?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: TextInputSize;
  fullWidth?: boolean;
}

const sizeClasses: Record<TextInputSize, { input: string; iconLeft: string; iconRight: string }> = {
  sm: {
    input: 'h-8 px-2.5 text-xs rounded-lg',
    iconLeft: 'pl-8',
    iconRight: 'pr-8',
  },
  md: {
    input: 'h-10 px-3.5 text-sm rounded-xl',
    iconLeft: 'pl-10',
    iconRight: 'pr-10',
  },
  lg: {
    input: 'h-12 px-4 text-base rounded-xl',
    iconLeft: 'pl-12',
    iconRight: 'pr-12',
  },
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      fullWidth = true,
      id: customId,
      disabled,
      required,
      className = '',
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const sizeConfig = sizeClasses[inputSize];

    return (
      <div className={`${fullWidth ? 'w-full' : 'inline-block'} font-sans`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-300 mb-1.5 transition-colors"
          >
            {label}
            {required && <span className="text-rose-400 ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div
              className="absolute left-3 flex items-center pointer-events-none text-slate-400 transition-colors"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`
              w-full bg-slate-900/80 border text-slate-100 placeholder:text-slate-500
              transition-all duration-200 outline-none
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-950/60
              focus:ring-2
              ${
                error
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/25'
              }
              ${sizeConfig.input}
              ${leftIcon ? sizeConfig.iconLeft : ''}
              ${rightIcon ? sizeConfig.iconRight : ''}
              ${className}
            `}
            {...rest}
          />

          {rightIcon && (
            <div
              className="absolute right-3 flex items-center text-slate-400 transition-colors"
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5 animate-fadeIn"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1.5 text-xs text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
