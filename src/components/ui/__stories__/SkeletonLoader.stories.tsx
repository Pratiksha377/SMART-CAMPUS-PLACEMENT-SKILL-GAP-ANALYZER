import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SkeletonLoader } from '../SkeletonLoader';

const meta: Meta<typeof SkeletonLoader> = {
  title: 'UI/SkeletonLoader',
  component: SkeletonLoader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SkeletonLoader>;

export const TextLines: Story = {
  render: () => (
    <div className="w-80 space-y-2 p-6 bg-slate-950">
      <SkeletonLoader variant="text" width="60%" />
      <SkeletonLoader variant="text" count={3} />
    </div>
  ),
};

export const AvatarAndProfile: Story = {
  render: () => (
    <div className="flex items-center gap-4 w-80 p-6 bg-slate-950">
      <SkeletonLoader variant="avatar" />
      <div className="space-y-2 flex-1">
        <SkeletonLoader variant="text" width="50%" />
        <SkeletonLoader variant="text" width="80%" />
      </div>
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="w-96 p-6 bg-slate-950">
      <SkeletonLoader variant="card" />
    </div>
  ),
};
