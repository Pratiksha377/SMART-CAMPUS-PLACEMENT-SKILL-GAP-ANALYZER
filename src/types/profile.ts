import { z } from 'zod';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type DocumentType = 'resume' | 'certificate' | 'transcript' | 'other';

export interface DocumentMetadata {
  id: string;
  name: string;
  size: number;
  type: DocumentType;
  uploadedAt: string;
  url?: string;
}

export interface EducationInfo {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: number;
  cgpa: number;
}

export interface SkillItem {
  name: string;
  proficiency: SkillProficiency;
  endorsements?: number;
  score?: number;
}

export interface ExperienceItem {
  id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
}

export interface ProjectItem {
  id?: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface StudentPreferences {
  preferredLocations: string[];
  preferredRoles: string[];
  preferredCompanies?: string[];
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  education: EducationInfo;
  skills: SkillItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  documents: DocumentMetadata[];
  preferences?: StudentPreferences;
  appliedOpportunities?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Zod validation schema for student profile form (Requirement 1.4)
export const profileValidationSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  education: z.object({
    institution: z.string().min(1, 'College / Institution name is required'),
    degree: z.string().min(1, 'Degree is required (e.g. B.Tech, M.S.)'),
    fieldOfStudy: z.string().min(1, 'Field of study / Branch is required (e.g. Computer Science)'),
    graduationYear: z
      .number()
      .min(2000, 'Year must be 2000 or later')
      .max(2035, 'Year must be 2035 or earlier'),
    cgpa: z
      .number()
      .min(0, 'CGPA cannot be negative')
      .max(10, 'CGPA cannot exceed 10.0'),
  }),
  skills: z
    .array(
      z.object({
        name: z.string().min(1, 'Skill name cannot be empty'),
        proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
        endorsements: z.number().optional(),
        score: z.number().optional(),
      })
    )
    .default([]),
  experience: z
    .array(
      z.object({
        company: z.string().min(1, 'Company name is required'),
        role: z.string().min(1, 'Role title is required'),
        startDate: z.string().min(1, 'Start date is required'),
        endDate: z.string().optional(),
        current: z.boolean().optional(),
        description: z.string().default(''),
      })
    )
    .default([]),
  projects: z
    .array(
      z.object({
        name: z.string().min(1, 'Project title is required'),
        description: z.string().min(1, 'Project description is required'),
        technologies: z.array(z.string()).default([]),
        link: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
      })
    )
    .default([]),
  preferences: z
    .object({
      preferredLocations: z.array(z.string()).default([]),
      preferredRoles: z.array(z.string()).default([]),
      preferredCompanies: z.array(z.string()).optional(),
    })
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileValidationSchema>;
