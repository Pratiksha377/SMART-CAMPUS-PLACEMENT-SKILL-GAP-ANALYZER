import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const FaultyComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Exploded during render');
  }
  return <div>Component Rendered Successfully</div>;
};

describe('ErrorBoundary Component', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Suppress React boundary console.error during expected errors
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal Child Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Child Content')).toBeInTheDocument();
  });

  it('catches render error and displays default error fallback', () => {
    render(
      <ErrorBoundary>
        <FaultyComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/Exploded during render/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('invokes onError prop when an error is caught', () => {
    const handleError = vi.fn();
    render(
      <ErrorBoundary onError={handleError}>
        <FaultyComponent />
      </ErrorBoundary>
    );

    expect(handleError).toHaveBeenCalled();
    expect(handleError.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it('supports custom fallback component', () => {
    render(
      <ErrorBoundary fallback={<div>Custom Error Screen</div>}>
        <FaultyComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error Screen')).toBeInTheDocument();
  });

  it('supports function fallback with reset capability', async () => {
    const handleReset = vi.fn();

    const ResettableWrapper = () => {
      const [shouldCrash, setShouldCrash] = React.useState(true);
      return (
        <ErrorBoundary
          onReset={() => {
            handleReset();
            setShouldCrash(false);
          }}
          fallback={({ error, reset }) => (
            <div>
              <p>Error: {error.message}</p>
              <button onClick={reset}>Recover</button>
            </div>
          )}
        >
          {shouldCrash ? <FaultyComponent shouldThrow={true} /> : <div>Recovered Content</div>}
        </ErrorBoundary>
      );
    };

    render(<ResettableWrapper />);

    expect(screen.getByText('Error: Exploded during render')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /recover/i }));
    expect(handleReset).toHaveBeenCalled();
    expect(screen.getByText('Recovered Content')).toBeInTheDocument();
  });

  it('toggles technical details visibility', async () => {
    render(
      <ErrorBoundary>
        <FaultyComponent />
      </ErrorBoundary>
    );

    const toggleBtn = screen.getByRole('button', { name: /show technical stack details/i });
    expect(toggleBtn).toBeInTheDocument();

    await userEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /hide technical stack details/i })).toBeInTheDocument();
  });
});
