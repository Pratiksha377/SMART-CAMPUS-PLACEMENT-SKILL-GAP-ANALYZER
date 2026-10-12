import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  fallbackIcon?: React.ReactNode;
  aspectRatio?: string;
  containerClassName?: string;
  className?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc,
  fallbackIcon,
  aspectRatio = 'auto',
  containerClassName = '',
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, load immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(e);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    setIsLoaded(true);
    onError?.(e);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-900/60 rounded-xl ${containerClassName}`}
      style={{ aspectRatio }}
      data-testid="lazy-image-container"
    >
      {/* Skeleton Shimmer Loading Placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-slate-800/60 animate-pulse flex items-center justify-center"
          data-testid="lazy-image-skeleton"
        >
          {placeholderSrc ? (
            <img
              src={placeholderSrc}
              alt=""
              className="w-full h-full object-cover blur-sm opacity-50"
              aria-hidden="true"
            />
          ) : (
            <ImageIcon className="h-6 w-6 text-slate-600 animate-pulse" />
          )}
        </div>
      )}

      {/* Error Fallback */}
      {hasError ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-slate-900/90 border border-slate-800 rounded-xl text-slate-500"
          data-testid="lazy-image-error"
        >
          {fallbackIcon || <ImageIcon className="h-6 w-6 text-slate-500 mb-1" />}
          <span className="text-[10px] text-slate-400 font-medium">Image unavailable</span>
        </div>
      ) : (
        isIntersecting && (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            data-testid="lazy-image-img"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            {...props}
          />
        )
      )}
    </div>
  );
};

export default LazyImage;
