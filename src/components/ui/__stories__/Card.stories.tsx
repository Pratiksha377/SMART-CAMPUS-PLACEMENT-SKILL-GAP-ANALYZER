import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Sparkles, ArrowRight } from 'lucide-react';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Full-Stack Engineer</CardTitle>
          <Badge variant="success" size="sm" dot>Active</Badge>
        </div>
        <CardDescription>Amazon Web Services • Seattle / Remote</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300 text-xs leading-relaxed">
          Seeking graduating seniors proficient in React, Node.js, and distributed cloud architectures.
        </p>
      </CardContent>
      <CardFooter>
        <span className="text-xs text-slate-400">$130,000 - $160,000 / yr</span>
        <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
          View Role
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const GlassVariant: Story = {
  render: () => (
    <Card variant="glass" className="w-96">
      <CardHeader>
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2">
          <Sparkles className="w-4 h-4" />
        </div>
        <CardTitle>Skill Gap Diagnostic</CardTitle>
        <CardDescription>AI-powered recommendation engine</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-300">
          Your system design readiness is at 78%. Recommended next track: High-Concurrency Data Pipelines.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm" fullWidth>
          Start Practice Module
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const InteractiveVariant: Story = {
  render: () => (
    <Card variant="interactive" padding="md" className="w-80">
      <CardTitle className="text-base">Interactive Assessment Card</CardTitle>
      <CardDescription className="mt-1">Click to trigger action</CardDescription>
      <div className="mt-3 text-xs text-indigo-300 font-medium flex items-center gap-1">
        <span>Proceed to Quiz</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </Card>
  ),
};
