import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RefreshCw } from 'lucide-react';

class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("CRITICAL APP ERROR:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 px-4 text-center font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-amber-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">!</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Une erreur inattendue est survenue</h1>
            <p className="text-gray-500 text-sm mb-6">
              Rafraîchissez la page. Si le problème persiste, contactez-nous.
            </p>
            <button
              onClick={() => { try { window.localStorage.clear(); } catch(e){} window.location.reload(); }}
              className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors"
            >
              <RefreshCw size={18} /> Recharger l'application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) { throw new Error("Could not find root element to mount to"); }

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
);