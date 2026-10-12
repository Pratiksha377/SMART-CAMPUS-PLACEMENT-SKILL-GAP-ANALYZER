import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { FormField } from '@/components/ui/FormField';

describe('FormField Component', () => {
  it('renders label, hint, and children', () => {
    render(
      <FormField label="Email Address" hint="Campus email preferred">
        <input type="email" placeholder="student@campus.edu" />
      </FormField>
    );

    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('Campus email preferred')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('student@campus.edu')).toBeInTheDocument();
  });

  it('renders required asterisk when required is true', () => {
    render(
      <FormField label="Password" required>
        <input type="password" />
      </FormField>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders helper text when no error exists', () => {
    render(
      <FormField label="Phone" helperText="Include country code">
        <input type="tel" />
      </FormField>
    );

    expect(screen.getByText('Include country code')).toBeInTheDocument();
  });

  it('renders error message in alert role', () => {
    render(
      <FormField
        label="Phone"
        error="Invalid phone number format"
        helperText="Should not show when error is present"
      >
        <input type="tel" />
      </FormField>
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid phone number format');
    expect(screen.queryByText('Should not show when error is present')).not.toBeInTheDocument();
  });
});
