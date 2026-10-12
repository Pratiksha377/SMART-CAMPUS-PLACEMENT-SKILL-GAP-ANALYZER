import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { MetricsWidget } from '@/components/MetricsWidget';
import {
  SkillDistributionChart,
  PlacementTrendsChart,
  DepartmentBreakdownChart,
} from '@/components/AnalyticsChart';
import { DepartmentFilter } from '@/components/DepartmentFilter';
import { DateRangePicker } from '@/components/DateRangePicker';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { PlacementTrackerPage } from '@/pages/admin/PlacementTrackerPage';
import { ReportGeneratorPage } from '@/pages/admin/ReportGeneratorPage';
import { DataExportPage } from '@/pages/admin/DataExportPage';
import {
  calculateMetrics,
  calculateDepartmentStats,
  calculateSkillDistribution,
  calculatePlacementTrends,
  getMockPlacementRecords,
} from '@/services/adminService';

// Mock react-chartjs-2 components
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart">Bar Chart Mock</div>,
  Line: () => <div data-testid="mock-line-chart">Line Chart Mock</div>,
  Doughnut: () => <div data-testid="mock-doughnut-chart">Doughnut Chart Mock</div>,
}));

// Mock URL methods for file download
window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
window.URL.revokeObjectURL = vi.fn();
window.print = vi.fn();

describe('Admin Dashboard & Operations UI (Phase FE13)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('FE13.2: MetricsWidget Component', () => {
    it('renders all key performance indicators accurately', () => {
      const mockMetrics = {
        totalStudents: 1250,
        eligibleStudents: 1100,
        totalOpportunities: 45,
        activeDrives: 12,
        totalPlaced: 980,
        placementRate: 78.4,
        averagePackageLPA: 14.5,
        highestPackageLPA: 42.0,
        totalOffers: 1040,
      };

      render(<MetricsWidget metrics={mockMetrics} />);

      expect(screen.getByTestId('metrics-widget')).toBeInTheDocument();
      expect(screen.getByTestId('metric-total-students')).toHaveTextContent('1,250');
      expect(screen.getByTestId('metric-total-placed')).toHaveTextContent('980');
      expect(screen.getByTestId('metric-placement-rate')).toHaveTextContent('78.4%');
      expect(screen.getByTestId('metric-avg-package')).toHaveTextContent('14.5');
      expect(screen.getByTestId('metric-total-opportunities')).toHaveTextContent('45');
      expect(screen.getByTestId('metric-active-drives')).toHaveTextContent('12');
    });
  });

  describe('FE13.3: AnalyticsChart Components', () => {
    it('renders SkillDistributionChart without error', () => {
      const skills = calculateSkillDistribution();
      render(<SkillDistributionChart skills={skills} />);
      expect(screen.getByTestId('skill-distribution-chart')).toBeInTheDocument();
      expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    });

    it('renders PlacementTrendsChart without error', () => {
      const trends = calculatePlacementTrends();
      render(<PlacementTrendsChart trends={trends} />);
      expect(screen.getByTestId('placement-trends-chart')).toBeInTheDocument();
      expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
    });

    it('renders DepartmentBreakdownChart without error', () => {
      const stats = calculateDepartmentStats(getMockPlacementRecords());
      render(<DepartmentBreakdownChart stats={stats} />);
      expect(screen.getByTestId('department-breakdown-chart')).toBeInTheDocument();
      expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
    });
  });

  describe('FE13.7: DepartmentFilter Component', () => {
    it('renders all department buttons and handles department switching', () => {
      const handleChange = vi.fn();
      render(
        <DepartmentFilter
          selectedDepartment="all"
          onChange={handleChange}
          departmentCounts={{ CSE: 10, IT: 5 }}
        />
      );

      expect(screen.getByTestId('department-filter')).toBeInTheDocument();
      expect(screen.getByTestId('dept-filter-all')).toBeInTheDocument();
      expect(screen.getByTestId('dept-filter-cse')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('dept-filter-cse'));
      expect(handleChange).toHaveBeenCalledWith('CSE');
    });
  });

  describe('FE13.8: DateRangePicker Component', () => {
    it('renders date inputs and handles preset selections', () => {
      const handleChange = vi.fn();
      render(
        <DateRangePicker
          startDate="2025-08-01"
          endDate="2026-06-30"
          onChange={handleChange}
        />
      );

      expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();

      // Click preset
      fireEvent.click(screen.getByTestId('preset-last30'));
      expect(handleChange).toHaveBeenCalled();

      // Change input
      const startInput = screen.getByTestId('input-start-date');
      fireEvent.change(startInput, { target: { value: '2025-09-01' } });
      expect(handleChange).toHaveBeenCalledWith({
        startDate: '2025-09-01',
        endDate: '2026-06-30',
      });
    });
  });

  describe('FE13.1: AdminDashboard Page Layout', () => {
    it('renders full operations console with metrics, charts, and filter', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <AdminDashboard />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByTestId('admin-dashboard-page')).toBeInTheDocument();
      expect(screen.getByTestId('metrics-widget')).toBeInTheDocument();
      expect(screen.getByTestId('skill-distribution-chart')).toBeInTheDocument();
      expect(screen.getByTestId('placement-trends-chart')).toBeInTheDocument();
      expect(screen.getByTestId('department-breakdown-chart')).toBeInTheDocument();
    });
  });

  describe('FE13.4: PlacementTrackerPage', () => {
    it('renders tracker page, handles search query and inline status update', () => {
      render(
        <BrowserRouter>
          <PlacementTrackerPage />
        </BrowserRouter>
      );

      expect(screen.getByTestId('placement-tracker-page')).toBeInTheDocument();
      expect(screen.getByTestId('total-tracked-count')).toBeInTheDocument();

      // Search
      const searchInput = screen.getByTestId('tracker-search-input');
      fireEvent.change(searchInput, { target: { value: 'Aarav' } });

      // Check row exists in tracker
      expect(screen.getAllByText('Aarav Sharma')[0]).toBeInTheDocument();

      // Update status button click
      const editBtn = screen.getByTestId('btn-edit-pr-1');
      fireEvent.click(editBtn);

      const statusSelect = screen.getByTestId('select-status-pr-1');
      expect(statusSelect).toBeInTheDocument();

      fireEvent.change(statusSelect, { target: { value: 'Offered' } });
      expect(screen.getByTestId('status-badge-pr-1')).toHaveTextContent('Offered');
    });

    it('filters placement tracker table by status tab', () => {
      render(
        <BrowserRouter>
          <PlacementTrackerPage />
        </BrowserRouter>
      );

      const interviewTab = screen.getByTestId('status-filter-interview');
      fireEvent.click(interviewTab);

      // Verify row for interview student
      expect(screen.getAllByText('Sneha Reddy')[0]).toBeInTheDocument();
    });
  });

  describe('FE13.5: ReportGeneratorPage', () => {
    it('renders report generator with department summary and skill gap audits', () => {
      render(
        <BrowserRouter>
          <ReportGeneratorPage />
        </BrowserRouter>
      );

      expect(screen.getByTestId('report-generator-page')).toBeInTheDocument();
      expect(screen.getByTestId('department-stats-table')).toBeInTheDocument();
      expect(screen.getByTestId('skill-gap-report-table')).toBeInTheDocument();

      // Export CSV button click
      const exportBtn = screen.getByTestId('btn-report-export-csv');
      fireEvent.click(exportBtn);

      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });

    it('triggers window.print when print button is clicked', () => {
      render(
        <BrowserRouter>
          <ReportGeneratorPage />
        </BrowserRouter>
      );

      const printBtn = screen.getByTestId('btn-report-print');
      fireEvent.click(printBtn);
      expect(window.print).toHaveBeenCalled();
    });
  });

  describe('FE13.6: DataExportPage', () => {
    it('renders format toggles, column checkboxes, and triggers download', () => {
      render(
        <BrowserRouter>
          <DataExportPage />
        </BrowserRouter>
      );

      expect(screen.getByTestId('data-export-page')).toBeInTheDocument();
      expect(screen.getByTestId('format-csv-btn')).toBeInTheDocument();
      expect(screen.getByTestId('format-excel-btn')).toBeInTheDocument();

      // Toggle format to Excel
      fireEvent.click(screen.getByTestId('format-excel-btn'));

      // Toggle a column
      const colBox = screen.getByTestId('col-checkbox-rollNo');
      fireEvent.click(colBox);

      // Trigger export
      const exportBtn = screen.getByTestId('btn-trigger-export');
      fireEvent.click(exportBtn);

      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
  });
});
