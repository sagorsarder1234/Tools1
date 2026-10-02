import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, Lock, User as UserIcon, Shield, ArrowRight } from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { Tools1Logo } from '../common/Tools1Logo';

export const LoginPage: React.FC = () => {
  const { login, setCurrentPage } = useApp();
  const [identifier, setIdentifier] = useState('alexthorne');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please provide your username or email.');
      return;
    }
    if (!password) {
      setError('Password cannot be empty.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const success = login(identifier);
      if (!success) {
        setError('Invalid credentials or account suspended.');
      }
    }, 600);
  };

  const handleQuickDemo = (role: 'USER' | 'ADMIN') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === 'ADMIN') {
        login('admin_master', 'ADMIN');
      } else {
        login('alexthorne', 'USER');
      }
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-md">
        {/* Glow behind card */}
        <div className="relative rounded-3xl glass-panel border border-white/20 p-7 sm:p-9 shadow-2xl backdrop-blur-3xl overflow-hidden">
          {/* Top subtle shine */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center pb-1">
              <Tools1Logo size="lg" showUnderline={true} />
            </div>
            <h2 className="text-xl font-bold font-display text-white">Sign In to Your Account</h2>
            <p className="text-xs text-white/60">Access your dashboard, marketplace, and productivity tools.</p>
          </div>

          {/* Quick Demo Logins Pill Box */}
          <div className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/80 block text-center">
              Quick 1-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('USER')}
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Alex (User)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Master</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="alexthorne or alex.thorne@tenex.io"
                  className="w-full px-4 py-3 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm"
                  required
                />
                <UserIcon className="absolute right-3.5 top-3.5 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-white/70">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/70 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0 focus:ring-offset-0"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-white hover:bg-white/95 text-black font-semibold text-sm shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer switch */}
          <div className="mt-8 text-center text-xs text-white/60">
            Don't have a Tools1 account?{' '}
            <button
              onClick={() => setCurrentPage('register')}
              className="text-amber-400 font-semibold hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      <ForgotPasswordModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} />
    </div>
  );
};
