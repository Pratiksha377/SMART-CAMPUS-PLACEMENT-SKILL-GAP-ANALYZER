import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  label?: React.ReactNode;
  error?: string;
  helperText?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  hint,
  required = false,
  id: customId,
  className = '',
  children,
}) => {
  const generatedId = useId();
  const fieldId = customId || generatedId;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  return (
    <div className={`w-full font-sans space-y-1.5 ${className}`}>
      {(label || hint) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <label htmlFor={fieldId} className="font-medium text-slate-300">
              {label}
              {required && (
                <span className="text-rose-400 ml-1 font-bold" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}
          {hint && <span className="text-slate-400 text-[11px]">{hint}</span>}
        </div>
      )}

      <div>{children}</div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-rose-400 flex items-center gap-1.5 mt-1 animate-fadeIn"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-slate-400 mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default FormField;
