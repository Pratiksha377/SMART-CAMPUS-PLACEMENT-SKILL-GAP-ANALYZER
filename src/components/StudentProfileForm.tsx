import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  StudentProfile,
  ProfileFormData,
  profileValidationSchema,
  SkillProficiency,
} from '@/types/profile';
import { Button } from './ui/Button';
import { TextInput } from './ui/TextInput';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import {
  User,
  GraduationCap,
  Sparkles,
  Briefcase,
  FolderGit2,
  Plus,
  Trash2,
  Save,
  X,
} from 'lucide-react';

export interface StudentProfileFormProps {
  initialData?: StudentProfile | null;
  onSubmit: (data: ProfileFormData) => Promise<unknown>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

const proficiencyLevels: SkillProficiency[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileValidationSchema) as any,
    defaultValues: {
      fullName: initialData?.fullName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      bio: initialData?.bio || '',
      education: {
        institution: initialData?.education?.institution || '',
        degree: initialData?.education?.degree || '',
        fieldOfStudy: initialData?.education?.fieldOfStudy || '',
        graduationYear: initialData?.education?.graduationYear || new Date().getFullYear(),
        cgpa: initialData?.education?.cgpa || 8.0,
      },
      skills: initialData?.skills || [
        { name: 'JavaScript', proficiency: 'Advanced' },
        { name: 'React', proficiency: 'Intermediate' },
      ],
      experience: initialData?.experience || [],
      projects: initialData?.projects || [],
      preferences: {
        preferredLocations: initialData?.preferences?.preferredLocations || ['Bengaluru', 'Remote'],
        preferredRoles: initialData?.preferences?.preferredRoles || ['Software Engineer'],
      },
    },
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: 'skills',
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: 'projects',
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: 'experience',
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((data) => onSubmit(data as ProfileFormData))}
      data-testid="student-profile-form"
      className={`space-y-8 font-sans ${className}`}
    >
      {/* 1. Basic Information */}
      <Card variant="glass" padding="lg">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Personal & Contact Details</CardTitle>
              <CardDescription>Your essential identity on campus placement records</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Full Name"
              required
              placeholder="e.g. Alex Morgan"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <TextInput
              label="Campus / Work Email"
              type="email"
              required
              placeholder="e.g. alex.morgan@campus.edu"
              error={errors.email?.message}
              {...register('email')}
            />

            <TextInput
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <div className="md:col-span-2">
              <label htmlFor="bio-textarea" className="block text-xs font-medium text-slate-300 mb-1.5">
                Professional Bio / Summary
              </label>
              <textarea
                id="bio-textarea"
                rows={3}
                placeholder="Brief summary of your background, career interests, and technical strengths..."
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                {...register('bio')}
              />
              {errors.bio?.message && (
                <p className="text-xs text-rose-400 mt-1">{errors.bio.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Educational Background (Requirement 1.4) */}
      <Card variant="glass" padding="lg">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Academic Qualifications</CardTitle>
              <CardDescription>Your university, branch of study, and verified performance metrics</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <TextInput
                label="College / Institution"
                required
                placeholder="e.g. University College of Engineering"
                error={errors.education?.institution?.message}
                {...register('education.institution')}
              />
            </div>

            <TextInput
              label="Degree"
              required
              placeholder="e.g. B.Tech / B.E. / M.S."
              error={errors.education?.degree?.message}
              {...register('education.degree')}
            />

            <TextInput
              label="Major / Field of Study"
              required
              placeholder="e.g. Computer Science & Engineering"
              error={errors.education?.fieldOfStudy?.message}
              {...register('education.fieldOfStudy')}
            />

            <TextInput
              label="Graduation Year"
              type="number"
              required
              placeholder="e.g. 2026"
              error={errors.education?.graduationYear?.message}
              {...register('education.graduationYear', { valueAsNumber: true })}
            />

            <TextInput
              label="Cumulative CGPA (Scale 0.0 - 10.0)"
              type="number"
              step="0.01"
              required
              placeholder="e.g. 8.75"
              error={errors.education?.cgpa?.message}
              {...register('education.cgpa', { valueAsNumber: true })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Technical Skills */}
      <Card variant="glass" padding="lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Skills & Proficiencies</CardTitle>
                <CardDescription>Add key skills matched against placement role benchmarks</CardDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendSkill({ name: '', proficiency: 'Intermediate' })}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {skillFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Skill name (e.g. TypeScript, React)"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                    {...register(`skills.${index}.name` as const)}
                  />
                  {errors.skills?.[index]?.name && (
                    <p className="text-[11px] text-rose-400 mt-1">
                      {errors.skills[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div className="w-40">
                  <select
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    {...register(`skills.${index}.proficiency` as const)}
                  >
                    {proficiencyLevels.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Projects */}
      <Card variant="glass" padding="lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Highlighted Projects</CardTitle>
                <CardDescription>Showcase relevant academic and engineering accomplishments</CardDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendProject({
                  name: '',
                  description: '',
                  technologies: ['React', 'TypeScript'],
                  link: '',
                })
              }
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300">Project #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TextInput
                    label="Project Title"
                    placeholder="e.g. Distributed Task Scheduler"
                    inputSize="sm"
                    error={errors.projects?.[index]?.name?.message}
                    {...register(`projects.${index}.name` as const)}
                  />

                  <TextInput
                    label="Repository / Demo URL"
                    placeholder="https://github.com/username/project"
                    inputSize="sm"
                    error={errors.projects?.[index]?.link?.message}
                    {...register(`projects.${index}.link` as const)}
                  />

                  <div className="md:col-span-2">
                    <label htmlFor={`project-desc-${index}`} className="block text-[11px] font-medium text-slate-300 mb-1">
                      Description & Architectural Highlights
                    </label>
                    <textarea
                      id={`project-desc-${index}`}
                      rows={2}
                      placeholder="Summary of purpose, challenges overcome, and stack used..."
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                      {...register(`projects.${index}.description` as const)}
                    />
                    {errors.projects?.[index]?.description && (
                      <p className="text-[11px] text-rose-400 mt-0.5">
                        {errors.projects[index]?.description?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 5. Experience */}
      <Card variant="glass" padding="lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Internships & Work Experience</CardTitle>
                <CardDescription>Industry apprenticeships, research, and technical roles</CardDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendExperience({
                  company: '',
                  role: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  description: '',
                })
              }
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {experienceFields.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                No previous work experience recorded yet. (Optional for fresh graduates)
              </p>
            ) : (
              experienceFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-300">Role #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <TextInput
                      label="Company / Organization"
                      placeholder="e.g. Acme Tech"
                      inputSize="sm"
                      error={errors.experience?.[index]?.company?.message}
                      {...register(`experience.${index}.company` as const)}
                    />

                    <TextInput
                      label="Role / Title"
                      placeholder="e.g. Software Engineering Intern"
                      inputSize="sm"
                      error={errors.experience?.[index]?.role?.message}
                      {...register(`experience.${index}.role` as const)}
                    />

                    <TextInput
                      label="Start Date"
                      type="month"
                      inputSize="sm"
                      error={errors.experience?.[index]?.startDate?.message}
                      {...register(`experience.${index}.startDate` as const)}
                    />

                    <TextInput
                      label="End Date (Leave blank if currently working)"
                      type="month"
                      inputSize="sm"
                      error={errors.experience?.[index]?.endDate?.message}
                      {...register(`experience.${index}.endDate` as const)}
                    />

                    <div className="md:col-span-2">
                      <label htmlFor={`experience-desc-${index}`} className="block text-[11px] font-medium text-slate-300 mb-1">
                        Impact & Contributions
                      </label>
                      <textarea
                        id={`experience-desc-${index}`}
                        rows={2}
                        placeholder="Bullet points of key accomplishments and technologies utilized..."
                        className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                        {...register(`experience.${index}.description` as const)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            leftIcon={<X className="w-4 h-4" />}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          loadingText="Saving Profile..."
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save & Update Profile
        </Button>
      </div>
    </form>
  );
};

export default StudentProfileForm;
