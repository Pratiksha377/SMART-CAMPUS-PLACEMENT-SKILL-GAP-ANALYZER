import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { SkillProficiency } from '@/types/skillGap';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { BarChart3 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export interface SkillProficiencyChartProps {
  skills: SkillProficiency[];
  className?: string;
}

export const SkillProficiencyChart: React.FC<SkillProficiencyChartProps> = ({
  skills,
  className = '',
}) => {
  const labels = skills.map((s) => s.skill);
  const currentData = skills.map((s) => s.currentLevel);
  const requiredData = skills.map((s) => s.requiredLevel);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Current Level (%)',
        data: currentData,
        backgroundColor: skills.map((s) => {
          if (s.priority === 'high') return 'rgba(244, 63, 94, 0.85)'; // rose-500
          if (s.priority === 'medium') return 'rgba(245, 158, 11, 0.85)'; // amber-500
          return 'rgba(99, 102, 241, 0.85)'; // indigo-500
        }),
        borderRadius: 6,
      },
      {
        label: 'Required Benchmark (%)',
        data: requiredData,
        backgroundColor: 'rgba(16, 185, 129, 0.4)',
        borderColor: 'rgba(16, 185, 129, 0.9)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#cbd5e1',
          font: {
            size: 11,
          },
          maxRotation: 30,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
        ticks: {
          color: '#94a3b8',
          stepSize: 20,
          callback: (value) => `${value}%`,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: 14,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(99, 102, 241, 0.4)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          afterBody: (context) => {
            const index = context[0].dataIndex;
            const skill = skills[index];
            if (skill) {
              return `Gap: ${skill.gap}% (${skill.priority.toUpperCase()} priority)`;
            }
            return '';
          },
        },
      },
    },
  };

  return (
    <Card
      variant="glass"
      padding="md"
      className={`font-sans ${className}`}
      data-testid="skill-proficiency-chart-card"
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <CardTitle className="text-base font-bold text-slate-100">
            Proficiency Levels & Gap Breakdown
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-slate-400">
          Individual skill comparison highlighting deficits that require dedicated study.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          className="relative w-full h-[320px] sm:h-[360px] flex items-center justify-center pt-2"
          data-testid="skill-proficiency-bar-chart"
        >
          {skills.length === 0 ? (
            <div className="text-center text-xs text-slate-500">
              No skill data available for this category filter.
            </div>
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillProficiencyChart;
