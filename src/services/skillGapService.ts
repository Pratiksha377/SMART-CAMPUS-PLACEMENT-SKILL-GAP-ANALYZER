import {
  SkillGapAnalysis,
  SkillProficiency,
  Recommendation,
  LearningResource,
  BenchmarkRoleRequirement,
  SkillPriority,
  SkillCategory,
} from '@/types/skillGap';
import { AssessmentResult } from '@/types/assessment';
import { SkillItem } from '@/types/profile';

export const benchmarkRoles: BenchmarkRoleRequirement[] = [
  {
    roleId: 'role-fullstack',
    roleName: 'Full Stack Software Engineer',
    description:
      'Industry standard expectations for graduate and associate full-stack web and platform software engineers.',
    benchmarkSkills: [
      { skill: 'React & UI Frameworks', category: 'Frontend', requiredLevel: 85 },
      { skill: 'TypeScript & JavaScript', category: 'Frontend', requiredLevel: 85 },
      { skill: 'Data Structures & Algorithms', category: 'Algorithms', requiredLevel: 80 },
      { skill: 'Node.js & Backend APIs', category: 'Backend', requiredLevel: 80 },
      { skill: 'SQL & Database Architecture', category: 'Database', requiredLevel: 75 },
      { skill: 'DevOps, Git & CI/CD', category: 'DevOps', requiredLevel: 70 },
    ],
  },
  {
    roleId: 'role-frontend',
    roleName: 'Frontend Engineer Specialist',
    description:
      'Deep focus on modern web interfaces, component architecture, client-side performance, and web vitals.',
    benchmarkSkills: [
      { skill: 'React & UI Frameworks', category: 'Frontend', requiredLevel: 90 },
      { skill: 'TypeScript & JavaScript', category: 'Frontend', requiredLevel: 90 },
      { skill: 'CSS & Responsive Design', category: 'Frontend', requiredLevel: 85 },
      { skill: 'Web Performance & Accessibility', category: 'Frontend', requiredLevel: 80 },
      { skill: 'Data Structures & Algorithms', category: 'Algorithms', requiredLevel: 70 },
    ],
  },
  {
    roleId: 'role-backend',
    roleName: 'Backend & Cloud Systems Engineer',
    description:
      'Focus on scalable server architectures, database optimization, distributed systems, and containerized cloud workloads.',
    benchmarkSkills: [
      { skill: 'Node.js & Backend APIs', category: 'Backend', requiredLevel: 90 },
      { skill: 'SQL & Database Architecture', category: 'Database', requiredLevel: 85 },
      { skill: 'Data Structures & Algorithms', category: 'Algorithms', requiredLevel: 85 },
      { skill: 'DevOps, Git & CI/CD', category: 'DevOps', requiredLevel: 80 },
      { skill: 'System Design & Scalability', category: 'Backend', requiredLevel: 75 },
    ],
  },
];

export const curatedResourcesCatalog: Record<string, LearningResource[]> = {
  'React & UI Frameworks': [
    {
      id: 'res-react-docs',
      skill: 'React & UI Frameworks',
      title: 'Official React 19 Docs & Architecture Patterns',
      type: 'Documentation',
      provider: 'React.dev',
      url: 'https://react.dev',
      estimatedHours: 8,
      difficulty: 'Intermediate',
    },
    {
      id: 'res-react-epic',
      skill: 'React & UI Frameworks',
      title: 'Advanced Component Design & Custom Hooks',
      type: 'Course',
      provider: 'Campus Learning Hub',
      url: 'https://campus.edu/courses/react-advanced',
      estimatedHours: 14,
      difficulty: 'Advanced',
    },
  ],
  'TypeScript & JavaScript': [
    {
      id: 'res-ts-handbook',
      skill: 'TypeScript & JavaScript',
      title: 'TypeScript Deep Dive: Generics & Utility Types',
      type: 'Documentation',
      provider: 'TypeScriptLang.org',
      url: 'https://www.typescriptlang.org/docs/',
      estimatedHours: 6,
      difficulty: 'Intermediate',
    },
    {
      id: 'res-ts-exercises',
      skill: 'TypeScript & JavaScript',
      title: 'Type-Challenges Interactive Practice',
      type: 'Practice',
      provider: 'GitHub Open Source',
      url: 'https://github.com/type-challenges/type-challenges',
      estimatedHours: 10,
      difficulty: 'Advanced',
    },
  ],
  'Data Structures & Algorithms': [
    {
      id: 'res-dsa-neet',
      skill: 'Data Structures & Algorithms',
      title: 'Blind 75 & NeetCode Algorithm Traversal Roadmap',
      type: 'Practice',
      provider: 'NeetCode.io',
      url: 'https://neetcode.io',
      estimatedHours: 25,
      difficulty: 'Advanced',
    },
    {
      id: 'res-dsa-mit',
      skill: 'Data Structures & Algorithms',
      title: 'Introduction to Algorithms & Complexity Analysis',
      type: 'Course',
      provider: 'MIT OpenCourseWare',
      url: 'https://ocw.mit.edu',
      estimatedHours: 20,
      difficulty: 'Intermediate',
    },
  ],
  'SQL & Database Architecture': [
    {
      id: 'res-sql-indexes',
      skill: 'SQL & Database Architecture',
      title: 'Use The Index, Luke: Relational Index Mechanics',
      type: 'Documentation',
      provider: 'Database Systems Group',
      url: 'https://use-the-index-luke.com',
      estimatedHours: 8,
      difficulty: 'Intermediate',
    },
    {
      id: 'res-sql-mode',
      skill: 'SQL & Database Architecture',
      title: 'Intermediate & Advanced SQL for Engineering',
      type: 'Practice',
      provider: 'Mode Analytics',
      url: 'https://mode.com/sql-tutorial',
      estimatedHours: 12,
      difficulty: 'Intermediate',
    },
  ],
  'Node.js & Backend APIs': [
    {
      id: 'res-node-patterns',
      skill: 'Node.js & Backend APIs',
      title: 'RESTful and GraphQL API Design with Node & Express',
      type: 'Course',
      provider: 'University Tech Portal',
      url: 'https://campus.edu/courses/backend-api-design',
      estimatedHours: 12,
      difficulty: 'Intermediate',
    },
  ],
  'DevOps, Git & CI/CD': [
    {
      id: 'res-devops-dock',
      skill: 'DevOps, Git & CI/CD',
      title: 'Docker & Containerization Workflow for Developers',
      type: 'Course',
      provider: 'DevOps Academy',
      url: 'https://docker.com',
      estimatedHours: 10,
      difficulty: 'Beginner',
    },
  ],
};

/**
 * Normalizes and matches skill names to find relevant assessment results and baseline scores.
 */
function isSkillMatch(targetSkill: string, assessedArea: string): boolean {
  const normTarget = targetSkill.toLowerCase();
  const normAssessed = assessedArea.toLowerCase();

  if (normTarget.includes(normAssessed) || normAssessed.includes(normTarget)) return true;

  if (normTarget.includes('react') && normAssessed.includes('frontend')) return true;
  if (normTarget.includes('typescript') && normAssessed.includes('frontend')) return true;
  if (normTarget.includes('algorithms') && normAssessed.includes('algo')) return true;
  if (normTarget.includes('sql') && (normAssessed.includes('database') || normAssessed.includes('sql'))) return true;
  if (normTarget.includes('backend') && (normAssessed.includes('backend') || normAssessed.includes('node'))) return true;

  return false;
}

/**
 * Core Data Aggregation Logic (Property 7: Skill Gap Aggregation)
 * For any student with multiple assessment results, the skill gap analysis
 * SHALL incorporate all assessment scores into the current skill proficiency levels.
 */
export function aggregateSkillProficiencies(
  baseSkills: SkillItem[] = [],
  assessmentResults: AssessmentResult[] = [],
  benchmark: BenchmarkRoleRequirement
): SkillProficiency[] {
  return benchmark.benchmarkSkills.map((req) => {
    // 1. Identify baseline self-reported proficiency if present
    const baseMatch = baseSkills.find((s) => isSkillMatch(req.skill, s.name));
    let baseLevel = 60; // default initial baseline
    if (baseMatch) {
      if (typeof baseMatch.score === 'number' && baseMatch.score > 0) {
        baseLevel = baseMatch.score;
      } else {
        switch (baseMatch.proficiency) {
          case 'Beginner':
            baseLevel = 45;
            break;
          case 'Intermediate':
            baseLevel = 70;
            break;
          case 'Advanced':
            baseLevel = 85;
            break;
          case 'Expert':
            baseLevel = 95;
            break;
          default:
            baseLevel = 60;
        }
      }
    }

    // 2. Identify ALL matching assessment results (Property 7 guarantee)
    const matchingAssessments = assessmentResults.filter(
      (ar) =>
        isSkillMatch(req.skill, ar.skillArea) ||
        isSkillMatch(req.skill, ar.assessmentTitle)
    );

    let currentLevel: number;
    let avgAssessmentScore: number | undefined;
    const assessmentCount = matchingAssessments.length;

    if (assessmentCount > 0) {
      // Sum all matching assessment percentages
      const totalScore = matchingAssessments.reduce((sum, ar) => sum + ar.percentage, 0);
      avgAssessmentScore = Math.round(totalScore / assessmentCount);

      // Blended calculation incorporating all assessment scores
      // 75% weighted towards verified assessment results, 25% baseline
      currentLevel = Math.round(avgAssessmentScore * 0.75 + baseLevel * 0.25);
    } else {
      currentLevel = baseLevel;
    }

    // Clamp currentLevel to 0 - 100
    currentLevel = Math.max(0, Math.min(100, currentLevel));

    // Calculate gap
    const gap = Math.max(0, req.requiredLevel - currentLevel);

    // Determine priority
    let priority: SkillPriority = 'low';
    if (gap >= 25) {
      priority = 'high';
    } else if (gap >= 12) {
      priority = 'medium';
    } else {
      priority = 'low';
    }

    return {
      skill: req.skill,
      category: req.category,
      currentLevel,
      requiredLevel: req.requiredLevel,
      gap,
      priority,
      assessmentScore: avgAssessmentScore,
      assessmentCount,
    };
  });
}

/**
 * Computes recommendations and estimates time to close gaps
 */
export function generateSkillRecommendations(skills: SkillProficiency[]): Recommendation[] {
  return skills
    .filter((s) => s.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .map((s) => {
      let advice = '';
      let timeToClose = '1-2 weeks';

      if (s.priority === 'high') {
        advice = `Critical priority gap of ${s.gap}%. Complete targeted assessments and structured practice projects to attain benchmark readiness (${s.requiredLevel}%).`;
        timeToClose = s.gap > 35 ? '4-6 weeks' : '3-4 weeks';
      } else if (s.priority === 'medium') {
        advice = `Moderate gap of ${s.gap}%. Review core architectural patterns and implement test assignments to reach the required level of ${s.requiredLevel}%.`;
        timeToClose = '2-3 weeks';
      } else {
        advice = `Minor refinement gap of ${s.gap}%. Solidify nuances and review reference documentation to achieve mastery.`;
        timeToClose = '1 week';
      }

      const resources =
        curatedResourcesCatalog[s.skill] || [
          {
            id: `res-generic-${s.skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            skill: s.skill,
            title: `${s.skill} Mastery Guide & Interactive Labs`,
            type: 'Course' as const,
            provider: 'Campus Technical Library',
            url: 'https://campus.edu/learning-resources',
            estimatedHours: 10,
            difficulty: 'Intermediate' as const,
          },
        ];

      return {
        id: `rec-${s.skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        skill: s.skill,
        category: s.category,
        currentScore: s.currentLevel,
        targetScore: s.requiredLevel,
        priority: s.priority,
        actionableAdvice: advice,
        estimatedTimeToClose: timeToClose,
        resources,
      };
    });
}

export const skillGapService = {
  getBenchmarkRoles(): BenchmarkRoleRequirement[] {
    return benchmarkRoles;
  },

  getBenchmarkRoleById(roleId: string): BenchmarkRoleRequirement {
    return (
      benchmarkRoles.find((r) => r.roleId === roleId) || benchmarkRoles[0]
    );
  },

  async getSkillGapAnalysis(
    studentId: string,
    roleId: string = 'role-fullstack',
    profileSkills: SkillItem[] = [],
    assessmentResults: AssessmentResult[] = []
  ): Promise<SkillGapAnalysis> {
    const benchmark = this.getBenchmarkRoleById(roleId);
    const skills = aggregateSkillProficiencies(profileSkills, assessmentResults, benchmark);
    const recommendations = generateSkillRecommendations(skills);

    // Compute overall readiness percentage
    const readinessSum = skills.reduce(
      (sum, s) => sum + Math.min(100, (s.currentLevel / s.requiredLevel) * 100),
      0
    );
    const overallReadinessPercentage = Math.round(readinessSum / skills.length);

    return {
      studentId,
      targetRole: benchmark.roleName,
      overallReadinessPercentage,
      skills,
      recommendations,
      assessedAt: new Date().toISOString(),
      totalAssessmentsCount: assessmentResults.length,
    };
  },
};

export default skillGapService;
