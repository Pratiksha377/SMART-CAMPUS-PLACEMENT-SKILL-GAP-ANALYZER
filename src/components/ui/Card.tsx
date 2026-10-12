import React, { forwardRef } from 'react';

export type CardVariant = 'default' | 'glass' | 'bordered' | 'elevated' | 'interactive';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-slate-900/90 border border-slate-800 shadow-lg shadow-black/40',
  glass: 'glass-card shadow-xl shadow-black/30',
  bordered: 'bg-slate-900/40 border-2 border-slate-700/80 shadow-none',
  elevated: 'bg-slate-900 border border-slate-700/60 shadow-2xl shadow-indigo-950/20',
  interactive: 'glass-card glass-card-hover cursor-pointer active:scale-[0.99]',
};

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`flex flex-col space-y-1.5 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h3
    className={`text-lg font-semibold text-slate-100 tracking-tight leading-none ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <p className={`text-xs text-slate-400 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`text-sm text-slate-300 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div
    className={`flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hover = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-2xl transition-all duration-200 overflow-hidden font-sans
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${hover && variant !== 'interactive' ? 'hover:border-slate-700 hover:shadow-xl hover:-translate-y-0.5' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
) as React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
};

Card.displayName = 'Card';
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
