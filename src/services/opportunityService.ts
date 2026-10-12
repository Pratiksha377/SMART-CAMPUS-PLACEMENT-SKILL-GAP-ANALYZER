import { v4 as uuidv4 } from 'uuid';
import {
  JobOpportunity,
  Application,
  OpportunityFilterCriteria,
} from '@/types/opportunity';

const OPPORTUNITIES_STORAGE_KEY = 'smart_campus_opportunities_v1';
const APPLICATIONS_STORAGE_KEY = 'smart_campus_applications_v1';

export const mockOpportunities: JobOpportunity[] = [
  {
    id: 'opp-google-swe-01',
    recruiterId: 'rec-google-01',
    title: 'Associate Software Engineer - Full Stack',
    company: 'Google',
    location: 'Bengaluru, India',
    workplaceType: 'Hybrid',
    type: 'Full-time',
    description:
      'Join Google Cloud engineering team building resilient distributed systems and next-generation web applications. You will collaborate with senior staff engineers to deliver scalable customer-facing services.',
    requirements: [
      "Bachelor's degree in Computer Science, Software Engineering or related STEM field.",
      'Strong foundational proficiency in Data Structures, Algorithms, and TypeScript/Java.',
      'Familiarity with containerization (Docker) and Cloud architectures.',
    ],
    responsibilities: [
      'Design, build, and test high-throughput frontend and backend services.',
      'Participate in code reviews, design docs, and architectural alignment.',
      'Optimize web vitals, latency, and reliability across modern browsers.',
    ],
    requiredSkills: [
      'React & UI Frameworks',
      'TypeScript & JavaScript',
      'Data Structures & Algorithms',
      'Node.js & Backend APIs',
    ],
    salaryRange: '$85,000 - $110,000 / yr',
    deadline: '2026-11-30T23:59:59Z',
    postedAt: '2026-10-01T09:00:00Z',
    applicants: ['std-student-101'],
    status: 'open',
    matchScore: 92,
  },
  {
    id: 'opp-msft-fe-02',
    recruiterId: 'rec-msft-01',
    title: 'Frontend Engineer - Microsoft 365 Web',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    workplaceType: 'Hybrid',
    type: 'Full-time',
    description:
      'The Microsoft 365 Core UX team is looking for a frontend specialist with high attention to accessible, fluid, and reactive UI architecture in React and TypeScript.',
    requirements: [
      'Degree in Computer Science or demonstrable equivalent technical project portfolio.',
      'Hands-on expertise in React 18/19, strict TypeScript, and CSS-in-JS or Tailwind CSS.',
      'Understanding of WCAG 2.1 accessibility criteria and client-side performance profiling.',
    ],
    responsibilities: [
      'Develop reusable UI components for hundreds of millions of daily enterprise users.',
      'Implement real-time collaboration features using WebSocket and state trees.',
    ],
    requiredSkills: [
      'React & UI Frameworks',
      'TypeScript & JavaScript',
      'CSS & Responsive Design',
      'Web Performance & Accessibility',
    ],
    salaryRange: '$80,000 - $105,000 / yr',
    deadline: '2026-12-15T23:59:59Z',
    postedAt: '2026-10-05T10:30:00Z',
    applicants: [],
    status: 'open',
    matchScore: 88,
  },
  {
    id: 'opp-amzn-sde-03',
    recruiterId: 'rec-amzn-01',
    title: 'Software Development Engineer - AWS Cloud Systems',
    company: 'Amazon Web Services',
    location: 'Remote',
    workplaceType: 'Remote',
    type: 'Full-time',
    description:
      'Build mission-critical backend microservices for AWS compute and serverless platforms. You will work on massive-scale low-latency distributed primitives.',
    requirements: [
      'B.Tech / M.Tech in CS / IT graduating class of 2024-2026.',
      'Deep fluency in Object Oriented or Systems Programming (Java, Go, TypeScript).',
      'Solid command of SQL and NoSQL database query tuning and ACID transaction mechanics.',
    ],
    responsibilities: [
      'Architect resilient backend services with 99.999% uptime SLAs.',
      'Deploy and monitor services using infrastructure-as-code and CI/CD pipelines.',
    ],
    requiredSkills: [
      'Data Structures & Algorithms',
      'Node.js & Backend APIs',
      'SQL & Database Architecture',
      'DevOps, Git & CI/CD',
    ],
    salaryRange: '$90,000 - $120,000 / yr',
    deadline: '2026-11-20T23:59:59Z',
    postedAt: '2026-09-28T08:00:00Z',
    applicants: [],
    status: 'open',
    matchScore: 78,
  },
  {
    id: 'opp-uber-intern-04',
    recruiterId: 'rec-uber-01',
    title: 'Software Engineering Summer Intern',
    company: 'Uber',
    location: 'Bengaluru, India',
    workplaceType: 'On-site',
    type: 'Internship',
    description:
      'A 12-week intensive summer internship program embedded directly in Uber Mobility and Marketplace routing engineering teams.',
    requirements: [
      'Currently enrolled in a university degree program graduating in 2025 or 2026.',
      'Strong problem-solving ability in graph algorithms and dynamic programming.',
    ],
    responsibilities: [
      'Deliver an end-to-end production software engineering project during the 12 weeks.',
      'Present project outcomes to department leadership.',
    ],
    requiredSkills: [
      'Data Structures & Algorithms',
      'TypeScript & JavaScript',
      'SQL & Database Architecture',
    ],
    salaryRange: '$4,500 / month Stipend',
    deadline: '2026-11-10T23:59:59Z',
    postedAt: '2026-10-02T11:00:00Z',
    applicants: [],
    status: 'open',
    matchScore: 82,
  },
  {
    id: 'opp-stripe-plat-05',
    recruiterId: 'rec-stripe-01',
    title: 'Platform Infrastructure Engineer',
    company: 'Stripe',
    location: 'Remote',
    workplaceType: 'Remote',
    type: 'Full-time',
    description:
      'Help power economic infrastructure for the internet. Stripe Infrastructure engineers build reliable APIs and financial ledger services handling billions in payments.',
    requirements: [
      'Demonstrated aptitude in concurrent programming and database reliability.',
      'Experience building automated integration tests and production observability.',
    ],
    responsibilities: [
      'Engineer fault-tolerant ledger and payout APIs.',
      'Collaborate across security and compliance engineering squads.',
    ],
    requiredSkills: [
      'Node.js & Backend APIs',
      'SQL & Database Architecture',
      'DevOps, Git & CI/CD',
    ],
    salaryRange: '$95,000 - $130,000 / yr',
    deadline: '2026-12-01T23:59:59Z',
    postedAt: '2026-10-07T12:00:00Z',
    applicants: [],
    status: 'open',
    matchScore: 74,
  },
];

export const initialMockApplications: Application[] = [
  {
    id: 'app-seed-01',
    studentId: 'prof-std-1001',
    studentName: 'Alex Morgan',
    studentEmail: 'alex.morgan@campus.edu',
    opportunityId: 'opp-google-swe-01',
    opportunityTitle: 'Associate Software Engineer - Full Stack',
    company: 'Google',
    location: 'Bengaluru, India',
    type: 'Full-time',
    status: 'shortlisted',
    appliedAt: '2026-10-02T14:30:00Z',
    lastUpdated: '2026-10-08T10:15:00Z',
    skillMatchPercentage: 92,
    notes: 'Submitted updated resume and verified assessment scores.',
    resumeFileName: 'Alex_Morgan_Resume_2026.pdf',
    timeline: [
      {
        status: 'applied',
        date: '2026-10-02T14:30:00Z',
        message: 'Application submitted successfully with verified profile credentials.',
      },
      {
        status: 'reviewed',
        date: '2026-10-05T09:00:00Z',
        message: 'Application reviewed by University Campus Hiring Recruitment Squad.',
      },
      {
        status: 'shortlisted',
        date: '2026-10-08T10:15:00Z',
        message: 'Profile shortlisted for Technical Screening Round 1.',
      },
    ],
  },
];

/**
 * Filter Combination Logic (Property 8)
 * Evaluates whether an opportunity matches ALL provided filter criteria.
 */
export function matchesAllCriteria(
  opp: JobOpportunity,
  criteria: Partial<OpportunityFilterCriteria>
): boolean {
  // 1. Search term (case-insensitive across title, company, description, and required skills)
  if (criteria.searchTerm && criteria.searchTerm.trim().length > 0) {
    const term = criteria.searchTerm.toLowerCase().trim();
    const titleMatch = opp.title.toLowerCase().includes(term);
    const companyMatch = opp.company.toLowerCase().includes(term);
    const descMatch = opp.description.toLowerCase().includes(term);
    const skillsMatch = opp.requiredSkills.some((s) => s.toLowerCase().includes(term));

    if (!titleMatch && !companyMatch && !descMatch && !skillsMatch) {
      return false;
    }
  }

  // 2. Location filter (matches any selected location)
  if (criteria.locations && criteria.locations.length > 0) {
    const matchLoc = criteria.locations.some(
      (loc) => opp.location.toLowerCase().includes(loc.toLowerCase())
    );
    if (!matchLoc) return false;
  }

  // 3. Company filter
  if (criteria.companies && criteria.companies.length > 0) {
    const matchComp = criteria.companies.some(
      (comp) => opp.company.toLowerCase() === comp.toLowerCase()
    );
    if (!matchComp) return false;
  }

  // 4. Role type filter (Full-time, Internship, etc.)
  if (criteria.types && criteria.types.length > 0) {
    if (!criteria.types.includes(opp.type)) {
      return false;
    }
  }

  // 5. Workplace type filter (Remote, On-site, Hybrid)
  if (criteria.workplaceTypes && criteria.workplaceTypes.length > 0) {
    if (!opp.workplaceType || !criteria.workplaceTypes.includes(opp.workplaceType)) {
      return false;
    }
  }

  // 6. Minimum match score filter
  if (typeof criteria.minMatchScore === 'number' && criteria.minMatchScore > 0) {
    if ((opp.matchScore || 0) < criteria.minMatchScore) {
      return false;
    }
  }

  return true;
}

export const opportunityService = {
  // Storage helpers
  getSavedOpportunities(): JobOpportunity[] {
    try {
      const raw = localStorage.getItem(OPPORTUNITIES_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fallback
    }
    return mockOpportunities;
  },

  saveOpportunities(items: JobOpportunity[]): void {
    try {
      localStorage.setItem(OPPORTUNITIES_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage error
    }
  },

  getSavedApplications(): Application[] {
    try {
      const raw = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fallback
    }
    return initialMockApplications;
  },

  saveApplications(apps: Application[]): void {
    try {
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(apps));
    } catch {
      // Ignore storage error
    }
  },

  // Opportunities retrieval
  async getOpportunities(criteria?: Partial<OpportunityFilterCriteria>): Promise<JobOpportunity[]> {
    const all = this.getSavedOpportunities();
    if (!criteria) return all;
    return all.filter((opp) => matchesAllCriteria(opp, criteria));
  },

  async getOpportunityById(id: string): Promise<JobOpportunity | null> {
    const all = this.getSavedOpportunities();
    return all.find((o) => o.id === id) || null;
  },

  // Duplicate Application Prevention (Property 9)
  async hasStudentApplied(studentId: string, opportunityId: string): Promise<boolean> {
    const apps = this.getSavedApplications();
    return apps.some(
      (a) =>
        a.studentId === studentId &&
        a.opportunityId === opportunityId &&
        a.status !== 'withdrawn'
    );
  },

  /**
   * Applies a student to an opportunity.
   * Throws an error if a non-withdrawn application already exists (Property 9).
   */
  async applyToOpportunity(
    studentId: string,
    opportunityId: string,
    metadata?: {
      studentName?: string;
      studentEmail?: string;
      resumeFileName?: string;
      notes?: string;
    }
  ): Promise<Application> {
    const opp = await this.getOpportunityById(opportunityId);
    if (!opp) throw new Error('Target opportunity not found');

    const alreadyApplied = await this.hasStudentApplied(studentId, opportunityId);
    if (alreadyApplied) {
      throw new Error(
        'Duplicate application detected: You have already submitted an active application for this opportunity.'
      );
    }

    const application: Application = {
      id: `app-${uuidv4().slice(0, 8)}`,
      studentId,
      studentName: metadata?.studentName || 'Student Candidate',
      studentEmail: metadata?.studentEmail || 'student@campus.edu',
      opportunityId,
      opportunityTitle: opp.title,
      company: opp.company,
      location: opp.location,
      type: opp.type,
      status: 'applied',
      appliedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      skillMatchPercentage: opp.matchScore || 85,
      notes: metadata?.notes,
      resumeFileName: metadata?.resumeFileName || 'Default_Resume.pdf',
      timeline: [
        {
          status: 'applied',
          date: new Date().toISOString(),
          message: 'Application registered and forwarded to recruiter review queue.',
        },
      ],
    };

    const apps = this.getSavedApplications();
    apps.unshift(application);
    this.saveApplications(apps);

    // Update applicant list in opportunity
    if (!opp.applicants) opp.applicants = [];
    if (!opp.applicants.includes(studentId)) {
      opp.applicants.push(studentId);
      const opps = this.getSavedOpportunities().map((o) => (o.id === opp.id ? opp : o));
      this.saveOpportunities(opps);
    }

    return application;
  },

  // Student Applications (Phase FE9)
  async getStudentApplications(studentId: string): Promise<Application[]> {
    const apps = this.getSavedApplications();
    return apps.filter((a) => a.studentId === studentId);
  },

  async getApplicationById(applicationId: string): Promise<Application | null> {
    const apps = this.getSavedApplications();
    return apps.find((a) => a.id === applicationId) || null;
  },

  async withdrawApplication(
    applicationId: string,
    reason: string = 'Candidate voluntarily withdrew application.'
  ): Promise<Application> {
    const apps = this.getSavedApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    app.status = 'withdrawn';
    app.withdrawalReason = reason;
    app.lastUpdated = new Date().toISOString();
    app.timeline.push({
      status: 'withdrawn',
      date: new Date().toISOString(),
      message: `Withdrawal recorded: ${reason}`,
    });

    this.saveApplications(apps);
    return app;
  },
};

export default opportunityService;
