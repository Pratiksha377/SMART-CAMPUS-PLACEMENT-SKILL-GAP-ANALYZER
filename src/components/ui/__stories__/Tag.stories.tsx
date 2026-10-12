import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Tag } from '../Tag';
import { Code, Database, Sparkles } from 'lucide-react';

const meta: Meta<typeof Tag> = {
  title: 'UI/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    label: 'TypeScript',
  },
};

export const Removable: Story = {
  args: {
    label: 'React 19',
    variant: 'primary',
    onRemove: () => alert('Removed React 19 tag'),
  },
};

export const SelectableGroup = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'TypeScript']);

  const skills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="flex flex-wrap gap-2.5 p-6 max-w-lg bg-slate-950">
      {skills.map((skill) => (
        <Tag
          key={skill}
          label={skill}
          variant="primary"
          selected={selectedSkills.includes(skill)}
          onClick={() => toggleSkill(skill)}
        />
      ))}
    </div>
  );
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-6 bg-slate-950">
      <Tag label="Frontend Engineering" icon={<Code />} variant="primary" />
      <Tag label="Relational Databases" icon={<Database />} variant="success" />
      <Tag label="AI / Machine Learning" icon={<Sparkles />} variant="purple" />
    </div>
  ),
};
