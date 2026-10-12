import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Spinner } from '@/components/ui/Spinner';

describe('Spinner Component', () => {
  it('renders with role="status" and default accessibility label', () => {
    render(<Spinner />);
    const spinnerContainer = screen.getByRole('status');
    expect(spinnerContainer).toBeInTheDocument();
    expect(spinnerContainer).toHaveAttribute('aria-label', 'Loading...');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom label for accessibility', () => {
    render(<Spinner label="Fetching opportunities..." />);
    const spinnerContainer = screen.getByRole('status');
    expect(spinnerContainer).toHaveAttribute('aria-label', 'Fetching opportunities...');
    expect(screen.getByText('Fetching opportunities...')).toBeInTheDocument();
  });

  it('renders different sizes', () => {
    const { container, rerender } = render(<Spinner size="xs" />);
    expect(container.querySelector('svg')).toHaveClass('w-3.5', 'h-3.5');

    rerender(<Spinner size="sm" />);
    expect(container.querySelector('svg')).toHaveClass('w-4', 'h-4');

    rerender(<Spinner size="md" />);
    expect(container.querySelector('svg')).toHaveClass('w-6', 'h-6');

    rerender(<Spinner size="lg" />);
    expect(container.querySelector('svg')).toHaveClass('w-8', 'h-8');

    rerender(<Spinner size="xl" />);
    expect(container.querySelector('svg')).toHaveClass('w-12', 'h-12');
  });

  it('renders different color variants', () => {
    const { container, rerender } = render(<Spinner variant="primary" />);
    expect(container.querySelector('svg')).toHaveClass('text-indigo-500');

    rerender(<Spinner variant="white" />);
    expect(container.querySelector('svg')).toHaveClass('text-white');

    rerender(<Spinner variant="slate" />);
    expect(container.querySelector('svg')).toHaveClass('text-slate-400');
  });
});
