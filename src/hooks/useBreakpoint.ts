import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ViewportDimensions {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
}

/**
 * Computes responsive breakpoint category from viewport width.
 * Mobile: < 640px
 * Tablet: 640px - 1023px
 * Desktop: >= 1024px
 */
export const getBreakpoint = (width: number): Breakpoint => {
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Determines minimum touch target requirement based on viewport width.
 * Mobile & Tablet (< 1024px) require >= 44px tap targets (WCAG 2.5.8).
 */
export const getMinTouchTargetSize = (width: number): number => {
  return width < 1024 ? 44 : 36;
};

/**
 * Checks if font size meets the minimum readable threshold (>= 12px for micro, >= 14px for body).
 */
export const isValidReadableFontSize = (fontSizeRemOrPx: number): boolean => {
  return fontSizeRemOrPx >= 12;
};

/**
 * Hook to observe viewport resize and provide current responsive breakpoint.
 */
export function useBreakpoint(): ViewportDimensions {
  const [dimensions, setDimensions] = useState<ViewportDimensions>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;
    const breakpoint = getBreakpoint(width);

    return {
      width,
      height,
      breakpoint,
      isMobile: breakpoint === 'mobile',
      isTablet: breakpoint === 'tablet',
      isDesktop: breakpoint === 'desktop',
      isTouch: width < 1024,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const breakpoint = getBreakpoint(width);

      setDimensions({
        width,
        height,
        breakpoint,
        isMobile: breakpoint === 'mobile',
        isTablet: breakpoint === 'tablet',
        isDesktop: breakpoint === 'desktop',
        isTouch: width < 1024,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}

export default useBreakpoint;
