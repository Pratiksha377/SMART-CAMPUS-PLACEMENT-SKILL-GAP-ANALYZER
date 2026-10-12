import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import {
  GraduationCap,
  Bell,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Shield,
  Briefcase,
} from 'lucide-react';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  onToggleMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileNav,
  isMobileNavOpen = false,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (user?.role === 'student') return '/student/dashboard';
    if (user?.role === 'recruiter') return '/recruiter/dashboard';
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  const getRoleIcon = () => {
    if (user?.role === 'student') return GraduationCap;
    if (user?.role === 'recruiter') return Briefcase;
    return Shield;
  };

  const RoleIcon = getRoleIcon();

  return (
    <header className="sticky top-0 z-40 w-full glass-header border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            aria-label={isMobileNavOpen ? 'Close navigation' : 'Open navigation'}
          >
            {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                  SmartCampus
                </span>
                {user?.role && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {user.role}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Placement & Skill Gap Analyzer
              </p>
            </div>
          </Link>
        </div>

        {/* Global Quick Search Bar */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <SearchBar
            size="sm"
            placeholder="Search jobs, tech skills, locations..."
            onSearch={(query) =>
              navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search')
            }
          />
        </div>

        {/* Right Side: Notifications & User Profile Menu */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Notification Bell */}
              <Link
                to="/notifications"
                className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-slate-800/80 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-950 animate-pulse" />
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 transition-all text-left"
                >
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-semibold text-slate-200 leading-tight max-w-[120px] truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-indigo-400 font-medium capitalize">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                      isProfileMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-card border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 border-b border-slate-800/80 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-500/20 text-indigo-300">
                          <RoleIcon className="h-2.5 w-2.5" />
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-indigo-400" />
                        <span>Dashboard</span>
                      </Link>

                      {user.role === 'student' && (
                        <Link
                          to="/student/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                        >
                          <User className="h-4 w-4 text-blue-400" />
                          <span>Profile & Resumes</span>
                        </Link>
                      )}

                      <Link
                        to="/settings"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                      >
                        <Settings className="h-4 w-4 text-slate-400" />
                        <span>Preferences</span>
                      </Link>
                    </div>

                    <div className="pt-1 mt-1 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-md shadow-indigo-600/30"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold transition-colors hidden sm:inline-block"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
