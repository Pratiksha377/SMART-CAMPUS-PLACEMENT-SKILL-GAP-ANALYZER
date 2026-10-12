import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { createRef } from 'react';
import { TextInput } from '@/components/ui/TextInput';

describe('TextInput Component', () => {
  it('renders input with label and helper text', () => {
    render(
      <TextInput
        label="Username"
        helperText="Enter your university roll number"
        placeholder="e.g. 210101001"
      />
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByText('Enter your university roll number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 210101001')).toBeInTheDocument();
  });

  it('updates value on typing', async () => {
    render(<TextInput label="Email" placeholder="user@campus.edu" />);
    const input = screen.getByLabelText(/email/i);

    await userEvent.type(input, 'test@campus.edu');
    expect(input).toHaveValue('test@campus.edu');
  });

  it('displays error and sets aria-invalid attribute', () => {
    render(
      <TextInput
        label="Password"
        error="Password must be at least 6 characters"
      />
    );

    const input = screen.getByLabelText(/password/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Password must be at least 6 characters');
  });

  it('renders required indicator', () => {
    render(<TextInput label="Full Name" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders left and right icons', () => {
    render(
      <TextInput
        label="Search"
        leftIcon={<span data-testid="search-icon">S</span>}
        rightIcon={<span data-testid="clear-icon">C</span>}
      />
    );

    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByTestId('clear-icon')).toBeInTheDocument();
  });

  it('handles disabled state', async () => {
    render(<TextInput label="Disabled Input" disabled defaultValue="cannot change" />);
    const input = screen.getByLabelText(/disabled input/i);

    expect(input).toBeDisabled();
    await userEvent.type(input, 'new text');
    expect(input).toHaveValue('cannot change');
  });

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextInput ref={ref} label="Ref Test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
