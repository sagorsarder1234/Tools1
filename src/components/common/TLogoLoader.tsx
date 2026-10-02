import React from 'react';

interface TLogoLoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const TLogoLoader: React.FC<TLogoLoaderProps> = ({
  fullScreen = false,
  size = 'lg',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const loaderContent = (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient background glow ring behind T */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600/30 via-orange-500/20 to-yellow-400/30 blur-2xl animate-pulse" />

      {/* SVG Stylized Letter "T" Logo with Drawing & Pulse Animations */}
      <svg
        className={`${sizeMap[size]} relative z-10 animate-t-glow`}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Linear Gradient for the glowing stroke */}
          <linearGradient id="t-gradient-stroke" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Core fill gradient */}
          <linearGradient id="t-gradient-fill" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.6" />
          </linearGradient>

          {/* Deep neon glow filter */}
          <filter id="t-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer stylized hexagonal shield / diamond guide (subtle, strictly frames the T) */}
        <path
          d="M60 6 L108 32 L108 88 L60 114 L12 88 L12 32 Z"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* The Animated "T" Emblem Path
            - Top horizontal bar: from (24, 28) to (96, 28) with beveled corners down to (96, 44), (72, 44), down vertical stem to (72, 94), (48, 94), (48, 44), (24, 44)
        */}
        <path
          d="M24 28 H96 C98.2 28 100 29.8 100 32 V40 C100 42.2 98.2 44 96 44 H74 V96 C74 98.2 72.2 100 70 100 H50 C47.8 100 46 98.2 46 96 V44 H24 C21.8 44 20 42.2 20 40 V32 C20 29.8 21.8 28 24 28 Z"
          fill="url(#t-gradient-fill)"
          stroke="url(#t-gradient-stroke)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          className="transition-all duration-700"
          style={{
            strokeDasharray: 380,
            animation: 't-draw-path 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate',
          }}
        />

        {/* Dynamic Inner Light Shimmer across horizontal bar */}
        <rect
          x="28"
          y="32"
          width="64"
          height="4"
          rx="2"
          fill="rgba(255,255,255,0.7)"
          className="animate-pulse"
        />

        {/* Dynamic Light Spine along vertical stem */}
        <rect
          x="57.5"
          y="48"
          width="5"
          height="44"
          rx="2.5"
          fill="rgba(255,255,255,0.6)"
          className="animate-pulse"
        />
      </svg>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07080b]/90 backdrop-blur-3xl transition-opacity duration-500">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};
