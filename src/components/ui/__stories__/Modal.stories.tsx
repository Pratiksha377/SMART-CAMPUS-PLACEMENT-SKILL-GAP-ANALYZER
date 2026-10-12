import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8 text-center bg-slate-950">
      <Button onClick={() => setIsOpen(true)}>Open Confirmation Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Apply for Frontend Engineer"
        description="Review opportunity requirements before submitting your profile."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Submit Application
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-slate-300">
            You are applying to <strong>Google</strong> for the position of <strong>Frontend Software Engineer</strong>.
          </p>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <p>• Verified CGPA: <strong>8.8 / 10</strong></p>
            <p>• Matching Skill Score: <strong>92%</strong></p>
            <p>• Attached Resume: <strong>resume_alex_2026.pdf</strong></p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const LargeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8 text-center bg-slate-950">
      <Button variant="secondary" onClick={() => setIsOpen(true)}>Open Large Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="lg"
        title="Skill Gap Breakdown"
        description="Comparative analysis of your skills vs target industry roles."
        footer={
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Close Report
          </Button>
        }
      >
        <p className="text-slate-300">
          Detailed radar and proficiency data for full-stack engineering competency matrix.
        </p>
      </Modal>
    </div>
  );
};
