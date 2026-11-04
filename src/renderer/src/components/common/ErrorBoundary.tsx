import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

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
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Chirmo component tree:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      localStorage.removeItem('chirmo_has_crashed_once');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  private handleResetStorage = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-800 text-center select-none font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-2xl font-black">
              🤖
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-black text-slate-900">
                Chirmo Başlatılıyor
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                Uygulama açılırken küçük bir geçiş durumu oluştu. Yeniden başlatarak hemen kaldığın yerden devam edebilirsin.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Yeniden Başlat</span>
              </button>

              <button
                onClick={this.handleResetStorage}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition-colors cursor-pointer"
              >
                <span>Sıfırla ve Aç</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
