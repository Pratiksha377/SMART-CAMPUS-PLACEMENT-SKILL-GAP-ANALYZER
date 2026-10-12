import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Toast, ToastContainer, ToastProps } from '@/components/ui/Toast';

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders title and message correctly', () => {
    render(
      <Toast
        id="t-1"
        type="success"
        title="Success Header"
        message="Your changes were saved"
        onDismiss={() => {}}
      />
    );

    expect(screen.getByText('Success Header')).toBeInTheDocument();
    expect(screen.getByText('Your changes were saved')).toBeInTheDocument();
  });

  it('renders different notification types', () => {
    const { rerender } = render(
      <Toast id="1" type="success" message="Success" onDismiss={() => {}} />
    );
    expect(screen.getByTestId('toast-1')).toHaveClass('border-emerald-500/30');

    rerender(<Toast id="1" type="error" message="Error" onDismiss={() => {}} />);
    expect(screen.getByTestId('toast-1')).toHaveClass('border-rose-500/30');

    rerender(<Toast id="1" type="warning" message="Warning" onDismiss={() => {}} />);
    expect(screen.getByTestId('toast-1')).toHaveClass('border-amber-500/30');

    rerender(<Toast id="1" type="info" message="Info" onDismiss={() => {}} />);
    expect(screen.getByTestId('toast-1')).toHaveClass('border-indigo-500/30');
  });

  it('calls onDismiss when close button is clicked', () => {
    const handleDismiss = vi.fn();
    render(
      <Toast
        id="t-2"
        message="Dismiss me"
        onDismiss={handleDismiss}
      />
    );

    const closeBtn = screen.getByRole('button', { name: /dismiss notification/i });
    fireEvent.click(closeBtn);
    expect(handleDismiss).toHaveBeenCalledWith('t-2');
  });

  it('auto-dismisses after specified duration', () => {
    const handleDismiss = vi.fn();
    render(
      <Toast
        id="t-3"
        message="Auto dismiss"
        duration={3000}
        onDismiss={handleDismiss}
      />
    );

    expect(handleDismiss).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(handleDismiss).toHaveBeenCalledWith('t-3');
  });

  it('pauses auto-dismiss on mouse enter and resumes on mouse leave', () => {
    const handleDismiss = vi.fn();
    render(
      <Toast
        id="t-4"
        message="Hover to pause"
        duration={3000}
        onDismiss={handleDismiss}
      />
    );

    const toastEl = screen.getByTestId('toast-t-4');

    // Advance 1000ms
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Hover pauses timer
    fireEvent.mouseEnter(toastEl);

    // Advance another 3000ms while paused
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(handleDismiss).not.toHaveBeenCalled();

    // Mouse leave resumes
    fireEvent.mouseLeave(toastEl);

    // Advance remaining 2000ms
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(handleDismiss).toHaveBeenCalledWith('t-4');
  });

  it('renders ToastContainer with multiple toasts', () => {
    const mockToasts: ToastProps[] = [
      { id: '1', message: 'First toast', onDismiss: () => {} },
      { id: '2', message: 'Second toast', onDismiss: () => {} },
    ];

    render(<ToastContainer toasts={mockToasts} position="top-right" />);

    expect(screen.getByText('First toast')).toBeInTheDocument();
    expect(screen.getByText('Second toast')).toBeInTheDocument();
  });
});
