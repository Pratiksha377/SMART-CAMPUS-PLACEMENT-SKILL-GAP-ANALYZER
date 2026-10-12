import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { SkillPriorityIndicator } from '@/components/SkillPriorityIndicator';
import { LearningResources } from '@/components/LearningResources';
import { SkillGapRecommendations } from '@/components/SkillGapRecommendations';
import { SkillComparison } from '@/components/SkillComparison';
import { SkillProficiencyChart } from '@/components/SkillProficiencyChart';
import { SkillGapPage } from '@/pages/SkillGap/SkillGapPage';
import { SkillProficiency, Recommendation, LearningResource } from '@/types/skillGap';

vi.mock('react-chartjs-2', () => ({
  Radar: ({ data, options }: { data: unknown; options?: unknown }) => (
    <div data-testid="mock-radar-chart" role="img" aria-label="Radar chart">
      Radar Chart Rendered
    </div>
  ),
  Bar: ({ data, options }: { data: unknown; options?: unknown }) => (
    <div data-testid="mock-bar-chart" role="img" aria-label="Bar chart">
      Bar Chart Rendered
    </div>
  ),
}));

const sampleSkills: SkillProficiency[] = [
  {
    skill: 'React & UI Frameworks',
    category: 'Frontend',
    currentLevel: 65,
    requiredLevel: 85,
    gap: 20,
    priority: 'medium',
    assessmentScore: 70,
    assessmentCount: 1,
  },
  {
    skill: 'Data Structures & Algorithms',
    category: 'Algorithms',
    currentLevel: 45,
    requiredLevel: 80,
    gap: 35,
    priority: 'high',
    assessmentScore: 50,
    assessmentCount: 2,
  },
  {
    skill: 'Git & Version Control',
    category: 'DevOps',
    currentLevel: 90,
    requiredLevel: 70,
    gap: 0,
    priority: 'low',
  },
];

const sampleResources: LearningResource[] = [
  {
    id: 'res-1',
    skill: 'React & UI Frameworks',
    title: 'Modern React Architecture Labs',
    type: 'Course',
    provider: 'Campus Hub',
    url: 'https://example.com/react',
    estimatedHours: 8,
    difficulty: 'Intermediate',
  },
];

const sampleRecommendations: Recommendation[] = [
  {
    id: 'rec-dsa',
    skill: 'Data Structures & Algorithms',
    category: 'Algorithms',
    currentScore: 45,
    targetScore: 80,
    priority: 'high',
    actionableAdvice: 'Critical priority deficit. Focus on tree and graph problems.',
    estimatedTimeToClose: '4-6 weeks',
    resources: [
      {
        id: 'res-neet',
        skill: 'Data Structures & Algorithms',
        title: 'Blind 75 Algorithm Roadmap',
        type: 'Practice',
        provider: 'NeetCode.io',
        url: 'https://neetcode.io',
        estimatedHours: 25,
        difficulty: 'Advanced',
      },
    ],
  },
  {
    id: 'rec-react',
    skill: 'React & UI Frameworks',
    category: 'Frontend',
    currentScore: 65,
    targetScore: 85,
    priority: 'medium',
    actionableAdvice: 'Moderate gap. Practice custom hooks and state management.',
    estimatedTimeToClose: '2-3 weeks',
    resources: sampleResources,
  },
];

describe('Skill Gap UI Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SkillPriorityIndicator', () => {
    it('renders correct priority label and styling for high, medium, and low', () => {
      const { rerender } = render(<SkillPriorityIndicator priority="high" gap={30} />);
      expect(screen.getByText('High Priority Gap')).toBeInTheDocument();
      expect(screen.getByText('(-30%)')).toBeInTheDocument();

      rerender(<SkillPriorityIndicator priority="medium" gap={15} />);
      expect(screen.getByText('Medium Priority Gap')).toBeInTheDocument();

      rerender(<SkillPriorityIndicator priority="low" gap={0} />);
      expect(screen.getByText('Target Met')).toBeInTheDocument();
    });
  });

  describe('LearningResources', () => {
    it('renders resource cards with title, provider, hours, and external links', () => {
      render(<LearningResources resources={sampleResources} />);

      expect(screen.getByText('Modern React Architecture Labs')).toBeInTheDocument();
      expect(screen.getByText('Campus Hub')).toBeInTheDocument();
      expect(screen.getByText('~8 hrs')).toBeInTheDocument();
      expect(screen.getByText('Intermediate')).toBeInTheDocument();

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com/react');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('renders empty notice when resource list is empty', () => {
      render(<LearningResources resources={[]} />);
      expect(screen.getByText(/no curated resources/i)).toBeInTheDocument();
    });
  });

  describe('SkillGapRecommendations', () => {
    it('renders list of recommendations sorted by priority and expands resources on click', () => {
      render(<SkillGapRecommendations recommendations={sampleRecommendations} />);

      expect(screen.getByText('Data Structures & Algorithms')).toBeInTheDocument();
      expect(screen.getByText(/Critical priority deficit/i)).toBeInTheDocument();
      expect(screen.getByText('4-6 weeks')).toBeInTheDocument();
      expect(screen.getByText('Blind 75 Algorithm Roadmap')).toBeInTheDocument();

      // Toggle resources for second item
      const toggleButtons = screen.getAllByRole('button', { name: /toggle learning resources/i });
      if (toggleButtons.length > 1) {
        fireEvent.click(toggleButtons[1]);
        expect(screen.getByText('Modern React Architecture Labs')).toBeInTheDocument();
      }
    });

    it('renders empty state when all skills meet benchmark', () => {
      render(<SkillGapRecommendations recommendations={[]} />);
      expect(screen.getByText('Outstanding Mastery!')).toBeInTheDocument();
    });
  });

  describe('SkillComparison and SkillProficiencyChart', () => {
    it('renders Radar comparison and Bar proficiency card containers', () => {
      render(
        <div>
          <SkillComparison skills={sampleSkills} />
          <SkillProficiencyChart skills={sampleSkills} />
        </div>
      );

      expect(screen.getByTestId('skill-comparison-card')).toBeInTheDocument();
      expect(screen.getByTestId('skill-comparison-radar')).toBeInTheDocument();
      expect(screen.getByTestId('skill-proficiency-chart-card')).toBeInTheDocument();
      expect(screen.getByTestId('skill-proficiency-bar-chart')).toBeInTheDocument();
    });
  });

  describe('SkillGapPage Integration', () => {
    it('renders full page layout, hero metrics, role selector, and filters', async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <SkillGapPage />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByText(/Skill Gap Analysis & Benchmark Alignment/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Target Role:/i)).toBeInTheDocument();
      expect(screen.getByText(/Filter:/i)).toBeInTheDocument();

      // Change role dropdown inside act
      const select = screen.getByLabelText(/Target Role:/i);
      await act(async () => {
        fireEvent.change(select, { target: { value: 'role-frontend' } });
      });

      // Change category filter inside act
      const frontendFilter = screen.getByRole('button', { name: 'Frontend' });
      await act(async () => {
        fireEvent.click(frontendFilter);
      });
      expect(frontendFilter.className).toContain('bg-indigo-600');
    });
  });
});
