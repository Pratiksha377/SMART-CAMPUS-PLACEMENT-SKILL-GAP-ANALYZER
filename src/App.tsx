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
import RecruiterDashboard from '@/pages/recruiter/RecruiterDashboard';
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

        {/* Student Portal Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} redirectTo="/login" />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/assessments" element={<AssessmentListPage />} />
          <Route path="/student/skill-gap" element={<SkillGapPage />} />
          <Route
            path="/student/opportunities"
            element={
              <div className="glass-card rounded-2xl p-8 text-center space-y-2 border border-slate-800">
                <h2 className="text-xl font-bold text-white">Placement Opportunities & Job Discovery</h2>
                <p className="text-xs text-slate-400">
                  Opportunity search, filters, and 1-click application modal will be fully expanded in Phase FE8.
                </p>
              </div>
            }
          />
          <Route
            path="/student/applications"
            element={
              <div className="glass-card rounded-2xl p-8 text-center space-y-2 border border-slate-800">
                <h2 className="text-xl font-bold text-white">Application Pipeline History</h2>
                <p className="text-xs text-slate-400">
                  Application timelines and status progression will be fully expanded in Phase FE9.
                </p>
              </div>
            }
          />
        </Route>

        {/* Recruiter Portal Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['recruiter']} redirectTo="/login" />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route
            path="/recruiter/postings"
            element={
              <div className="glass-card rounded-2xl p-8 text-center space-y-2 border border-slate-800">
                <h2 className="text-xl font-bold text-white">Manage Job Postings</h2>
                <p className="text-xs text-slate-400">
                  Posting management, status toggles, and edit actions will be fully expanded in Phase FE10.
                </p>
              </div>
            }
          />
          <Route
            path="/recruiter/postings/new"
            element={
              <div className="glass-card rounded-2xl p-8 text-center space-y-2 border border-slate-800">
                <h2 className="text-xl font-bold text-white">Publish New Job Opening</h2>
                <p className="text-xs text-slate-400">
                  Dynamic skill requirement form and job details will be fully expanded in Phase FE10.
                </p>
              </div>
            }
          />
          <Route
            path="/recruiter/applicants"
            element={
              <div className="glass-card rounded-2xl p-8 text-center space-y-2 border border-slate-800">
                <h2 className="text-xl font-bold text-white">Applicant Match Pool</h2>
                <p className="text-xs text-slate-400">
                  Profile reviews and skill match percentage ranking will be fully expanded in Phase FE10.
                </p>
              </div>
            }
          />
        </Route>

        {/* Admin Dashboard Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} redirectTo="/login" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin/placements"
            element={
              <div className="glass-card rounded-2xl p-8 text-center space-y-2 border border-slate-800">
                <h2 className="text-xl font-bold text-white">Placement Drive Tracker</h2>
                <p className="text-xs text-slate-400">
                  University-wide placement status tracking will be fully expanded in Phase FE13.
                </p>
              </div>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <div className="glass-card rounded-2xl p-8 text-center space-y-2 border border-slate-800">
                <h2 className="text-xl font-bold text-white">Analytics & Report Generator</h2>
                <p className="text-xs text-slate-400">
                  Departmental charts and metric generation will be fully expanded in Phase FE13.
                </p>
              </div>
            }
          />
          <Route
            path="/admin/export"
            element={
              <div className="glass-card rounded-2xl p-8 text-center space-y-2 border border-slate-800">
                <h2 className="text-xl font-bold text-white">Institutional Data Export</h2>
                <p className="text-xs text-slate-400">
                  CSV and Excel report exports will be fully expanded in Phase FE13.
                </p>
              </div>
            }
          />
        </Route>

        {/* Common Authenticated Routes */}
        <Route
          path="/notifications"
          element={
            <div className="glass-card rounded-2xl p-8 text-center space-y-2 border border-slate-800">
              <h2 className="text-xl font-bold text-white">Notification Center</h2>
              <p className="text-xs text-slate-400">
                Opportunity match alerts and status updates will be fully expanded in Phase FE12.
              </p>
            </div>
          }
        />
        <Route
          path="/settings"
          element={
            <div className="glass-card rounded-2xl p-8 text-center space-y-2 border border-slate-800">
              <h2 className="text-xl font-bold text-white">User Preferences & Settings</h2>
              <p className="text-xs text-slate-400">
                Notification preferences and account configurations.
              </p>
            </div>
          }
        />

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
