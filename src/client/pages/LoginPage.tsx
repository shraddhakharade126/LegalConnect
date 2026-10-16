import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Scale,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  User,
  Briefcase,
  Shield,
  Sparkles,
} from 'lucide-react';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { login, switchDemoRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await login({ email: email.trim().toLowerCase(), password });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole: 'client' | 'lawyer' | 'admin') => {
    setLoading(true);
    setError(null);
    try {
      await switchDemoRole(demoRole);
      if (demoRole === 'admin') navigate('/admin');
      else if (demoRole === 'lawyer') navigate('/lawyer-dashboard');
      else navigate('/client-dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-bold mx-auto flex items-center justify-center shadow-md">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Sign In to LegalConnect
          </h1>
          <p className="text-xs text-slate-500">
            Enter your credentials or click a pre-configured demo profile below
          </p>
        </div>

        {/* Demo Quick Switcher Box */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> 1-Click Demo Evaluation Profiles
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('client')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span>Demo Client</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('lawyer')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Demo Lawyer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client.sarah@example.com"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-amber-400 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In to LegalConnect <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account yet?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-amber-700 hover:text-amber-800 font-bold ml-1"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
