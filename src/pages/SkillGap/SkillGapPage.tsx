import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import {
  skillGapService,
  benchmarkRoles,
} from '@/services/skillGapService';
import { SkillGapAnalysis, SkillCategory } from '@/types/skillGap';
import { SkillComparison } from '@/components/SkillComparison';
import { SkillProficiencyChart } from '@/components/SkillProficiencyChart';
import { SkillGapRecommendations } from '@/components/SkillGapRecommendations';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  TrendingUp,
  Target,
  Sparkles,
  Award,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Layers,
} from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAppSelector((state) => state.profile);
  const { resultsHistory } = useAppSelector((state) => state.assessment);

  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-fullstack');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Re-run analysis whenever target role or assessments update
  useEffect(() => {
    const runAnalysis = async () => {
      setIsLoading(true);
      try {
        const studentId = profile?.id || 'std-guest';
        const profileSkills = profile?.skills || [];
        const result = await skillGapService.getSkillGapAnalysis(
          studentId,
          selectedRoleId,
          profileSkills,
          resultsHistory
        );
        setAnalysis(result);
      } finally {
        setIsLoading(false);
      }
    };

    runAnalysis();
  }, [profile, resultsHistory, selectedRoleId]);

  const categories: Array<string> = ['All', 'Frontend', 'Backend', 'Database', 'Algorithms', 'DevOps'];

  // Filter skills and recommendations by category
  const filteredSkills = (analysis?.skills || []).filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  const filteredRecommendations = (analysis?.recommendations || []).filter((r) => {
    if (selectedCategory === 'All') return true;
    return r.category === selectedCategory;
  });

  const highPriorityGapsCount = (analysis?.skills || []).filter(
    (s) => s.priority === 'high'
  ).length;

  const totalGapsCount = (analysis?.skills || []).filter((s) => s.gap > 0).length;

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn"
      data-testid="skill-gap-page"
    >
      {/* 1. Header & Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
            Skill Gap Analysis & Benchmark Alignment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare verified competencies against industry hiring benchmarks and access targeted remediation resources.
          </p>
        </div>

        {/* Target Role Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="target-role-select" className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            Target Role:
          </label>
          <select
            id="target-role-select"
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-sans shadow-sm"
          >
            {benchmarkRoles.map((role) => (
              <option key={role.roleId} value={role.roleId}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Hero Placement Readiness Card */}
      {analysis && (
        <Card variant="glass" padding="lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div
                className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center font-bold text-2xl shadow-xl shrink-0 border ${
                  analysis.overallReadinessPercentage >= 80
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-950/40'
                    : analysis.overallReadinessPercentage >= 65
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-amber-950/40'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-rose-950/40'
                }`}
              >
                <span>{analysis.overallReadinessPercentage}%</span>
                <span className="text-[10px] font-normal uppercase tracking-wider opacity-80">
                  Readiness
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h2 className="text-xl font-bold text-slate-100">
                    Role Match: {analysis.targetRole}
                  </h2>
                  <Badge
                    variant={
                      analysis.overallReadinessPercentage >= 80
                        ? 'success'
                        : analysis.overallReadinessPercentage >= 65
                        ? 'warning'
                        : 'danger'
                    }
                    size="md"
                    dot
                  >
                    {analysis.overallReadinessPercentage >= 80
                      ? 'Placement Ready'
                      : analysis.overallReadinessPercentage >= 65
                      ? 'Competitive Candidate'
                      : 'Remediation Required'}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 mt-2.5">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    Verified Assessments: <strong>{analysis.totalAssessmentsCount}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    Total Skill Gaps: <strong>{totalGapsCount}</strong>
                  </span>
                  {highPriorityGapsCount > 0 && (
                    <span className="flex items-center gap-1.5 text-rose-300 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      Critical Gaps: <strong>{highPriorityGapsCount}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/student/assessments')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Take Skills Assessment
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`
              px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap
              ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:text-white'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillComparison skills={filteredSkills} />
        <SkillProficiencyChart skills={filteredSkills} />
      </div>

      {/* 5. Prioritized Action Recommendations & Resources */}
      <SkillGapRecommendations recommendations={filteredRecommendations} />
    </div>
  );
};

export default SkillGapPage;
