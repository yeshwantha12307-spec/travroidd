import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log safe error summary without printing sensitive tokens
    console.error('[Travroidd ErrorBoundary] Caught UI error:', error.message, errorInfo.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-900/5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              We encountered an unexpected display issue. Your data and bookings remain completely safe.
            </p>

            {this.state.error && (
              <div className="mt-4 rounded-lg bg-slate-100 p-3 text-left">
                <p className="font-mono text-xs text-slate-700 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B5ED7] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#094db2] transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Home className="h-4 w-4" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
