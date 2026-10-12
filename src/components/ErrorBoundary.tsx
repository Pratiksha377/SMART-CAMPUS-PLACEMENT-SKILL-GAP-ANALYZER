import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error; reset: () => void }) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  toggleDetails = (): void => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({
          error: this.state.error,
          reset: this.handleReset,
        });
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6 bg-slate-950">
          <div className="glass-card bg-slate-900/90 border border-rose-500/30 rounded-2xl p-8 max-w-xl w-full text-center shadow-2xl shadow-rose-950/20">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-400 mt-2 mb-6">
              An unexpected application error occurred. We have logged this event and our team has been notified.
            </p>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 mb-6 text-left">
              <p className="text-xs font-mono text-rose-300 break-words">
                {this.state.error.name}: {this.state.error.message}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = '/')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>

            {this.state.errorInfo?.componentStack && (
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-300 transition-colors focus:outline-none"
                >
                  {this.state.showDetails ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>Hide technical stack details</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>Show technical stack details</span>
                    </>
                  )}
                </button>

                {this.state.showDetails && (
                  <pre className="mt-3 p-3 bg-slate-950 text-[11px] font-mono text-slate-400 rounded-lg overflow-x-auto max-h-48 whitespace-pre-wrap border border-slate-800">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
