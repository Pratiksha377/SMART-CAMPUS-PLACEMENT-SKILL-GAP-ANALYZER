import apiClient from './api';
import { StudentProfile, DocumentMetadata, DocumentType } from '@/types/profile';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'smart_campus_profile_data';

export const initialMockProfile: StudentProfile = {
  id: 'prof-std-1001',
  userId: 'usr-std-001',
  fullName: 'Alex Morgan',
  email: 'alex.morgan@campus.edu',
  phone: '+1 (555) 234-5678',
  bio: 'Computer Science senior passionate about distributed systems, full-stack development, and modern cloud architectures.',
  education: {
    institution: 'University College of Engineering',
    degree: 'Bachelor of Technology (B.Tech)',
    fieldOfStudy: 'Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 8.85,
  },
  skills: [
    { name: 'TypeScript', proficiency: 'Advanced', endorsements: 14, score: 92 },
    { name: 'React', proficiency: 'Advanced', endorsements: 18, score: 94 },
    { name: 'Node.js', proficiency: 'Intermediate', endorsements: 9, score: 85 },
    { name: 'PostgreSQL', proficiency: 'Intermediate', endorsements: 7, score: 80 },
    { name: 'Docker', proficiency: 'Intermediate', endorsements: 5, score: 78 },
    { name: 'Python', proficiency: 'Advanced', endorsements: 12, score: 88 },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Innovatech Cloud Labs',
      role: 'Full-Stack Developer Intern',
      startDate: '2025-05',
      endDate: '2025-08',
      current: false,
      description:
        'Engineered responsive dashboards with React, TypeScript, and microservices on Node.js, reducing payload latency by 24%.',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Campus Job & Skill Engine',
      description: 'Distributed web portal connecting recruiters and students with skill gap radar visualizer.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit'],
      link: 'https://github.com/campus/skill-engine',
    },
    {
      id: 'proj-2',
      name: 'High-Throughput Analytics Streamer',
      description: 'Real-time telemetry event processor analyzing student placement trends and KPI metrics.',
      technologies: ['Node.js', 'PostgreSQL', 'Docker'],
      link: 'https://github.com/campus/analytics-streamer',
    },
  ],
  documents: [
    {
      id: 'doc-resume-01',
      name: 'Alex_Morgan_Resume_2026.pdf',
      size: 245760, // ~240 KB
      type: 'resume',
      uploadedAt: '2026-09-15T10:30:00.000Z',
      url: '/documents/Alex_Morgan_Resume_2026.pdf',
    },
    {
      id: 'doc-cert-01',
      name: 'AWS_Certified_Cloud_Practitioner.pdf',
      size: 512000, // ~500 KB
      type: 'certificate',
      uploadedAt: '2026-08-20T14:15:00.000Z',
      url: '/documents/AWS_Certified_Cloud_Practitioner.pdf',
    },
  ],
  preferences: {
    preferredLocations: ['Bengaluru', 'Hyderabad', 'Remote', 'Seattle'],
    preferredRoles: ['Software Engineer', 'Frontend Engineer', 'Full-Stack Developer'],
    preferredCompanies: ['Google', 'Microsoft', 'Amazon', 'Atlassian'],
  },
  appliedOpportunities: [],
  createdAt: '2026-08-01T08:00:00.000Z',
  updatedAt: new Date().toISOString(),
};

function getLocalProfile(studentId?: string): StudentProfile {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${studentId || 'default'}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse profile from storage', err);
  }
  return { ...initialMockProfile, id: studentId || initialMockProfile.id };
}

function setLocalProfile(profile: StudentProfile, studentId?: string): void {
  try {
    const keyId = studentId || profile.id;
    localStorage.setItem(`${STORAGE_KEY}_${keyId}`, JSON.stringify(profile));
    localStorage.setItem(`${STORAGE_KEY}_${profile.id}`, JSON.stringify(profile));
    localStorage.setItem(`${STORAGE_KEY}_default`, JSON.stringify(profile));
  } catch (err) {
    console.warn('Failed to persist profile to storage', err);
  }
}

export const profileService = {
  async getProfile(studentId?: string): Promise<StudentProfile> {
    try {
      const response = await apiClient.get<StudentProfile>(
        `/students/${studentId || 'me'}/profile`
      );
      setLocalProfile(response.data, studentId);
      return response.data;
    } catch {
      // Fallback to local storage persistence
      return getLocalProfile(studentId);
    }
  },

  async updateProfile(
    studentId: string,
    data: Partial<StudentProfile>
  ): Promise<StudentProfile> {
    try {
      const response = await apiClient.put<StudentProfile>(
        `/students/${studentId}/profile`,
        data
      );
      setLocalProfile(response.data, studentId);
      return response.data;
    } catch {
      const current = getLocalProfile(studentId);
      const updated: StudentProfile = {
        ...current,
        id: studentId,
        ...data,
        education: {
          ...current.education,
          ...(data.education || {}),
        },
        skills: data.skills || current.skills,
        experience: data.experience || current.experience,
        projects: data.projects || current.projects,
        documents: data.documents || current.documents,
        updatedAt: new Date().toISOString(),
      };
      setLocalProfile(updated, studentId);
      return updated;
    }
  },

  async uploadDocument(
    studentId: string,
    file: File,
    type: DocumentType = 'resume'
  ): Promise<DocumentMetadata> {
    const newDoc: DocumentMetadata = {
      id: `doc-${uuidv4().slice(0, 8)}`,
      name: file.name,
      size: file.size,
      type,
      uploadedAt: new Date().toISOString(),
      url: typeof URL !== 'undefined' && URL.createObjectURL ? URL.createObjectURL(file) : undefined,
    };

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      const response = await apiClient.post<DocumentMetadata>(
        `/students/${studentId}/documents`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    } catch {
      const current = getLocalProfile(studentId);
      current.id = studentId;
      current.documents = [...(current.documents || []), newDoc];
      setLocalProfile(current, studentId);
      return newDoc;
    }
  },

  async deleteDocument(
    studentId: string,
    documentId: string
  ): Promise<{ success: boolean }> {
    try {
      await apiClient.delete(`/students/${studentId}/documents/${documentId}`);
    } catch {
      // Local fallback
      const current = getLocalProfile(studentId);
      current.id = studentId;
      current.documents = (current.documents || []).filter(
        (doc) => doc.id !== documentId
      );
      setLocalProfile(current, studentId);
    }
    return { success: true };
  },

  async replaceDocument(
    studentId: string,
    documentId: string,
    file: File,
    type: DocumentType = 'resume'
  ): Promise<DocumentMetadata> {
    const updatedDoc: DocumentMetadata = {
      id: documentId,
      name: file.name,
      size: file.size,
      type,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file),
    };

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      const response = await apiClient.put<DocumentMetadata>(
        `/students/${studentId}/documents/${documentId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    } catch {
      const current = getLocalProfile(studentId);
      const index = (current.documents || []).findIndex(
        (doc) => doc.id !== documentId
      );
      if (index !== -1) {
        current.documents[index] = updatedDoc;
      } else {
        current.documents.push(updatedDoc);
      }
      setLocalProfile(current);
      return updatedDoc;
    }
  },
};

export default profileService;
