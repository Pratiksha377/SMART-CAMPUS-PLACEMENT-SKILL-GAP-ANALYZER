import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FormField } from '../FormField';
import { TextInput } from '../TextInput';

const meta: Meta<typeof FormField> = {
  title: 'UI/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: () => (
    <div className="w-80 p-4 bg-slate-950">
      <FormField
        label="University CGPA"
        required
        helperText="Scale of 0.0 to 10.0"
        hint="Mandatory for Tier-1 placements"
      >
        <TextInput placeholder="e.g. 8.75" />
      </FormField>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-80 p-4 bg-slate-950">
      <FormField
        label="Graduation Year"
        required
        error="Graduation year must be between 2024 and 2030"
      >
        <TextInput defaultValue="1999" error="Graduation year must be between 2024 and 2030" />
      </FormField>
    </div>
  ),
};
