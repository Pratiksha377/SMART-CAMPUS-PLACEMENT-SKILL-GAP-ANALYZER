import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { login, setLoading, setError, clearError } from '@/store/authSlice';
import { authService } from '@/services/authService';
import AuthErrorAlert from './AuthErrorAlert';
import { AuthResponse } from '@/types/auth';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g. name@campus.edu)'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: (authResponse: AuthResponse) => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  onForgotPassword,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    dispatch(setLoading(true));
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
      dispatch(login(response));
      onSuccess?.(response);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Invalid credentials or failed to log in.';
      dispatch(setError(errorMsg));
    }
  };

  return (
    <div
      className={`glass-card rounded-2xl p-6 sm:p-8 w-full max-w-md mx-auto shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="mb-6 text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter your credentials to access your campus portal
        </p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mb-5">
          <AuthErrorAlert error={error} onDismiss={() => dispatch(clearError())} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@campus.edu"
              {...register('email')}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                errors.email
                  ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-400 font-medium pl-1 animate-in fade-in">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-300">
              Password
            </label>
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full pl-10 pr-11 py-2.5 bg-slate-900/80 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                errors.password
                  ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-400 font-medium pl-1 animate-in fade-in">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
            />
            <span className="text-xs text-slate-400 font-medium">Remember me for 30 days</span>
          </label>
        </div>

        {/* Quick Demo Access for Authorized Team Accounts */}
        <div className="pt-1.5 pb-0.5">
          <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 mb-1.5">
            <span>Authorized Quick Access:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setValue('email', 'amishakalita380@gmail.com', { shouldValidate: true });
                setValue('password', 'campus123', { shouldValidate: true });
              }}
              className="px-2 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/80 text-left border border-slate-700/60 hover:border-indigo-500/50 transition-all text-xs"
            >
              <div className="font-medium text-slate-200 truncate">Amisha Kalita</div>
              <div className="text-[10px] text-indigo-400 font-semibold">Student Access</div>
            </button>
            <button
              type="button"
              onClick={() => {
                setValue('email', 'shrawmana@gmail.com', { shouldValidate: true });
                setValue('password', 'campus123', { shouldValidate: true });
              }}
              className="px-2 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/80 text-left border border-slate-700/60 hover:border-indigo-500/50 transition-all text-xs"
            >
              <div className="font-medium text-slate-200 truncate">Shrawmana</div>
              <div className="text-[10px] text-indigo-400 font-semibold">Student Access</div>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-indigo-600/50 active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register footer */}
      {onSwitchToRegister && (
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Create Account
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
