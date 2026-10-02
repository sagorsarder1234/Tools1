import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, ShieldCheck, Mail, User as UserIcon, ArrowRight, Check } from 'lucide-react';
import { Tools1Logo } from '../common/Tools1Logo';

export const RegisterPage: React.FC = () => {
  const { registerUser, setCurrentPage } = useApp();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Compute password strength
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Strong', 'Unbreakable'];
  const strengthColors = ['bg-rose-500', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-300'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setError('You must accept the terms of service to continue.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const success = registerUser(username, email);
      if (!success) {
        setError('Registration could not be completed.');
      }
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="relative rounded-3xl glass-panel border border-white/20 p-7 sm:p-9 shadow-2xl backdrop-blur-3xl overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

          {/* Header */}
          <div className="text-center space-y-3 mb-7">
            <div className="flex justify-center pb-1">
              <Tools1Logo size="lg" showUnderline={true} />
            </div>
            <h2 className="text-xl font-bold font-display text-white">Create Tools1 Account</h2>
            <p className="text-xs text-white/60">
              Get an instant $100 starting balance bonus on account creation.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Desired Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. quantum_user"
                  className="w-full px-4 py-3 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm"
                  required
                />
                <UserIcon className="absolute right-3.5 top-3.5 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-4 py-3 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm"
                  required
                />
                <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`flex-1 rounded-full transition-colors ${
                          strength >= step ? strengthColors[strength] : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-white/50">
                    <span>Password Strength:</span>
                    <span className="font-semibold text-white/90">{strengthLabels[strength]}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-4 py-3 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm"
                required
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-white/70">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0"
                />
                <span>
                  I agree to the Tools1 Platform Terms of Service, Acceptable Use Policy, and Security Charter.
                </span>
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
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 text-center text-xs text-white/60">
            Already registered?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-amber-400 font-semibold hover:underline"
            >
              Sign In Instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
