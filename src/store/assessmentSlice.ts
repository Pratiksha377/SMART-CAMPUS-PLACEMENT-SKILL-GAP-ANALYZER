import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Assessment,
  AssessmentSession,
  AssessmentResult,
} from '@/types/assessment';

export interface AssessmentState {
  assessments: Assessment[];
  activeAssessment: Assessment | null;
  activeSession: AssessmentSession | null;
  latestResult: AssessmentResult | null;
  resultsHistory: AssessmentResult[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AssessmentState = {
  assessments: [],
  activeAssessment: null,
  activeSession: null,
  latestResult: null,
  resultsHistory: [],
  isLoading: false,
  error: null,
};

export const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.error = null;
    },
    setAssessments: (state, action: PayloadAction<Assessment[]>) => {
      state.assessments = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setActiveAssessment: (state, action: PayloadAction<Assessment | null>) => {
      state.activeAssessment = action.payload;
    },
    setActiveSession: (state, action: PayloadAction<AssessmentSession | null>) => {
      state.activeSession = action.payload;
    },
    updateAnswer: (
      state,
      action: PayloadAction<{ questionId: string; answer: string }>
    ) => {
      if (state.activeSession) {
        state.activeSession.answers[action.payload.questionId] = action.payload.answer;
        state.activeSession.lastSavedAt = new Date().toISOString();
      }
    },
    setCurrentQuestion: (state, action: PayloadAction<number>) => {
      if (state.activeSession) {
        state.activeSession.currentQuestionIndex = action.payload;
        state.activeSession.lastSavedAt = new Date().toISOString();
      }
    },
    nextQuestion: (state) => {
      if (
        state.activeSession &&
        state.activeAssessment &&
        state.activeSession.currentQuestionIndex < state.activeAssessment.questions.length - 1
      ) {
        state.activeSession.currentQuestionIndex += 1;
        state.activeSession.lastSavedAt = new Date().toISOString();
      }
    },
    prevQuestion: (state) => {
      if (state.activeSession && state.activeSession.currentQuestionIndex > 0) {
        state.activeSession.currentQuestionIndex -= 1;
        state.activeSession.lastSavedAt = new Date().toISOString();
      }
    },
    updateTimeRemaining: (state, action: PayloadAction<number>) => {
      if (state.activeSession) {
        state.activeSession.timeRemainingSeconds = action.payload;
        state.activeSession.lastSavedAt = new Date().toISOString();
      }
    },
    pauseSession: (state) => {
      if (state.activeSession) {
        state.activeSession.status = 'paused';
        state.activeSession.lastSavedAt = new Date().toISOString();
      }
    },
    resumeSession: (state, action: PayloadAction<AssessmentSession>) => {
      state.activeSession = {
        ...action.payload,
        status: 'in_progress',
        lastSavedAt: new Date().toISOString(),
      };
    },
    completeSession: (state, action: PayloadAction<AssessmentResult>) => {
      state.latestResult = action.payload;
      state.resultsHistory.push(action.payload);
      if (state.activeSession) {
        state.activeSession.status = 'completed';
      }
    },
    clearActiveSession: (state) => {
      state.activeSession = null;
      state.activeAssessment = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setAssessments,
  setActiveAssessment,
  setActiveSession,
  updateAnswer,
  setCurrentQuestion,
  nextQuestion,
  prevQuestion,
  updateTimeRemaining,
  pauseSession,
  resumeSession,
  completeSession,
  clearActiveSession,
  setError,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;
