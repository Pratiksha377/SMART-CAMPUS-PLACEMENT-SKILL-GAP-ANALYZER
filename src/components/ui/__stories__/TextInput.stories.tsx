import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TextInput } from '../TextInput';
import { Mail, Lock, Search } from 'lucide-react';

const meta: Meta<typeof TextInput> = {
  title: 'UI/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    helperText: 'As it appears on official campus records',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'student@campus.edu',
    leftIcon: <Mail className="w-4 h-4" />,
    helperText: 'We will send placement updates here',
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    defaultValue: '123',
    leftIcon: <Lock className="w-4 h-4" />,
    error: 'Password must be at least 6 characters long',
  },
};

export const SearchField: Story = {
  args: {
    placeholder: 'Search roles, companies, or skills...',
    leftIcon: <Search className="w-4 h-4" />,
    inputSize: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    label: 'University Registration ID',
    defaultValue: 'REG-2026-98124',
    disabled: true,
    helperText: 'Registration ID cannot be modified',
  },
};
