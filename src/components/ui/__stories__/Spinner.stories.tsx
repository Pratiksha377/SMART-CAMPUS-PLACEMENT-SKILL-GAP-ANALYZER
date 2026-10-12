import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Spinner } from '../Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: 'md',
    variant: 'primary',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-6 bg-slate-950">
      <div className="text-center">
        <Spinner size="xs" />
        <p className="text-[10px] text-slate-500 mt-2">xs (14px)</p>
      </div>
      <div className="text-center">
        <Spinner size="sm" />
        <p className="text-[10px] text-slate-500 mt-2">sm (16px)</p>
      </div>
      <div className="text-center">
        <Spinner size="md" />
        <p className="text-[10px] text-slate-500 mt-2">md (24px)</p>
      </div>
      <div className="text-center">
        <Spinner size="lg" />
        <p className="text-[10px] text-slate-500 mt-2">lg (32px)</p>
      </div>
      <div className="text-center">
        <Spinner size="xl" />
        <p className="text-[10px] text-slate-500 mt-2">xl (48px)</p>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-6 bg-slate-950">
      <Spinner variant="primary" size="lg" />
      <Spinner variant="indigo" size="lg" />
      <Spinner variant="white" size="lg" />
      <Spinner variant="slate" size="lg" />
      <Spinner variant="secondary" size="lg" />
    </div>
  ),
};
