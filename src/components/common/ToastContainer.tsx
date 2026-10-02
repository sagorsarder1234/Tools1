import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-md w-auto pointer-events-none px-4 pb-safe">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0a0c14]/95 border border-white/20 shadow-2xl shadow-black/80 backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 text-center cursor-default"
          >
            {/* Status Icon */}
            <div className="shrink-0 flex items-center justify-center">
              {isSuccess && (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/40">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              {isError && (
                <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center ring-1 ring-rose-500/40">
                  <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              )}
              {isWarning && (
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center ring-1 ring-amber-500/40">
                  <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              )}
              {!isSuccess && !isError && !isWarning && (
                <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center ring-1 ring-sky-500/40">
                  <Info className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              )}
            </div>

            {/* Message Text */}
            <div className="text-xs sm:text-sm font-semibold text-white/95 whitespace-nowrap">
              {toast.message}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white transition-colors p-1 ml-1 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
