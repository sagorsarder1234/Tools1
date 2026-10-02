import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, CheckCircle2, X } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Password reset link dispatched.', 'success');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl glass-panel border border-white/20 p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold font-display text-white">Reset Password</h3>
              <p className="text-xs text-white/60">
                Enter your registered email address and we will send you a secure password reset link.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.thorne@tenex.io"
                  required
                  className="w-full px-4 py-3 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm"
                />
                <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Recovery Link'}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-3 py-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Check Your Inbox</h4>
            <p className="text-xs text-white/60">
              We dispatched a secure reset link to <span className="text-amber-300 font-mono">{email}</span>. Click the link within 15 minutes to configure your new credentials.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
