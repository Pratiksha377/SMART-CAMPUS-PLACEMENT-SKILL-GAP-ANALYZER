import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setAssessments,
  setActiveAssessment,
  setActiveSession,
  setLoading,
  setError,
} from '@/store/assessmentSlice';
import { assessmentService, mockAssessments } from '@/services/assessmentService';
import { Assessment, AssessmentSession } from '@/types/assessment';
import { AssessmentCard } from '@/components/AssessmentCard';
import { AssessmentStartModal } from '@/components/AssessmentStartModal';
import { AssessmentViewer } from '@/components/AssessmentViewer';
import {
  updateAnswer,
  nextQuestion,
  prevQuestion,
  setCurrentQuestion,
  updateTimeRemaining,
  pauseSession,
  completeSession,
  clearActiveSession,
} from '@/store/assessmentSlice';
import { AssessmentResultsPage } from './AssessmentResultsPage';
import { useToast } from '@/hooks';
import { Search, Sparkles, Filter } from 'lucide-react';

export const AssessmentListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { assessments, activeAssessment, activeSession, latestResult } = useAppSelector(
    (state) => state.assessment
  );
  const { profile } = useAppSelector((state) => state.profile);
  const toast = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalAssessment, setModalAssessment] = useState<Assessment | null>(null);
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchAssessments = async () => {
      dispatch(setLoading(true));
      try {
        const data = await assessmentService.getAssessments();
        dispatch(setAssessments(data));
      } catch (err) {
        dispatch(setError('Failed to fetch assessments'));
        dispatch(setAssessments(mockAssessments));
      }
    };
    fetchAssessments();
  }, [dispatch]);

  const handleStartModalOpen = (assessment: Assessment) => {
    setModalAssessment(assessment);
  };

  const handleConfirmStart = async (assessment: Assessment) => {
    setModalAssessment(null);
    dispatch(setLoading(true));
    try {
      const studentId = profile?.id || 'prof-std-1001';
      const session = await assessmentService.startAssessment(assessment.id, studentId);
      dispatch(setActiveAssessment(assessment));
      dispatch(setActiveSession(session));
      toast.info(`Assessment started. You have ${assessment.durationMinutes} minutes.`, 'Test Begun');
    } catch {
      toast.error('Failed to start assessment session', 'Error');
    }
  };

  const handleResume = (assessment: Assessment, session: AssessmentSession) => {
    dispatch(setActiveAssessment(assessment));
    dispatch(setActiveSession(session));
    toast.info('Resumed incomplete assessment state', 'Test Resumed');
  };

  const handleSubmitTest = async () => {
    if (!activeSession) return;
    setIsSubmittingTest(true);
    try {
      const result = await assessmentService.submitAssessment(activeSession);
      dispatch(completeSession(result));
      setShowResults(true);
      toast.success(
        `Assessment complete! You scored ${result.score}/${result.maxScore} (${result.percentage}%).`,
        result.passed ? 'Assessment Passed' : 'Assessment Completed'
      );
    } catch {
      toast.error('Failed to submit assessment answers', 'Submission Error');
    } finally {
      setIsSubmittingTest(false);
    }
  };

  const handlePauseTest = () => {
    dispatch(pauseSession());
    dispatch(clearActiveSession());
    toast.info('Assessment session paused. You can resume anytime.', 'Session Paused');
  };

  // If in active viewing mode
  if (activeAssessment && activeSession && !showResults) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AssessmentViewer
          assessment={activeAssessment}
          session={activeSession}
          onUpdateAnswer={(qId, ans) => dispatch(updateAnswer({ questionId: qId, answer: ans }))}
          onNext={() => dispatch(nextQuestion())}
          onPrev={() => dispatch(prevQuestion())}
          onSelectQuestion={(idx) => dispatch(setCurrentQuestion(idx))}
          onTimeUpdate={(secs) => dispatch(updateTimeRemaining(secs))}
          onPause={handlePauseTest}
          onSubmit={handleSubmitTest}
          isSubmitting={isSubmittingTest}
        />
      </div>
    );
  }

  // If viewing results
  if (showResults && latestResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AssessmentResultsPage
          result={latestResult}
          onRetakeOrReturn={() => {
            setShowResults(false);
            dispatch(clearActiveSession());
          }}
        />
      </div>
    );
  }

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Algorithms'];

  const filteredAssessments = assessments.filter((asmt) => {
    const matchesCategory = selectedCategory === 'All' || asmt.category === selectedCategory;
    const matchesSearch =
      asmt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asmt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asmt.skillArea.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Adaptive Skill Assessments
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Test your technical competencies and identify skill gaps relative to placement criteria.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
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

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search assessments or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((asmt) => (
          <AssessmentCard
            key={asmt.id}
            assessment={asmt}
            activeSession={activeSession?.assessmentId === asmt.id ? activeSession : null}
            onStart={handleStartModalOpen}
            onResume={handleResume}
          />
        ))}
      </div>

      {/* Confirmation Modal */}
      <AssessmentStartModal
        assessment={modalAssessment}
        isOpen={!!modalAssessment}
        onClose={() => setModalAssessment(null)}
        onConfirmStart={handleConfirmStart}
      />
    </div>
  );
};

export default AssessmentListPage;
