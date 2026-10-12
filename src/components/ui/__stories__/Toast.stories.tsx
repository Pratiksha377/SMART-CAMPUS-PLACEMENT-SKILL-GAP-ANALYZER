import type { Meta } from '@storybook/react';
import React from 'react';
import { Toast } from '../Toast';
import { Button } from '../Button';
import { ToastProvider, useToast } from '@/context/ToastContext';

const meta: Meta<typeof Toast> = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const StaticVariants = () => (
  <div className="flex flex-col gap-3 max-w-md w-full p-4 bg-slate-950">
    <Toast
      id="1"
      type="success"
      title="Application Submitted"
      message="Your application for Microsoft SWE Intern was successfully delivered."
      onDismiss={() => {}}
      duration={0}
    />
    <Toast
      id="2"
      type="error"
      title="Verification Failed"
      message="Your uploaded transcript could not be parsed. Please upload a clear PDF."
      onDismiss={() => {}}
      duration={0}
    />
    <Toast
      id="3"
      type="warning"
      title="Assessment Deadline"
      message="React Core Assessment must be completed in the next 24 hours."
      onDismiss={() => {}}
      duration={0}
    />
    <Toast
      id="4"
      type="info"
      title="New Opportunity Match"
      message="3 new listings matching your profile were posted today."
      onDismiss={() => {}}
      duration={0}
    />
  </div>
);

const InteractiveToastDemo = () => {
  const toast = useToast();

  return (
    <div className="flex flex-wrap gap-3 p-8 bg-slate-950">
      <Button
        variant="primary"
        onClick={() => toast.success('Profile saved successfully!', 'Success')}
      >
        Trigger Success
      </Button>
      <Button
        variant="danger"
        onClick={() => toast.error('Failed to submit form. Check required fields.', 'Error')}
      >
        Trigger Error
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.warning('Your session will expire in 5 minutes.', 'Warning')}
      >
        Trigger Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('New assessment available in your inbox.', 'Notice')}
      >
        Trigger Info
      </Button>
    </div>
  );
};

export const Interactive = () => (
  <ToastProvider>
    <InteractiveToastDemo />
  </ToastProvider>
);
