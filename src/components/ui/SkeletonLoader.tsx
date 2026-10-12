import React from 'react';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'card' | 'avatar';

export interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded-md',
  circular: 'rounded-full',
  rectangular: 'rounded-xl',
  avatar: 'w-10 h-10 rounded-full shrink-0',
  card: 'w-full rounded-2xl p-6 space-y-4',
};

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
  style,
  ...rest
}) => {
  const customStyles: React.CSSProperties = {
    ...style,
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
  };

  const renderSingleSkeleton = (index: number) => {
    if (variant === 'card') {
      return (
        <div
          key={index}
          role="status"
          aria-label="Loading content..."
          aria-busy="true"
          className={`
            border border-slate-800/80 bg-slate-900/60 rounded-2xl p-6 space-y-4
            ${className}
          `}
          {...rest}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-800 rounded animate-pulse w-1/3" />
              <div className="h-3 bg-slate-800/60 rounded animate-pulse w-1/4" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-slate-800 rounded animate-pulse w-full" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4" />
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-slate-800/60">
            <div className="h-8 bg-slate-800 rounded-lg animate-pulse w-24" />
            <div className="h-8 bg-slate-800 rounded-lg animate-pulse w-20" />
          </div>
          <span className="sr-only">Loading card...</span>
        </div>
      );
    }

    return (
      <div
        key={index}
        role="status"
        aria-label="Loading..."
        aria-busy="true"
        className={`
          animate-pulse bg-slate-800/80 border border-slate-700/20
          ${variantStyles[variant]}
          ${className}
        `}
        style={customStyles}
        {...rest}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  };

  if (count > 1) {
    return (
      <div className="space-y-2.5 w-full">
        {Array.from({ length: count }, (_, i) => renderSingleSkeleton(i))}
      </div>
    );
  }

  return renderSingleSkeleton(0);
};

export default SkeletonLoader;
