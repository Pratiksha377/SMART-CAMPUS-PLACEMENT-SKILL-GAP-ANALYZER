import React from 'react';
import { AdminMetrics } from '@/types/admin';
import {
  Users,
  Briefcase,
  TrendingUp,
  Award,
  DollarSign,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export interface MetricsWidgetProps {
  metrics: AdminMetrics;
  className?: string;
}

export const MetricsWidget: React.FC<MetricsWidgetProps> = ({
  metrics,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 ${className}`} data-testid="metrics-widget">
      {/* 1. Total Students */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Total Registered</span>
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-white tracking-tight" data-testid="metric-total-students">
            {metrics.totalStudents.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 className="h-3 w-3" />
            {metrics.eligibleStudents} Eligible ({metrics.totalStudents > 0 ? Math.round((metrics.eligibleStudents / metrics.totalStudents) * 100) : 0}%)
          </p>
        </div>
      </div>

      {/* 2. Placed Students */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Students Placed</span>
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Award className="h-4 w-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-emerald-400 tracking-tight" data-testid="metric-total-placed">
            {metrics.totalPlaced.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {metrics.totalOffers} Confirmed Offers
          </p>
        </div>
      </div>

      {/* 3. Placement Rate */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Placement Rate</span>
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-white tracking-tight" data-testid="metric-placement-rate">
              {metrics.placementRate}%
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              +4.8% YoY
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, metrics.placementRate))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Average CTC */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Avg Package (CTC)</span>
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-white tracking-tight" data-testid="metric-avg-package">
            ₹{metrics.averagePackageLPA} <span className="text-xs font-normal text-slate-400">LPA</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Max: ₹{metrics.highestPackageLPA} LPA
          </p>
        </div>
      </div>

      {/* 5. Opportunities Posted */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Opportunities</span>
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Briefcase className="h-4 w-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-white tracking-tight" data-testid="metric-total-opportunities">
            {metrics.totalOpportunities}
          </p>
          <p className="text-[11px] text-purple-400 font-medium mt-1">
            Across 30+ Tech Sectors
          </p>
        </div>
      </div>

      {/* 6. Active Drives */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Active Drives</span>
          <div className="h-8 w-8 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
            <Building2 className="h-4 w-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-white tracking-tight" data-testid="metric-active-drives">
            {metrics.activeDrives}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Campus & Virtual
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricsWidget;
