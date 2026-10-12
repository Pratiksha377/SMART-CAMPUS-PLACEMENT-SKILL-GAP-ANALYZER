import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { SkillProficiency } from '@/types/skillGap';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Radar as RadarIcon } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export interface SkillComparisonProps {
  skills: SkillProficiency[];
  className?: string;
}

export const SkillComparison: React.FC<SkillComparisonProps> = ({
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
        label: 'Current Proficiency',
        data: currentData,
        backgroundColor: 'rgba(99, 102, 241, 0.25)', // indigo-500
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
        pointRadius: 4,
      },
      {
        label: 'Required Benchmark',
        data: requiredData,
        backgroundColor: 'rgba(16, 185, 129, 0.15)', // emerald-500
        borderColor: 'rgba(16, 185, 129, 0.9)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
        pointRadius: 3,
      },
    ],
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
        pointLabels: {
          color: '#cbd5e1', // slate-300
          font: {
            size: 11,
            family: 'sans-serif',
          },
        },
        ticks: {
          color: '#64748b', // slate-500
          backdropColor: 'transparent',
          stepSize: 20,
          font: {
            size: 9,
          },
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0', // slate-200
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: 16,
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
          label: (context) => `${context.dataset.label}: ${context.parsed.r}%`,
        },
      },
    },
  };

  return (
    <Card
      variant="glass"
      padding="md"
      className={`font-sans ${className}`}
      data-testid="skill-comparison-card"
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <RadarIcon className="w-5 h-5 text-indigo-400" />
          <CardTitle className="text-base font-bold text-slate-100">
            Current vs. Industry Benchmark Radar
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-slate-400">
          Superimposed visualization contrasting your verified skill proficiencies against target role requirements.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          className="relative w-full h-[320px] sm:h-[360px] flex items-center justify-center pt-2"
          data-testid="skill-comparison-radar"
        >
          {skills.length === 0 ? (
            <div className="text-center text-xs text-slate-500">
              No skill data available for this category filter.
            </div>
          ) : (
            <Radar data={chartData} options={options} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillComparison;
