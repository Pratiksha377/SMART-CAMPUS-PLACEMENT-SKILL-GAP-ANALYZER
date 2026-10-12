import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import AuthErrorBoundary from '@/components/AuthErrorBoundary';
import Home from '@/pages/Home';
import StudentDashboard from '@/pages/student/StudentDashboard';
import StudentProfilePage from '@/pages/StudentProfile/StudentProfilePage';
import AssessmentListPage from '@/pages/Assessment/AssessmentListPage';
import SkillGapPage from '@/pages/SkillGap/SkillGapPage';
import OpportunitiesPage from '@/pages/Opportunities/OpportunitiesPage';
import ApplicationHistoryPage from '@/pages/Applications/ApplicationHistoryPage';
import {
  RecruiterDashboardPage,
  PostingManagementPage,
  CreatePostingPage,
  ApplicantListPage,
  SearchResultsPage,
  NotificationCenterPage,
  NotificationPreferencesPage,
  PlacementTrackerPage,
  ReportGeneratorPage,
  DataExportPage,
} from '@/pages';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import Unauthorized from '@/pages/Unauthorized';
import NotFound from '@/pages/NotFound';

export const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Main Layout containing Header, Desktop Sidebar, MobileNav, and Footer */}
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <div className="py-8">
              <AuthErrorBoundary>
                <LoginForm
                  onSuccess={() => navigate('/')}
                  onSwitchToRegister={() => navigate('/register')}
                />
              </AuthErrorBoundary>
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="py-8">
              <AuthErrorBoundary>
                <RegisterForm
                  onSuccess={() => navigate('/')}
                  onSwitchToLogin={() => navigate('/login')}
                />
              </AuthErrorBoundary>
            </div>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/notifications" element={<NotificationCenterPage />} />
        <Route path="/settings/notifications" element={<NotificationPreferencesPage />} />

        {/* Student Portal Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} redirectTo="/login" />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/assessments" element={<AssessmentListPage />} />
          <Route path="/student/skill-gap" element={<SkillGapPage />} />
          <Route path="/student/opportunities" element={<OpportunitiesPage />} />
          <Route path="/student/applications" element={<ApplicationHistoryPage />} />
        </Route>

        {/* Recruiter Portal Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['recruiter']} redirectTo="/login" />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />
          <Route path="/recruiter/postings" element={<PostingManagementPage />} />
          <Route path="/recruiter/postings/new" element={<CreatePostingPage />} />
          <Route path="/recruiter/applicants" element={<ApplicantListPage />} />
        </Route>

        {/* Admin Dashboard Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} redirectTo="/login" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/placements" element={<PlacementTrackerPage />} />
          <Route path="/admin/reports" element={<ReportGeneratorPage />} />
          <Route path="/admin/export" element={<DataExportPage />} />
        </Route>

        {/* Common Authenticated Routes */}
        <Route path="/notifications" element={<NotificationCenterPage />} />
        <Route path="/settings" element={<NotificationPreferencesPage />} />

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
