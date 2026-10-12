import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobOpportunity, Application, OpportunityFilterCriteria } from '@/types/opportunity';

export interface OpportunityFilters extends Partial<OpportunityFilterCriteria> {
  searchTerm: string;
  location?: string;
  type?: string;
  minMatchScore?: number;
}

export interface OpportunityState {
  items: JobOpportunity[];
  selectedOpportunity: JobOpportunity | null;
  applications: Application[];
  selectedApplication: Application | null;
  filters: OpportunityFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: OpportunityState = {
  items: [],
  selectedOpportunity: null,
  applications: [],
  selectedApplication: null,
  filters: {
    searchTerm: '',
    locations: [],
    companies: [],
    types: [],
    workplaceTypes: [],
  },
  isLoading: false,
  error: null,
};

export const opportunitySlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    setOpportunitiesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setOpportunities: (state, action: PayloadAction<JobOpportunity[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedOpportunity: (state, action: PayloadAction<JobOpportunity | null>) => {
      state.selectedOpportunity = action.payload;
    },
    addOpportunity: (state, action: PayloadAction<JobOpportunity>) => {
      state.items.unshift(action.payload);
    },
    updateOpportunity: (state, action: PayloadAction<JobOpportunity>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedOpportunity?.id === action.payload.id) {
        state.selectedOpportunity = action.payload;
      }
    },
    setFilters: (state, action: PayloadAction<Partial<OpportunityFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setOpportunityError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Application management actions (Phase FE9)
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload;
      state.isLoading = false;
    },
    addApplication: (state, action: PayloadAction<Application>) => {
      // Prevent duplicate in state
      const exists = state.applications.some(
        (app) =>
          app.opportunityId === action.payload.opportunityId &&
          app.studentId === action.payload.studentId &&
          app.status !== 'withdrawn'
      );
      if (!exists) {
        state.applications.unshift(action.payload);
      }
    },
    updateApplication: (state, action: PayloadAction<Application>) => {
      const index = state.applications.findIndex((app) => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
      if (state.selectedApplication?.id === action.payload.id) {
        state.selectedApplication = action.payload;
      }
    },
    withdrawApplication: (
      state,
      action: PayloadAction<{ applicationId: string; reason?: string }>
    ) => {
      const app = state.applications.find((a) => a.id === action.payload.applicationId);
      if (app) {
        app.status = 'withdrawn';
        app.withdrawalReason = action.payload.reason;
        app.lastUpdated = new Date().toISOString();
        app.timeline.push({
          status: 'withdrawn',
          date: new Date().toISOString(),
          message: action.payload.reason || 'Candidate requested application withdrawal.',
        });
      }
    },
    setSelectedApplication: (state, action: PayloadAction<Application | null>) => {
      state.selectedApplication = action.payload;
    },
  },
});

export const {
  setOpportunitiesStart,
  setOpportunities,
  setSelectedOpportunity,
  addOpportunity,
  updateOpportunity,
  setFilters,
  resetFilters,
  setOpportunityError,
  setApplications,
  addApplication,
  updateApplication,
  withdrawApplication,
  setSelectedApplication,
} = opportunitySlice.actions;

export default opportunitySlice.reducer;
