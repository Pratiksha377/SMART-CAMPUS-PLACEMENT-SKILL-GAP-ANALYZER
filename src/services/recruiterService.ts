import { v4 as uuidv4 } from 'uuid';
import {
  JobOpportunity,
  OpportunityStatus,
  ApplicationStatus,
  Application,
  RequiredSkill,
} from '@/types/opportunity';
import {
  JobPostingFormData,
  ApplicantCandidate,
  ApplicantFilterCriteria,
  RecruiterMetrics,
  SkillProficiencyLevel,
} from '@/types/recruiter';
import { opportunityService } from './opportunityService';
import { SkillProficiency } from '@/types/profile';

// Numerical weights for comparing skill proficiency levels
export const PROFICIENCY_WEIGHTS: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

export const normalizeProficiency = (
  level?: string
): number => {
  if (!level) return 1;
  const lower = level.toLowerCase();
  return PROFICIENCY_WEIGHTS[lower] || 1;
};

// Initial mock candidates pool for applicant evaluation and skill matching
export const mockCandidatesPool: {
  id: string;
  name: string;
  email: string;
  department: string;
  cgpa: number;
  graduationYear: number;
  resumeFileName: string;
  skills: { name: string; proficiency: SkillProficiency }[];
}[] = [
  {
    id: 'std-candidate-001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@campus.edu',
    department: 'Computer Science & Engineering',
    cgpa: 8.9,
    graduationYear: 2026,
    resumeFileName: 'Aarav_Sharma_Resume.pdf',
    skills: [
      { name: 'React & UI Frameworks', proficiency: 'Advanced' },
      { name: 'TypeScript & JavaScript', proficiency: 'Advanced' },
      { name: 'Node.js & Backend APIs', proficiency: 'Intermediate' },
      { name: 'Data Structures & Algorithms', proficiency: 'Advanced' },
      { name: 'SQL & Database Architecture', proficiency: 'Intermediate' },
      { name: 'DevOps, Git & CI/CD', proficiency: 'Intermediate' },
    ],
  },
  {
    id: 'std-candidate-002',
    name: 'Diya Patel',
    email: 'diya.patel@campus.edu',
    department: 'Information Technology',
    cgpa: 9.3,
    graduationYear: 2026,
    resumeFileName: 'Diya_Patel_Portfolio.pdf',
    skills: [
      { name: 'React & UI Frameworks', proficiency: 'Expert' },
      { name: 'TypeScript & JavaScript', proficiency: 'Expert' },
      { name: 'CSS & Responsive Design', proficiency: 'Advanced' },
      { name: 'Web Performance & Accessibility', proficiency: 'Advanced' },
      { name: 'Data Structures & Algorithms', proficiency: 'Intermediate' },
    ],
  },
  {
    id: 'std-candidate-003',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@campus.edu',
    department: 'Computer Science & Engineering',
    cgpa: 8.4,
    graduationYear: 2025,
    resumeFileName: 'Rohan_Deshmukh_CV.pdf',
    skills: [
      { name: 'Node.js & Backend APIs', proficiency: 'Advanced' },
      { name: 'Data Structures & Algorithms', proficiency: 'Advanced' },
      { name: 'SQL & Database Architecture', proficiency: 'Expert' },
      { name: 'DevOps, Git & CI/CD', proficiency: 'Advanced' },
      { name: 'React & UI Frameworks', proficiency: 'Beginner' },
    ],
  },
  {
    id: 'std-candidate-004',
    name: 'Ananya Roy',
    email: 'ananya.roy@campus.edu',
    department: 'Electronics & Communication',
    cgpa: 8.1,
    graduationYear: 2026,
    resumeFileName: 'Ananya_Roy_Profile.pdf',
    skills: [
      { name: 'TypeScript & JavaScript', proficiency: 'Intermediate' },
      { name: 'CSS & Responsive Design', proficiency: 'Intermediate' },
      { name: 'Data Structures & Algorithms', proficiency: 'Intermediate' },
      { name: 'SQL & Database Architecture', proficiency: 'Beginner' },
    ],
  },
  {
    id: 'std-candidate-005',
    name: 'Kabir Mehta',
    email: 'kabir.mehta@campus.edu',
    department: 'Computer Science & Engineering',
    cgpa: 7.8,
    graduationYear: 2026,
    resumeFileName: 'Kabir_Mehta_Resume.pdf',
    skills: [
      { name: 'React & UI Frameworks', proficiency: 'Beginner' },
      { name: 'TypeScript & JavaScript', proficiency: 'Beginner' },
      { name: 'Python', proficiency: 'Intermediate' },
    ],
  },
];

export const recruiterService = {
  /**
   * Create a new job posting.
   * Immediately saves to persistent opportunities storage.
   * Validates Property 11: Job Posting Round-trip.
   */
  async createPosting(
    formData: JobPostingFormData,
    recruiterId: string = 'rec-default-01'
  ): Promise<JobOpportunity> {
    if (!formData.title?.trim()) {
      throw new Error('Opportunity title is required');
    }
    if (!formData.description?.trim()) {
      throw new Error('Opportunity description is required');
    }
    if (!formData.deadline?.trim()) {
      throw new Error('Application deadline is required');
    }
    if (!formData.skills || formData.skills.length === 0) {
      throw new Error('At least one required skill must be specified');
    }

    const detailedSkills: RequiredSkill[] = formData.skills.map((s) => ({
      skill: s.skill.trim(),
      level: s.level,
    }));

    const requiredSkills: string[] = detailedSkills.map((s) => s.skill);

    const newPosting: JobOpportunity = {
      id: `opp-${uuidv4().slice(0, 8)}`,
      recruiterId,
      title: formData.title.trim(),
      company: formData.company?.trim() || 'Tech Innovators Corp',
      location: formData.location?.trim() || 'Remote',
      workplaceType: formData.workplaceType || 'Hybrid',
      type: formData.type || 'Full-time',
      description: formData.description.trim(),
      requirements: formData.requirements
        ? formData.requirements.split('\n').filter((l) => l.trim().length > 0)
        : [
            'Bachelor’s or Master’s in Computer Science or related degree',
            'Strong foundation in core computing principles and collaborative teamwork',
          ],
      responsibilities: formData.responsibilities
        ? formData.responsibilities.split('\n').filter((l) => l.trim().length > 0)
        : [
            'Collaborate with multi-functional engineering squads',
            'Build reliable features and participate in agile sprints',
          ],
      requiredSkills,
      detailedSkills,
      salaryRange: formData.salaryRange?.trim() || 'Competitive Package',
      deadline: formData.deadline.includes('T')
        ? formData.deadline
        : `${formData.deadline}T23:59:59Z`,
      postedAt: new Date().toISOString(),
      applicants: [],
      status: formData.status || 'open',
      matchScore: 90,
    };

    const currentOpportunities = opportunityService.getSavedOpportunities();
    currentOpportunities.unshift(newPosting);
    opportunityService.saveOpportunities(currentOpportunities);

    return newPosting;
  },

  /**
   * Retrieves all postings associated with a recruiter (or all if recruiterId is omitted).
   */
  async getRecruiterPostings(recruiterId?: string): Promise<JobOpportunity[]> {
    const all = opportunityService.getSavedOpportunities();
    if (!recruiterId) return all;
    return all.filter((o) => o.recruiterId === recruiterId);
  },

  /**
   * Retrieve posting by ID.
   */
  async getPostingById(id: string): Promise<JobOpportunity | null> {
    return opportunityService.getOpportunityById(id);
  },

  /**
   * Update an existing job posting.
   * Immediately propagates changes to persistent storage.
   * Validates Property 12: Posting Update Propagation.
   */
  async updatePosting(
    id: string,
    updates: Partial<JobOpportunity>
  ): Promise<JobOpportunity> {
    const all = opportunityService.getSavedOpportunities();
    const index = all.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new Error(`Job posting with ID ${id} not found`);
    }

    const current = all[index];
    const updated: JobOpportunity = {
      ...current,
      ...updates,
      id: current.id, // prevent ID override
      recruiterId: current.recruiterId,
    };

    // If detailedSkills was updated, sync requiredSkills strings
    if (updates.detailedSkills) {
      updated.requiredSkills = updates.detailedSkills.map((s) => s.skill);
    }

    all[index] = updated;
    opportunityService.saveOpportunities(all);

    return updated;
  },

  /**
   * Delete a job posting.
   */
  async deletePosting(id: string): Promise<boolean> {
    const all = opportunityService.getSavedOpportunities();
    const filtered = all.filter((o) => o.id !== id);
    if (filtered.length === all.length) return false;

    opportunityService.saveOpportunities(filtered);
    return true;
  },

  /**
   * Toggle posting status ('open' | 'closed' | 'filled').
   */
  async updatePostingStatus(
    id: string,
    status: OpportunityStatus
  ): Promise<JobOpportunity> {
    return this.updatePosting(id, { status });
  },

  /**
   * Evaluates skill match between a student candidate and a job posting.
   * Checks both skill existence and minimum required proficiency level.
   */
  evaluateCandidateMatch(
    candidateSkills: { name: string; proficiency: SkillProficiency }[],
    requiredSkills: RequiredSkill[] | string[]
  ): {
    matchedSkills: string[];
    missingSkills: string[];
    matchPercentage: number;
    fullyMatchesAll: boolean;
  } {
    if (!requiredSkills || requiredSkills.length === 0) {
      return {
        matchedSkills: [],
        missingSkills: [],
        matchPercentage: 100,
        fullyMatchesAll: true,
      };
    }

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    // Normalize required skills to RequiredSkill[] format
    const normalizedRequirements: RequiredSkill[] = requiredSkills.map((req) => {
      if (typeof req === 'string') {
        return { skill: req, level: 'intermediate' };
      }
      return req;
    });

    for (const req of normalizedRequirements) {
      const targetReqName = req.skill.toLowerCase().trim();
      const requiredWeight = normalizeProficiency(req.level);

      // Find best match in candidate's skills
      const studentSkill = candidateSkills.find((candSkill) => {
        const candName = candSkill.name.toLowerCase().trim();
        return (
          candName === targetReqName ||
          candName.includes(targetReqName) ||
          targetReqName.includes(candName)
        );
      });

      if (studentSkill) {
        const studentWeight = normalizeProficiency(studentSkill.proficiency);
        if (studentWeight >= requiredWeight) {
          matchedSkills.push(req.skill);
        } else {
          missingSkills.push(
            `${req.skill} (requires ${req.level}, candidate is ${studentSkill.proficiency.toLowerCase()})`
          );
        }
      } else {
        missingSkills.push(`${req.skill} (missing)`);
      }
    }

    const matchPercentage = Math.round(
      (matchedSkills.length / normalizedRequirements.length) * 100
    );
    const fullyMatchesAll = matchedSkills.length === normalizedRequirements.length;

    return {
      matchedSkills,
      missingSkills,
      matchPercentage,
      fullyMatchesAll,
    };
  },

  /**
   * Retrieves and ranks applicants for a specific posting.
   * Validates Property 13: Applicant Filtering Accuracy.
   * When requireAllSkills is true, ALL returned student profiles SHALL match the
   * skill requirements of that posting at the specified proficiency levels.
   */
  async getApplicantsForPosting(
    postingId: string,
    filter?: ApplicantFilterCriteria
  ): Promise<ApplicantCandidate[]> {
    const posting = await this.getPostingById(postingId);
    if (!posting) {
      throw new Error(`Job posting with ID ${postingId} not found`);
    }

    const requirements = posting.detailedSkills || posting.requiredSkills;

    // Retrieve active student applications for this posting
    const savedApps = opportunityService.getSavedApplications().filter(
      (a) => a.opportunityId === postingId && a.status !== 'withdrawn'
    );

    // Map candidates from pool or applications
    const results: ApplicantCandidate[] = [];

    // First include candidates that have explicit saved applications
    const existingStudentIds = new Set<string>();

    for (const app of savedApps) {
      existingStudentIds.add(app.studentId);
      const poolMatch = mockCandidatesPool.find((c) => c.id === app.studentId) || {
        id: app.studentId,
        name: app.studentName || 'Student Applicant',
        email: app.studentEmail || 'student@campus.edu',
        department: 'Computer Science & Engineering',
        cgpa: 8.5,
        graduationYear: 2026,
        resumeFileName: app.resumeFileName || 'Resume.pdf',
        skills: [
          { name: 'React & UI Frameworks', proficiency: 'Advanced' as SkillProficiency },
          { name: 'TypeScript & JavaScript', proficiency: 'Advanced' as SkillProficiency },
          { name: 'Data Structures & Algorithms', proficiency: 'Intermediate' as SkillProficiency },
        ],
      };

      const match = this.evaluateCandidateMatch(poolMatch.skills, requirements);

      results.push({
        id: poolMatch.id,
        applicationId: app.id,
        opportunityId: postingId,
        opportunityTitle: posting.title,
        studentName: poolMatch.name,
        studentEmail: poolMatch.email,
        department: poolMatch.department,
        cgpa: poolMatch.cgpa,
        graduationYear: poolMatch.graduationYear,
        resumeFileName: app.resumeFileName || poolMatch.resumeFileName,
        appliedAt: app.appliedAt,
        status: app.status,
        skillMatchPercentage: match.matchPercentage,
        studentSkills: poolMatch.skills,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        notes: app.notes,
      });
    }

    // Also populate with pool candidates for demo richness if needed
    for (let i = 0; i < mockCandidatesPool.length; i++) {
      const candidate = mockCandidatesPool[i];
      if (!existingStudentIds.has(candidate.id)) {
        const match = this.evaluateCandidateMatch(candidate.skills, requirements);
        const demoStatuses: ApplicationStatus[] = [
          'applied',
          'reviewed',
          'shortlisted',
          'selected',
          'applied',
        ];

        results.push({
          id: candidate.id,
          applicationId: `app-demo-${candidate.id}-${postingId.slice(-4)}`,
          opportunityId: postingId,
          opportunityTitle: posting.title,
          studentName: candidate.name,
          studentEmail: candidate.email,
          department: candidate.department,
          cgpa: candidate.cgpa,
          graduationYear: candidate.graduationYear,
          resumeFileName: candidate.resumeFileName,
          appliedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
          status: demoStatuses[i % demoStatuses.length],
          skillMatchPercentage: match.matchPercentage,
          studentSkills: candidate.skills,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
        });
      }
    }

    // Apply filtering criteria
    let filtered = results;

    // Property 13 validation check: requireAllSkills
    if (filter?.requireAllSkills) {
      filtered = filtered.filter((c) => {
        const evalRes = this.evaluateCandidateMatch(c.studentSkills, requirements);
        return evalRes.fullyMatchesAll;
      });
    }

    // Min match score filter
    if (typeof filter?.minMatchScore === 'number' && filter.minMatchScore > 0) {
      filtered = filtered.filter((c) => c.skillMatchPercentage >= filter.minMatchScore!);
    }

    // Application status filter
    if (filter?.status && filter.status !== 'all') {
      filtered = filtered.filter((c) => c.status === filter.status);
    }

    // Search query filter (name or email or skills)
    if (filter?.searchQuery?.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.studentName.toLowerCase().includes(q) ||
          c.studentEmail.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q) ||
          c.studentSkills.some((s) => s.name.toLowerCase().includes(q))
      );
    }

    // Sort order
    const sortBy = filter?.sortBy || 'matchDesc';
    filtered.sort((a, b) => {
      if (sortBy === 'matchDesc') return b.skillMatchPercentage - a.skillMatchPercentage;
      if (sortBy === 'matchAsc') return a.skillMatchPercentage - b.skillMatchPercentage;
      if (sortBy === 'dateDesc')
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
      if (sortBy === 'nameAsc') return a.studentName.localeCompare(b.studentName);
      return 0;
    });

    return filtered;
  },

  /**
   * Update applicant status from recruiter actions.
   */
  async updateApplicantStatus(
    applicationId: string,
    status: ApplicationStatus,
    notes?: string
  ): Promise<Application> {
    const apps = opportunityService.getSavedApplications();
    let app = apps.find((a) => a.id === applicationId);

    if (!app) {
      // Create or update demo application record
      app = {
        id: applicationId,
        studentId: 'std-candidate-001',
        opportunityId: 'opp-google-swe-01',
        opportunityTitle: 'Software Engineer',
        company: 'Campus Recruiter',
        location: 'Bengaluru',
        type: 'Full-time',
        status,
        appliedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        skillMatchPercentage: 88,
        notes,
        timeline: [
          {
            status,
            date: new Date().toISOString(),
            message: `Status updated to ${status} by recruiter`,
          },
        ],
      };
      apps.unshift(app);
    } else {
      app.status = status;
      app.lastUpdated = new Date().toISOString();
      if (notes) app.notes = notes;
      app.timeline.push({
        status,
        date: new Date().toISOString(),
        message: `Status updated to ${status} by recruiter`,
      });
    }

    opportunityService.saveApplications(apps);
    return app;
  },

  /**
   * Computes dashboard KPIs for recruiter.
   */
  async getRecruiterMetrics(recruiterId?: string): Promise<RecruiterMetrics> {
    const postings = await this.getRecruiterPostings(recruiterId);
    const active = postings.filter((p) => p.status === 'open');
    const filled = postings.filter((p) => p.status === 'filled');

    // Aggregate applicants count
    const totalApplicants = postings.reduce(
      (sum, p) => sum + (p.applicants?.length || 5), // default baseline
      0
    );

    const averageMatch =
      postings.length > 0
        ? Math.round(
            postings.reduce((sum, p) => sum + (p.matchScore || 80), 0) /
              postings.length
          )
        : 85;

    return {
      activePostingsCount: active.length,
      totalPostingsCount: postings.length,
      totalApplicantsCount: totalApplicants,
      shortlistedCount: Math.round(totalApplicants * 0.35),
      filledPostingsCount: filled.length,
      averageMatchScore: averageMatch,
    };
  },
};

export default recruiterService;
