import React from 'react';

interface Tools1LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUnderline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Tools1Logo: React.FC<Tools1LogoProps> = ({
  size = 'md',
  showUnderline = false,
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    sm: {
      text: 'text-lg',
      badge: 'w-5 h-5 text-xs',
      spacing: 'gap-1.5',
    },
    md: {
      text: 'text-xl sm:text-2xl',
      badge: 'w-6 h-6 sm:w-7 sm:h-7 text-xs sm:text-sm',
      spacing: 'gap-1.5 sm:gap-2',
    },
    lg: {
      text: 'text-3xl sm:text-4xl',
      badge: 'w-9 h-9 sm:w-10 sm:h-10 text-lg sm:text-xl',
      spacing: 'gap-2 sm:gap-2.5',
    },
    xl: {
      text: 'text-4xl sm:text-6xl',
      badge: 'w-12 h-12 sm:w-16 sm:h-16 text-2xl sm:text-3xl',
      spacing: 'gap-3',
    },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col select-none relative group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className={`flex items-center ${sizeClasses.spacing}`}>
        {/* Dynamic Stylized "Tools" wordmark */}
        <div className={`font-display font-black tracking-tight ${sizeClasses.text} flex items-center`}>
          {/* Letter 'T' with bold red/white accent */}
          <span className="relative inline-block text-white group-hover:text-red-400 transition-colors">
            T
            <span className="absolute -top-0.5 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 via-rose-500 to-transparent rounded-full opacity-90" />
          </span>

          {/* Letter 'o' #1: Cyan to Yellow-Orange spiral gradient */}
          <span className="bg-gradient-to-br from-cyan-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent hover:scale-110 transition-transform">
            o
          </span>

          {/* Letter 'o' #2: Green to Orange-Red spiral gradient */}
          <span className="bg-gradient-to-br from-lime-400 via-orange-400 to-rose-500 bg-clip-text text-transparent hover:scale-110 transition-transform">
            o
          </span>

          {/* Letter 'l': Blue to Yellow-Pink gradient */}
          <span className="bg-gradient-to-b from-blue-500 via-amber-300 to-pink-500 bg-clip-text text-transparent">
            l
          </span>

          {/* Letter 's': Vibrant Sky Blue to Royal Blue curve */}
          <span className="bg-gradient-to-tr from-blue-600 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
            s
          </span>
        </div>

        {/* The Signature Encircled "1" Badge matching logo */}
        <div className="relative flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          {/* Outer glowing halo ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 opacity-60 blur-[6px] group-hover:opacity-100 transition-opacity" />
          
          {/* Circular frame */}
          <div className={`relative ${sizeClasses.badge} rounded-full p-[2px] bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 shadow-md`}>
            <div className="w-full h-full rounded-full bg-[#0d0f17] flex items-center justify-center overflow-hidden">
              <span className="font-display font-black leading-none bg-gradient-to-b from-amber-300 via-orange-400 to-purple-500 bg-clip-text text-transparent transform translate-y-[-0.5px]">
                1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stylized Red & Black Speed Swoosh Underline */}
      {showUnderline && (
        <div className="w-full h-1 mt-0.5 relative overflow-hidden rounded-full">
          <div className="w-full h-[2.5px] bg-gradient-to-r from-red-600 via-rose-500 via-black to-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};
