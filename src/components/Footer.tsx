import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Code2, Mail, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/70 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-sm text-white tracking-tight">Skill Studio</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Empowering students, recruiters, and placement directors with intelligent skill gap analytics and automated job matching.
            </p>
          </div>

          {/* Student Hub Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Student Hub
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link to="/student/profile" className="hover:text-indigo-400 transition-colors">
                  Profile & Portfolio
                </Link>
              </li>
              <li>
                <Link to="/student/assessments" className="hover:text-indigo-400 transition-colors">
                  Adaptive Assessments
                </Link>
              </li>
              <li>
                <Link to="/student/skill-gap" className="hover:text-indigo-400 transition-colors">
                  Skill Gap Radar
                </Link>
              </li>
              <li>
                <Link to="/student/opportunities" className="hover:text-indigo-400 transition-colors">
                  Placement Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruiter & Admin Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Enterprise & Campus
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link to="/recruiter/postings/new" className="hover:text-indigo-400 transition-colors">
                  Post Opportunities
                </Link>
              </li>
              <li>
                <Link to="/recruiter/applicants" className="hover:text-indigo-400 transition-colors">
                  Applicant Match Filtering
                </Link>
              </li>
              <li>
                <Link to="/admin/placements" className="hover:text-indigo-400 transition-colors">
                  Placement Tracker
                </Link>
              </li>
              <li>
                <Link to="/admin/reports" className="hover:text-indigo-400 transition-colors">
                  Analytics & Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & System Status */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Platform & Security
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span>Role-Based Access Control</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-400" />
                <span>placement-support@campus.edu</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-slate-400" />
                <span>v1.0.0-phaseFE3</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} Smart Campus Placement & Skill Gap Analyzer. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
