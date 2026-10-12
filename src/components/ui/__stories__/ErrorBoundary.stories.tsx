import type { Meta } from '@storybook/react';
import React, { useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '../Button';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'UI/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

const CrashingComponent = () => {
  throw new Error('Simulated runtime exception: Unable to fetch skill matrix from remote API endpoint.');
};

export const NormalRender = () => (
  <ErrorBoundary>
    <div className="p-6 rounded-xl border border-slate-800 bg-slate-900 text-slate-200">
      Everything is functioning smoothly inside this ErrorBoundary boundary.
    </div>
  </ErrorBoundary>
);

export const TriggerError = () => {
  const [shouldCrash, setShouldCrash] = useState(false);

  return (
    <div className="p-8 max-w-xl w-full bg-slate-950">
      {!shouldCrash ? (
        <div className="text-center space-y-4">
          <p className="text-slate-300 text-sm">
            Click the button below to simulate an uncaught component crash and preview the ErrorBoundary fallback.
          </p>
          <Button variant="danger" onClick={() => setShouldCrash(true)}>
            Simulate Component Error
          </Button>
        </div>
      ) : (
        <ErrorBoundary onReset={() => setShouldCrash(false)}>
          <CrashingComponent />
        </ErrorBoundary>
      )}
    </div>
  );
};
