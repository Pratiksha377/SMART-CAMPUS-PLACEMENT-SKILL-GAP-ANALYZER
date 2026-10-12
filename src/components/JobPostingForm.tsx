import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { JobOpportunity, OpportunityType } from '@/types/opportunity';
import {
  JobPostingFormData,
  RequiredSkillInput,
  SkillProficiencyLevel,
} from '@/types/recruiter';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { TextInput } from '@/components/ui/TextInput';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  Sparkles,
  Save,
  X,
  FileText,
  Layers,
} from 'lucide-react';

export interface JobPostingFormProps {
  initialData?: JobOpportunity | null;
  onSubmit: (data: JobPostingFormData) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const COMMON_SKILLS = [
  'React & UI Frameworks',
  'TypeScript & JavaScript',
  'Data Structures & Algorithms',
  'Node.js & Backend APIs',
  'SQL & Database Architecture',
  'DevOps, Git & CI/CD',
  'Python & Machine Learning',
  'Web Performance & Accessibility',
];

export const JobPostingForm: React.FC<JobPostingFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditing = !!initialData;

  // Format initial deadline to YYYY-MM-DD
  const defaultDeadline = initialData?.deadline
    ? initialData.deadline.split('T')[0]
    : new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  // Format initial skills
  const defaultSkills: RequiredSkillInput[] = initialData?.detailedSkills
    ? initialData.detailedSkills.map((s) => ({
        skill: s.skill,
        level: s.level,
      }))
    : initialData?.requiredSkills && initialData.requiredSkills.length > 0
    ? initialData.requiredSkills.map((name) => ({
        skill: name,
        level: 'intermediate' as SkillProficiencyLevel,
      }))
    : [
        { skill: 'React & UI Frameworks', level: 'intermediate' },
        { skill: 'TypeScript & JavaScript', level: 'intermediate' },
      ];

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobPostingFormData>({
    defaultValues: {
      title: initialData?.title || '',
      company: initialData?.company || 'Campus Placement Partner',
      location: initialData?.location || 'Bengaluru, India',
      workplaceType: initialData?.workplaceType || 'Hybrid',
      type: initialData?.type || 'Full-time',
      salaryRange: initialData?.salaryRange || '$75,000 - $95,000 / yr',
      deadline: defaultDeadline,
      description: initialData?.description || '',
      requirements: initialData?.requirements ? initialData.requirements.join('\n') : '',
      responsibilities: initialData?.responsibilities
        ? initialData.responsibilities.join('\n')
        : '',
      skills: defaultSkills,
      status: initialData?.status || 'open',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const currentSkills = watch('skills') || [];

  const handleQuickAddSkill = (skillName: string) => {
    const exists = currentSkills.some(
      (s) => s.skill.toLowerCase() === skillName.toLowerCase()
    );
    if (!exists) {
      append({ skill: skillName, level: 'intermediate' });
    }
  };

  const onFormSubmit = async (data: JobPostingFormData) => {
    // Validate that at least one skill is non-empty
    const validSkills = (data.skills || []).filter((s) => s.skill && s.skill.trim().length > 0);
    if (validSkills.length === 0) {
      return;
    }
    await onSubmit({
      ...data,
      skills: validSkills,
    });
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-2xl border-slate-800 bg-slate-900/90 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                {isEditing ? 'Edit Job Opening' : 'Publish New Campus Job Posting'}
              </CardTitle>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {isEditing
                  ? 'Update role criteria, skill proficiency targets, and submission deadline.'
                  : 'Define role requirements and skill thresholds to discover matched campus talent.'}
              </p>
            </div>
          </div>
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-slate-400 hover:text-white"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form
          noValidate
          onSubmit={handleSubmit(onFormSubmit)}
          className="space-y-6"
          data-testid="job-posting-form"
        >
          {/* Section 1: Role Overview */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
              <Building className="h-4 w-4" /> Role Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Job Title"
                required
                placeholder="e.g. Frontend Software Engineer"
                error={errors.title?.message}
                helperText="e.g. Associate Software Engineer - Cloud Platforms"
                {...register('title', {
                  required: 'Job title is required',
                  minLength: { value: 3, message: 'Title must be at least 3 characters' },
                })}
              />

              <TextInput
                label="Hiring Company"
                required
                placeholder="e.g. Google, Microsoft, Tech Corp"
                error={errors.company?.message}
                helperText="Company or department issuing this requisition"
                {...register('company', {
                  required: 'Hiring company name is required',
                })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <TextInput
                label="Location"
                required
                placeholder="e.g. Bengaluru, India or Remote"
                error={errors.location?.message}
                {...register('location', {
                  required: 'Location is required',
                })}
              />

              <div className="space-y-1.5 font-sans">
                <label className="block text-xs font-semibold text-slate-300">
                  Workplace Arrangement
                </label>
                <select
                  aria-label="Workplace Arrangement"
                  className="w-full h-10 px-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  {...register('workplaceType')}
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="block text-xs font-semibold text-slate-300">
                  Employment Type
                </label>
                <select
                  aria-label="Employment Type"
                  className="w-full h-10 px-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  {...register('type')}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <TextInput
                label="Application Deadline"
                type="date"
                required
                error={errors.deadline?.message}
                {...register('deadline', {
                  required: 'Application deadline is required',
                })}
              />
            </div>

            <TextInput
              label="Compensation / Stipend Range"
              placeholder="e.g. $85,000 - $110,000 / yr"
              helperText="e.g. $80,000 - $105,000 / yr or ₹12 - 18 LPA"
              {...register('salaryRange')}
            />
          </div>

          {/* Section 2: Skill Requirements & Proficiency Levels (FE10.3) */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Required Candidate Skills & Target Levels
                </h3>
                <p className="text-xs text-slate-400">
                  Applicants will be scored and filtered against these skill proficiency thresholds.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ skill: '', level: 'intermediate' })}
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                Add Skill
              </Button>
            </div>

            {/* Quick Skill Suggestion Chips */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-violet-400" /> Click to quickly append standard curriculum skills:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SKILLS.map((skillName) => (
                  <button
                    key={skillName}
                    type="button"
                    onClick={() => handleQuickAddSkill(skillName)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-violet-500/50 hover:bg-violet-950/30 text-[11px] text-slate-300 transition-all"
                  >
                    + {skillName}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Skill Rows (useFieldArray) */}
            <div className="space-y-2.5" data-testid="skill-requirements-list">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <span className="text-xs font-semibold text-slate-500 w-6 text-center">
                    #{index + 1}
                  </span>

                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Skill name (e.g. React, Data Structures, Python)"
                      className="w-full px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      {...register(`skills.${index}.skill` as const, {
                        required: 'Skill name cannot be blank',
                      })}
                    />
                  </div>

                  <div className="w-36">
                    <select
                      className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                      {...register(`skills.${index}.level` as const)}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      aria-label={`Remove skill ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {errors.skills && (
              <p className="text-xs text-red-400">
                Please provide at least one valid skill requirement with a non-empty name.
              </p>
            )}
          </div>

          {/* Section 3: Job Description & Details */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Description & Specifications
            </h3>

            <div className="space-y-1.5 font-sans">
              <label htmlFor="description" className="block text-xs font-semibold text-slate-300">
                Role Overview & Mission <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe the opportunity, core responsibilities, and team culture..."
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                {...register('description', {
                  required: 'Job description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters long',
                  },
                })}
              />
              {errors.description && (
                <p className="text-xs text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Role Requirements (One per line)"
                helperText="Educational prerequisites, coursework, project experience"
              >
                <textarea
                  rows={3}
                  placeholder="e.g. Bachelor's in CS / IT / EE&#10;Hands-on project experience in web development"
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  {...register('requirements')}
                />
              </FormField>

              <FormField
                label="Core Responsibilities (One per line)"
                helperText="Key duties the candidate will handle upon joining"
              >
                <textarea
                  rows={3}
                  placeholder="e.g. Build reusable UI components&#10;Participate in sprint planning and reviews"
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  {...register('responsibilities')}
                />
              </FormField>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-end gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              leftIcon={<Save className="h-4 w-4" />}
            >
              {isEditing ? 'Save Changes' : 'Publish Opportunity'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobPostingForm;
