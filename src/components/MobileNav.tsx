import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { useAuth } from '@/hooks/useAuth';
import { GraduationCap, X, LogOut, LogIn, UserPlus } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" data-testid="mobile-nav-drawer">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
        data-testid="mobile-nav-backdrop"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-left duration-200">
        <div className="space-y-6">
          {/* Header inside drawer */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5 touch-target">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-base text-white">SmartCampus</span>
                <p className="text-[10px] text-slate-400">Placement Analyzer</p>
              </div>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="touch-target p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close navigation"
              data-testid="mobile-nav-close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User profile snippet if authenticated */}
          {isAuthenticated && user ? (
            <div className="p-3.5 rounded-xl bg-slate-850/70 border border-slate-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-indigo-500/20 text-indigo-300">
                  {user.role}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-500 px-3 tracking-wider mb-2">
              Menu Items
            </p>
            <Navigation orientation="vertical" onItemClick={onClose} />
          </div>
        </div>

        {/* Bottom logout / session area */}
        {isAuthenticated && (
          <div className="pt-4 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-semibold transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
