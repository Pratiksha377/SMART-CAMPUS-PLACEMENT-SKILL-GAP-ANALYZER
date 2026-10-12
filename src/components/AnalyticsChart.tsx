import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { DepartmentStat, SkillGapAuditMetric, PlacementTrendPoint } from '@/types/admin';
import { BarChart3, TrendingUp, PieChart as PieIcon } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

interface SkillDistributionChartProps {
  skills: SkillGapAuditMetric[];
  className?: string;
}

export const SkillDistributionChart: React.FC<SkillDistributionChartProps> = ({
  skills,
  className = '',
}) => {
  const labels = skills.map((s) => s.skill);
  const studentData = skills.map((s) => s.avgProficiency);
  const industryData = skills.map((s) => s.requiredProficiency);

  const data = {
    labels,
    datasets: [
      {
        label: 'Student Avg Proficiency (%)',
        data: studentData,
        backgroundColor: 'rgba(56, 189, 248, 0.8)',
        borderColor: 'rgb(56, 189, 248)',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Industry Demand Benchmark (%)',
        data: industryData,
        backgroundColor: 'rgba(129, 140, 248, 0.4)',
        borderColor: 'rgb(129, 140, 248)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { size: 12, family: 'sans-serif' },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: {
          color: '#94a3b8',
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div
      className={`glass-card rounded-2xl p-5 border border-slate-800 space-y-4 ${className}`}
      data-testid="skill-distribution-chart"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Campus Skill Proficiency vs Industry Benchmark</h3>
            <p className="text-xs text-slate-400">Institutional skill gap distribution across tech competencies</p>
          </div>
        </div>
      </div>
      <div className="h-72 w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

interface PlacementTrendsChartProps {
  trends: PlacementTrendPoint[];
  className?: string;
}

export const PlacementTrendsChart: React.FC<PlacementTrendsChartProps> = ({
  trends,
  className = '',
}) => {
  const labels = trends.map((t) => t.period);
  const placedData = trends.map((t) => t.placedStudents);
  const offersData = trends.map((t) => t.offers);

  const data = {
    labels,
    datasets: [
      {
        label: 'Cumulative Placed Students',
        data: placedData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointRadius: 4,
      },
      {
        label: 'Total Offers Extended',
        data: offersData,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointRadius: 4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
        ticks: { color: '#94a3b8' },
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8' },
      },
    },
  };

  return (
    <div
      className={`glass-card rounded-2xl p-5 border border-slate-800 space-y-4 ${className}`}
      data-testid="placement-trends-chart"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Placement Timeline & Offer Growth</h3>
            <p className="text-xs text-slate-400">Monthly conversion rate of student offers across drives</p>
          </div>
        </div>
      </div>
      <div className="h-72 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

interface DepartmentBreakdownChartProps {
  stats: DepartmentStat[];
  className?: string;
}

export const DepartmentBreakdownChart: React.FC<DepartmentBreakdownChartProps> = ({
  stats,
  className = '',
}) => {
  const labels = stats.map((s) => s.department);
  const dataValues = stats.map((s) => s.placedStudents);

  const colors = [
    '#38bdf8', // Sky
    '#818cf8', // Indigo
    '#34d399', // Emerald
    '#f472b6', // Pink
    '#fbbf24', // Amber
    '#a78bfa', // Purple
    '#fb923c', // Orange
  ];

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: '#0f172a',
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#cbd5e1',
          font: { size: 11 },
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const val = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            return ` ${context.label}: ${val} placed (${pct}%)`;
          },
        },
      },
    },
    cutout: '65%',
  };

  return (
    <div
      className={`glass-card rounded-2xl p-5 border border-slate-800 space-y-4 ${className}`}
      data-testid="department-breakdown-chart"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <PieIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Department Placement Distribution</h3>
            <p className="text-xs text-slate-400">Share of placed students across academic branches</p>
          </div>
        </div>
      </div>
      <div className="h-72 w-full flex items-center justify-center">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
