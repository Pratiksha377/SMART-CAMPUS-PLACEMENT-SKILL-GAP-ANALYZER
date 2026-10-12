import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Badge } from '@/components/ui/Badge';

describe('Badge Component', () => {
  it('renders badge text correctly', () => {
    render(<Badge>Applied</Badge>);
    expect(screen.getByText('Applied')).toBeInTheDocument();
  });

  it('renders status dot when dot prop is true', () => {
    const { container } = render(<Badge dot>Active</Badge>);
    const dotElement = container.querySelector('.rounded-full.w-1\\.5');
    expect(dotElement).toBeInTheDocument();
  });

  it('renders solid variants', () => {
    const { container, rerender } = render(<Badge variant="primary">Primary</Badge>);
    expect(container.firstChild).toHaveClass('text-indigo-300');

    rerender(<Badge variant="success">Success</Badge>);
    expect(container.firstChild).toHaveClass('text-emerald-300');

    rerender(<Badge variant="danger">Danger</Badge>);
    expect(container.firstChild).toHaveClass('text-rose-300');

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(container.firstChild).toHaveClass('text-amber-300');

    rerender(<Badge variant="info">Info</Badge>);
    expect(container.firstChild).toHaveClass('text-sky-300');
  });

  it('renders outline variants', () => {
    const { container } = render(
      <Badge variant="primary" outline>
        Outline
      </Badge>
    );
    expect(container.firstChild).toHaveClass('bg-transparent', 'border-indigo-500/60');
  });

  it('renders different sizes', () => {
    const { container, rerender } = render(<Badge size="sm">Small</Badge>);
    expect(container.firstChild).toHaveClass('text-[10px]');

    rerender(<Badge size="md">Medium</Badge>);
    expect(container.firstChild).toHaveClass('text-xs');

    rerender(<Badge size="lg">Large</Badge>);
    expect(container.firstChild).toHaveClass('text-sm');
  });
});
