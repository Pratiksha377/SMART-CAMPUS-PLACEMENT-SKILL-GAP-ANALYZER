import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';

describe('Card Component', () => {
  it('renders card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Job Title</CardTitle>
          <CardDescription>Company Name</CardDescription>
        </CardHeader>
        <CardContent>Job Description Content</CardContent>
        <CardFooter>Footer Actions</CardFooter>
      </Card>
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Job Title' })).toBeInTheDocument();
    expect(screen.getByText('Company Name')).toBeInTheDocument();
    expect(screen.getByText('Job Description Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Actions')).toBeInTheDocument();
  });

  it('renders different card variants', () => {
    const { container, rerender } = render(<Card variant="default">Content</Card>);
    expect(container.firstChild).toHaveClass('bg-slate-900/90');

    rerender(<Card variant="glass">Content</Card>);
    expect(container.firstChild).toHaveClass('glass-card');

    rerender(<Card variant="interactive">Content</Card>);
    expect(container.firstChild).toHaveClass('glass-card-hover');

    rerender(<Card variant="bordered">Content</Card>);
    expect(container.firstChild).toHaveClass('border-2');
  });

  it('applies padding correctly', () => {
    const { container, rerender } = render(<Card padding="none">Content</Card>);
    expect(container.firstChild).toHaveClass('p-0');

    rerender(<Card padding="sm">Content</Card>);
    expect(container.firstChild).toHaveClass('p-4');

    rerender(<Card padding="md">Content</Card>);
    expect(container.firstChild).toHaveClass('p-6');

    rerender(<Card padding="lg">Content</Card>);
    expect(container.firstChild).toHaveClass('p-8');
  });

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref Card</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
