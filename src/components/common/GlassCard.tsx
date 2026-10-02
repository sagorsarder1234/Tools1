import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
  variant?: 'liquid' | 'default' | 'subtle';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  variant = 'liquid',
  onClick,
}) => {
  const baseClass =
    variant === 'liquid'
      ? 'liquid-glass-card rounded-[32px] sm:rounded-[36px] p-6 sm:p-8'
      : variant === 'subtle'
      ? 'glass-panel-subtle rounded-3xl p-6 sm:p-7'
      : 'glass-panel rounded-3xl p-6 sm:p-7';

  return (
    <div
      onClick={onClick}
      className={`${baseClass} relative overflow-hidden transition-all ${
        hoverEffect ? 'glass-card-hover cursor-pointer' : ''
      } ${
        glow
          ? 'shadow-[0_20px_70px_-10px_rgba(245,158,11,0.25)] border-amber-400/40'
          : 'shadow-2xl'
      } ${className}`}
    >
      {/* Top convex liquid specular meniscus rim */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
      {/* Top secondary refraction arc */}
      <div className="absolute inset-x-6 top-1 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      {/* Left subtle vertical specular sheen */}
      <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/50 via-white/10 to-transparent pointer-events-none" />
      {/* Bottom liquid meniscus rim */}
      <div className="absolute inset-x-10 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      {children}
    </div>
  );
};
