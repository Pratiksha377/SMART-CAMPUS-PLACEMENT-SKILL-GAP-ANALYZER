import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from '../Button';
import { ArrowRight, Download, Trash2, Send } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Explore Opportunities',
    rightIcon: <ArrowRight className="w-4 h-4" />,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Download Resume',
    leftIcon: <Download className="w-4 h-4" />,
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Withdraw Application',
    leftIcon: <Trash2 className="w-4 h-4" />,
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'View Details',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Dismiss',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
    loadingText: 'Submitting Assessment...',
    children: 'Submit',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Action Disabled',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-950">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4 bg-slate-950">
      <Button size="sm">Small (sm)</Button>
      <Button size="md">Medium (md)</Button>
      <Button size="lg">Large (lg)</Button>
    </div>
  ),
};
