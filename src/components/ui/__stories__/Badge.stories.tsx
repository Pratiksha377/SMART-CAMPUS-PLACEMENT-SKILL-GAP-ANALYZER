import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Badge } from '../Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: 'primary',
    children: 'Shortlisted',
  },
};

export const WithDot: Story = {
  args: {
    variant: 'success',
    dot: true,
    children: 'Active Application',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-6 bg-slate-950">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success" dot>Success</Badge>
      <Badge variant="warning" dot>Warning</Badge>
      <Badge variant="danger" dot>Danger</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
};

export const OutlineVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-6 bg-slate-950">
      <Badge variant="primary" outline>Primary</Badge>
      <Badge variant="secondary" outline>Secondary</Badge>
      <Badge variant="success" outline dot>Success</Badge>
      <Badge variant="warning" outline dot>Warning</Badge>
      <Badge variant="danger" outline dot>Danger</Badge>
      <Badge variant="info" outline>Info</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-6 bg-slate-950">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};
