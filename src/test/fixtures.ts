import { StudentProfile } from '@/types/profile';
import { Opportunity } from '@/types/opportunity';
import { JobPosting } from '@/types/recruiter';
import { Notification } from '@/types/notification';
import { PlacementRecord } from '@/types/admin';
import { Question, AssessmentResult } from '@/types/assessment';

export const mockUsers = {
  student: {
    id: 'user-stu-1',
    email: 'student@smartcampus.edu',
    name: 'Aarav Sharma',
    role: 'student' as const,
  },
  recruiter: {
    id: 'user-rec-1',
    email: 'recruiter@techcorp.com',
    name: 'Elena Rostova',
    role: 'recruiter' as const,
  },
  admin: {
    id: 'user-adm-1',
    email: 'admin@smartcampus.edu',
    name: 'Dr. Vikram Malhotra',
    role: 'admin' as const,
  },
};

export const mockStudentProfile: StudentProfile = {
  id: 'profile-1',
  studentId: 'user-stu-1',
  name: 'Aarav Sharma',
  email: 'student@smartcampus.edu',
  phone: '+91 98765 43210',
  department: 'Computer Science',
  degree: 'B.Tech',
  cgpa: 8.9,
  graduationYear: 2026,
  skills: [
    { name: 'TypeScript', proficiency: 85, category: 'Technical' },
    { name: 'React', proficiency: 80, category: 'Technical' },
    { name: 'Algorithms', proficiency: 75, category: 'Technical' },
  ],
  education: [
    {
      institution: 'Smart Campus University',
      degree: 'B.Tech in Computer Science',
      fieldOfStudy: 'Engineering',
      startYear: 2022,
      endYear: 2026,
      grade: '8.9 CGPA',
    },
  ],
  experience: [
    {
      title: 'Frontend Engineering Intern',
      company: 'InnovateTech',
      location: 'Remote',
      startDate: '2024-05-01',
      endDate: '2024-08-01',
      description: 'Built reusable React components with 100% test coverage.',
    },
  ],
  projects: [
    {
      title: 'Campus Skill Gap Analyzer',
      description: 'Analytics engine and visualization dashboard.',
      technologies: ['React', 'TypeScript', 'Chart.js', 'Redux'],
      link: 'https://github.com/example/analyzer',
    },
  ],
  documents: [
    {
      id: 'doc-1',
      fileId: 'file-resume-1',
      name: 'Aarav_Sharma_Resume_2026.pdf',
      type: 'resume',
      size: 154200,
      uploadedAt: '2025-08-15T10:00:00Z',
    },
  ],
  isVerified: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-08-15T10:00:00Z',
};

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Junior Software Engineer',
    company: 'Google',
    location: 'Bangalore, India',
    type: 'Full-time',
    description: 'Design and implement high-performance web applications.',
    requirements: ['Data Structures', 'TypeScript', 'Problem Solving'],
    salaryRange: '₹28,00,000 - ₹34,00,000',
    matchScore: 92,
    skills: ['TypeScript', 'React', 'Algorithms'],
    deadline: '2026-06-30',
    postedDate: '2026-01-15',
  },
  {
    id: 'opp-2',
    title: 'Cloud Systems Associate',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    type: 'Full-time',
    description: 'Work with cloud architecture, microservices, and monitoring.',
    requirements: ['Cloud Computing', 'Docker', 'Networking'],
    salaryRange: '₹22,00,000 - ₹26,00,000',
    matchScore: 84,
    skills: ['Cloud & System Design', 'Python'],
    deadline: '2026-07-15',
    postedDate: '2026-02-01',
  },
];

export const mockQuestions: Question[] = [
  {
    id: 'q-1',
    skill: 'TypeScript',
    text: 'What is the utility type to make all properties in T optional?',
    options: ['Required<T>', 'Partial<T>', 'Readonly<T>', 'Pick<T>'],
    correctAnswer: 1,
    difficulty: 'intermediate',
  },
  {
    id: 'q-2',
    skill: 'React',
    text: 'Which hook should you use for side effects in a functional component?',
    options: ['useState', 'useMemo', 'useEffect', 'useCallback'],
    correctAnswer: 2,
    difficulty: 'beginner',
  },
];

export const mockAssessmentResult: AssessmentResult = {
  assessmentId: 'assess-ts-101',
  score: 85,
  totalQuestions: 20,
  correctCount: 17,
  completedAt: '2026-02-10T14:30:00Z',
  skillsEvaluated: [
    { skill: 'TypeScript', proficiency: 85, requiredProficiency: 80, gap: -5 },
  ],
};

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-stu-1',
    title: 'High Match Opportunity',
    message: 'Google posted Junior Software Engineer with 92% match to your profile!',
    type: 'opportunity_match',
    read: false,
    createdAt: '2026-02-20T08:00:00Z',
    link: '/opportunities/opp-1',
  },
  {
    id: 'notif-2',
    userId: 'user-stu-1',
    title: 'Application Shortlisted',
    message: 'Your application for Microsoft Cloud Systems Associate has been Shortlisted.',
    type: 'status_update',
    read: true,
    createdAt: '2026-02-18T10:00:00Z',
    link: '/applications',
  },
];
