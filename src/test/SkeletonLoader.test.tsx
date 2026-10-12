import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';

describe('SkeletonLoader Component', () => {
  it('renders with role="status" and default accessibility attributes', () => {
    render(<SkeletonLoader />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { container, rerender } = render(<SkeletonLoader variant="text" />);
    expect(container.firstChild).toHaveClass('h-4', 'rounded-md');

    rerender(<SkeletonLoader variant="circular" />);
    expect(container.firstChild).toHaveClass('rounded-full');

    rerender(<SkeletonLoader variant="rectangular" />);
    expect(container.firstChild).toHaveClass('rounded-xl');

    rerender(<SkeletonLoader variant="avatar" />);
    expect(container.firstChild).toHaveClass('w-10', 'h-10');
  });

  it('renders card skeleton layout with inner elements', () => {
    render(<SkeletonLoader variant="card" />);
    expect(screen.getByLabelText('Loading content...')).toBeInTheDocument();
    expect(screen.getByText('Loading card...')).toBeInTheDocument();
  });

  it('renders multiple skeletons when count > 1', () => {
    render(<SkeletonLoader count={4} variant="text" />);
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(4);
  });

  it('applies custom dimensions', () => {
    const { container } = render(<SkeletonLoader width={200} height={50} />);
    const element = container.firstChild as HTMLElement;
    expect(element.style.width).toBe('200px');
    expect(element.style.height).toBe('50px');
  });
});
