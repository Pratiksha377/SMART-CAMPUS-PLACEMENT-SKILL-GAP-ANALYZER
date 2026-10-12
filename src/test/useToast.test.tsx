import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ToastProvider, useToast } from '@/context/ToastContext';

const TestComponent = () => {
  const { toasts, success, error, warning, info, dismissToast, clearToasts } = useToast();

  return (
    <div>
      <button onClick={() => success('Success operation')}>Trigger Success</button>
      <button onClick={() => error('Error operation', 'Error Title')}>Trigger Error</button>
      <button onClick={() => warning('Warning operation')}>Trigger Warning</button>
      <button onClick={() => info('Info operation')}>Trigger Info</button>
      <button onClick={() => clearToasts()}>Clear All</button>
      {toasts.length > 0 && (
        <button onClick={() => dismissToast(toasts[0].id)}>Dismiss First</button>
      )}
      <div data-testid="toast-count">{toasts.length}</div>
    </div>
  );
};

describe('useToast Hook and ToastProvider', () => {
  it('throws error when useToast is used outside of ToastProvider', () => {
    // Suppress console.error for expected uncaught error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useToast must be used within a ToastProvider'
    );

    spy.mockRestore();
  });

  it('triggers toasts and manages state correctly', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');

    await userEvent.click(screen.getByText('Trigger Success'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByText('Success operation')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Trigger Error'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('2');
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error operation')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Dismiss First'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    await userEvent.click(screen.getByText('Clear All'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });
});
